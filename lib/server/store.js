/**
 * Persistenza delle giocate.
 *
 * Implementazione locale su file (`.data/entries.json`) con lock cooperativo: sopravvive al
 * riavvio del processo, che è ciò che la Map in memoria non faceva.
 * In produzione va sostituita l'implementazione, non i chiamanti: l'interfaccia esposta
 * (`saveEntry`, `findByTx`, `countByEmail`, `listEntries`) è la stessa che implementerà
 * l'adapter Postgres/Prisma.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'entries.json');

let queue = Promise.resolve(); // serializza le scritture: niente race tra richieste concorrenti

async function readAll() {
  try {
    const raw = await readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.entries) ? parsed.entries : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(entries) {
  await mkdir(dirname(FILE), { recursive: true });
  // Scrittura atomica: file temporaneo + rename, così un crash non lascia un JSON troncato.
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), entries }, null, 2)}\n`);
  await rename(tmp, FILE);
}

/** Esegue `fn` in coda, con l'elenco corrente, e persiste il risultato restituito. */
function transaction(fn) {
  const next = queue.then(async () => {
    const entries = await readAll();
    const { entries: updated, result } = await fn(entries);
    if (updated) await writeAll(updated);
    return result;
  });
  // La coda non deve interrompersi se una transazione fallisce.
  queue = next.catch(() => {});
  return next;
}

export const findByTx = async (txNormalized) =>
  txNormalized ? (await readAll()).find((e) => e.txNormalized === txNormalized) ?? null : null;

export const countByEmail = async (email) =>
  (await readAll()).filter((e) => e.email.toLowerCase() === email.toLowerCase()).length;

export const listEntries = readAll;

/**
 * Inserisce la giocata solo se il numero di transazione non è già presente.
 * Il controllo e l'inserimento avvengono nella stessa transazione: due richieste simultanee
 * con lo stesso TX non possono più passare entrambe.
 */
export const saveEntry = (entry) =>
  transaction(async (entries) => {
    const duplicate = entry.txNormalized && entries.find((e) => e.txNormalized === entry.txNormalized);
    if (duplicate) return { entries: null, result: { ok: false, reason: 'duplicate' } };
    return { entries: [...entries, entry], result: { ok: true, entry } };
  });

/** Aggiorna lo stato di una giocata (verifica manuale o riscontro automatico sul POS). */
export const updateEntry = (id, patch) =>
  transaction(async (entries) => {
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) return { entries: null, result: { ok: false, reason: 'not_found' } };
    const updated = [...entries];
    updated[index] = { ...updated[index], ...patch, updatedAt: new Date().toISOString() };
    return { entries: updated, result: { ok: true, entry: updated[index] } };
  });
