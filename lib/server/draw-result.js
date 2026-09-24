import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

/** Risultato dell'estrazione, se già eseguita e pubblicata. */
export async function readDrawResult() {
  try {
    return JSON.parse(await readFile(join(DATA_DIR, 'draw', 'result.json'), 'utf8'));
  } catch {
    return null;
  }
}
