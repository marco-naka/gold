#!/usr/bin/env node
/**
 * Estrazione verificabile, a mano dalla Shell. La logica sta in `lib/server/draw.js`; il giorno
 * dell'estrazione la stessa logica la esegue da sé il server (`lib/server/draw-scheduler.js`).
 * Questo script serve a controllare, a intervenire se l'automatismo si ferma, e a verificare.
 *
 *   node scripts/draw.mjs commit                       impegno sugli elenchi + blocco-seme
 *   node scripts/draw.mjs archive                      copia su archive.org di impegno e risultato
 *   node scripts/draw.mjs status                       a che punto è la catena
 *   node scripts/draw.mjs run                          estrae, quando il seme è definitivo
 *   node scripts/draw.mjs disqualify <ID> --reason "…" esclude un vincitore, entra la riserva
 *                                     [--only spritz]  solo da un'estrazione (es. pagato fuori orario)
 *   node scripts/draw.mjs verify                       ricalcola tutto e confronta
 *
 * Senza rete (prove, test): `commit --tip <altezza>` e `run --seed <hash>`; `verify --offline`.
 * `--force` scavalca i controlli di orario: solo per le prove, mai il giorno dell'estrazione.
 */
import { pathToFileURL } from 'node:url';
import { formatPrize } from '../lib/campaigns.js';
import {
  archivePublicFile,
  commitDraw,
  disqualifyWinner,
  drawStatus,
  hasResult,
  runDraw,
  verifyDraw,
} from '../lib/server/draw.js';

// I test importano il motore da qui, come facevano prima che fosse spostato.
export {
  buildLists,
  drawWinners,
  computeAll,
  isAdmitted,
  isSpritzEntry,
  listHash,
  readyHeightFor,
  seedHeightFor,
  ticketOf,
} from '../lib/server/draw.js';

const out = (s = '') => process.stdout.write(`${s}\n`);
const flagOf = (args, name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args.at(i + 1);
};

function report(result) {
  const show = (label, section) => {
    out(`\n  ${label} (${section.participants} partecipanti)`);
    if (!section.winners.length) return out('    — nessun vincitore');
    for (const w of section.winners) {
      out(`    ${String(w.rank).padStart(2)}. ${w.place.padEnd(30)}${formatPrize(w).padStart(16)}  ${w.winnerId}`);
    }
    if (section.reserves?.length) out(`    riserve: ${section.reserves.map((r) => r.id).join(', ')}`);
  };
  out(`✓ Estrazione · blocco ${result.seedHeight} · seme ${result.seed}`);
  show('CLIENTI', result.users);
  show('SATOSHI SPRITZ', result.spritz);
  show('MERCHANT', result.merchants);
  if (result.disqualified?.length) {
    out('\n  Esclusi dopo la verifica:');
    for (const d of result.disqualified) out(`    · ${d.id}${d.only ? ` (solo ${d.only})` : ''} — ${d.reason}`);
  }
  out('\n  Risultato: .data/draw/result.json (pubblicato su /vincitori)');
}

async function commit(rest) {
  const c = await commitDraw({
    includeAll: rest.includes('--all'),
    force: rest.includes('--force'),
    tip: flagOf(rest, 'tip') ?? null,
  });
  out('✓ Impegno creato');
  out(`  clienti : ${c.users.count} giocate — ${c.users.listHash}`);
  out(`  spritz  : ${c.spritz.count} giocate — ${c.spritz.listHash} (${c.spritz.venues.length} locali)`);
  out(`  merchant: ${c.merchants.count} esercenti — ${c.merchants.listHash}`);
  out(`\n  Cima della catena: ${c.seed.tipHeightAtCommit}. Blocco-seme: ${c.seed.seedHeight}. Si estrae a ${c.seed.drawWhenHeight}.`);
  out('  È già visibile su /vincitori. Ora: node scripts/draw.mjs archive');
}

async function archive() {
  const files = ['commitment.json', ...((await hasResult()) ? ['result.json'] : [])];
  for (const name of files) {
    const a = await archivePublicFile(name);
    out(`✓ ${name} archiviato: ${a.url}`);
  }
}

async function status() {
  const s = await drawStatus();
  out(`Cima attuale: ${s.tip} · blocco-seme: ${s.seedHeight} · si estrae da: ${s.drawWhenHeight}`);
  if (s.tip < s.seedHeight) out(`Mancano ${s.seedHeight - s.tip} blocchi al seme (circa ${(s.seedHeight - s.tip) * 10} minuti, in media).`);
  else if (s.tip < s.drawWhenHeight) out('Seme minato. Manca il blocco di conferma.');
  else out('Il seme è definitivo: si può estrarre.');
}

async function disqualify(rest) {
  const id = rest.at(0);
  if (!id || id.startsWith('--')) throw new Error('Uso: disqualify <ID> --reason "motivo pubblicabile, senza dati personali"');
  const reason = flagOf(rest, 'reason');
  const only = flagOf(rest, 'only') ?? null;
  const result = await disqualifyWinner(id, reason, { only });
  out(`✓ ${id} escluso${only ? ` dall'estrazione "${only}"` : ''}: ${reason}`);
  report(result);
}

async function verify(rest) {
  const checks = await verifyDraw({ offline: rest.includes('--offline') });
  for (const c of checks) out(`${c.ok ? '✓' : '✗'} ${c.label}`);
  if (checks.some((c) => !c.ok)) process.exitCode = 1;
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  const [command, ...rest] = process.argv.slice(2);
  const commands = {
    commit: () => commit(rest),
    archive,
    status,
    run: async () => report(await runDraw({ seed: flagOf(rest, 'seed') ?? null, force: rest.includes('--force') })),
    disqualify: () => disqualify(rest),
    verify: () => verify(rest),
  };
  const fn = commands[command];
  if (!fn) {
    process.stderr.write('Uso: commit | archive | status | run | disqualify <ID> --reason "…" | verify\n');
    process.exit(1);
  }
  fn().catch((err) => {
    process.stderr.write(`✗ ${err.message}\n`);
    process.exit(1);
  });
}
