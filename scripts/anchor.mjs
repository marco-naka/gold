#!/usr/bin/env node
/**
 * Dice quanto manca all'ancoraggio, e lo cattura quando il mercato ci passa sopra.
 *
 *   npm run anchor              una lettura sola
 *   npm run anchor -- --watch   controlla ogni minuto e avvisa quando il rapporto è giusto
 *
 * Il rapporto da cogliere è 1 BTC = 20 XAUT: lì due XAUT valgono esattamente dieci milioni
 * di satoshi, e i 21 milioni dichiarati dal concorso smettono di essere un arrotondamento.
 */
import { TARGET_RATIO, TOLERANCE, PRIZE_POOL, merchantsSatsNow, ratioDrift } from '../lib/anchor.js';

const SOURCE = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd,chf';

async function read() {
  const res = await fetch(SOURCE, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const json = await res.json();
  const btc = json.bitcoin?.usd;
  const xaut = json['tether-gold']?.usd;
  if (!btc || !xaut) throw new Error('risposta senza prezzi');
  return { btc, xaut, chf: json.bitcoin?.chf };
}

function report({ btc, xaut }) {
  const ratio = btc / xaut;
  const drift = ratioDrift(btc, xaut);
  const sats = merchantsSatsNow(btc, xaut);
  const colto = Math.abs(drift) <= TOLERANCE;

  const riga = [
    new Date().toLocaleTimeString('it-CH'),
    `BTC ${btc.toLocaleString('it-CH')}`,
    `XAUT ${xaut.toLocaleString('it-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `rapporto ${ratio.toFixed(4)}`,
    `scarto ${(drift * 100).toFixed(3)}%`,
    `2 XAUT = ${sats.toLocaleString('it-CH')} sat`,
  ].join('  ·  ');

  process.stdout.write(`${colto ? '✓' : ' '} ${riga}\n`);
  if (colto) {
    process.stdout.write(
      `\n  ANCORAGGIO COLTO. Fissa in lib/anchor.js:\n` +
        `    at: '${new Date().toISOString()}',\n` +
        `    btcUsd: ${btc},\n` +
        `    xautUsd: ${xaut},\n` +
        `    ratio: ${ratio.toFixed(4)},\n\n`
    );
  }
  return colto;
}

const watch = process.argv.includes('--watch');
const prezzi = await read();

process.stdout.write(
  `\nObiettivo: 1 BTC = ${TARGET_RATIO} XAUT — lì ${PRIZE_POOL.merchantsXaut} XAUT valgono ` +
    `${PRIZE_POOL.merchantsSatsEquivalent.toLocaleString('it-CH')} sat esatti.\n` +
    `Tolleranza ${(TOLERANCE * 100).toFixed(1)}%.\n\n`
);

if (!report(prezzi) && !watch) {
  const { btc, xaut } = prezzi;
  process.stdout.write(
    `\n  Serve che BTC scenda a ${(TARGET_RATIO * xaut).toFixed(0)} $ (a oro fermo)\n` +
      `  oppure che XAUT salga a ${(btc / TARGET_RATIO).toFixed(2)} $ (a bitcoin fermo).\n` +
      `  Con --watch controllo ogni minuto.\n\n`
  );
}

if (watch) {
  // Un minuto: CoinGecko aggiorna di rado, e il rapporto fra due asset si muove piano.
  setInterval(async () => {
    try {
      if (report(await read())) process.exit(0);
    } catch (err) {
      process.stderr.write(`  ✗ ${err.message}\n`);
    }
  }, 60_000);
}
