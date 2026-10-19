import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

test('il cookie degli adesivi non si firma con niente di indovinabile, e cambiare PIN lo invalida', () => {
  delete process.env.RILEVAZIONI_SECRET;
  process.env.DATA_DIR = mkdtempSync(join(tmpdir(), 'adesivi-'));
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111,Emilio:2222';
  process.env.RILEVAZIONI_ADESIVI_PIN = '2000';
  const c = stickerCookie();
  assert.equal(isStickerSession(req(c)), true);
  const msg = 'adesivi-v1:2000';
  assert.notEqual(c.value, createHmac('sha256', '2000').update(msg).digest('hex'));
  assert.notEqual(c.value, createHmac('sha256', 'Sabri:1111,Emilio:2222').update(msg).digest('hex'));
  // La chiave casuale sta sul disco del server, lunga 256 bit.
  assert.equal(readFileSync(join(process.env.DATA_DIR, 'adesivi-chiave'), 'utf8').length, 64);
  process.env.RILEVAZIONI_ADESIVI_PIN = '3000';
  assert.equal(isStickerSession(req(c)), false);
  delete process.env.RILEVAZIONI_ADESIVI_PIN;
  delete process.env.DATA_DIR;
});

test('materiale: i vecchi «montato» valgono adesivi, e ogni ripasso si somma senza cancellare niente', async () => {
  const { materialsOf } = await import('../lib/stickers.js');
  const merchants = [m('a', 'A'), m('b', 'B'), m('c', 'C')];
  const photo = (key) => ({ key, size: 1, contentType: 'image/jpeg', sha256: 'x' });
  const stickers = [
    // Prima delle caselle: «montato» con la foto.
    { ...sticker('a', 'montato', '2026-10-12T09:00:00Z'), id: 'AD-2026-AAAAA1', photo: photo('adesivi/2026/AD-2026-AAAAA1.jpg') },
    // Ripasso: flyer e locandine, con un'altra foto.
    { ...sticker('a', 'lasciato', '2026-10-19T09:00:00Z'), id: 'AD-2026-AAAAA2', materials: ['locandine', 'flyer'], photo: photo('adesivi/2026/AD-2026-AAAAA2.jpg') },
    // Ripasso ancora: chiuso. Non toglie niente.
    { ...sticker('a', 'chiuso', '2026-10-20T09:00:00Z'), id: 'AD-2026-AAAAA3' },
    { ...sticker('b', 'lasciato', '2026-10-19T10:00:00Z'), materials: ['rollup_a3'] },
    { ...sticker('c', 'chiuso', '2026-10-19T10:00:00Z') },
  ];
  const shops = Object.fromEntries(stickerShops({ merchants, stickers }).map((s) => [s.id, s]));
  assert.deepEqual(materialsOf({ status: 'montato' }), ['adesivi']);
  assert.deepEqual(Object.keys(shops.a.left).sort(), ['adesivi', 'flyer', 'locandine']);
  assert.equal(shops.a.left.adesivi, '2026-10-12T09:00:00Z');
  assert.equal(shops.a.sticker.status, 'chiuso');
  assert.equal(shops.a.passes, 3);
  // Tutte e due le foto restano, dalla più recente.
  assert.deepEqual(shops.a.photos.map((p) => p.key), ['adesivi/2026/AD-2026-AAAAA2.jpg', 'adesivi/2026/AD-2026-AAAAA1.jpg']);
  assert.equal(isStickerDone(shops.a), true);
  assert.equal(isStickerDone(shops.b), true);
  assert.equal(isStickerDone(shops.c), false);
});

test('materiale: caselle pulite, e la foto è obbligatoria solo con gli adesivi', async () => {
  const { cleanMaterials, photoRequired } = await import('../lib/stickers.js');
  assert.deepEqual(cleanMaterials(['locandine', 'flyer', 'flyer', 'bandiera']), ['flyer', 'locandine']);
  assert.deepEqual(cleanMaterials(undefined), []);
  assert.equal(photoRequired(['flyer']), false);
  assert.equal(photoRequired(['flyer', 'adesivi']), true);
});

test('le foto non si sovrascrivono e i passaggi si aggiungono soltanto', async () => {
  const prev = process.env.DATA_DIR;
  process.env.DATA_DIR = mkdtempSync(join(tmpdir(), 'adesivi-foto-'));
  try {
    // Import nuovo: il modulo legge DATA_DIR quando si carica.
    const store = await import(`../lib/server/stickers.js?t=${Date.now()}`);
    const kind = { ext: 'jpg', type: 'image/jpeg' };
    const first = await store.storeStickerPhoto({ buffer: Buffer.from('prima'), kind }, 'AD-2026-FOTO01');
    await assert.rejects(store.storeStickerPhoto({ buffer: Buffer.from('dopo'), kind }, 'AD-2026-FOTO01'));
    assert.equal(readFileSync(store.stickerPhotoPath(first.key), 'utf8'), 'prima');
    assert.deepEqual(await store.photoFiles(), [first.key]);

    const rec = { id: 'AD-2026-PASS01', createdAt: '2026-10-19T09:00:00Z', merchantId: 'a', status: 'chiuso', by: 'Ale' };
    await store.saveSticker(rec);
    await assert.rejects(store.saveSticker(rec));
    await store.saveSticker({ ...rec, id: 'AD-2026-PASS02' });
    assert.deepEqual((await store.listStickers()).map((r) => r.id), ['AD-2026-PASS01', 'AD-2026-PASS02']);
  } finally {
    if (prev === undefined) delete process.env.DATA_DIR;
    else process.env.DATA_DIR = prev;
  }
});

test('la copia di sicurezza è uno ZIP valido', async () => {
  const { crc32, zipStore } = await import('../lib/server/zip.js');
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  const zip = zipStore([
    { name: 'adesivi.json', data: Buffer.from('{"stickers":[]}') },
    { name: 'adesivi/2026/AD-2026-ABCDEF.jpg', data: Buffer.from([0xff, 0xd8, 0xff]) },
  ]);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const end = zip.length - 22;
  assert.equal(zip.readUInt32LE(end), 0x06054b50);
  assert.equal(zip.readUInt16LE(end + 10), 2);
});

test('i rilevatori entrano anche negli adesivi con il loro PIN, il PIN adesivi non apre il questionario', async () => {
  const { canUseStickers } = await import('../lib/server/adesivi-auth.js');
  const { sessionCookie } = await import('../lib/server/rilevazioni-auth.js');
  process.env.RILEVAZIONI_SECRET = 'una-chiave-lunga-e-casuale-per-le-prove';
  process.env.RILEVAZIONI_OPERATORI = 'Sabri:1111';
  process.env.RILEVAZIONI_ADESIVI_PIN = '2000';
  assert.equal(canUseStickers(req(sessionCookie('Sabri'))), true);
  assert.equal(canUseStickers(req(stickerCookie())), true);
  assert.equal(isAuthorized(req(stickerCookie())), false);
  assert.equal(canUseStickers(req()), false);
  assert.equal(canUseStickers(req({ name: 'adesivi', value: 'abc' })), false);
  delete process.env.RILEVAZIONI_SECRET;
  delete process.env.RILEVAZIONI_ADESIVI_PIN;
});
