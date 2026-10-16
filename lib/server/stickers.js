/**
 * Persistenza dei passaggi per gli adesivi in vetrina.
 *
 * Stessa forma delle rilevazioni (`visits.js`): file JSON in `.data/adesivi.json`, scrittura
 * atomica e coda che serializza le scritture. Ogni passaggio è un record a sé: un negozio
 * chiuso oggi e ripassato domani ha due passaggi, e conta l'ultimo.
 *
 * Le foto stanno in `.data/adesivi/<anno>/<id>.<ext>`, fuori dalla cartella pubblica.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { yearInZurich } from '../time.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'adesivi.json');

let queue = Promise.resolve();

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return Array.isArray(parsed.stickers) ? parsed.stickers : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(stickers) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), stickers }, null, 2)}\n`);
  await rename(tmp, FILE);
}

export const listStickers = readAll;

export const newStickerId = () => `AD-${yearInZurich()}-${randomUUID().slice(0, 6).toUpperCase()}`;

export function saveSticker(record) {
  const next = queue.then(async () => {
    const all = await readAll();
    all.push(record);
    await writeAll(all);
    return record;
  });
  queue = next.catch(() => {});
  return next;
}

/** Chiavi delle foto accettate da chi le serve: niente `..`, niente percorsi arbitrari. */
export const STICKER_PHOTO_KEY = /^adesivi\/\d{4}\/AD-\d{4}-[A-Z0-9]{6}\.(jpg|png|webp|heic)$/;

/** `image` arriva già riconosciuto dai byte (`image-sniff.js`). */
export async function storeStickerPhoto({ buffer, kind }, id) {
  if (!buffer?.length || !kind) return null;
  const year = yearInZurich();
  const dir = join(DATA_DIR, 'adesivi', String(year));
  const name = `${id}.${kind.ext}`;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), buffer);
  return {
    key: `adesivi/${year}/${name}`,
    size: buffer.length,
    contentType: kind.type,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}

export const stickerPhotoPath = (key) => join(DATA_DIR, key);
