/**
 * Persistenza dei passaggi per gli adesivi in vetrina e il materiale.
 *
 * Stessa forma delle rilevazioni (`visits.js`): file JSON in `.data/adesivi.json`, scrittura
 * atomica e coda che serializza le scritture. Ogni passaggio è un record a sé: un negozio
 * chiuso oggi e ripassato domani ha due passaggi, e conta l'ultimo.
 *
 * Le foto stanno in `.data/adesivi/<anno>/<id>.<ext>`, fuori dalla cartella pubblica.
 *
 * Niente si cancella e niente si riscrive: i passaggi si aggiungono soltanto, e ogni foto è
 * scritta una volta (mai sopra un'altra) e poi messa in sola lettura, comprese quelle salvate
 * prima di questa regola. Non c'è nessuna API che tolga un passaggio o una foto.
 */
import { chmod, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
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

export async function listStickers() {
  lockPhotos();
  return readAll();
}

/** Le foto già sul disco in sola lettura, una volta per avvio del server. */
let locked = null;
function lockPhotos() {
  locked ??= (async () => {
    for (const file of await photoFiles()) await chmod(join(DATA_DIR, file), 0o444).catch(() => {});
  })().catch(() => {});
  return locked;
}

/** Tutti i file foto sul disco, come chiavi `adesivi/<anno>/<nome>`. */
export async function photoFiles() {
  const root = join(DATA_DIR, 'adesivi');
  const out = [];
  let years = [];
  try {
    years = await readdir(root, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return out;
    throw err;
  }
  for (const y of years) {
    if (!y.isDirectory() || !/^\d{4}$/.test(y.name)) continue;
    for (const f of await readdir(join(root, y.name))) out.push(`adesivi/${y.name}/${f}`);
  }
  return out.sort();
}

/** Il file dei passaggi così com'è sul disco, per la copia di sicurezza. */
export async function stickersFileBytes() {
  try {
    return await readFile(FILE);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export const newStickerId = () => `AD-${yearInZurich()}-${randomUUID().slice(0, 6).toUpperCase()}`;

export function saveSticker(record) {
  const next = queue.then(async () => {
    const all = await readAll();
    if (all.some((r) => r.id === record.id)) throw new Error(`passaggio ${record.id} già salvato`);
    // Solo in aggiunta: quello che c'era resta identico, nello stesso ordine.
    await writeAll([...all, record]);
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
  // `wx`: mai sopra un file che c'è già. Poi sola lettura.
  await writeFile(join(dir, name), buffer, { flag: 'wx', mode: 0o444 });
  return {
    key: `adesivi/${year}/${name}`,
    size: buffer.length,
    contentType: kind.type,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  };
}

export const stickerPhotoPath = (key) => join(DATA_DIR, key);
