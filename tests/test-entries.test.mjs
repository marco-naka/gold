import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Le date si leggono all'import: la finestra di prova va accesa prima.
process.env.NEXT_PUBLIC_TEST_ENTRIES_FROM = '2026-10-08T00:00:00+02:00';
const { submissionWindow } = await import('../lib/contest.js');
const { testResetTick } = await import('../lib/server/test-reset.js');
const { isAdmitted } = await import('../lib/server/draw.js');

test('nella finestra di prova si registra, ma come prova', () => {
  const w = submissionWindow(new Date('2026-10-10T12:00:00+02:00'));
  assert.equal(w.open, true);
  assert.equal(w.test, true);
});

test('dal 18.10 alle 20:00 alle 8:00 del 19 non si registra niente, poi si apre davvero', () => {
  assert.equal(submissionWindow(new Date('2026-10-18T19:59:00+02:00')).test, true);
  assert.equal(submissionWindow(new Date('2026-10-18T20:00:00+02:00')).open, false);
  assert.equal(submissionWindow(new Date('2026-10-19T07:59:00+02:00')).reason, 'upcoming');
  const real = submissionWindow(new Date('2026-10-19T08:00:00+02:00'));
  assert.equal(real.open, true);
  assert.equal(real.test, undefined);
});

test('una giocata di prova non entra mai nell’estrazione', () => {
  const base = { status: 'validated', createdAt: '2026-10-20T10:00:00+02:00' };
  assert.equal(isAdmitted(base), true);
  assert.equal(isAdmitted({ ...base, test: true }), false);
});

async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), 'naka-prove-'));
  process.env.DATA_DIR = dir;
  await writeFile(join(dir, 'entries.json'), JSON.stringify({ entries: [{ id: 'NK-2026-PROVA1', test: true }] }));
  await mkdir(join(dir, 'receipts'));
  await writeFile(join(dir, 'receipts', 'NK-2026-PROVA1.jpg'), 'x');
  await writeFile(join(dir, 'rilevazioni.json'), JSON.stringify({ visits: [{ id: 'RV-1' }] }));
  await writeFile(
    join(dir, 'social.json'),
    JSON.stringify({ links: [{ kind: 'customer', url: 'https://a' }, { kind: 'merchant', url: 'https://b' }] }),
  );
  return dir;
}

test('il 18.10 alle 20:00 le prove si spostano in archivio, una volta sola', async () => {
  const dir = await fixture();
  assert.equal(await testResetTick(new Date('2026-10-18T19:59:00+02:00')), 'waiting');
  assert.equal(await testResetTick(new Date('2026-10-18T20:00:00+02:00')), 'reset');
  const left = await readdir(dir);
  assert.ok(!left.includes('entries.json') && !left.includes('receipts'));
  assert.equal(JSON.parse(await readFile(join(dir, 'rilevazioni.json'), 'utf8')).visits.length, 1, 'rilevazioni intatte');
  const links = JSON.parse(await readFile(join(dir, 'social.json'), 'utf8')).links;
  assert.deepEqual(links.map((l) => l.kind), ['merchant'], 'restano i link dei commercianti');
  const [stamp] = await readdir(join(dir, 'archivio-prove'));
  assert.ok((await readdir(join(dir, 'archivio-prove', stamp))).includes('entries.json'));
  // Un riavvio dopo le 20:00 non ripete l'azzeramento sulle giocate eventualmente arrivate.
  await writeFile(join(dir, 'entries.json'), JSON.stringify({ entries: [{ id: 'X' }] }));
  assert.equal(await testResetTick(new Date('2026-10-18T23:00:00+02:00')), 'done');
  assert.ok((await readdir(dir)).includes('entries.json'));
});

test('dopo l’apertura vera l’azzeramento automatico non tocca più niente', async () => {
  const dir = await fixture();
  assert.equal(await testResetTick(new Date('2026-10-19T08:00:00+02:00')), 'too_late');
  assert.ok((await readdir(dir)).includes('entries.json'));
});
