/**
 * Negozi che non fanno più parte del circuito, tolti dall'area rilevazioni con il tasto
 * «Non fa più parte del circuito». Stanno sul disco, non nel codice: escono dall'elenco
 * pubblico subito, senza un deploy, e si rimettono dal pannello dell'admin.
 *
 * Le esclusioni scritte a mano in `lib/merchants.overrides.json` restano dove sono: quelle
 * sono già fuori dal pacchetto del sito, queste si sottraggono a runtime.
 *
 * Ogni cambio finisce anche nello storico, con chi l'ha fatto e perché.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'negozi-esclusi.json');

export const REASON_MIN = 3;
export const REASON_MAX = 500;

let queue = Promise.resolve();

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return { excluded: parsed.excluded ?? {}, history: Array.isArray(parsed.history) ? parsed.history : [] };
  } catch (err) {
    if (err.code === 'ENOENT') return { excluded: {}, history: [] };
    throw err;
  }
}

async function writeAll(data) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), ...data }, null, 2)}\n`);
  await rename(tmp, FILE);
}

const transaction = (change) => {
  const next = queue.then(async () => {
    const data = await readAll();
    const result = change(data);
    if (result.ok) await writeAll(data);
    return result;
  });
  queue = next.catch(() => {});
  return next;
};

/** Le esclusioni attive: `{ [merchantId]: { name, reason, by, at } }`. */
export async function readExclusions() {
  return (await readAll()).excluded;
}

/** Tutto, storico compreso, per il pannello. */
export const exclusionState = readAll;

export async function excludedIds() {
  return new Set(Object.keys(await readExclusions()));
}

/** Il motivo è obbligatorio: fra un mese nessuno ricorderà perché un negozio è sparito. */
export function excludeMerchant({ id, name, reason, by, now = new Date() }) {
  const why = typeof reason === 'string' ? reason.trim().replace(/\s+/g, ' ') : '';
  if (why.length < REASON_MIN) return Promise.resolve({ ok: false, code: 'reason_required' });
  if (why.length > REASON_MAX) return Promise.resolve({ ok: false, code: 'reason_too_long' });
  return transaction((data) => {
    if (data.excluded[id]) return { ok: false, code: 'already_excluded', exclusion: data.excluded[id] };
    const at = now.toISOString();
    data.excluded[id] = { name, reason: why, by, at };
    data.history.push({ id, name, action: 'exclude', reason: why, by, at });
    return { ok: true, exclusion: data.excluded[id] };
  });
}

export function restoreMerchant({ id, by, now = new Date() }) {
  return transaction((data) => {
    const current = data.excluded[id];
    if (!current) return { ok: false, code: 'not_excluded' };
    delete data.excluded[id];
    data.history.push({ id, name: current.name, action: 'restore', by, at: now.toISOString() });
    return { ok: true };
  });
}
