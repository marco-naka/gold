/**
 * Le giocate viste dall'admin: elenco completo, cambi di stato con cronologia, CSV.
 *
 * Lo stato decide chi entra nell'estrazione (lib/server/draw.js, `isAdmitted`): una giocata
 * respinta prima dell'impegno resta fuori dagli elenchi. Dopo l'impegno gli elenchi sono
 * pubblici e non cambiano più: un vincitore non valido si esclude dall'estrazione, e al suo
 * posto sale la riserva. Per questo il pannello dice se l'impegno c'è già.
 */
import { readFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';
import { amendEntry, listEntries } from './store.js';
import { TIME_ZONE, zurichLocalToIso } from '../time.js';

const dataDir = () => process.env.DATA_DIR || join(process.cwd(), '.data');

export const ENTRY_STATUSES = ['pending_verification', 'validated', 'rejected'];

/** Le giocate più recenti per prime, senza il riferimento interno allo scontrino. */
export async function adminEntries() {
  const entries = await listEntries();
  return entries
    .map(({ receipt, txNormalized, ...e }) => ({ ...e, tx: txNormalized ?? null, hasReceipt: Boolean(receipt?.key) }))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

/**
 * Cambia lo stato di una giocata e lo scrive nella cronologia: chi, quando, da cosa a cosa,
 * perché. Respingere chiede sempre un motivo; convalidare può portare l'ora del POS, che
 * decide l'ammissione al Satoshi Spritz.
 */
export async function setEntryStatus(id, status, { by, reason = '', paidAt = '', note = '' } = {}) {
  if (!ENTRY_STATUSES.includes(status)) return { ok: false, error: 'status' };
  if (status === 'rejected' && !reason.trim()) return { ok: false, error: 'reason' };
  let paid = null;
  if (paidAt.trim()) {
    try {
      paid = zurichLocalToIso(paidAt);
    } catch {
      return { ok: false, error: 'paidAt' };
    }
  }
  const res = await amendEntry(id, (e) => ({
    status,
    ...(paid ? { paidAt: paid } : {}),
    ...(status === 'validated' ? { verifiedBy: by, verifiedAt: new Date().toISOString() } : {}),
    ...(status === 'rejected' ? { rejectReason: reason.trim() } : {}),
    history: [
      ...(e.history ?? []),
      {
        at: new Date().toISOString(),
        by,
        from: e.status,
        to: status,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(paid ? { paidAt: paid } : {}),
      },
    ],
  }));
  return res.ok ? { ok: true } : { ok: false, error: 'not_found' };
}

/** La foto dello scontrino di una giocata: il percorso viene dalla giocata, mai dalla richiesta. */
export async function receiptOf(id) {
  const entry = (await listEntries()).find((e) => e.id === id);
  const key = entry?.receipt?.key;
  if (!key) return null;
  const path = normalize(join(dataDir(), key));
  if (!path.startsWith(join(dataDir(), 'receipts'))) return null;
  try {
    return { body: await readFile(path), contentType: entry.receipt.contentType || 'application/octet-stream' };
  } catch {
    return null;
  }
}

const STATUS_IT = { pending_verification: 'in verifica', validated: 'valida', rejected: 'respinta' };
const zurich = (iso) =>
  iso ? new Date(iso).toLocaleString('it-CH', { timeZone: TIME_ZONE, dateStyle: 'short', timeStyle: 'short' }) : '';
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export function entriesCsv(entries) {
  const cols = [
    ['ID', (e) => e.id],
    ['Prova del team', (e) => (e.test ? 'sì' : 'no')],
    ['Stato', (e) => STATUS_IT[e.status] ?? e.status],
    ['Registrata (Lugano)', (e) => zurich(e.createdAt)],
    ['Email', (e) => e.email],
    ['Negozio', (e) => e.merchant],
    ['ID negozio', (e) => e.merchantId],
    ['Negozio in elenco', (e) => (e.merchantKnown ? 'sì' : 'no')],
    ['Importo', (e) => e.amountLabel],
    ['Ultimi 6 caratteri', (e) => e.txIdMasked],
    ['Transazione', (e) => e.tx],
    ['Tipo transazione', (e) => e.txKind],
    ['Pagata sul POS (Lugano)', (e) => zurich(e.paidAt)],
    ['Sorgente QR', (e) => e.source],
    ['Lingua', (e) => e.locale],
    ['Scontrino', (e) => (e.hasReceipt ? 'sì' : 'no')],
    ['Convalidata da', (e) => e.verifiedBy],
    ['Motivo del rifiuto', (e) => e.rejectReason],
  ];
  // Come l'esportazione delle rilevazioni: virgole, CRLF e BOM, così Excel apre gli accenti giusti.
  const lines = [cols.map(([h]) => cell(h)).join(','), ...entries.map((e) => cols.map(([, f]) => cell(f(e))).join(','))];
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}
