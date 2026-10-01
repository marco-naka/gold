#!/usr/bin/env node
/**
 * Rigenera il QR della recensione Google mostrato dai rilevatori.
 *
 *   npm run qr:review
 *
 * Il codice è un file statico in `public/img/`: si genera qui una volta e il sito non
 * chiama nessun generatore esterno, né a build time né sul telefono del rilevatore —
 * che dentro un negozio la rete ce l'ha a singhiozzo.
 *
 * Richiede `segno` (Python): pip3 install segno
 */
import { execFileSync } from 'node:child_process';
import { CONTEST } from '../lib/constants.js';

const OUT = 'public/img/qr-recensione-google.svg';

const python = `
import segno
qr = segno.make(${JSON.stringify(CONTEST.googleReviewUrl)}, error='h')
qr.save(${JSON.stringify(OUT)}, kind='svg', scale=1, border=2, dark='#0D0D0D', light='#FFFFFF')
print('versione', qr.version, '· correzione', qr.error)
`;

try {
  const out = execFileSync('python3', ['-c', python], { encoding: 'utf8' });
  process.stdout.write(`✓ ${OUT} — ${out.trim()}\n  ${CONTEST.googleReviewUrl}\n`);
} catch (err) {
  process.stderr.write(`✗ ${err.message}\nServe segno: pip3 install segno\n`);
  process.exit(1);
}
