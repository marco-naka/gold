import { randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import { MERCHANTS } from '@/lib/merchants';
import { MAX_MERCHANT_LENGTH, parseAmount, txKind, txSuffix, validateEntry } from '@/lib/validation';
import { submissionWindow } from '@/lib/contest';
import { normalizeSource } from '@/lib/server/stats';
import { formatDateTime } from '@/lib/i18n';
import { yearInZurich } from '@/lib/time';
import { IS_DEMO } from '@/lib/deploy';
import { saveEntry } from '@/lib/server/store';
import { deleteReceipt, storeReceipt } from '@/lib/server/receipts';
import { sendEntryReceived } from '@/lib/server/mailer';
import { HOUR, globalLimit, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Due limiti, non uno: quello per email impedisce a una persona di riempire l'urna, quello
// per solo IP impedisce di aggirarlo cambiando email a ogni richiesta — che è esattamente
// quello che farebbe uno script.
const PER_EMAIL = { max: 10, windowMs: HOUR };
const PER_IP = { max: 40, windowMs: HOUR };

// Oltre questa dimensione la richiesta si rifiuta PRIMA di leggerla: formData() carica
// tutto il corpo in memoria, quindi senza questo controllo un upload da un giga lo
// occuperebbe davvero prima che la validazione possa dire di no.
const MAX_BODY_BYTES = 12 * 1024 * 1024;
// Un form compilato in meno di 3 secondi è quasi certamente automatizzato.
const MIN_FILL_MS = 3000;

const mask = (value, head = 6, tail = 4) =>
  !value || value.length <= head + tail ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;

/** Riconosce il negozio dichiarato (testo libero) tra quelli della mappa, senza imporlo. */
function matchMerchant(input) {
  const q = (input || '').trim().toLowerCase();
  if (!q) return null;
  const hit =
    MERCHANTS.find((m) => m.name.toLowerCase() === q) ||
    MERCHANTS.find((m) => m.name.toLowerCase().includes(q) || q.includes(m.name.toLowerCase()));
  return hit ? { id: hit.id, name: hit.name, known: true } : { id: null, name: input.trim(), known: false };
}

export async function POST(request) {
  // 0a. Ambiente dimostrativo: si rifiuta la giocata invece di accettarla e perderla.
  if (IS_DEMO) {
    return NextResponse.json(
      { code: 'demo', demo: true },
      { status: 503 }
    );
  }

  // 0b. Finestra temporale: fuori dal periodo di gara non si registra nulla.
  const window = submissionWindow();
  if (!window.open) {
    return NextResponse.json(
      { code: window.reason === 'upcoming' ? 'closed_upcoming' : 'closed_ended', closed: true },
      { status: 403 }
    );
  }

  const ip = clientIp(request);

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ code: 'bad_request' }, { status: 413 });
  }

  // Il limite per IP si applica prima di leggere il corpo: un flood non deve nemmeno
  // arrivare a essere parsato.
  if (hit(`ip:${ip}`, PER_IP) || globalLimit('entries', 120)) {
    return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  }

  const data = {
    email: String(form.get('email') ?? '').trim(),
    txId: String(form.get('txId') ?? '').trim(),
    amount: String(form.get('amount') ?? '').trim(),
    merchant: String(form.get('merchant') ?? '').trim().slice(0, MAX_MERCHANT_LENGTH + 1),
    locale: String(form.get('locale') ?? 'it') === 'en' ? 'en' : 'it',
    source: normalizeSource(form.get('source')),
    confirmAge: form.get('confirmAge') === 'true',
    acceptRules: form.get('acceptRules') === 'true',
  };

  // 1. Anti-bot: honeypot invisibile + tempo minimo di compilazione.
  //    Si risponde 201 fittizio per non insegnare al bot come passare il filtro.
  const honeypot = String(form.get('company') ?? '').trim();
  const startedAt = Number(form.get('startedAt') ?? 0);
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
  if (honeypot || tooFast) {
    return NextResponse.json(
      { entry: { id: 'NK-0000-000000', email: data.email, proof: '—', status: 'pending_verification' } },
      { status: 201 }
    );
  }

  const file = form.get('receipt');
  const hasFile = file && typeof file === 'object' && 'size' in file && file.size > 0;
  const receipt = hasFile ? { name: file.name, size: file.size, type: file.type } : null;

  // 2. Validazione server-side (stesse regole del client, non aggirabili)
  const errors = validateEntry(data, receipt);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { code: 'invalid_fields', errors },
      { status: 422 }
    );
  }

  // 3. Rate limiting per email (quello per IP è già scattato prima di leggere il corpo)
  if (hit(`entry:${ip}|${data.email.toLowerCase()}`, PER_EMAIL)) {
    return NextResponse.json(
      { code: 'rate_limited' },
      { status: 429 }
    );
  }

  // 4. TODO produzione: verifica incrociata sul gateway POS NAKA
  //    const settlement = await nakaPos.lookupTransaction({ tx, merchant: merchant?.id });
  //    if (!settlement) -> resta pending, verifica manuale sullo scontrino archiviato
  //    if (settlement.timestamp fuori dal periodo di gara) -> 422

  // Chiave di unicità: ultime 6 cifre + importo. Le sole 6 cifre collidono troppo spesso e
  // finirebbero per rifiutare come duplicate le giocate di clienti diversi ma onesti.
  const cents = parseAmount(data.amount);
  const suffix = txSuffix(data.txId);
  const tx = `${suffix}|${cents}`;
  const merchant = matchMerchant(data.merchant);
  const createdAt = new Date();

  // L'ID è il biglietto dell'estrazione: due giocate con lo stesso ID varrebbero un biglietto
  // solo, e la seconda foto sovrascriverebbe la prima. Generatore crittografico, sempre sei
  // caratteri; se l'ID è già preso (da una foto o da una giocata) se ne genera un altro.
  let entry = null;
  let stored = null;
  for (let attempt = 0; attempt < 5 && !entry; attempt += 1) {
    const id = `NK-${yearInZurich(createdAt)}-${newIdSuffix()}`;
    try {
      stored = await storeReceipt(hasFile ? file : null, id);
    } catch (err) {
      if (err?.code === 'EEXIST') continue;
      return NextResponse.json(
        { code: 'storage_error' },
        { status: 500 }
      );
    }

    // 5. Unicità del numero di transazione e dell'ID, verificate e applicate nella stessa
    //    transazione di scrittura.
    const saved = await saveEntry({
      id,
      email: data.email,
      locale: data.locale,
      source: data.source,
      merchant: merchant?.name ?? null,
      merchantId: merchant?.id ?? null,
      merchantKnown: merchant?.known ?? null,
      proof: 'tx_and_receipt', // codice: il testo lo risolve il client
      txNormalized: tx,
      txSuffix: suffix,
      amountCents: cents,
      amountLabel: `CHF ${(cents / 100).toFixed(2)}`,
      txIdMasked: suffix.toUpperCase(),
      txKind: txKind(data.txId),
      receipt: stored,
      status: 'pending_verification',
      createdAt: createdAt.toISOString(),
      createdAtLabel: formatDateTime(createdAt, data.locale, { dateStyle: 'medium', timeStyle: 'short' }),
    });
    if (saved.ok) {
      entry = saved.entry;
      break;
    }
    // La giocata non è stata accettata: niente scontrini orfani sullo storage.
    await deleteReceipt(stored).catch(() => {});
    if (saved.reason !== 'id_taken') {
      return NextResponse.json(
        { code: 'duplicate_tx', errors: { txId: 'tx_duplicate' } },
        { status: 409 }
      );
    }
  }
  if (!entry) return NextResponse.json({ code: 'storage_error' }, { status: 500 });

  // 6. Conferma via email. L'invio non deve far fallire la giocata: se il provider non risponde
  //    il messaggio resta in coda e la partecipazione è comunque registrata.
  let mail = { sent: false, queued: false };
  try {
    mail = await sendEntryReceived(entry);
  } catch {
    mail = { sent: false, queued: false };
  }

  // Al client non serve (e non deve arrivare) il riferimento allo scontrino archiviato.
  const { txNormalized, receipt: _receipt, ...publicEntry } = entry;
  return NextResponse.json(
    {
      entry: {
        ...publicEntry,
        receiptName: stored?.originalName ?? null,
        confirmationEmail: mail.sent ? 'sent' : 'queued',
      },
    },
    { status: 201 }
  );
}

const ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** Sei caratteri da un generatore crittografico: 36^6, oltre due miliardi di combinazioni. */
const newIdSuffix = () => Array.from({ length: 6 }, () => ID_ALPHABET[randomInt(ID_ALPHABET.length)]).join('');
