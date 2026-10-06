import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sniffImage } from '../lib/server/image-sniff.js';

const pad = (head) => Buffer.concat([head, Buffer.alloc(32)]);

test('le foto si riconoscono dai byte, qualunque tipo dichiari il telefono', () => {
  assert.equal(sniffImage(pad(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))).ext, 'jpg');
  assert.equal(sniffImage(pad(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).ext, 'png');
  assert.equal(sniffImage(pad(Buffer.from('RIFF\0\0\0\0WEBP', 'ascii'))).ext, 'webp');
  // HEIF di Android e HEIC di iPhone: stessa scatola `ftyp`, marchi diversi.
  assert.equal(sniffImage(pad(Buffer.from('\0\0\0\x18ftypheic', 'binary'))).ext, 'heic');
  assert.equal(sniffImage(pad(Buffer.from('\0\0\0\x18ftypmif1', 'binary'))).ext, 'heic');
});

test('quello che non è un\'immagine viene rifiutato', () => {
  assert.equal(sniffImage(pad(Buffer.from('%PDF-1.7', 'ascii'))), null);
  assert.equal(sniffImage(Buffer.from([0xff, 0xd8])), null);
  assert.equal(sniffImage(null), null);
});
