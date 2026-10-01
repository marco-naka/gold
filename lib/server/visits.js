/**
 * Persistenza delle rilevazioni in negozio.
 *
 * Stessa forma di `store.js`: file JSON in `.data/rilevazioni.json`, scrittura atomica e coda
 * che serializza le transazioni. In produzione si sostituisce l'implementazione, non i chiamanti.
 *
 * Il nome del file non è `visits.json`: quello è già del contatore delle sorgenti in
 * `stats.js`, e due sottosistemi che scrivono lo stesso file si cancellano a vicenda.
 *
 * A differenza delle giocate qui non c'è unicità da garantire: lo stesso negozio può essere
 * visitato più volte (primo giro, richiamo, consegna del materiale) e ogni passaggio è un
 * record a sé. Lo storico è il dato utile.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'rilevazioni.json');

let queue = Promise.resolve();

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return Array.isArray(parsed.visits) ? parsed.visits : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(visits) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), visits }, null, 2)}\n`);
  await rename(tmp, FILE);
}

export const listVisits = readAll;

/** Visite precedenti allo stesso negozio: serve a mostrare lo storico al rilevatore. */
export async function visitsForMerchant(merchantId, merchantName) {
  const all = await readAll();
  return all.filter((v) =>
    merchantId ? v.merchantId === merchantId : v.merchantName.toLowerCase() === (merchantName || '').toLowerCase()
  );
}

/** Identificativo leggibile: si detta al telefono senza incertezze. */
export const newVisitId = () => `RV-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;

export function saveVisit(visit) {
  const next = queue.then(async () => {
    const visits = await readAll();
    visits.push(visit);
    await writeAll(visits);
    return visit;
  });
  queue = next.catch(() => {});
  return next;
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic' };

/**
 * Archivia una foto in `.data/rilevazioni/<anno>/<id>-<slot>.<ext>`, fuori dalla cartella pubblica:
 * ci sono dentro vetrine, terminali e ricevute, non vanno serviti staticamente.
 */
export async function storeVisitPhoto(file, visitId, slot) {
  if (!file || !file.size) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const year = new Date().getFullYear();
  const dir = join(DATA_DIR, 'rilevazioni', String(year));
  const ext = EXT[file.type] ?? 'bin';
  const name = `${visitId}-${slot}.${ext}`;

  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), buffer);

  return {
    key: `rilevazioni/${year}/${name}`,
    size: buffer.length,
    contentType: file.type,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}
