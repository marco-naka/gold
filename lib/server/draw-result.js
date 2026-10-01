import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

const readDrawFile = async (name) => {
  try {
    return JSON.parse(await readFile(join(DATA_DIR, 'draw', name), 'utf8'));
  } catch {
    return null;
  }
};

/** Impegno sugli elenchi, se già pubblicato: elenchi, impronte e blocco-seme annunciato. */
export const readCommitment = () => readDrawFile('commitment.json');

/** Copie depositate su archive.org: `{ 'commitment.json': { url, archivedAt }, … }`. */
export const readArchive = async () => (await readDrawFile('archive.json')) ?? {};

/** Risultato dell'estrazione, se già eseguita e pubblicata. */
export const readDrawResult = () => readDrawFile('result.json');
