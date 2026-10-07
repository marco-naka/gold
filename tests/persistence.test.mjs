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
  assert.equal(cell('Data (Lugano)'), '05.10.2026');
  assert.equal(cell('Ora (Lugano)'), '10:30:00');
  assert.equal(cell('Timestamp UTC (ISO 8601)'), '2026-10-05T08:30:00Z');
  assert.equal(cell('Numero di foto'), '3');
  assert.equal(cell('Negozio'), 'Bar "Sole", Lugano');
  assert.equal(cell('Indirizzo'), 'Via Nassa 1');
  assert.equal(cell('Esito'), 'Aderisce');
  assert.equal(cell('Quando si torna?'), '09.10.2026');
  // Una colonna per foto: un link per cella è quello che un foglio rende cliccabile.
  assert.equal(cell('Foto: Vetrina'), 'rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg');
  assert.equal(cell('Foto: Ricevute e QR 1'), 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg');
  assert.equal(cell('Foto: Ricevute e QR 2'), 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-2.jpg');
  assert.equal(cell('Foto: Altre foto 1'), '');

  // Ogni domanda ha la sua colonna, e ci trova esattamente la sua risposta.
  const fixed = 15;
  answerable.forEach((q, i) => {
    assert.equal(row[fixed + i], cellFor(q, answers[q.id]), `colonna di ${q.id}`);
    assert.ok(head[fixed + i].startsWith(q.label), `intestazione di ${q.id}`);
  });
});

test('la data del file è quella di Lugano', () => {
  // 23:30 UTC del 4 ottobre è già il 5 a Lugano.
  assert.equal(todayInZurich(new Date('2026-10-04T23:30:00Z')), '2026-10-05');
});

test('il pannello è solo per i nomi in RILEVAZIONI_ADMIN', async () => {
  const { isAdmin, sessionCookie } = await import('../lib/server/rilevazioni-auth.js');
  const env = { RILEVAZIONI_OPERATORI: 'Marco:4321,Giulia:8765', RILEVAZIONI_ADMIN: 'marco', NODE_ENV: 'production' };
  withEnv(env, () => {
    const as = (name) => {
      const c = sessionCookie(name);
      return { cookies: { get: (k) => (k === c.name ? { value: c.value } : undefined) } };
    };
    assert.equal(isAdmin(as('Marco')), true);
    assert.equal(isAdmin(as('Giulia')), false);
    assert.equal(isAdmin({ cookies: { get: () => undefined } }), false);
  });
  // Senza PIN configurati, in produzione il pannello resta chiuso.
  withEnv({ RILEVAZIONI_OPERATORI: undefined, RILEVAZIONI_CODE: undefined, NODE_ENV: 'production' }, () =>
    assert.equal(isAdmin({ cookies: { get: () => undefined } }), false)
  );
});

test('i link delle foto nel CSV si aprono senza PIN, solo firmati e non scaduti', async () => {
  const { signedPhotoUrl, validPhotoSignature, LINK_DAYS } = await import('../lib/server/photo-links.js');
  withEnv({ RILEVAZIONI_OPERATORI: 'Marco:4321', RILEVAZIONI_LINK_SECRET: undefined }, () => {
    const key = 'rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg';
    const url = new URL(signedPhotoUrl(key, Date.parse('2026-10-06T08:00:00Z')));
    const [exp, sig] = [url.searchParams.get('exp'), url.searchParams.get('sig')];
    assert.equal(url.searchParams.get('key'), key);
    assert.equal(validPhotoSignature(key, exp, sig, Date.parse('2026-10-07T08:00:00Z')), true);
    // Scaduto, per un'altra foto, o con la firma ritoccata: no.
    assert.equal(validPhotoSignature(key, exp, sig, Date.parse('2026-10-06T08:00:00Z') + (LINK_DAYS + 1) * 864e5), false);
    assert.equal(validPhotoSignature(key.replace('vetrina', 'altro-1'), exp, sig), false);
    assert.equal(validPhotoSignature(key, exp, sig.replace(/.$/, (c) => (c === '0' ? '1' : '0'))), false);
  });
});

test('un testo che sembra una formula resta testo nel CSV', () => {
  const csv = visitsCsv([{ id: 'RV-2026-BBBBBB', createdAt: '2026-10-05T08:30:00Z', surveyor: 'Anna', merchantName: '=HYPERLINK("x")', outcome: 'aderisce', answers: { note: '+41 91 000 00 00' }, photos: {} }]);
  assert.match(csv, /"'=HYPERLINK\(""x""\)"/);
  assert.match(csv, /"'\+41 91 000 00 00"/);
});

test('il CSV ha le colonne della lamentela MyLugano', () => {
  const csv = visitsCsv([{ id: 'RV-2026-CCCCCC', createdAt: '2026-10-07T08:30:00Z', surveyor: 'Anna', merchantName: 'Bar', outcome: 'aderisce', answers: { con_chi: 'Titolare', mylugano_lamentela: true, mylugano_problema: ['È lenta', 'Non funziona'], mylugano_note: 'Non si apre' }, photos: {} }]);
  const [head, row] = parseCsv(csv);
  const cell = (name) => row[head.indexOf(name)];
  assert.ok(head.includes('Si lamenta del funzionamento dell’app MyLugano'));
  assert.equal(cell('Si lamenta del funzionamento dell’app MyLugano'), 'sì');
  assert.equal(cell('Di che cosa si lamenta?'), 'È lenta; Non funziona');
  assert.equal(cell('Commento libero'), 'Non si apre');
});
