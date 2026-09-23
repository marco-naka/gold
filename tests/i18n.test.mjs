import { test } from 'node:test';
import assert from 'node:assert/strict';
import it from '../lib/i18n/it.js';
import en from '../lib/i18n/en.js';
import { LOCALES, getDictionary, localePath } from '../lib/i18n/index.js';

/** Percorre l'oggetto restituendo tutte le chiavi annidate, con il tipo del valore. */
function shape(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, shape(v, path));
    else out[path] = Array.isArray(v) ? 'array' : typeof v;
  }
  return out;
}

test('i due dizionari hanno esattamente le stesse chiavi', () => {
  const a = shape(it);
  const b = shape(en);
  const missingInEn = Object.keys(a).filter((k) => !(k in b));
  const missingInIt = Object.keys(b).filter((k) => !(k in a));
  assert.deepEqual(missingInEn, [], 'chiavi presenti in it ma non in en');
  assert.deepEqual(missingInIt, [], 'chiavi presenti in en ma non in it');
});

test('i tipi corrispondono: una funzione non diventa una stringa', () => {
  const a = shape(it);
  const b = shape(en);
  const mismatched = Object.keys(a).filter((k) => a[k] !== b[k]);
  assert.deepEqual(mismatched, []);
});

test('le liste di pari ruolo hanno la stessa lunghezza', () => {
  assert.equal(it.faq.items.length, en.faq.items.length);
  assert.equal(it.b2b.checklist.length, en.b2b.checklist.length);
  assert.equal(it.how.steps('x').length, en.how.steps('x').length);
  assert.equal(it.dual.users.points('x').length, en.dual.users.points('x').length);
});

test('nessun testo inglese è rimasto in italiano nelle voci chiave', () => {
  assert.notEqual(en.nav.cta, it.nav.cta);
  assert.notEqual(en.hero.titleLead, it.hero.titleLead);
  assert.notEqual(en.form.submit, it.form.submit);
});

test('i percorsi per lingua sono corretti', () => {
  assert.equal(localePath('it', '/'), '/');
  assert.equal(localePath('en', '/'), '/en');
  assert.equal(localePath('en', '/best-social-video'), '/en/best-social-video');
  assert.equal(localePath('it', '/best-social-video'), '/best-social-video');
});

test('getDictionary ricade sull’italiano per lingue sconosciute', () => {
  assert.equal(getDictionary('de'), it);
  assert.equal(getDictionary('en'), en);
  assert.deepEqual(LOCALES, ['it', 'en']);
});
