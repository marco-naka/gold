/**
 * Le due varianti del concorso, in un posto solo.
 *
 * Cambia unicamente il premio: Tether Gold su `/`, satoshi su `/bitcoin`. Date, negozi,
 * asset accettati, meccanica di registrazione ed estrazione sono condivisi e stanno in
 * `lib/constants.js` — toccarli lì li cambia su entrambe le pagine.
 *
 * Questo file serve a due cose:
 *  1. dare un elenco delle campagne a chi deve ricordarsi di aggiornarle tutte;
 *  2. reggere il test `tests/campaigns.test.mjs`, che confronta le due strutture e fallisce
 *     se una prende una forma che l'altra non ha — è il modo in cui la promessa «le modifiche
 *     valgono per entrambe» smette di dipendere dalla memoria di qualcuno.
 */
import { PRIZES, TOTAL_POOL, TOTAL_WINNERS, formatXaut } from './constants.js';
import {
  BTC_PRIZES,
  BTC_TOTAL_SATS,
  BTC_TOTAL_WINNERS,
  SATS_PER_BTC,
  formatSats,
} from './bitcoin.js';

export const CAMPAIGNS = {
  gold: {
    id: 'gold',
    path: '/',
    label: 'Tether Gold',
    prizeAsset: 'XAUT',
    /** Tinta dell'accento: oro per la variante in XAUT, arancione Bitcoin per l'altra. */
    accent: '#FFD700',
    priceApi: '/api/xaut',
    prizes: PRIZES,
    total: TOTAL_POOL,
    winners: TOTAL_WINNERS,
    format: formatXaut,
    /** Quantità del singolo premio, nell'unità della campagna. */
    amountOf: (item) => item.amount,
    /** Da quantità a controvalore, dato il prezzo unitario dell'asset. */
    valueOf: (amount, unitPrice) => amount * unitPrice,
  },
  bitcoin: {
    id: 'bitcoin',
    path: '/bitcoin',
    label: 'Bitcoin',
    prizeAsset: 'BTC',
    accent: '#F7931A',
    priceApi: '/api/btc',
    prizes: BTC_PRIZES,
    total: BTC_TOTAL_SATS,
    winners: BTC_TOTAL_WINNERS,
    format: formatSats,
    amountOf: (item) => item.sats,
    valueOf: (sats, unitPrice) => (sats / SATS_PER_BTC) * unitPrice,
  },
};

export const CAMPAIGN_LIST = Object.values(CAMPAIGNS);
