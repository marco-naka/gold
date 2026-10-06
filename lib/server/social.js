/**
 * Archivio dei link social segnalati dai commercianti: DATA_DIR/social.json, sul disco
 * persistente come le rilevazioni. Scritture in coda, file sostituito in modo atomico.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { MERCHANTS } from '../merchants.js';
import { listEntries } from './store.js';

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
 * Salva una segnalazione, di un commerciante (`kind: 'merchant'`) o di un cliente
 * (`kind: 'customer'`). Lo stesso link non si duplica: chi preme due volte, o lo rimanda per
 * sicurezza, trova la segnalazione che c'era già.
 */
export function saveSocialLink(link) {
  const next = queue.then(async () => {
    const links = await readAll();
    const kindOf = (l) => l.kind ?? 'merchant';
    const existing = links.find(
      (l) => l.url === link.url && kindOf(l) === kindOf(link) && (l.merchantId ?? null) === (link.merchantId ?? null),
    );
    if (existing) return { ok: true, duplicate: true, link: existing };
    const saved = { id: `SC-${randomUUID().slice(0, 8).toUpperCase()}`, ...link };
    await writeAll([...links, saved]);
    return { ok: true, duplicate: false, link: saved };
  });
  queue = next.catch(() => {});
  return next;
}

const byId = new Map(MERCHANTS.map((m) => [m.id, m]));

/**
 * L'elenco come lo vede l'admin. Per i clienti si dice anche se l'email corrisponde a una
 * partecipazione non respinta: il premio è per chi ne ha almeno una. Si calcola a ogni lettura,
 * perché un cliente può segnalare il contenuto prima di registrare lo scontrino.
 */
export async function adminSocialLinks() {
  const entries = await listEntries();
  const byEmail = new Map();
  for (const e of entries) {
    if (e.status === 'rejected') continue;
    const key = String(e.email ?? '').toLowerCase();
    byEmail.set(key, [...(byEmail.get(key) ?? []), e.id]);
  }
  return (await listSocialLinks())
    .map((l) => {
      const kind = l.kind ?? 'merchant';
      if (kind === 'customer') {
        const ids = byEmail.get(l.email) ?? [];
        return { ...l, kind, entries: ids.length, entryMatches: l.entryId ? ids.includes(l.entryId) : null };
      }
      return { ...l, kind, merchantName: byId.get(l.merchantId)?.name ?? l.merchantId, address: byId.get(l.merchantId)?.address ?? '' };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
