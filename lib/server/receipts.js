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
import { yearInZurich } from '../time.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

/** Rimuove uno scontrino archiviato: usato quando la giocata viene poi rifiutata. */
export async function deleteReceipt(stored) {
  if (!stored?.key) return;
  await rm(join(DATA_DIR, stored.key), { force: true });
}

/** `kind` è il tipo letto dai primi byte (image-sniff.js): vince su quello dichiarato. */
export async function storeReceipt(file, entryId, kind = null) {
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = kind?.type ?? file.type;
  const year = yearInZurich();
  const dir = join(DATA_DIR, 'receipts', String(year));
  const ext = EXT[type] ?? 'bin';
  const path = join(dir, `${entryId}.${ext}`);

  await mkdir(dir, { recursive: true });
  // Esclusiva: una foto esistente non si sovrascrive mai (EEXIST → chi chiama cambia ID).
  await writeFile(path, buffer, { flag: 'wx' });

  return {
    key: `receipts/${year}/${entryId}.${ext}`,
    originalName: file.name,
    size: buffer.length,
    contentType: type,
    // L'hash permette di individuare lo stesso scontrino ricaricato con un altro nome file.
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}
