import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateEntry, isValidTxId, txKind, MAX_RECEIPT_BYTES } from '../lib/validation.js';

const jpg = { name: 'scontrino.jpg', size: 120_000, type: 'image/jpeg' };
const valid = {
  email: 'mario@rossi.ch',
  txId: '0x' + 'a'.repeat(64),
  merchant: '',
  confirmAge: true,
  acceptRules: true,
};

test('accetta una giocata completa', () => {
  assert.deepEqual(validateEntry(valid, jpg), {});
});

test('richiede entrambe le prove d’acquisto', () => {
  assert.ok(validateEntry(valid, null).receipt, 'scontrino obbligatorio');
  assert.ok(validateEntry({ ...valid, txId: '' }, jpg).txId, 'numero transazione obbligatorio');
});

test('rifiuta email non valide', () => {
  for (const email of ['', 'mario', 'mario@', 'mario@rossi']) {
    assert.ok(validateEntry({ ...valid, email }, jpg).email, `doveva fallire: ${email}`);
  }
});

test('richiede entrambi i consensi', () => {
  assert.ok(validateEntry({ ...valid, confirmAge: false }, jpg).confirmAge);
  assert.ok(validateEntry({ ...valid, acceptRules: false }, jpg).acceptRules);
});

test('controlla formato e peso dell’allegato', () => {
  assert.ok(validateEntry(valid, { ...jpg, type: 'text/plain' }).receipt);
  assert.ok(validateEntry(valid, { ...jpg, size: MAX_RECEIPT_BYTES + 1 }).receipt);
});

test('il merchant è facoltativo ma limitato in lunghezza', () => {
  assert.deepEqual(validateEntry({ ...valid, merchant: '' }, jpg), {});
  assert.deepEqual(validateEntry({ ...valid, merchant: 'Caffè Roma' }, jpg), {});
  assert.ok(validateEntry({ ...valid, merchant: 'x'.repeat(200) }, jpg).merchant);
});

test('il numero transazione accetta anche i riferimenti di ricevuta', () => {
  assert.ok(isValidTxId('POS-2026-778412'));
  assert.ok(isValidTxId('lnbc250n1p' + 'a'.repeat(60)));
  assert.ok(!isValidTxId('123'), 'troppo corto');
  assert.ok(!isValidTxId('rif <script>'), 'caratteri non ammessi');
});

test('etichetta il tipo di riferimento', () => {
  assert.equal(txKind('0x' + 'b'.repeat(64)), 'blockchain');
  assert.equal(txKind('lnbc250n1p' + 'c'.repeat(60)), 'lightning');
  assert.equal(txKind('POS-2026-778412'), 'ricevuta');
  assert.equal(txKind(''), null);
});
