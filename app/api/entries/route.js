import { NextResponse } from 'next/server';
import { MERCHANTS } from '@/lib/merchants';
import { MAX_MERCHANT_LENGTH, normalizeTx, txKind, validateEntry } from '@/lib/validation';
import { submissionWindow } from '@/lib/contest';
import { IS_DEMO } from '@/lib/deploy';
import { saveEntry } from '@/lib/server/store';
import { deleteReceipt, storeReceipt } from '@/lib/server/receipts';
import { sendEntryReceived } from '@/lib/server/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimit = new Map(); // chiave (ip|email) -> timestamp[]
const WINDOW_MS = 60 * 60 * 1000; // 1 ora
const MAX_PER_WINDOW = 10;
// Un form compilato in meno di 3 secondi è quasi certamente automatizzato.
const MIN_FILL_MS = 3000;

const mask = (value, head = 6, tail = 4) =>
  !value || value.length <= head + tail ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;

function isRateLimited(key) {
  const now = Date.now();
  const hits = (rateLimit.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  rateLimit.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

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
      {
        message:
          'Questa è un\u2019anteprima del sito: le registrazioni non sono ancora attive. Nessun dato viene salvato.',
        demo: true,
      },
      { status: 503 }
    );
  }

  // 0b. Finestra temporale: fuori dal periodo di gara non si registra nulla.
  const window = submissionWindow();
  if (!window.open) {
    return NextResponse.json(
      {
        message:
          window.reason === 'upcoming'
            ? `Le registrazioni aprono il ${window.opensAt.toLocaleDateString('it-CH')}.`
            : 'Il concorso è chiuso: non è più possibile registrare giocate.',
        closed: true,
      },
      { status: 403 }
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: 'Richiesta non valida.' }, { status: 400 });
  }

  const data = {
    email: String(form.get('email') ?? '').trim(),
    txId: String(form.get('txId') ?? '').trim(),
    merchant: String(form.get('merchant') ?? '').trim().slice(0, MAX_MERCHANT_LENGTH + 1),
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
      { message: 'Alcuni campi non sono validi: controlla il modulo.', errors },
      { status: 422 }
    );
  }

  // 3. Rate limiting per IP + email (anti flooding di giocate automatizzate)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(`${ip}|${data.email.toLowerCase()}`)) {
    return NextResponse.json(
      { message: 'Troppe registrazioni ravvicinate. Riprova tra qualche minuto.' },
      { status: 429 }
    );
  }

  // 4. TODO produzione: verifica incrociata sul gateway POS NAKA
  //    const settlement = await nakaPos.lookupTransaction({ tx, merchant: merchant?.id });
  //    if (!settlement) -> resta pending, verifica manuale sullo scontrino archiviato
  //    if (settlement.timestamp fuori dal periodo di gara) -> 422

  const tx = normalizeTx(data.txId);
  const merchant = matchMerchant(data.merchant);
  const createdAt = new Date();
  const id = `NK-${createdAt.getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  let stored = null;
  try {
    stored = await storeReceipt(hasFile ? file : null, id);
  } catch {
    return NextResponse.json(
      { message: 'Non siamo riusciti a salvare lo scontrino. Riprova tra qualche istante.' },
      { status: 500 }
    );
  }

  const entry = {
    id,
    email: data.email,
    merchant: merchant?.name ?? null,
    merchantId: merchant?.id ?? null,
    merchantKnown: merchant?.known ?? null,
    proof: 'Numero transazione + scontrino',
    txNormalized: tx,
    txIdMasked: mask(data.txId, 10, 6),
    txKind: txKind(data.txId),
    receipt: stored,
    status: 'pending_verification',
    createdAt: createdAt.toISOString(),
    createdAtLabel: createdAt.toLocaleString('it-CH', { dateStyle: 'medium', timeStyle: 'short' }),
  };

  // 5. Unicità del numero di transazione, verificata e applicata nella stessa transazione di scrittura.
  const saved = await saveEntry(entry);
  if (!saved.ok) {
    // La giocata non è stata accettata: niente scontrini orfani sullo storage.
    await deleteReceipt(stored).catch(() => {});
    return NextResponse.json(
      {
        message: 'Questa transazione risulta già registrata.',
        errors: { txId: 'Numero transazione già utilizzato per una giocata precedente.' },
      },
      { status: 409 }
    );
  }

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
