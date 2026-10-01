import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DECLARED, POOLS, POOL_LIST } from '../lib/campaigns.js';
import {
  PRIZE_POOL,
  SATS_PER_BTC,
  TARGET_RATIO,
  TOLERANCE,
  TOTAL_SATS,
  merchantsSatsNow,
  ratioDrift,
} from '../lib/anchor.js';

/*
 * Il concorso dichiara un numero al pubblico — 21'000'000 di satoshi — che è la somma di due
 * quote pagate in asset diversi. È l'unica affermazione del sito che il mercato può smentire,
 * quindi è quella da tenere sotto controllo.
 */

test('ogni quota è la somma dei suoi premi', () => {
  for (const pool of POOL_LIST) {
    const somma = pool.items.reduce((tot, item) => tot + item.amount * item.count, 0);
    // Gli importi in oro hanno i decimali: si confronta a meno dei residui in virgola mobile.
    assert.ok(Math.abs(somma - pool.total) < 1e-6, `${pool.id}: dichiarato ${pool.total}, somma ${somma}`);
  }
});

test('il numero dichiarato è la somma delle due quote', () => {
  assert.equal(DECLARED.sats, TOTAL_SATS);
  assert.equal(TOTAL_SATS, PRIZE_POOL.usersSats + PRIZE_POOL.merchantsSatsEquivalent);
  assert.equal(POOLS.users.total, PRIZE_POOL.usersSats);
});

test('l’ancoraggio è un rapporto, e il rapporto fa tornare i conti', () => {
  // 10'000'000 sat sono 0,1 BTC; perché valgano 2 XAUT serve 1 BTC = 20 XAUT.
  const xaut = 4000; // prezzo qualunque: conta solo il rapporto
  const btc = TARGET_RATIO * xaut;

  assert.equal(ratioDrift(btc, xaut), 0);
  assert.equal(merchantsSatsNow(btc, xaut), PRIZE_POOL.merchantsSatsEquivalent);
  assert.equal((PRIZE_POOL.merchantsSatsEquivalent / SATS_PER_BTC) * btc, PRIZE_POOL.merchantsXaut * xaut);
});

test('fuori dal rapporto il valore reale si scosta, e lo sappiamo misurare', () => {
  const xaut = 4000;
  // Bitcoin del 10% più caro rispetto all'oro: la quota in oro vale meno satoshi.
  const caro = TARGET_RATIO * xaut * 1.1;
  assert.ok(ratioDrift(caro, xaut) > TOLERANCE);
  assert.ok(merchantsSatsNow(caro, xaut) < PRIZE_POOL.merchantsSatsEquivalent);

  // E viceversa.
  const economico = TARGET_RATIO * xaut * 0.9;
  assert.ok(ratioDrift(economico, xaut) < -TOLERANCE);
  assert.ok(merchantsSatsNow(economico, xaut) > PRIZE_POOL.merchantsSatsEquivalent);
});

test('le due quote parlano a due pubblici, con due verbi diversi', () => {
  // Non è pedanteria linguistica: il sito diceva «paga in crypto» anche al negoziante,
  // che però non paga — offre la possibilità di pagare.
  assert.equal(POOLS.users.verb, 'paga');
  assert.equal(POOLS.merchants.verb, 'offre');
  assert.notEqual(POOLS.users.page, POOLS.merchants.page);
  assert.notEqual(POOLS.users.asset, POOLS.merchants.asset);
});

test('ogni quota sa formattare i propri importi e ha una fonte per il prezzo', () => {
  for (const pool of POOL_LIST) {
    assert.match(pool.priceApi, /^\/api\//, `${pool.id}: manca l'endpoint del prezzo`);
    assert.equal(typeof pool.format(1), 'string');
    assert.match(pool.accent, /^#[0-9A-F]{6}$/i, `${pool.id}: accento non valido`);
    assert.ok(pool.valueOf(pool.total, 100) > 0, `${pool.id}: controvalore non calcolabile`);
    assert.ok(pool.winners > 0);
  }
});
