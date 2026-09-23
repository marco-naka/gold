import { test } from 'node:test';
import assert from 'node:assert/strict';
import it from '../lib/i18n/it.js';
import en from '../lib/i18n/en.js';
import { LOCALES, getDictionary, localePath } from '../lib/i18n/index.js';
import { validateEntry } from '../lib/validation.js';

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

test('ogni codice di errore ha un messaggio in entrambe le lingue', () => {
  // I codici si ricavano da validateEntry: un codice nuovo senza traduzione fa fallire il test.
  const cases = [
    [{ email: '', txId: '', merchant: 'x'.repeat(200), confirmAge: false, acceptRules: false }, null],
    [{ email: 'a@b.ch', txId: '123' }, { name: 'r.txt', size: 10, type: 'text/plain' }],
    [{ email: 'a@b.ch', txId: 'POS-123456' }, { name: 'r.jpg', size: 99e6, type: 'image/jpeg' }],
  ];
  const codes = [...new Set(cases.flatMap(([d, r]) => Object.values(validateEntry(d, r)))), 'tx_duplicate'];
  const apiCodes = ['invalid_fields', 'duplicate_tx', 'rate_limited', 'storage_error', 'bad_request', 'demo'];
  for (const dict of [it, en]) {
    for (const c of codes) assert.ok(dict.form.errors[c], `manca il messaggio per ${c}`);
    for (const c of apiCodes) assert.ok(dict.form.apiErrors[c], `manca il messaggio API per ${c}`);
  }
});

test('i percorsi per lingua sono corretti', () => {
  assert.equal(localePath('it', '/'), '/');
  assert.equal(localePath('en', '/'), '/en');
  assert.equal(localePath('en', '/best-social-content'), '/en/best-social-content');
  assert.equal(localePath('it', '/best-social-content'), '/best-social-content');
});

test('getDictionary ricade sull’italiano per lingue sconosciute', () => {
  assert.equal(getDictionary('de'), it);
  assert.equal(getDictionary('en'), en);
  assert.deepEqual(LOCALES, ['it', 'en']);
});
