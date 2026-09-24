/**
 * Contatori pubblici e attribuzione delle sorgenti.
 *
 * Volutamente senza cookie, senza IP e senza identificatori: si contano solo quante volte
 * è stata aperta una pagina per ciascuna sorgente (il parametro `?s=` stampato sui QR) e
 * quante giocate ne sono derivate. Non c'è nulla da consentire ai sensi della LPD, e il
 * dato serve a una cosa sola: sapere quale materiale ha funzionato.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { listEntries } from './store.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'visits.json');

/** Sorgenti ammesse: un valore non in elenco viene scartato, così il file non diventa una discarica. */
export const SOURCES = ['volantino-cliente', 'volantino-merchant', 'locandina', 'vetrina', 'linkedin', 'sito', 'altro'];

export const normalizeSource = (value) => {
  const v = (value || '').trim().toLowerCase().slice(0, 32);
  return SOURCES.includes(v) ? v : null;
};

let queue = Promise.resolve();

async function readVisits() {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

/** Incrementa il contatore di una sorgente, serializzando le scritture. */
export function recordVisit(source) {
  const key = normalizeSource(source);
  if (!key) return Promise.resolve(null);

  const next = queue.then(async () => {
    const visits = await readVisits();
    visits[key] = (visits[key] ?? 0) + 1;
    await mkdir(dirname(FILE), { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await writeFile(tmp, `${JSON.stringify(visits, null, 2)}\n`);
    await rename(tmp, FILE);
    return visits[key];
  });
  queue = next.catch(() => {});
  return next;
}

export const getVisits = readVisits;

/** Numeri pubblici mostrati in pagina. */
export async function publicStats() {
  const entries = await listEntries();
  return {
    entries: entries.length,
    validated: entries.filter((e) => e.status === 'validated').length,
  };
}

/** Conversione per sorgente: visite, giocate e tasso. Usato dal back-office. */
export async function sourceReport() {
  const [visits, entries] = await Promise.all([readVisits(), listEntries()]);
  const bySource = entries.reduce((acc, e) => {
    const k = e.source ?? 'sconosciuta';
    return { ...acc, [k]: (acc[k] ?? 0) + 1 };
  }, {});
  const keys = [...new Set([...Object.keys(visits), ...Object.keys(bySource)])].sort();
  return keys.map((source) => {
    const seen = visits[source] ?? 0;
    const played = bySource[source] ?? 0;
    return { source, visits: seen, entries: played, rate: seen ? played / seen : null };
  });
}
