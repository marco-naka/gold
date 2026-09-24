#!/usr/bin/env node
/**
 * Back-office da riga di comando per la verifica delle giocate.
 *
 * È l'anello mancante tra la registrazione (stato `pending_verification`) e l'estrazione,
 * che ammette solo le giocate `validated`. Finché non esiste il riscontro automatico sul
 * gateway POS NAKA, la convalida si fa da qui, una per una o in blocco.
 *
 *   node scripts/entries.mjs stats
 *   node scripts/entries.mjs list --status pending_verification
 *   node scripts/entries.mjs show NK-2026-ABC123
 *   node scripts/entries.mjs validate NK-2026-ABC123 [--note "riscontro POS #4412"]
 *   node scripts/entries.mjs reject   NK-2026-ABC123 --reason "transazione non trovata"
 *   node scripts/entries.mjs export   > giocate.csv
 */
import { listEntries, purgePersonalData, updateEntry } from '../lib/server/store.js';
import { sourceReport } from '../lib/server/stats.js';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { CONTEST } from '../lib/constants.js';

const STATUS = {
  pending_verification: 'in verifica',
  validated: 'valida',
  rejected: 'respinta',
};

const flag = (rest, name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
};

const out = (s) => process.stdout.write(`${s}\n`);

async function stats() {
  const entries = await listEntries();
  const byStatus = entries.reduce((acc, e) => ({ ...acc, [e.status]: (acc[e.status] ?? 0) + 1 }), {});
  const merchants = new Set(entries.filter((e) => e.merchantId).map((e) => e.merchantId));
  const emails = new Set(entries.map((e) => e.email.toLowerCase()));

  out(`Giocate totali: ${entries.length}`);
  for (const [status, label] of Object.entries(STATUS)) {
    out(`  ${label.padEnd(12)} ${byStatus[status] ?? 0}`);
  }
  out(`Partecipanti distinti: ${emails.size}`);
  out(`Merchant coinvolti: ${merchants.size}`);
  const unknown = entries.filter((e) => e.merchant && !e.merchantKnown).length;
  if (unknown) out(`⚠ ${unknown} giocate con negozio non riconosciuto: da controllare a mano`);
  const noMerchant = entries.filter((e) => !e.merchant).length;
  if (noMerchant) out(`  ${noMerchant} giocate senza negozio indicato (campo facoltativo)`);

  // Quale materiale ha portato giocate: è la domanda a cui si deve rispondere a campagna finita.
  const report = await sourceReport();
  if (report.length) {
    out('\nConversione per sorgente');
    out(`  ${'sorgente'.padEnd(20)} ${'aperture'.padStart(8)} ${'giocate'.padStart(8)} ${'tasso'.padStart(7)}`);
    for (const r of report) {
      const rate = r.rate === null ? '—' : `${Math.round(r.rate * 100)}%`;
      out(`  ${r.source.padEnd(20)} ${String(r.visits).padStart(8)} ${String(r.entries).padStart(8)} ${rate.padStart(7)}`);
    }
  }
}

async function list(rest) {
  const status = flag(rest, 'status');
  const entries = (await listEntries()).filter((e) => !status || e.status === status);
  if (!entries.length) return out('Nessuna giocata corrisponde.');
  for (const e of entries) {
    out(
      `${e.id}  ${(STATUS[e.status] ?? e.status).padEnd(12)} ${e.email.padEnd(28)} ` +
        `${(e.merchant ?? '—').slice(0, 24).padEnd(24)} ${e.txIdMasked ?? '—'}`
    );
  }
  out(`\n${entries.length} giocate`);
}

async function show([id]) {
  const entry = (await listEntries()).find((e) => e.id === id);
  if (!entry) throw new Error(`Giocata ${id} non trovata.`);
  out(JSON.stringify(entry, null, 2));
}

async function setStatus(id, status, patch) {
  if (!id) throw new Error('Serve l’ID della giocata.');
  const res = await updateEntry(id, { status, ...patch });
  if (!res.ok) throw new Error(`Giocata ${id} non trovata.`);
  out(`✓ ${id} → ${STATUS[status]}`);
}

/** Convalida in blocco: utile dopo un riscontro massivo sull'export del POS. */
async function validateAll(rest) {
  const entries = (await listEntries()).filter((e) => e.status === 'pending_verification');
  if (!entries.length) return out('Nessuna giocata in verifica.');
  if (!rest.includes('--yes')) {
    return out(`${entries.length} giocate verrebbero convalidate. Conferma con --yes.`);
  }
  for (const e of entries) await updateEntry(e.id, { status: 'validated', verifiedBy: 'bulk' });
  out(`✓ ${entries.length} giocate convalidate`);
}

/**
 * Chiusura del concorso: via email, scontrini e numeri di transazione.
 * Restano ID, stato, sorgente e data, che non identificano nessuno e servono al rendiconto
 * e alla verificabilità dell'estrazione già pubblicata.
 */
async function purge(rest) {
  const entries = await listEntries();
  const withData = entries.filter((e) => e.email);
  const until = new Date(CONTEST.onlineUntil);

  if (!rest.includes('--yes')) {
    out(`Cancellazione dati personali di ${withData.length} giocate (email, scontrini, numeri di transazione).`);
    out(`Data prevista dalla privacy policy: ${until.toLocaleDateString('it-CH')}`);
    if (Date.now() < until.getTime()) out('⚠ La data non è ancora arrivata: procedi solo se sai perché.');
    return out('Conferma con --yes. Operazione irreversibile.');
  }

  const dir = process.env.DATA_DIR || join(process.cwd(), '.data');
  await rm(join(dir, 'receipts'), { recursive: true, force: true });
  const res = await purgePersonalData();
  out(`✓ Scontrini eliminati e ${res.count} giocate anonimizzate`);
  out('  Conservati: ID giocata, stato, sorgente, data. Nessun dato personale.');
}

async function exportCsv() {
  const entries = await listEntries();
  const cols = ['id', 'status', 'email', 'merchant', 'merchantId', 'merchantKnown', 'txSuffix', 'amountCents', 'txKind', 'source', 'locale', 'createdAt'];
  out(cols.join(','));
  for (const e of entries) {
    out(cols.map((c) => `"${String(e[c] ?? '').replace(/"/g, '""')}"`).join(','));
  }
}

const [command, ...rest] = process.argv.slice(2);
const commands = {
  stats,
  list: () => list(rest),
  show: () => show(rest),
  validate: () => setStatus(rest[0], 'validated', { verifiedBy: 'cli', note: flag(rest, 'note') ?? null }),
  reject: () => setStatus(rest[0], 'rejected', { rejectionReason: flag(rest, 'reason') ?? null }),
  'validate-all': () => validateAll(rest),
  export: exportCsv,
  purge: () => purge(rest),
};

const fn = commands[command];
if (!fn) {
  process.stderr.write(
    'Uso: stats | list [--status <stato>] | show <id> | validate <id> | reject <id> --reason <testo> | validate-all --yes | export | purge --yes\n'
  );
  process.exit(1);
}
fn().catch((err) => {
  process.stderr.write(`✗ ${err.message}\n`);
  process.exit(1);
});
