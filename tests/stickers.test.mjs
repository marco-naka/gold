import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStickerDone, matchesShop, stickerShops } from '../lib/stickers.js';
import { isStickerPin, isStickerSession, stickerCookie } from '../lib/server/adesivi-auth.js';
import { currentOperator, identify, isAuthorized } from '../lib/server/rilevazioni-auth.js';

const m = (id, name, address = 'Via Nassa 1, 6900 Lugano') => ({ id, name, address });
const visit = (merchantId, outcome, createdAt) => ({ merchantId, merchantName: merchantId, outcome, createdAt });
const sticker = (merchantId, status, createdAt) => ({ id: `AD-2026-${merchantId.toUpperCase().padEnd(6, 'X').slice(0, 6)}`, merchantId, status, createdAt, by: 'Ale' });

test('si vedono chi aderisce e chi è ancora da visitare, non chi è fuori', () => {
  const merchants = [m('a', 'Aderente'), m('b', 'Mai visto'), m('c', 'Chiuso'), m('d', 'Da ricontattare'), m('e', 'Rifiuta'), m('f', 'Fuori'), m('g', 'Escluso')];
  const visits = [
    visit('a', 'aderisce', '2026-10-10T10:00:00Z'),
    visit('c', 'chiuso', '2026-10-10T10:00:00Z'),
    visit('d', 'da_ricontattare', '2026-10-10T10:00:00Z'),
    visit('e', 'rifiuta', '2026-10-10T10:00:00Z'),
    visit('f', 'fuori_circuito', '2026-10-10T10:00:00Z'),
  ];
  const shops = stickerShops({ merchants, visits, excluded: new Set(['g']) });
  const byId = Object.fromEntries(shops.map((s) => [s.id, s.group]));
  assert.deepEqual(byId, { a: 'aderisce', b: 'da_visitare', c: 'da_visitare', d: 'da_visitare' });
});

test('conta l\'ultima rilevazione: chiuso e poi aderisce vale aderisce, aderisce e poi rifiuta esce', () => {
  const merchants = [m('a', 'A'), m('b', 'B')];
  const visits = [
    visit('a', 'chiuso', '2026-10-09T10:00:00Z'),
    visit('a', 'aderisce', '2026-10-11T10:00:00Z'),
    visit('b', 'aderisce', '2026-10-09T10:00:00Z'),
    visit('b', 'rifiuta', '2026-10-12T10:00:00Z'),
  ];
  const shops = stickerShops({ merchants, visits });
  assert.deepEqual(shops.map((s) => [s.id, s.group]), [['a', 'aderisce']]);
});

test('conta l\'ultimo passaggio per l\'adesivo, e «chiuso» resta da fare', () => {
  const merchants = [m('a', 'A'), m('b', 'B'), m('c', 'C')];
  const stickers = [
    sticker('a', 'chiuso', '2026-10-19T09:00:00Z'),
    sticker('a', 'montato', '2026-10-20T09:00:00Z'),
    sticker('b', 'chiuso', '2026-10-19T09:00:00Z'),
    sticker('c', 'rifiutato', '2026-10-19T09:00:00Z'),
  ];
  const shops = Object.fromEntries(stickerShops({ merchants, stickers }).map((s) => [s.id, s]));
  assert.equal(shops.a.sticker.status, 'montato');
  assert.equal(isStickerDone(shops.a), true);
  assert.equal(isStickerDone(shops.b), false);
  assert.equal(isStickerDone(shops.c), true);
});

test('la ricerca ignora accenti e maiuscole, e cerca anche nella via', () => {
  const shop = m('a', 'Caffè del Lago', 'Piazza Cioccaro 2, 6900 Lugano');
  assert.equal(matchesShop(shop, 'caffe'), true);
  assert.equal(matchesShop(shop, 'CIOCCARO'), true);
  assert.equal(matchesShop(shop, 'lago cioccaro'), true);
  assert.equal(matchesShop(shop, 'nassa'), false);
});

// La richiesta come la vede il server: solo `cookies.get(name)`.
const req = (...cookies) => ({ cookies: { get: (n) => cookies.find((c) => c.name === n) } });

test('il PIN degli adesivi apre solo l\'area adesivi', () => {
  process.env.RILEVAZIONI_SECRET = 'una-chiave-lunga-e-casuale-per-le-prove';
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111';
  process.env.RILEVAZIONI_ADESIVI_PIN = '2000';
  assert.equal(isStickerPin('2000'), true);
  assert.equal(isStickerPin(' 2000 '), true);
  assert.equal(isStickerPin('1111'), false);
  // Non è il PIN di un rilevatore: il questionario resta chiuso.
  assert.equal(identify('2000'), null);
  const c = stickerCookie();
  assert.equal(isStickerSession(req(c)), true);
  assert.equal(isAuthorized(req(c)), false);
  assert.equal(currentOperator(req(c)), null);
  // Un cookie inventato non vale.
  assert.equal(isStickerSession(req({ name: 'adesivi', value: 'abc' })), false);
  delete process.env.RILEVAZIONI_SECRET;
  delete process.env.RILEVAZIONI_ADESIVI_PIN;
});

test('senza RILEVAZIONI_ADESIVI_PIN l\'area adesivi è chiusa', () => {
  delete process.env.RILEVAZIONI_ADESIVI_PIN;
  assert.equal(isStickerPin('2000'), false);
  assert.equal(isStickerPin(''), false);
  assert.equal(isStickerSession(req({ name: 'adesivi', value: 'x' })), false);
});

test('«Vicino a me»: dal più vicino, e chi non ha coordinate va in fondo', async () => {
  const { byDistance, formatDistance } = await import('../lib/stickers.js');
  const here = { lat: 46.0037, lng: 8.9511 }; // Piazza Riforma
  const shops = [
    { id: 'lontano', name: 'Lontano', lat: 46.02, lng: 8.96 },
    { id: 'senza', name: 'Senza coordinate', lat: null, lng: null },
    { id: 'vicino', name: 'Vicino', lat: 46.0039, lng: 8.9513 },
  ];
  assert.deepEqual(byDistance(shops, here).map((s) => s.id), ['vicino', 'lontano', 'senza']);
  assert.equal(formatDistance(123), '120 m');
  assert.equal(formatDistance(1450), '1,4 km');
});
