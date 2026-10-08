#!/usr/bin/env node
/**
 * Azzera le prove prima dell'apertura vera del concorso.
 *
 * Dall'8 ottobre il sito accetta giocate reali per i test del team: prima del 19 vanno tolte
 * tutte, insieme a ciò che ne deriva. Niente viene cancellato: ogni file si sposta in
 * DATA_DIR/archivio-prove/<data-ora>/, così una prova si ritrova se servisse.
 *
 *   node scripts/reset-prove.mjs          → mostra che cosa sposterebbe, senza toccare nulla
 *   node scripts/reset-prove.mjs --yes    → lo fa
 *
 * Si spostano: giocate, scontrini, email in coda, contatori delle sorgenti, file
 * dell'estrazione e i link social dei clienti. Restano dove sono le rilevazioni, le loro
 * bozze e foto, e i link social dei commercianti: sono lavoro vero, non prove.
 */
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const apply = process.argv.includes('--yes');
const out = (s) => process.stdout.write(`${s}\n`);

const exists = (p) => stat(p).then(() => true, () => false);
const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));

async function describe(name) {
  const p = join(DATA_DIR, name);
  if (!(await exists(p))) return null;
  if ((await stat(p)).isDirectory()) return `${(await readdir(p)).length} file`;
  if (name === 'entries.json') return `${(await readJson(p)).entries?.length ?? 0} giocate`;
  if (name === 'visits.json') return `${Object.keys(await readJson(p)).length} contatori`;
  return 'presente';
}

const MOVE = ['entries.json', 'receipts', 'outbox', 'visits.json', 'draw'];
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const dest = join(DATA_DIR, 'archivio-prove', stamp);

out(`Dati in ${DATA_DIR}`);
const found = [];
for (const name of MOVE) {
  const d = await describe(name);
  out(`  ${name.padEnd(14)} ${d ?? '—'}`);
  if (d) found.push(name);
}

const socialFile = join(DATA_DIR, 'social.json');
const links = (await exists(socialFile)) ? ((await readJson(socialFile)).links ?? []) : [];
const customers = links.filter((l) => l.kind === 'customer');
out(`  social.json    ${customers.length} link di clienti da togliere, ${links.length - customers.length} di commercianti restano`);

if (!apply) {
  out('\nNessuna modifica. Per azzerare: node scripts/reset-prove.mjs --yes');
  process.exit(0);
}

await mkdir(dest, { recursive: true });
for (const name of found) await rename(join(DATA_DIR, name), join(dest, name));
if (customers.length) {
  await writeFile(join(dest, 'social-clienti.json'), `${JSON.stringify({ links: customers }, null, 2)}\n`);
  const tmp = `${socialFile}.${process.pid}.tmp`;
  const kept = links.filter((l) => l.kind !== 'customer');
  await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), links: kept }, null, 2)}\n`);
  await rename(tmp, socialFile);
}
out(`\nFatto. Le prove sono in ${dest}`);
