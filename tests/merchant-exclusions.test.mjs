import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'naka-circuito-'));
process.env.DATA_DIR = dir;
const { excludeMerchant, restoreMerchant, excludedIds, exclusionState } = await import('../lib/server/merchant-exclusions.js');

test('senza motivo non si toglie nessuno', async () => {
  assert.equal((await excludeMerchant({ id: 'a', name: 'A', reason: '  ', by: 'Sabri' })).code, 'reason_required');
  assert.equal((await excludeMerchant({ id: 'a', name: 'A', reason: 'x'.repeat(501), by: 'Sabri' })).code, 'reason_too_long');
  assert.equal((await excludedIds()).size, 0);
});

test('tolto, poi rimesso, con lo storico', async () => {
  const r = await excludeMerchant({ id: 'a', name: 'A', reason: ' ha tolto   il POS ', by: 'Sabri', now: new Date('2026-10-11T10:00:00Z') });
  assert.equal(r.ok, true);
  assert.equal(r.exclusion.reason, 'ha tolto il POS');
  assert.deepEqual([...(await excludedIds())], ['a']);
  assert.equal((await excludeMerchant({ id: 'a', name: 'A', reason: 'di nuovo', by: 'Luca' })).code, 'already_excluded');

  assert.equal((await restoreMerchant({ id: 'a', by: 'Rilevatore' })).ok, true);
  assert.equal((await restoreMerchant({ id: 'a', by: 'Rilevatore' })).code, 'not_excluded');
  assert.equal((await excludedIds()).size, 0);

  const { history } = await exclusionState();
  assert.deepEqual(history.map((h) => [h.action, h.by]), [['exclude', 'Sabri'], ['restore', 'Rilevatore']]);
  assert.ok(JSON.parse(readFileSync(join(dir, 'negozi-esclusi.json'), 'utf8')).updatedAt);
});

test('due esclusioni insieme non si cancellano a vicenda', async () => {
  await Promise.all([
    excludeMerchant({ id: 'b', name: 'B', reason: 'chiuso', by: 'Sabri' }),
    excludeMerchant({ id: 'c', name: 'C', reason: 'non accetta più crypto', by: 'Luca' }),
  ]);
  assert.deepEqual([...(await excludedIds())].sort(), ['b', 'c']);
});
