import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POOLS, POOL_LIST, TOTAL_WINNERS, formatPrize } from '../lib/campaigns.js';
import { formatXaut } from '../lib/constants.js';
import { formatSats } from '../lib/bitcoin.js';

/*
 * I premi vivono in due moduli — satoshi in bitcoin.js, oro in constants.js — e si incontrano
 * solo in campaigns.js. Qui si controlla che le due metà non divergano da quello che il sito
 * dichiara, e che una voce sappia sempre dire in quale unità è scritta.
 */

test('il montepremi di ogni quota coincide con la somma dei suoi premi', () => {
  for (const pool of POOL_LIST) {
    const somma = pool.items.reduce((tot, i) => tot + i.amount * i.count, 0);
    // Gli importi in oro hanno i decimali: si confronta a meno dei residui in virgola mobile.
    assert.ok(Math.abs(somma - pool.total) < 1e-6, `${pool.id}: dichiarato ${pool.total}, somma ${somma}`);
  }
});

test('il numero dei vincitori è la somma delle due quote', () => {
  assert.equal(TOTAL_WINNERS, POOLS.users.winners + POOLS.merchants.winners);
  assert.equal(POOLS.users.winners, 12);
  assert.equal(POOLS.merchants.winners, 4);
});

test('ogni premio ha asset, importo e numero di vincitori validi', () => {
  for (const pool of POOL_LIST) {
    for (const item of pool.items) {
      assert.equal(item.asset, pool.asset, `${item.place}: asset diverso da quello della quota`);
      assert.ok(typeof item.amount === 'number' && item.amount > 0, `${item.place}: importo non valido`);
      assert.ok(Number.isInteger(item.count) && item.count > 0, `${item.place}: vincitori non validi`);
      assert.ok(item.place && item.desc, `${item.place}: testi mancanti`);
      assert.ok(['draw', 'volume', 'jury'].includes(item.assignment), `${item.place}: assegnazione ignota`);
    }
  }
});

test('le fasce che indicano un intervallo dichiarano il numero di vincitori corrispondente', () => {
  // "3°–11° Premio" deve avere count = 9
  for (const pool of POOL_LIST) {
    for (const item of pool.items) {
      const range = item.place.match(/(\d+)°\s*[–-]\s*(\d+)°/);
      if (!range) continue;
      const atteso = Number(range[2]) - Number(range[1]) + 1;
      assert.equal(item.count, atteso, `${item.place}: dichiara ${atteso} vincitori ma count = ${item.count}`);
    }
  }
});

test('ogni importo si scrive nell’unità del proprio asset', () => {
  assert.equal(formatPrize({ asset: 'BTC', amount: 5_000_000 }), "5'000'000 sat");
  assert.equal(formatPrize({ asset: 'XAUT', amount: 0.25 }), '0.25 XAUT');
  // Nessun residuo in virgola mobile, né separatori sbagliati.
  assert.equal(formatXaut(0.1 * 12), '1.20 XAUT');
  assert.equal(formatXaut(2), '2.00 XAUT');
  assert.equal(formatSats(11_000_000), "11'000'000 sat");
});
