import { test } from 'node:test';
import assert from 'node:assert/strict';
import { persistentStorage } from '../lib/server/persistence.js';
import { visitsCsv } from '../lib/survey-export.js';
import { todayInZurich } from '../lib/time.js';

const withEnv = (vars, fn) => {
  const saved = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
  for (const [k, v] of Object.entries(vars)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
};

test('in produzione senza DATA_DIR le rilevazioni non si salvano', () => {
  withEnv({ NODE_ENV: 'production', DATA_DIR: undefined }, () => assert.equal(persistentStorage(), false));
  withEnv({ NODE_ENV: 'production', DATA_DIR: '/var/data' }, () => assert.equal(persistentStorage(), true));
  withEnv({ NODE_ENV: 'development', DATA_DIR: undefined }, () => assert.equal(persistentStorage(), true));
});

test('il CSV ha una riga di intestazione e una per visita, con le virgolette raddoppiate', () => {
  const csv = visitsCsv([
    { id: 'RV-2026-AAAAAA', createdAt: '2026-10-05T08:00:00Z', surveyor: 'Anna', merchantName: 'Bar "Sole"', outcome: 'aderisce', answers: { con_chi: 'Titolare', materiale_esposto: ['Adesivo in vetrina', 'Plex da banco'] }, photos: {} },
  ]);
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^"id","data","rilevatore"/);
  assert.match(lines[1], /"Bar ""Sole"""/);
  assert.match(lines[1], /"Adesivo in vetrina; Plex da banco"/);
});

test('la data del file è quella di Lugano', () => {
  // 23:30 UTC del 4 ottobre è già il 5 a Lugano.
  assert.equal(todayInZurich(new Date('2026-10-04T23:30:00Z')), '2026-10-05');
});
