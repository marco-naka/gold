#!/usr/bin/env node
/**
 * Estrazione verificabile ("provably fair") — clienti e merchant.
 *
 * Il problema non è generare un numero casuale: è dimostrare a un terzo che NON è stato scelto
 * dopo aver visto i partecipanti. Si risolve con due impegni pubblici presi in sequenza:
 *
 *   1. COMMIT  — a registrazioni chiuse si pubblica l'impronta SHA-256 dei due elenchi ordinati
 *                (giocate valide e merchant con almeno una transazione). Da quel momento gli
 *                elenchi non sono più modificabili senza che l'impronta cambi.
 *   2. SEED    — si annuncia in anticipo QUALE valore pubblico e futuro farà da seme: l'hash del
 *                blocco Bitcoin a un'altezza prestabilita. Nessuno, organizzatore compreso, può
 *                conoscerlo prima né sceglierlo a piacere.
 *   3. DRAW    — i vincitori sono una funzione deterministica di (elenco, seme). Chiunque, con i
 *                dati pubblici, rieseguendo questo script ottiene gli stessi vincitori.
 *
 * Vengono estratti solo i premi con `assignment: 'draw'`. Top Volume (classifica POS) e
 * Best Social Video (giuria) non sono casuali e restano fuori da questa procedura.
 *
 * Uso:
 *   node scripts/draw.mjs commit
 *   node scripts/draw.mjs run --seed <hash-del-blocco>
 *   node scripts/draw.mjs verify
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PRIZES } from '../lib/constants.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const DRAW_DIR = join(DATA_DIR, 'draw');
const ENTRIES = join(DATA_DIR, 'entries.json');
const COMMITMENT = join(DRAW_DIR, 'commitment.json');
const RESULT = join(DRAW_DIR, 'result.json');
const FILES = { users: 'participants-clienti.txt', merchants: 'participants-merchant.txt' };

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

/** Stati ammessi all'estrazione: solo le giocate riscontrate sul backend POS NAKA. */
const ELIGIBLE = new Set(['validated']);

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const drawnTiers = (tier) => tier.items.filter((i) => i.assignment === 'draw');

/**
 * Elenchi canonici, ordinati e senza duplicati.
 * - clienti : un biglietto per ogni giocata valida (più giocate = più possibilità)
 * - merchant: un solo biglietto per esercente con almeno una transazione registrata,
 *             indipendentemente da quante ne ha fatte (è un'estrazione tra pari)
 */
function buildLists(entries, { includeAll = false } = {}) {
  const eligible = entries.filter((e) => includeAll || ELIGIBLE.has(e.status));
  return {
    users: [...new Set(eligible.map((e) => e.id))].sort(),
    merchants: [...new Set(eligible.map((e) => e.merchantId).filter(Boolean))].sort(),
  };
}

async function commit({ includeAll }) {
  const { entries } = await readJson(ENTRIES);
  const lists = buildLists(entries, { includeAll });
  if (!lists.users.length) throw new Error('Nessuna giocata ammissibile: niente da impegnare.');
  if (!lists.merchants.length) {
    process.stdout.write('⚠ Nessun merchant riconosciuto nelle giocate: l’estrazione merchant sarà vuota.\n');
  }

  const commitment = {
    createdAt: new Date().toISOString(),
    algorithm: 'sha256 della lista di ID ordinati, separati da \\n',
    users: { count: lists.users.length, listHash: sha256(lists.users.join('\n')), file: FILES.users },
    merchants: {
      count: lists.merchants.length,
      listHash: sha256(lists.merchants.join('\n')),
      file: FILES.merchants,
    },
    seedSource:
      'Hash del primo blocco Bitcoin minato dopo la chiusura delle giocate, annunciata pubblicamente prima di questo commit.',
    note: 'Pubblicare questo file PRIMA che il blocco-seme esista. Da qui in poi gli elenchi non cambiano.',
  };

  await mkdir(DRAW_DIR, { recursive: true });
  await writeFile(COMMITMENT, `${JSON.stringify(commitment, null, 2)}\n`);
  await writeFile(join(DRAW_DIR, FILES.users), `${lists.users.join('\n')}\n`);
  await writeFile(join(DRAW_DIR, FILES.merchants), `${lists.merchants.join('\n')}\n`);

  process.stdout.write(
    `✓ Commit creato\n` +
      `  clienti : ${commitment.users.count} giocate — ${commitment.users.listHash}\n` +
      `  merchant: ${commitment.merchants.count} esercenti — ${commitment.merchants.listHash}\n\n` +
      `  Pubblica ORA le impronte. Il seme è l’hash del primo blocco Bitcoin dopo la chiusura.\n`
  );
  return commitment;
}

/**
 * Biglietto di ogni partecipante: sha256 deterministico su (seme, categoria, id).
 * La categoria separa i due sorteggi: lo stesso seme non produce correlazioni
 * tra l'ordine dei clienti e quello dei merchant.
 */
export const ticketOf = (seed, id, scope = 'users') => sha256(`${seed}:${scope}:${id}`);

export function drawWinners(ids, seed, tiers, scope = 'users') {
  const ordered = [...ids]
    .map((id) => ({ id, ticket: ticketOf(seed, id, scope) }))
    .sort((a, b) => (a.ticket < b.ticket ? -1 : a.ticket > b.ticket ? 1 : a.id < b.id ? -1 : 1));

  const winners = [];
  let cursor = 0;
  for (const tier of tiers) {
    for (let i = 0; i < tier.count && cursor < ordered.length; i += 1, cursor += 1) {
      winners.push({
        rank: winners.length + 1,
        place: tier.place,
        amount: tier.amount,
        winnerId: ordered[cursor].id,
        ticket: ordered[cursor].ticket,
      });
    }
  }
  return { winners, ordered };
}

async function loadCommitted() {
  const commitment = await readJson(COMMITMENT);
  const out = {};
  for (const scope of ['users', 'merchants']) {
    const raw = await readFile(join(DRAW_DIR, commitment[scope].file), 'utf8');
    const ids = raw.trim() ? raw.trim().split('\n') : [];
    const hash = sha256(ids.join('\n'));
    // Gli elenchi devono combaciare con quelli impegnati: è ciò che rende l'estrazione non manipolabile.
    if (hash !== commitment[scope].listHash) {
      throw new Error(
        `Elenco "${scope}" alterato dopo il commit!\n  atteso ${commitment[scope].listHash}\n  trovato ${hash}`
      );
    }
    out[scope] = ids;
  }
  return { commitment, lists: out };
}

async function run({ seed }) {
  if (!seed) throw new Error('Serve il seme: --seed <hash del blocco Bitcoin annunciato>');
  const { commitment, lists } = await loadCommitted();

  const users = drawWinners(lists.users, seed, drawnTiers(PRIZES.users), 'users');
  const merchants = drawWinners(lists.merchants, seed, drawnTiers(PRIZES.merchants), 'merchants');

  const result = {
    drawnAt: new Date().toISOString(),
    seed,
    users: { participants: lists.users.length, listHash: commitment.users.listHash, winners: users.winners },
    merchants: {
      participants: lists.merchants.length,
      listHash: commitment.merchants.listHash,
      winners: merchants.winners,
    },
    notDrawn: [
      ...PRIZES.merchants.items,
      ...PRIZES.users.items,
    ]
      .filter((i) => i.assignment !== 'draw')
      .map((i) => ({ place: i.place, amount: i.amount, assignment: i.assignment })),
    howToVerify: [
      '1. Verifica che sha256 di ciascun elenco pubblicato sia uguale al listHash corrispondente.',
      '2. Controlla l’hash del blocco Bitcoin annunciato: deve essere identico a seed.',
      '3. Per ogni ID calcola sha256("<seed>:<clienti|merchant>:<ID>") e ordina in modo crescente.',
      '4. I primi in classifica sono i vincitori, assegnati ai premi nell’ordine indicato.',
      '   Oppure, più semplicemente: node scripts/draw.mjs verify',
    ],
  };

  await writeFile(RESULT, `${JSON.stringify(result, null, 2)}\n`);

  const show = (label, section) => {
    process.stdout.write(`\n  ${label} (${section.participants} partecipanti)\n`);
    if (!section.winners.length) return process.stdout.write('    — nessun vincitore\n');
    for (const w of section.winners) {
      process.stdout.write(`    ${String(w.rank).padStart(2)}. ${w.place.padEnd(30)} ${w.amount} XAUT  ${w.winnerId}\n`);
    }
  };

  process.stdout.write(`✓ Estrazione eseguita\n  seme: ${seed}\n`);
  show('CLIENTI', result.users);
  show('MERCHANT', result.merchants);
  process.stdout.write('\n  Assegnati fuori sorteggio:\n');
  for (const p of result.notDrawn) {
    process.stdout.write(`    · ${p.place.padEnd(30)} ${p.amount} XAUT  (${p.assignment})\n`);
  }
  process.stdout.write(`\n  Risultato: .data/draw/result.json\n`);
  return result;
}

async function verify() {
  const result = await readJson(RESULT);
  const { lists } = await loadCommitted(); // lancia se un elenco non combacia col commit

  let ok = true;
  for (const scope of ['users', 'merchants']) {
    const { winners } = drawWinners(lists[scope], result.seed, drawnTiers(PRIZES[scope]), scope);
    const same = JSON.stringify(winners) === JSON.stringify(result[scope].winners);
    ok = ok && same;
    process.stdout.write(`${same ? '✓' : '✗'} vincitori ${scope} riproducibili (${lists[scope].length} partecipanti)\n`);
  }
  if (!ok) process.exitCode = 1;
  return ok;
}

const [command, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? undefined : rest[i + 1];
};

const commands = {
  commit: () => commit({ includeAll: rest.includes('--all') }),
  run: () => run({ seed: flag('seed') }),
  verify,
};

if (command) {
  const fn = commands[command];
  if (!fn) {
    process.stderr.write(`Comando sconosciuto: ${command}\nUso: commit | run --seed <hash> | verify\n`);
    process.exit(1);
  }
  fn().catch((err) => {
    process.stderr.write(`✗ ${err.message}\n`);
    process.exit(1);
  });
}
