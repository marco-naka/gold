import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// I moduli leggono DATA_DIR all'import: la cartella va scelta prima.
const dir = await mkdtemp(join(tmpdir(), 'naka-admin-'));
process.env.DATA_DIR = dir;

const { adminEntries, entriesCsv, receiptOf, setEntryStatus } = await import('../lib/server/entries-admin.js');
const { drawAdminState } = await import('../lib/server/draw-admin.js');
const { commitDraw, runDraw } = await import('../lib/server/draw.js');

const shops = [
  { id: 'lug-a', name: 'Negozio A', address: 'Via A 1' },
  { id: 'lug-b', name: 'Negozio B', address: 'Via B 2' },
  { id: 'lug-c', name: 'Negozio C', address: 'Via C 3' },
];
const entry = (n, extra = {}) => ({
  id: `NK-2026-A${String(n).padStart(5, '0')}`,
  email: `cliente${n}@example.com`,
  merchant: shops[n % 3].name,
  merchantId: shops[n % 3].id,
  merchantKnown: true,
  amountLabel: 'CHF 10.00',
  txIdMasked: 'ABC123',
  txNormalized: `tx${n}`,
  status: 'pending_verification',
  createdAt: '2026-10-20T10:00:00+02:00',
  ...extra,
});
const entries = [
  ...Array.from({ length: 20 }, (_, i) => entry(i)),
  entry(90, { test: true }),
  entry(91, { status: 'rejected' }),
  entry(92, { receipt: { key: 'receipts/2026/NK-2026-A00092.jpg', contentType: 'image/jpeg' } }),
  entry(93, { receipt: { key: '../../../etc/hosts', contentType: 'text/plain' } }),
];
await writeFile(join(dir, 'entries.json'), JSON.stringify({ entries }));
await mkdir(join(dir, 'receipts', '2026'), { recursive: true });
await writeFile(join(dir, 'receipts', '2026', 'NK-2026-A00092.jpg'), 'jpg');

test('respingere chiede un motivo; ogni cambio di stato resta nella cronologia', async () => {
  assert.deepEqual(await setEntryStatus('NK-2026-A00001', 'rejected', { by: 'Admin' }), { ok: false, error: 'reason' });
  assert.equal((await setEntryStatus('NK-2026-A00001', 'validated', { by: 'Admin', paidAt: '2026-10-23 19:30' })).ok, true);
  const e = (await adminEntries()).find((x) => x.id === 'NK-2026-A00001');
  assert.equal(e.status, 'validated');
  assert.equal(e.paidAt, '2026-10-23T17:30:00.000Z', 'ora del POS letta come ora di Lugano');
  assert.equal(e.history.length, 1);
  assert.deepEqual([e.history[0].by, e.history[0].from, e.history[0].to], ['Admin', 'pending_verification', 'validated']);
  assert.equal(e.receipt, undefined, 'al client non arriva il percorso dello scontrino');
  assert.equal((await setEntryStatus('NK-2026-NONE', 'validated', { by: 'Admin' })).error, 'not_found');
});

test('lo scontrino si legge solo dalla cartella degli scontrini', async () => {
  assert.equal(String((await receiptOf('NK-2026-A00092')).body), 'jpg');
  assert.equal(await receiptOf('NK-2026-A00093'), null);
  assert.equal(await receiptOf('NK-2026-A00000'), null);
});

test('il CSV porta una riga per giocata e segna le prove', async () => {
  const csv = entriesCsv(await adminEntries());
  const lines = csv.trim().split('\r\n');
  assert.equal(lines.length, entries.length + 1);
  assert.ok(lines.some((l) => l.includes('NK-2026-A00090') && l.includes('"sì"')));
});

test('prima dell’impegno: anteprima degli elenchi senza prove e respinte', async () => {
  const s = await drawAdminState({ now: Date.parse('2026-10-22T12:00:00+02:00'), merchants: shops });
  assert.equal(s.phase, 'open');
  assert.equal(s.preview.users, 22, '24 giocate meno una prova e una respinta');
  assert.equal(s.preview.excludedTest, 1);
  assert.equal(s.preview.excludedRejected, 1);
  assert.equal(s.preview.merchants, 3);
});

test('dopo l’estrazione: vincitori con i dati per contattarli, commercianti con nome', async () => {
  await commitDraw({ force: true, tip: 900_000 });
  await runDraw({ force: true, seed: '00000000000000000001b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3' });
  const s = await drawAdminState({ merchants: shops });
  assert.equal(s.phase, 'drawn');
  const w = s.scopes.users.winners[0];
  assert.match(w.who.email, /@example\.com$/);
  assert.ok(!s.scopes.users.winners.some((x) => x.winnerId === 'NK-2026-A00090'), 'la prova non vince');
  const m = s.scopes.merchants.winners[0];
  assert.ok(shops.some((shop) => shop.name === m.who.name));
  assert.ok(m.who.entries > 0);
});
