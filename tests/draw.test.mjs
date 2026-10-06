import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildLists, drawWinners, isAdmitted, listHash, readyHeightFor, seedHeightFor, ticketOf } from '../scripts/draw.mjs';
import { POOLS } from '../lib/campaigns.js';
import { CONTEST, DRAW } from '../lib/constants.js';

const ids = Array.from({ length: 500 }, (_, i) => `NK-2026-${String(i).padStart(6, '0')}`);
const merchantIds = Array.from({ length: 40 }, (_, i) => `lug-merchant-${i}`);
const SEED = '00000000000000000001b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3';
const drawn = (pool) => pool.items.filter((i) => i.assignment === 'draw');
const userTiers = drawn(POOLS.users);
const merchantTiers = drawn(POOLS.merchants);

test('a parità di elenco e seme i vincitori sono sempre gli stessi', () => {
  const a = drawWinners(ids, SEED, userTiers).winners;
  const b = drawWinners([...ids].reverse(), SEED, userTiers).winners; // l'ordine di input non conta
  assert.deepEqual(a, b);
});

test('un seme diverso produce un esito diverso', () => {
  const a = drawWinners(ids, SEED, userTiers).winners.map((w) => w.winnerId);
  const b = drawWinners(ids, `${SEED.slice(0, -1)}4`, userTiers).winners.map((w) => w.winnerId);
  assert.notDeepEqual(a, b);
});

test('estrae esattamente i premi sorteggiabili, senza ripetere un vincitore', () => {
  const { winners } = drawWinners(ids, SEED, userTiers);
  assert.equal(winners.length, userTiers.reduce((a, t) => a + t.count, 0));
  assert.equal(new Set(winners.map((w) => w.winnerId)).size, winners.length);
});

test('estrazione merchant: due premi, due vincitori diversi', () => {
  // Due da 0.25 invece di uno da 0.50: il sorteggio deve pescarne due distinti.
  const { winners } = drawWinners(merchantIds, SEED, merchantTiers, 'merchants');
  assert.equal(winners.length, 2);
  for (const w of winners) {
    assert.equal(w.place, 'Estrazione Riservata Merchant');
    assert.ok(merchantIds.includes(w.winnerId));
  }
  assert.notEqual(winners[0].winnerId, winners[1].winnerId);
});

test('i due sorteggi sono indipendenti: stesso seme, ordinamenti scorrelati', () => {
  const asUsers = drawWinners(merchantIds, SEED, merchantTiers, 'users').winners[0].winnerId;
  const asMerchants = drawWinners(merchantIds, SEED, merchantTiers, 'merchants').winners[0].winnerId;
  assert.notEqual(asUsers, asMerchants, 'la separazione per categoria non sta avendo effetto');
});

test('i premi non sorteggiabili restano fuori dall’estrazione', () => {
  const places = merchantTiers.map((t) => t.place);
  assert.ok(!places.includes('Top Numero Transazioni'), 'Top Numero di Transazioni è una classifica, non un sorteggio');
  assert.ok(!places.includes('Best Social Content'), 'Best Social Content è deciso dalla giuria');
});

test('con meno partecipanti che premi non assegna premi inesistenti', () => {
  assert.equal(drawWinners(ids.slice(0, 3), SEED, userTiers).winners.length, 3);
  assert.equal(drawWinners([], SEED, merchantTiers, 'merchants').winners.length, 0);
});

test('il biglietto è verificabile da chiunque con un semplice sha256', () => {
  const id = ids[7];
  assert.equal(ticketOf(SEED, id, 'users'), createHash('sha256').update(`${SEED}:users:${id}`).digest('hex'));
});

test('la distribuzione non privilegia sistematicamente i primi in elenco', () => {
  let firstHalf = 0;
  for (let i = 0; i < 200; i += 1) {
    const winner = drawWinners(ids, `seed-${i}`, userTiers).winners[0].winnerId;
    if (ids.indexOf(winner) < ids.length / 2) firstHalf += 1;
  }
  assert.ok(firstHalf > 70 && firstHalf < 130, `sbilanciamento sospetto: ${firstHalf}/200 nella prima metà`);
});

test('anche i merchant hanno pari probabilità', () => {
  const wins = new Map(merchantIds.map((id) => [id, 0]));
  for (let i = 0; i < 400; i += 1) {
    const w = drawWinners(merchantIds, `seed-${i}`, merchantTiers, 'merchants').winners[0].winnerId;
    wins.set(w, wins.get(w) + 1);
  }
  const counts = [...wins.values()];
  // attese ~10 vittorie a testa su 400 estrazioni con 40 merchant
  assert.ok(Math.max(...counts) < 30, `un merchant vince troppo spesso: ${Math.max(...counts)}/400`);
  assert.ok(counts.filter((c) => c === 0).length < 5, 'troppi merchant non estratti mai');
});

/* ---------- Sequenza dell'estrazione: impegno, seme, riserve ---------- */

test('il seme è un blocco futuro rispetto all’impegno, con una conferma sopra', () => {
  assert.equal(DRAW.blocksAhead, 6);
  assert.equal(seedHeightFor(870_000), 870_006);
  assert.ok(readyHeightFor(seedHeightFor(870_000)) > seedHeightFor(870_000), 'si estrae solo con un blocco sopra il seme');
});

test('i tempi annunciati sono nell’ordine giusto', () => {
  const close = Date.parse(CONTEST.validTo);
  const commit = Date.parse(DRAW.commitBy);
  const from = Date.parse(DRAW.expectedFrom);
  const to = Date.parse(DRAW.expectedBy);
  assert.ok(commit > close, 'l’impegno arriva dopo la chiusura');
  assert.ok(from > commit, 'l’estrazione non può precedere l’impegno');
  assert.ok(to > from);
  assert.equal(CONTEST.drawDate, DRAW.expectedFrom, 'la data annunciata è l’inizio della finestra');
});

test('entrano le giocate registrate in tempo e non respinte, anche se ancora in verifica', () => {
  const inTime = '2026-10-24T13:00:00.000Z';
  const late = '2026-10-24T14:30:00.000Z'; // 16:30 a Lugano, dopo la chiusura
  assert.equal(isAdmitted({ status: 'validated', createdAt: inTime }), true);
  assert.equal(isAdmitted({ status: 'pending_verification', createdAt: inTime }), true);
  assert.equal(isAdmitted({ status: 'rejected', createdAt: inTime }), false);
  assert.equal(isAdmitted({ status: 'validated', createdAt: late }), false);
  const { users } = buildLists([
    { id: 'NK-2026-B', status: 'pending_verification', createdAt: inTime },
    { id: 'NK-2026-A', status: 'validated', createdAt: inTime },
    { id: 'NK-2026-C', status: 'rejected', createdAt: inTime },
  ]);
  assert.deepEqual(users, ['NK-2026-A', 'NK-2026-B']);
});

test('l’impronta dell’elenco si rifà con un semplice sha256', () => {
  const list = ['NK-2026-A', 'NK-2026-B'];
  assert.equal(listHash(list), createHash('sha256').update('NK-2026-A\nNK-2026-B').digest('hex'));
});

test('le riserve seguono i vincitori nello stesso ordine', () => {
  const { winners, reserves, ordered } = drawWinners(ids, SEED, userTiers, 'users', { reserves: 10 });
  assert.equal(reserves.length, 10);
  const n = winners.length;
  assert.deepEqual(
    reserves.map((r) => r.id),
    ordered.slice(n, n + 10).map((o) => o.id),
  );
});

test('un vincitore escluso lascia il premio alla prima riserva, senza rimescolare gli altri', () => {
  const before = drawWinners(ids, SEED, userTiers, 'users', { reserves: 3 });
  const out = before.winners[0].winnerId;
  const after = drawWinners(ids, SEED, userTiers, 'users', { exclude: [out], reserves: 3 });
  assert.ok(!after.winners.some((w) => w.winnerId === out));
  // Tutti gli altri restano vincitori; il nuovo è la prima riserva di prima.
  const kept = before.winners.slice(1).map((w) => w.winnerId);
  for (const id of kept) assert.ok(after.winners.some((w) => w.winnerId === id));
  assert.ok(after.winners.some((w) => w.winnerId === before.reserves[0].id));
  assert.equal(after.reserves[0].id, before.reserves[1].id);
});

/* ---------- Satoshi Spritz e premio unico ---------- */

import { computeAll, isSpritzEntry } from '../scripts/draw.mjs';
import { zurichLocalToIso } from '../lib/time.js';

test('Spritz: conta il locale e l’ora del pagamento sul POS, non quella di registrazione', () => {
  const venues = ['lug-cioccaro-1'];
  const at = (s) => zurichLocalToIso(s);
  const late = { merchantId: 'lug-cioccaro-1', createdAt: at('2026-10-24 15:30') }; // registrata sabato
  assert.equal(isSpritzEntry({ ...late, paidAt: at('2026-10-22 19:30') }, venues), true);
  assert.equal(isSpritzEntry({ ...late, paidAt: at('2026-10-22 17:59') }, venues), false, 'prima della serata');
  assert.equal(isSpritzEntry({ ...late, paidAt: at('2026-10-22 23:01') }, venues), false, 'dopo la serata');
  assert.equal(isSpritzEntry({ ...late, paidAt: at('2026-10-23 12:00') }, venues), false, 'giorno dopo');
  assert.equal(isSpritzEntry(late, venues), true, 'ora POS non ancora caricata: entra, si verifica se vince');
  assert.equal(
    isSpritzEntry({ merchantId: 'lug-cioccaro-1', createdAt: at('2026-10-22 12:00') }, venues),
    false,
    'registrata prima della serata: non può essere stata pagata lì',
  );
  assert.equal(isSpritzEntry({ merchantId: 'lug-altrove', paidAt: at('2026-10-22 19:30') }, venues), false, 'fuori dalla piazza');
  assert.equal(isSpritzEntry({ merchantId: null, paidAt: at('2026-10-22 19:30') }, venues), false);
});

test('esclusa solo dallo Spritz, la giocata resta in gara nel generale', () => {
  const pool = ids.slice(0, 20);
  const lists = { users: pool, spritz: pool, merchants: merchantIds };
  const first = computeAll(lists, SEED);
  const spritzWinner = first.spritz.winners[0].winnerId;
  const after = computeAll(lists, SEED, [{ id: spritzWinner, reason: 'fuori orario', only: 'spritz' }]);
  assert.notEqual(after.spritz.winners[0].winnerId, spritzWinner, 'lo Spritz passa alla riserva');
  assert.deepEqual(after.users, first.users, 'il generale non cambia');
  assert.ok(
    computeAll(lists, SEED, [{ id: spritzWinner, reason: 'x' }]).users.reserves.every((r) => r.id !== spritzWinner),
    'un’esclusione totale invece la toglie anche dalle riserve del generale',
  );
});

test('una giocata vince al massimo un premio: lo Spritz salta chi ha vinto il generale', () => {
  const pool = ids.slice(0, 20);
  const lists = { users: pool, spritz: pool, merchants: merchantIds };
  const r = computeAll(lists, SEED);
  const usersWon = new Set(r.users.winners.map((w) => w.winnerId));
  assert.equal(r.spritz.winners.length, 1);
  assert.ok(!usersWon.has(r.spritz.winners[0].winnerId));
  assert.ok(r.spritz.reserves.every((x) => !usersWon.has(x.id)));
});

test('dopo ogni esclusione nessuna giocata vince due volte, e l’esclusa non vince più', () => {
  const pool = ids.slice(0, 14);
  const lists = { users: pool, spritz: pool, merchants: merchantIds };
  const first = computeAll(lists, SEED);
  for (const w of first.users.winners) {
    const r = computeAll(lists, SEED, [{ id: w.winnerId, reason: 'test' }]);
    const all = [...r.users.winners, ...r.spritz.winners].map((x) => x.winnerId);
    assert.equal(new Set(all).size, all.length, 'una giocata compare in due premi');
    assert.ok(!all.includes(w.winnerId));
  }
});

test('l’ora del POS si legge come ora di Lugano, con l’ora legale giusta', () => {
  assert.equal(zurichLocalToIso('2026-10-22 19:30'), '2026-10-22T17:30:00.000Z');
  assert.equal(zurichLocalToIso('2026-12-01 10:00'), '2026-12-01T09:00:00.000Z');
  assert.equal(zurichLocalToIso('2026-10-22T19:30:00+02:00'), '2026-10-22T17:30:00.000Z');
  assert.throws(() => zurichLocalToIso('22/10 19:30'));
});
