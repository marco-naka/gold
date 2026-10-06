/**
 * Archivio dei link social segnalati dai commercianti: DATA_DIR/social.json, sul disco
 * persistente come le rilevazioni. Scritture in coda, file sostituito in modo atomico.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'social.json');

let queue = Promise.resolve();

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return Array.isArray(parsed.links) ? parsed.links : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(links) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), links }, null, 2)}\n`);
  await rename(tmp, FILE);
}

export const listSocialLinks = readAll;

/**
 * Salva una segnalazione. Lo stesso link per lo stesso negozio non si duplica: chi preme due
 * volte, o lo rimanda per sicurezza, trova la segnalazione che c'era già.
 */
export function saveSocialLink(link) {
  const next = queue.then(async () => {
    const links = await readAll();
    const existing = links.find((l) => l.url === link.url && l.merchantId === link.merchantId);
    if (existing) return { ok: true, duplicate: true, link: existing };
    const saved = { id: `SC-${randomUUID().slice(0, 8).toUpperCase()}`, ...link };
    await writeAll([...links, saved]);
    return { ok: true, duplicate: false, link: saved };
  });
  queue = next.catch(() => {});
  return next;
}
