import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, platformOf, socialOpen, validateSocialLink } from '../lib/social-links.js';

const SHOPS = new Set(['lug-club-g-161dab']);

test('riconosce le piattaforme ammesse, anche dai link brevi delle app', () => {
  assert.equal(platformOf('https://www.instagram.com/p/C123/'), 'Instagram');
  assert.equal(platformOf('https://vm.tiktok.com/ZM123/'), 'TikTok');
  assert.equal(platformOf('https://fb.watch/abc/'), 'Facebook');
  assert.equal(platformOf('https://m.facebook.com/story.php?id=1'), 'Facebook');
  assert.equal(platformOf('https://lnkd.in/xyz'), 'LinkedIn');
  assert.equal(platformOf('https://twitter.com/naka/status/1'), 'X');
  assert.equal(platformOf('https://x.com/naka/status/1'), 'X');
});

test('rifiuta i domini che non sono piattaforme ammesse, anche se somigliano', () => {
  assert.equal(platformOf('https://youtube.com/watch?v=1'), null);
  assert.equal(platformOf('https://instagram.com.evil.example/p/1'), null);
  assert.equal(platformOf('https://notinstagram.com/p/1'), null);
  assert.equal(platformOf('javascript:alert(1)'), null);
});

test('normalizza: https, senza frammento, anche se manca il protocollo', () => {
  assert.equal(normalizeUrl(' instagram.com/p/C1/#x '), 'https://instagram.com/p/C1/');
  assert.equal(normalizeUrl('http://x.com/a'), 'https://x.com/a');
  // Stesso post, scritto in modi diversi: un solo link.
  assert.equal(normalizeUrl('https://www.instagram.com/p/C1/?igsh=abc&utm_source=ig'), 'https://instagram.com/p/C1/');
  assert.equal(normalizeUrl('https://m.facebook.com/story.php?story_fbid=1&id=2&mibextid=x'), 'https://facebook.com/story.php?story_fbid=1&id=2');
});

test('valida negozio, link ed email facoltativa', () => {
  assert.deepEqual(validateSocialLink({ merchantId: 'altro', url: '' }, SHOPS).errors, { merchant: 'required', url: 'required' });
  assert.equal(validateSocialLink({ merchantId: 'lug-club-g-161dab', url: 'https://example.com' }, SHOPS).errors.url, 'platform');
  assert.equal(validateSocialLink({ merchantId: 'lug-club-g-161dab', url: 'instagram.com/p/1', email: 'no' }, SHOPS).errors.email, 'invalid');
  const ok = validateSocialLink({ merchantId: 'lug-club-g-161dab', url: 'instagram.com/p/1', email: '' }, SHOPS);
  assert.deepEqual(ok.value, { merchantId: 'lug-club-g-161dab', url: 'https://instagram.com/p/1', platform: 'Instagram', email: null });
});

test('le segnalazioni chiudono alla scadenza di pubblicazione', () => {
  assert.equal(socialOpen(new Date('2026-10-23T23:59:00+02:00')), true);
  assert.equal(socialOpen(new Date('2026-10-24T00:00:01+02:00')), false);
});

test('segnalazione di un cliente: link ed email obbligatori, ID facoltativo ma nel formato giusto', async () => {
  const { validateCustomerLink } = await import('../lib/social-links.js');
  assert.deepEqual(validateCustomerLink({ url: '', email: '' }).errors, { url: 'required', email: 'required' });
  assert.equal(validateCustomerLink({ url: 'tiktok.com/@a/video/1', email: 'a@b.ch', entryId: 'ABC' }).errors.entryId, 'invalid');
  assert.deepEqual(validateCustomerLink({ url: 'tiktok.com/@a/video/1', email: 'Mario@Example.CH', entryId: 'nk-2026-7kq2xm' }).value, {
    url: 'https://tiktok.com/@a/video/1',
    platform: 'TikTok',
    email: 'mario@example.ch',
    entryId: 'NK-2026-7KQ2XM',
  });
});
