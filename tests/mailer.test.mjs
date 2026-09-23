import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryReceivedTemplate } from '../lib/server/mailer.js';
import { CONTEST } from '../lib/constants.js';

const entry = {
  id: 'NK-2026-ABC123',
  email: 'mario@rossi.ch',
  merchant: 'Caffè Roma',
  txIdMasked: 'POS-2026-7…8412',
  receiptName: 'scontrino.jpg',
  createdAtLabel: '23 set 2026, 13:00',
};

test('la conferma contiene i dati della giocata', () => {
  const msg = entryReceivedTemplate(entry);
  assert.equal(msg.to, entry.email);
  assert.ok(msg.subject.includes(entry.id));
  for (const part of [msg.text, msg.html]) {
    for (const value of [entry.id, entry.txIdMasked, entry.merchant, entry.createdAtLabel]) {
      assert.ok(part.includes(value), `manca "${value}"`);
    }
  }
});

test('non contiene segnaposto non risolti', () => {
  const msg = entryReceivedTemplate(entry);
  for (const part of [msg.subject, msg.text, msg.html]) {
    assert.ok(!/undefined|NaN|\[object Object\]|\$\{/.test(part), `segnaposto non risolto in: ${part.slice(0, 80)}`);
  }
});

test('funziona anche senza negozio indicato (campo facoltativo)', () => {
  const msg = entryReceivedTemplate({ ...entry, merchant: null });
  assert.ok(!msg.text.includes('Negozio:'));
  assert.ok(msg.text.includes(entry.id));
});

test('avverte di conservare lo scontrino e mette in guardia sul phishing', () => {
  const { text } = entryReceivedTemplate(entry);
  assert.ok(/conserva lo scontrino originale/i.test(text));
  assert.ok(/mai chiavi private/i.test(text));
});

test('l’HTML esegue l’escaping dei dati forniti dall’utente', () => {
  const msg = entryReceivedTemplate({ ...entry, merchant: '<script>alert(1)</script>' });
  assert.ok(!msg.html.includes('<script>alert(1)</script>'));
  assert.ok(msg.html.includes('&lt;script&gt;'));
});

test('mittente e assistenza puntano agli indirizzi del concorso', () => {
  const msg = entryReceivedTemplate(entry);
  assert.ok(msg.from.includes(CONTEST.supportEmail) || msg.from.includes(CONTEST.organizer));
  assert.ok(msg.text.includes(CONTEST.supportEmail));
});
