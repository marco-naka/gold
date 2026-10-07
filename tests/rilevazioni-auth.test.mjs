import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentOperator, sessionCookie } from '../lib/server/rilevazioni-auth.js';

// La richiesta come la vede il server: solo `cookies.get(name)`.
const req = (cookie) => ({ cookies: { get: (n) => (n === cookie.name ? { value: cookie.value } : undefined) } });

test('con RILEVAZIONI_SECRET aggiungere un rilevatore non disconnette gli altri', () => {
  process.env.RILEVAZIONI_SECRET = 'una-chiave-lunga-e-casuale-per-le-prove';
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111';
  const cookie = sessionCookie('Sabri');
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111,Emilio:2222';
  assert.equal(currentOperator(req(cookie)), 'Sabri');
  delete process.env.RILEVAZIONI_SECRET;
});

test('senza chiave fissa la stessa modifica fa decadere la sessione (il caso del 7 ottobre)', () => {
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111';
  const cookie = sessionCookie('Sabri');
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111,Emilio:2222';
  assert.equal(currentOperator(req(cookie)), null);
});

test('un cookie falsificato non vale, con o senza chiave fissa', () => {
  process.env.RILEVAZIONI_SECRET = 'una-chiave-lunga-e-casuale-per-le-prove';
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111';
  assert.equal(currentOperator(req({ name: 'rilevazioni', value: 'Sabri.0000' })), null);
  delete process.env.RILEVAZIONI_SECRET;
});
