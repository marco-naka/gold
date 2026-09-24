import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEntry, isValidTxId, txKind, txSuffix, parseAmount, MAX_RECEIPT_BYTES } from '../lib/validation.js';

const jpg = { name: 'scontrino.jpg', size: 120_000, type: 'image/jpeg' };
const valid = {
  email: 'mario@rossi.ch',
  txId: '0adca2', // ultime 6 cifre come stampate sulla ricevuta NAKA
  amount: '0.10',
  merchant: '',
  confirmAge: true,
  acceptRules: true,
};

test('accetta una giocata completa', () => {
  assert.deepEqual(validateEntry(valid, jpg), {});
});

test('richiede entrambe le prove d’acquisto', () => {
  assert.equal(validateEntry(valid, null).receipt, 'receipt_missing');
  assert.equal(validateEntry({ ...valid, txId: '' }, jpg).txId, 'tx_missing');
});

test('rifiuta email non valide', () => {
  for (const email of ['', 'mario', 'mario@', 'mario@rossi']) {
    assert.equal(validateEntry({ ...valid, email }, jpg).email, 'email_invalid', `doveva fallire: ${email}`);
  }
});

test('restituisce codici, non messaggi: il testo dipende dalla lingua', () => {
  const errors = validateEntry({ ...valid, email: '' }, null);
  assert.equal(errors.email, 'email_invalid');
  assert.equal(errors.receipt, 'receipt_missing');
  for (const code of Object.values(errors)) {
    assert.match(code, /^[a-z_]+$/, `"${code}" non è un codice`);
  }
});

test('richiede entrambi i consensi', () => {
  assert.ok(validateEntry({ ...valid, confirmAge: false }, jpg).confirmAge);
  assert.ok(validateEntry({ ...valid, acceptRules: false }, jpg).acceptRules);
});

test('controlla formato e peso dell’allegato', () => {
  assert.equal(validateEntry(valid, { ...jpg, type: 'text/plain' }).receipt, 'receipt_type');
  assert.equal(validateEntry(valid, { ...jpg, size: MAX_RECEIPT_BYTES + 1 }).receipt, 'receipt_size');
});

test('il merchant è facoltativo ma limitato in lunghezza', () => {
  assert.deepEqual(validateEntry({ ...valid, merchant: '' }, jpg), {});
  assert.deepEqual(validateEntry({ ...valid, merchant: 'Caffè Roma' }, jpg), {});
  assert.ok(validateEntry({ ...valid, merchant: 'x'.repeat(200) }, jpg).merchant);
});

test('bastano le ultime 6 cifre, ma il numero intero resta accettato', () => {
  assert.ok(isValidTxId('0adca2'));
  assert.ok(isValidTxId('b72134bf088d4df88eaf55c3b90adca2'));
  assert.ok(!isValidTxId('adca'), 'meno di 6 caratteri');
  assert.ok(!isValidTxId('rif <script>'), 'caratteri non ammessi');
});

test('il suffisso è lo stesso sia dal numero intero sia dalle 6 cifre', () => {
  const intero = 'b72134bf088d4df88eaf55c3b90adca2';
  assert.equal(txSuffix(intero), '0adca2');
  assert.equal(txSuffix('0adca2'), '0adca2');
  assert.equal(txSuffix('0ADCA2'), '0adca2', 'maiuscole equivalenti');
  assert.equal(txSuffix('0a dc-a2'), '0adca2', 'spazi e trattini ignorati');
});

test('l\u2019importo si scrive come sulla ricevuta', () => {
  assert.equal(parseAmount('0.10'), 10);
  assert.equal(parseAmount('CHF 0.10'), 10);
  assert.equal(parseAmount('0,10'), 10);
  assert.equal(parseAmount('84.50'), 8450);
  for (const bad of ['', 'abc', '-5', '0', '1.234']) assert.equal(parseAmount(bad), null, `"${bad}"`);
});

test('l\u2019importo è obbligatorio: da solo il suffisso collide troppo spesso', () => {
  assert.equal(validateEntry({ ...valid, amount: '' }, jpg).amount, 'amount_missing');
  assert.equal(validateEntry({ ...valid, amount: 'tanto' }, jpg).amount, 'amount_invalid');
});

test('etichetta il tipo di riferimento', () => {
  assert.equal(txKind('0x' + 'b'.repeat(64)), 'blockchain');
  assert.equal(txKind('b72134bf088d4df88eaf55c3b90adca2'), 'naka');
  assert.equal(txKind('lnbc250n1p' + 'c'.repeat(60)), 'lightning');
  assert.equal(txKind('0adca2'), 'receipt');
  assert.equal(txKind(''), null);
});
