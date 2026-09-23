import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { drawWinners, ticketOf } from '../scripts/draw.mjs';
import { PRIZES } from '../lib/constants.js';

const ids = Array.from({ length: 500 }, (_, i) => `NK-2026-${String(i).padStart(6, '0')}`);
const merchantIds = Array.from({ length: 40 }, (_, i) => `lug-merchant-${i}`);
const SEED = '00000000000000000001b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3';
const drawn = (tier) => tier.items.filter((i) => i.assignment === 'draw');
const userTiers = drawn(PRIZES.users);
const merchantTiers = drawn(PRIZES.merchants);

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

test('estrazione merchant: un solo premio, un solo vincitore', () => {
  const { winners } = drawWinners(merchantIds, SEED, merchantTiers, 'merchants');
  assert.equal(winners.length, 1);
  assert.equal(winners[0].place, 'Estrazione Riservata Merchant');
  assert.ok(merchantIds.includes(winners[0].winnerId));
});

test('i due sorteggi sono indipendenti: stesso seme, ordinamenti scorrelati', () => {
  const asUsers = drawWinners(merchantIds, SEED, merchantTiers, 'users').winners[0].winnerId;
  const asMerchants = drawWinners(merchantIds, SEED, merchantTiers, 'merchants').winners[0].winnerId;
  assert.notEqual(asUsers, asMerchants, 'la separazione per categoria non sta avendo effetto');
});

test('i premi non sorteggiabili restano fuori dall’estrazione', () => {
  const places = merchantTiers.map((t) => t.place);
  assert.ok(!places.includes('Top Volume Transazioni'), 'Top Volume è una classifica, non un sorteggio');
  assert.ok(!places.includes('Best Social Video'), 'Best Social Video è deciso dalla giuria');
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
