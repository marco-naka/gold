import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let dir;
let store;

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'planb-store-'));
  process.env.DATA_DIR = dir;
  store = await import('../lib/server/store.js');
});

after(() => rm(dir, { recursive: true, force: true }));

const entry = (id, tx) => ({ id, email: 'a@b.ch', txNormalized: tx, createdAt: new Date().toISOString() });

test('salva e rilegge le giocate', async () => {
  assert.equal((await store.listEntries()).length, 0);
  const saved = await store.saveEntry(entry('NK-1', 'tx-1'));
  assert.equal(saved.ok, true);
  assert.equal((await store.listEntries()).length, 1);
  assert.equal((await store.findByTx('tx-1')).id, 'NK-1');
});

test('rifiuta il numero di transazione duplicato', async () => {
  const dup = await store.saveEntry(entry('NK-2', 'tx-1'));
  assert.equal(dup.ok, false);
  assert.equal(dup.reason, 'duplicate');
  assert.equal((await store.listEntries()).length, 1);
});

test('scritture concorrenti sullo stesso TX: ne passa una sola', async () => {
  const results = await Promise.all([
    store.saveEntry(entry('NK-3', 'tx-race')),
    store.saveEntry(entry('NK-4', 'tx-race')),
    store.saveEntry(entry('NK-5', 'tx-race')),
  ]);
  assert.equal(results.filter((r) => r.ok).length, 1);
});

test('conta le giocate per email', async () => {
  await store.saveEntry({ ...entry('NK-6', 'tx-6'), email: 'Mario@Rossi.ch' });
  assert.equal(await store.countByEmail('mario@rossi.ch'), 1);
});
