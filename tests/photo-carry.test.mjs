import { test } from 'node:test';
import assert from 'node:assert/strict';
import { photosToCarry } from '../lib/server/visits.js';

const prev = {
  photos: {
    vetrina: { key: 'rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg' },
    ricevuta: [{ key: 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg' }, { key: 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-2.jpg' }],
  },
};
const all = ['rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg', 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg', 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-2.jpg'];

test('passano le foto lasciate nel modulo, non quelle tolte', () => {
  const out = photosToCarry(prev, [all[0], all[2]]);
  assert.deepEqual(out.map(([slot, p]) => [slot, p.key]), [['vetrina', all[0]], ['ricevuta', all[2]]]);
});

test('una vetrina nuova sostituisce la vecchia', () => {
  const out = photosToCarry(prev, all, ['vetrina', 'ricevuta']);
  assert.deepEqual(out.map(([slot]) => slot), ['ricevuta', 'ricevuta']);
});

test('chiavi estranee alla visita di prima o malformate non passano', () => {
  assert.deepEqual(photosToCarry(prev, ['rilevazioni/2026/RV-2026-BBBBBB-vetrina.jpg', '../entries.json']), []);
  assert.deepEqual(photosToCarry({ photos: { vetrina: { key: '../../etc/passwd' } } }, ['../../etc/passwd']), []);
  assert.deepEqual(photosToCarry(null, all), []);
  assert.deepEqual(photosToCarry(prev, 'non un array'), []);
});
