import { test } from 'node:test';
import assert from 'node:assert/strict';
import { persistentStorage } from '../lib/server/persistence.js';
import { cellFor, visitsCsv } from '../lib/survey-export.js';
import { ALL_QUESTIONS } from '../lib/survey.js';
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

/** Parser CSV minimo ma corretto: virgolette raddoppiate, virgole e a capo dentro i campi. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') row.push(field), (field = '');
    else if (c === '\n') row.push(field), rows.push(row), (row = []), (field = '');
    else if (c !== '\r') field += c;
  }
  return rows;
}

test('nel CSV finisce ogni risposta, nella sua colonna, e niente colonne doppie', () => {
  const answerable = ALL_QUESTIONS.filter((q) => q.type !== 'photo' && q.type !== 'qr');
  // Un valore riconoscibile per ogni domanda, con virgole, virgolette e a capo nei testi.
  const sample = (q) =>
    ({
      text: `testo, "${q.id}"\nseconda riga`,
      single: q.options?.[0] ?? `scelta di ${q.id}`, // le opzioni di acquisto_rail vengono da un'altra risposta
      multi: q.options?.slice(0, 2),
      check: true,
      yesno: 'si',
      number: 12.5,
      scale: 4,
      date: '2026-10-09',
      time: '15:30',
    })[q.type];
  const answers = Object.fromEntries(answerable.map((q) => [q.id, sample(q)]));
  for (const q of answerable) assert.notEqual(answers[q.id], undefined, `manca un esempio per il tipo ${q.type}`);

  const visit = {
    id: 'RV-2026-AAAAAA',
    createdAt: '2026-10-05T08:30:00Z',
    surveyor: 'Anna',
    merchantName: 'Bar "Sole", Lugano',
    merchantId: 'm-1',
    merchantKnown: true,
    mapSnapshot: { address: 'Via Nassa 1', category: 'Ristorazione' },
    outcome: 'aderisce',
    excludes: false,
    answers,
    photos: {
      vetrina: { key: 'rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg' },
      ricevuta: [{ key: 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg' }, { key: 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-2.jpg' }],
    },
  };

  const [head, row, ...rest] = parseCsv(visitsCsv([visit]));
  assert.equal(rest.length, 0);
  assert.equal(head.length, row.length);
  assert.equal(new Set(head).size, head.length, `colonne doppie: ${head.filter((h, i) => head.indexOf(h) !== i)}`);

  const cell = (name) => row[head.indexOf(name)];
  assert.equal(cell('Data e ora (Lugano)'), '05.10.2026, 10:30');
  assert.equal(cell('Negozio'), 'Bar "Sole", Lugano');
  assert.equal(cell('Indirizzo'), 'Via Nassa 1');
  assert.equal(cell('Esito'), 'Aderisce');
  assert.equal(cell('Quando si torna?'), '09.10.2026');
  assert.equal(cell('Foto: Ricevute e QR'), 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg; rilevazioni/2026/RV-2026-AAAAAA-ricevuta-2.jpg');

  // Ogni domanda ha la sua colonna, e ci trova esattamente la sua risposta.
  const fixed = 10;
  answerable.forEach((q, i) => {
    assert.equal(row[fixed + i], cellFor(q, answers[q.id]), `colonna di ${q.id}`);
    assert.ok(head[fixed + i].startsWith(q.label), `intestazione di ${q.id}`);
  });
});

test('la data del file è quella di Lugano', () => {
  // 23:30 UTC del 4 ottobre è già il 5 a Lugano.
  assert.equal(todayInZurich(new Date('2026-10-04T23:30:00Z')), '2026-10-05');
});
