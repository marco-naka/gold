#!/usr/bin/env node
/**
 * Azzera a mano le prove del team (lib/server/test-reset.js). Di solito non serve: il server
 * lo fa da solo alla fine della finestra di prova. Resta per anticiparlo o per controllare.
 *
 *   node scripts/reset-prove.mjs          → mostra che cosa sposterebbe, senza toccare nulla
 *   node scripts/reset-prove.mjs --yes    → lo fa
 */
import { resetTestData } from '../lib/server/test-reset.js';

const apply = process.argv.includes('--yes');
const out = (s) => process.stdout.write(`${s}\n`);

const r = await resetTestData({ apply });
out(`Dati in ${r.dir}`);
for (const { name, what } of r.found) out(`  ${name.padEnd(14)} ${what ?? '—'}`);
out(`  social.json    ${r.customerLinks} link di clienti da togliere, ${r.merchantLinks} di commercianti restano`);
out(apply ? `\nFatto. Le prove sono in ${r.dest}` : '\nNessuna modifica. Per azzerare: node scripts/reset-prove.mjs --yes');
