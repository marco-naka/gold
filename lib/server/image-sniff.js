/**
 * Che immagine è, dai primi byte e non dal tipo dichiarato.
 *
 * Il tipo che arriva dal telefono non è affidabile: alcuni Android salvano in HEIF e lo
 * dichiarano `image/heif`, altre app non dichiarano niente. Fidarsi del tipo voleva dire
 * rifiutare foto buone (e accettarne di finte). I primi byte invece non mentono.
 */
const HEIF_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1', 'heif'];

export function sniffImage(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: 'png', type: 'image/png' };
  }
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return { ext: 'webp', type: 'image/webp' };
  }
  if (buf.toString('ascii', 4, 8) === 'ftyp' && HEIF_BRANDS.includes(buf.toString('ascii', 8, 12))) {
    return { ext: 'heic', type: 'image/heic' };
  }
  return null;
}
