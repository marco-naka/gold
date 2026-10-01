import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { POOLS } from '../lib/campaigns.js';

/** Quanti premi clienti si estraggono davvero: il premio della giuria non entra. */
const drawnUserPrizes = POOLS.users.items
  .filter((i) => i.assignment === 'draw' && !i.pool)
  .reduce((sum, i) => sum + i.count, 0);

/*
 * Il processo automatico dall'inizio alla fine, contro un finto esploratore Bitcoin locale:
 * impegno dopo la chiusura, attesa del blocco, estrazione quando il seme ha un blocco sopra.
 * Nessuna rete esterna: gli esploratori veri sono sostituiti per la durata del test.
 */
const dir = await mkdtemp(join(tmpdir(), 'naka-draw-'));
process.env.DATA_DIR = dir;

const { DRAW } = await import('../lib/constants.js');
const { drawTick, drawAutomationEnabled } = await import('../lib/server/draw-scheduler.js');

const chain = { tip: 900_000, hashes: {} };
const server = createServer((req, res) => {
  const height = /\/block-height\/(\d+)/.exec(req.url)?.[1];
  if (req.url.endsWith('/blocks/tip/height')) return res.end(String(chain.tip));
  if (height && chain.hashes[height]) return res.end(chain.hashes[height]);
  res.statusCode = 404;
  res.end('Block not found');
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const realExplorers = DRAW.explorers;
DRAW.explorers = [`${base}/a`, `${base}/b`];

const entries = Array.from({ length: 30 }, (_, i) => ({
  id: `NK-2026-T${String(i).padStart(5, '0')}`,
  status: i === 3 ? 'rejected' : 'pending_verification',
  createdAt: '2026-10-21T10:00:00.000Z',
  merchantId: `lug-m${i % 3}`,
}));
await writeFile(join(dir, 'entries.json'), JSON.stringify({ entries }));

const afterClose = Date.parse('2026-10-24T16:05:00+02:00');
const afterNotBefore = Date.parse(DRAW.expectedFrom) + 60_000;
const read = async (name) => JSON.parse(await readFile(join(dir, 'draw', name), 'utf8'));

test.after(() => {
  DRAW.explorers = realExplorers;
  server.close();
});

test('si accende da solo solo in produzione', () => {
  const before = process.env.DRAW_AUTOMATIC;
  delete process.env.DRAW_AUTOMATIC;
  assert.equal(drawAutomationEnabled(), false, 'in test e in locale resta spento');
  process.env.DRAW_AUTOMATIC = 'on';
  assert.equal(drawAutomationEnabled(), true);
  process.env.DRAW_AUTOMATIC = 'off';
  assert.equal(drawAutomationEnabled(), false);
  if (before === undefined) delete process.env.DRAW_AUTOMATIC;
  else process.env.DRAW_AUTOMATIC = before;
});

test('prima della chiusura non fa nulla', async () => {
  await drawTick(Date.parse('2026-10-24T15:59:00+02:00'));
  await assert.rejects(read('commitment.json'));
});

test('dopo la chiusura impegna gli elenchi e annuncia un blocco 6 posizioni avanti', async () => {
  await drawTick(afterClose);
  const c = await read('commitment.json');
  assert.equal(c.users.count, 29, 'le respinte restano fuori, quelle in verifica entrano');
  assert.equal(c.seed.tipHeightAtCommit, 900_000);
  assert.equal(c.seed.seedHeight, 900_006);
  assert.equal(c.seed.drawWhenHeight, 900_007);
  await assert.rejects(read('result.json'), 'alle 16:05 non si estrae');
});

test('aspetta: prima delle 17:00 e finché il seme non ha un blocco sopra', async () => {
  chain.tip = 900_006;
  chain.hashes['900006'] = 'aa'.repeat(32);
  await drawTick(afterNotBefore);
  await assert.rejects(read('result.json'), 'il seme è minato ma senza conferma');
});

test('estrae quando il seme è definitivo, usando l’hash del blocco annunciato', async () => {
  chain.tip = 900_007;
  await drawTick(afterNotBefore);
  const r = await read('result.json');
  assert.equal(r.seedHeight, 900_006);
  assert.equal(r.seed, 'aa'.repeat(32));
  assert.equal(r.users.winners.length, drawnUserPrizes);
  const c = await read('commitment.json');
  assert.equal(r.users.listHash, c.users.listHash);
});

test('un altro giro non cambia niente: impegno e risultato si scrivono una volta sola', async () => {
  const before = await readFile(join(dir, 'draw', 'result.json'), 'utf8');
  chain.tip = 900_050;
  chain.hashes['900006'] = 'bb'.repeat(32);
  await drawTick(afterNotBefore + 3_600_000);
  assert.equal(await readFile(join(dir, 'draw', 'result.json'), 'utf8'), before);
});
