import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_QUESTIONS, OUTCOMES, PHOTOS, SECTIONS } from '../lib/survey.js';
import { PHOTOS_EN, QUESTIONS_EN, OUTCOMES_EN, SECTIONS_EN, UI_EN } from '../lib/survey.en.js';
import { UI_IT, askedIn, choicesIn, sectionIn } from '../lib/survey-i18n.js';

/*
 * L'inglese è una maschera sull'italiano: questi test servono a tenerla attaccata.
 *
 * Il rischio vero non è una frase non tradotta — si vede a occhio. È che qualcuno cambi
 * un'opzione in `survey.js` e dimentichi la chiave corrispondente qui: la domanda
 * continuerebbe a funzionare, mostrando però l'italiano in mezzo all'inglese, e nessuno
 * se ne accorgerebbe fino a quando non è in negozio.
 */

test('ogni domanda ha la sua traduzione', () => {
  const mancanti = ALL_QUESTIONS.filter((q) => !QUESTIONS_EN[q.id]).map((q) => q.id);
  assert.deepEqual(mancanti, []);
});

test('ogni sezione ha la sua traduzione', () => {
  const mancanti = SECTIONS.filter((s) => !SECTIONS_EN[s.id]).map((s) => s.id);
  assert.deepEqual(mancanti, []);
});

test('ogni opzione scritta nello schema ha la chiave inglese', () => {
  const buchi = [];
  for (const q of ALL_QUESTIONS) {
    if (!q.options) continue; // le opzioni derivate con optionsFrom si traducono alla fonte
    const t = QUESTIONS_EN[q.id] ?? {};
    // `brandOptions` marca le domande le cui opzioni sono nomi propri: rail e marchi
    // restano uguali nelle due lingue, e dichiararlo evita di scambiare una scelta
    // deliberata per una dimenticanza.
    if (t.brandOptions) continue;
    for (const opt of q.options) if (!t.options?.[opt]) buchi.push(`${q.id} → ${opt}`);
  }
  assert.deepEqual(buchi, []);
});

test('nessuna chiave inglese punta a un’opzione che non esiste più', () => {
  // È l'errore opposto, e più insidioso: l'opzione è stata rinominata in survey.js e qui
  // resta la vecchia, quindi la nuova appare in italiano senza che nulla si rompa.
  const orfane = [];
  for (const [id, t] of Object.entries(QUESTIONS_EN)) {
    const q = ALL_QUESTIONS.find((x) => x.id === id);
    if (!q?.options || !t.options) continue;
    for (const key of Object.keys(t.options)) if (!q.options.includes(key)) orfane.push(`${id} → ${key}`);
  }
  assert.deepEqual(orfane, []);
});

test('esiti e slot foto sono tradotti', () => {
  assert.deepEqual(OUTCOMES.filter((o) => !OUTCOMES_EN[o.id]).map((o) => o.id), []);
  assert.deepEqual(PHOTOS.filter((p) => !PHOTOS_EN[p.id]).map((p) => p.id), []);
});

test('i testi dell’interfaccia esistono in entrambe le lingue', () => {
  assert.deepEqual(Object.keys(UI_IT).sort(), Object.keys(UI_EN).sort());
  for (const key of Object.keys(UI_IT)) {
    assert.equal(typeof UI_IT[key], typeof UI_EN[key], `${key}: tipi diversi`);
  }
});

test('in inglese si leggono le etichette inglesi, ma il valore salvato resta italiano', () => {
  const con_chi = ALL_QUESTIONS.find((q) => q.id === 'con_chi');

  assert.equal(askedIn(con_chi, 'en').label, 'Who did you find in the shop?');
  assert.equal(askedIn(con_chi, 'it').label, 'Chi hai trovato in negozio?');

  const scelte = choicesIn(con_chi, {}, 'en');
  const chiuso = scelte.find((c) => c.label === 'It was closed');
  // Questo è il punto di tutto l'impianto: l'etichetta è inglese, il dato no.
  assert.equal(chiuso.value, 'Era chiuso');

  assert.equal(sectionIn(SECTIONS[0], 'en').title, 'In the shop');
});

test('le opzioni derivate restano valori italiani anche in inglese', () => {
  const rail = ALL_QUESTIONS.find((q) => q.id === 'acquisto_rail');
  const provati = ['BTC · Lightning'];
  assert.deepEqual(
    choicesIn(rail, { qr_provati: provati }, 'en'),
    [{ value: 'BTC · Lightning', label: 'BTC · Lightning' }]
  );
});
