import { NextResponse } from 'next/server';
import { ALL_MERCHANTS } from '@/lib/merchants';
import { OUTCOMES, PHOTOS, outcomeOf } from '@/lib/survey';
import { pickAnswers, validatePhoto, validateVisit } from '@/lib/survey-validation';
import { currentOperator, isAuthorized, identify, sessionCookie } from '@/lib/server/rilevazioni-auth';
import { listVisits, newVisitId, saveVisit, storeVisitPhoto, visitsForMerchant } from '@/lib/server/visits';
import { persistentStorage } from '@/lib/server/persistence';
import { visitsCsv } from '@/lib/survey-export';
import { todayInZurich } from '@/lib/time';
import { HOUR, globalLimit, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET ?visited=1        → riepilogo di tutti i negozi già visitati, per marcarli in ricerca
 * GET ?merchantId=…     → visite precedenti a quel negozio, con nome del rilevatore e data
 */
export async function GET(request) {
  if (!isAuthorized(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });

  const params = request.nextUrl.searchParams;

  if (params.get('me') === '1') {
    return NextResponse.json({ operator: currentOperator(request) ?? '' });
  }

  // La copia da tenere fuori da Render: CSV per leggerla, JSON completo per poterla ricaricare.
  // Le foto restano sul disco, coperte dagli snapshot giornalieri di Render.
  const format = params.get('export');
  if (format === 'csv' || format === 'json') {
    const visits = await listVisits();
    const name = `rilevazioni-${todayInZurich()}.${format}`;
    const body =
      format === 'csv'
        ? `\uFEFF${visitsCsv(visits)}` // BOM: Excel apre gli accenti giusti
        : `${JSON.stringify({ exportedAt: new Date().toISOString(), visits }, null, 2)}\n`;
    return new NextResponse(body, {
      headers: {
        'Content-Type': format === 'csv' ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${name}"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (params.get('visited') === '1') {
    // Una riga per negozio, con l'ultima visita: serve a non rifare un giro già fatto,
    // e il campo pesa pochi byte anche con tutti e 336 gli esercenti visitati.
    const all = await listVisits();
    const visited = {};
    for (const v of all) {
      const key = v.merchantId ?? v.merchantName.toLowerCase();
      const prev = visited[key];
      if (!prev || new Date(v.createdAt) > new Date(prev.at)) {
        visited[key] = {
          at: v.createdAt,
          surveyor: v.surveyor,
          outcome: v.outcome,
          // Un ritorno fissato tiene il negozio «da completare» anche se la visita è andata
          // bene: qualcosa è rimasto da fare.
          ripasso: v.answers?.ritorno_quando ?? null,
          count: (prev?.count ?? 0) + 1,
        };
      } else {
        prev.count += 1;
      }
    }
    for (const v of Object.values(visited)) {
      v.status = v.ripasso || v.outcome === 'da_ricontattare' ? 'da_completare' : 'completo';
    }
    return NextResponse.json({ visited });
  }

  const id = params.get('merchantId');
  const name = params.get('merchantName');
  if (!id && !name) return NextResponse.json({ visits: [] });

  const previous = await visitsForMerchant(id, name);
  const latest = previous[previous.length - 1];
  return NextResponse.json({
    visits: previous.map((v) => ({ id: v.id, at: v.createdAt, surveyor: v.surveyor, outcome: v.outcome })),
    // Le risposte dell'ultima visita, per chi torna sul posto: ripartire da quello che
    // il collega ha già rilevato evita di ridigitare dieci risposte identiche, e fa
    // risaltare quello che nel frattempo è cambiato.
    last: latest ? { id: latest.id, at: latest.createdAt, surveyor: latest.surveyor, answers: latest.answers } : null,
  });
}

// Le foto sono più d'una e già compresse: il tetto è più alto di quello delle giocate,
// ma esiste, perché formData() legge tutto il corpo in memoria prima di validarlo.
const MAX_BODY_BYTES = 24 * 1024 * 1024;
const PER_IP = { max: 60, windowMs: HOUR };
// Il codice d'accesso è corto e condiviso: senza un freno si prova a indovinarlo.
const UNLOCK_TRIES = { max: 10, windowMs: HOUR };

export async function POST(request) {
  const ip = clientIp(request);

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ code: 'bad_request' }, { status: 413 });
  }
  if (hit(`riv:${ip}`, PER_IP) || globalLimit('rilevazioni', 60)) {
    return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  }

  const form = await request.formData();

  // Primo passo: lo scambio del codice per il cookie di sessione.
  if (form.get('intent') === 'unlock') {
    if (hit(`unlock:${ip}`, UNLOCK_TRIES)) {
      return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
    }
    const operator = identify(form.get('code'));
    if (operator === null) {
      return NextResponse.json({ code: 'wrong_code' }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, operator });
    res.cookies.set(sessionCookie(operator));
    return res;
  }

  if (!isAuthorized(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });

  // Meglio rifiutare che salvare su una cartella che il prossimo deploy cancella: il rilevatore
  // vede subito il problema e la bozza resta sul telefono.
  if (!persistentStorage()) return NextResponse.json({ code: 'storage_unavailable' }, { status: 503 });

  let answers = {};
  try {
    answers = JSON.parse(form.get('answers') || '{}');
  } catch {
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  }

  const data = {
    merchantId: (form.get('merchantId') || '').trim() || null,
    merchantName: (form.get('merchantName') || '').trim(),
    // Con i PIN per persona il nome arriva dal cookie: è l'unico che non si può sbagliare
    // né attribuire a un collega. Col codice condiviso resta quello digitato.
    surveyor: currentOperator(request) || (form.get('surveyor') || '').trim(),
    answers,
  };

  const errors = validateVisit(data);

  // Le foto sono facoltative, ma se ci sono devono essere immagini di peso ragionevole.
  // Gli slot multipli arrivano come più valori con la stessa chiave.
  const files = [];
  for (const photo of PHOTOS) {
    const picked = form.getAll(`photo_${photo.id}`).filter((f) => f && typeof f !== 'string' && f.size);
    for (const file of photo.multiple ? picked : picked.slice(0, 1)) {
      const code = validatePhoto(file);
      if (code) errors[`photo_${photo.id}`] = code;
      else files.push([photo.id, file]);
    }
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ code: 'invalid_fields', errors }, { status: 422 });
  }

  // Il negozio dichiarato viene agganciato allo snapshot quando riconosciuto: senza id,
  // l'esclusione dall'elenco pubblico non saprebbe chi togliere.
  const known = data.merchantId ? ALL_MERCHANTS.find((m) => m.id === data.merchantId) : null;

  const id = newVisitId();
  const photos = {};
  const counters = {};
  for (const [slot, file] of files) {
    const index = (counters[slot] = (counters[slot] ?? 0) + 1);
    const multiple = PHOTOS.find((p) => p.id === slot)?.multiple;
    const stored = await storeVisitPhoto(file, id, multiple ? `${slot}-${index}` : slot);
    if (!stored) continue;
    // Uno slot multiplo tiene sempre un array, anche con una foto sola: chi legge
    // dopo non deve indovinare la forma del dato.
    if (multiple) (photos[slot] ??= []).push(stored);
    else photos[slot] = stored;
  }

  // L'esito non arriva dal modulo: si deduce dalle risposte, così non può divergere da
  // quello che il rilevatore ha effettivamente risposto.
  const outcomeId = outcomeOf(answers);
  const outcome = OUTCOMES.find((o) => o.id === outcomeId);

  await saveVisit({
    id,
    createdAt: new Date().toISOString(),
    surveyor: data.surveyor,
    merchantId: known?.id ?? null,
    merchantName: known?.name ?? data.merchantName,
    merchantKnown: Boolean(known),
    // Copia dei dati di mappa al momento della visita: serve a capire cosa è cambiato dopo.
    mapSnapshot: known
      ? { address: known.address, category: known.category, assets: known.assets, phone: known.phone ?? null }
      : null,
    outcome: outcome.id,
    excludes: Boolean(outcome.excludes),
    answers: pickAnswers(answers),
    photos,
  });

  return NextResponse.json({ ok: true, id });
}
