import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONTEST, DRAW, EVENT } from '../lib/constants.js';
import { SATOSHI_SPRITZ } from '../lib/bitcoin.js';
import { formatDate, formatDateTime, formatTime } from '../lib/i18n/index.js';
import { yearInZurich } from '../lib/time.js';

/*
 * Le date devono uscire con l'ora di Lugano qualunque sia il fuso della macchina: Render gira
 * in UTC, e un visitatore può essere a New York. Si cambia il fuso del processo e si controlla
 * che il testo non si muova.
 */
const ZONES = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/Zurich'];

for (const zone of ZONES) {
  test(`date e orari nel fuso di Lugano anche con TZ=${zone}`, () => {
    const previous = process.env.TZ;
    process.env.TZ = zone;
    try {
      assert.match(formatDateTime(CONTEST.drawDate, 'it'), /24 ottobre 2026.*17:00/);
      assert.equal(formatTime(DRAW.commitBy, 'it'), '16:30');
      assert.match(formatDateTime(CONTEST.validTo, 'it'), /24 ottobre 2026.*16:00/);
      assert.match(formatDateTime(CONTEST.validFrom, 'en'), /19 October 2026.*08:00/);
      assert.equal(formatTime(SATOSHI_SPRITZ.from, 'it'), '18:00');
      assert.equal(formatTime(SATOSHI_SPRITZ.to, 'it'), '23:00');
      // Il forum comincia il 23: a mezzanotte di Lugano, che in UTC è ancora il 22.
      assert.equal(formatDate(EVENT.startsAt, 'it', { day: 'numeric' }), '23');
      assert.equal(formatDate(EVENT.endsAt, 'en'), '24 October 2026');
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  });
}

test('l’anno degli identificativi è quello di Lugano', () => {
  // 31 dicembre, 23:30 UTC = già 1° gennaio a Lugano.
  assert.equal(yearInZurich(new Date('2026-12-31T23:30:00Z')), 2027);
  assert.equal(yearInZurich(new Date('2026-10-24T14:00:00Z')), 2026);
});
