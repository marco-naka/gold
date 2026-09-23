/**
 * Archiviazione degli scontrini caricati.
 *
 * In locale i file finiscono in `.data/receipts/<anno>/<id>.<ext>`, fuori dalla cartella
 * pubblica: non sono serviti staticamente e restano accessibili solo al back-office.
 * In produzione va sostituito il corpo di `storeReceipt` con l'upload su S3/R2 e la
 * restituzione della chiave oggetto: la firma resta invariata.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'application/pdf': 'pdf',
};

/** Rimuove uno scontrino archiviato: usato quando la giocata viene poi rifiutata. */
export async function deleteReceipt(stored) {
  if (!stored?.key) return;
  await rm(join(DATA_DIR, stored.key), { force: true });
}

export async function storeReceipt(file, entryId) {
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const year = new Date().getFullYear();
  const dir = join(DATA_DIR, 'receipts', String(year));
  const ext = EXT[file.type] ?? 'bin';
  const path = join(dir, `${entryId}.${ext}`);

  await mkdir(dir, { recursive: true });
  await writeFile(path, buffer);

  return {
    key: `receipts/${year}/${entryId}.${ext}`,
    originalName: file.name,
    size: buffer.length,
    contentType: file.type,
    // L'hash permette di individuare lo stesso scontrino ricaricato con un altro nome file.
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}
