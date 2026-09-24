import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contestPhase, submissionWindow, GRACE_MS } from '../lib/contest.js';
import { CONTEST } from '../lib/constants.js';

const before = new Date(new Date(CONTEST.validFrom).getTime() - 86_400_000);
const during = new Date(new Date(CONTEST.validFrom).getTime() + 3_600_000);
const afterGrace = new Date(new Date(CONTEST.validTo).getTime() + GRACE_MS + 1000);
const drawTime = new Date(CONTEST.drawDate).getTime();

test('fasi del concorso', () => {
  assert.equal(contestPhase(before), 'upcoming');
  assert.equal(contestPhase(during), 'open');
  assert.equal(contestPhase(afterGrace), 'closed');
});

test('l\u2019estrazione avviene dopo la chiusura delle giocate', () => {
  // Con estrazione lo stesso giorno, la tolleranza non può sovrapporsi al sorteggio.
  const lastEntry = new Date(CONTEST.validTo).getTime() + GRACE_MS;
  assert.ok(drawTime > lastEntry, 'il sorteggio cadrebbe mentre si accettano ancora giocate');
  assert.ok(drawTime - lastEntry >= 30 * 60 * 1000, 'serve almeno mezz\u2019ora fra ultima giocata e sorteggio');
});

test('i vincitori restano pubblicati dopo l\u2019estrazione', () => {
  assert.ok(new Date(CONTEST.onlineUntil).getTime() > drawTime);
});

test('finestra di invio con tolleranza post-chiusura', () => {
  assert.equal(submissionWindow(before).open, false);
  assert.equal(submissionWindow(before).reason, 'upcoming');
  assert.equal(submissionWindow(during).open, true);

  const inGrace = new Date(new Date(CONTEST.validTo).getTime() + GRACE_MS / 2);
  assert.equal(submissionWindow(inGrace).open, true, 'entro la tolleranza si registra ancora');
  assert.equal(submissionWindow(afterGrace).open, false);
  assert.equal(submissionWindow(afterGrace).reason, 'closed');
});
