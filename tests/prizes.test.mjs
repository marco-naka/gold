import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRIZES, TOTAL_POOL, TOTAL_WINNERS, formatXaut } from '../lib/constants.js';

const tiers = [
  ['clienti', PRIZES.users],
  ['merchant', PRIZES.merchants],
];

test('il montepremi di ogni sezione coincide con la somma dei premi', () => {
  for (const [name, tier] of tiers) {
    const sum = tier.items.reduce((a, i) => a + i.amount * i.count, 0);
    assert.equal(tier.pool, Math.round(sum * 100) / 100, `pool ${name} incoerente`);
  }
});

test('il totale coincide con la somma dei due montepremi', () => {
  assert.equal(TOTAL_POOL, Math.round((PRIZES.users.pool + PRIZES.merchants.pool) * 100) / 100);
  assert.equal(TOTAL_WINNERS, PRIZES.users.winners + PRIZES.merchants.winners);
});

test('ogni premio ha importo e numero di vincitori positivi', () => {
  for (const [name, tier] of tiers) {
    for (const item of tier.items) {
      assert.ok(typeof item.amount === 'number' && item.amount > 0, `${name}: ${item.place} importo non valido`);
      assert.ok(Number.isInteger(item.count) && item.count > 0, `${name}: ${item.place} vincitori non validi`);
      assert.ok(item.place && item.desc, `${name}: ${item.place} testi mancanti`);
    }
  }
});

test('le fasce che indicano un intervallo dichiarano il numero di vincitori corrispondente', () => {
  // "3°–14° Premio" deve avere count = 12
  for (const [, tier] of tiers) {
    for (const item of tier.items) {
      const range = item.place.match(/(\d+)°\s*[–-]\s*(\d+)°/);
      if (!range) continue;
      const expected = Number(range[2]) - Number(range[1]) + 1;
      assert.equal(item.count, expected, `${item.place}: dichiara ${expected} vincitori ma count = ${item.count}`);
    }
  }
});

test('gli importi hanno sempre due decimali e nessun residuo in virgola mobile', () => {
  assert.equal(formatXaut(6.2), '6.20 XAUT');
  assert.equal(formatXaut(4.2), '4.20 XAUT');
  assert.equal(formatXaut(0.1 * 12), '1.20 XAUT');
  assert.equal(formatXaut(2), '2.00 XAUT');
  assert.equal(formatXaut(0.1), '0.10 XAUT');
});
