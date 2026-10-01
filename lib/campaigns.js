/**
 * Le due quote del montepremi, in un posto solo.
 *
 * Non sono due campagne alternative — lo erano, quando `/bitcoin` era una proposta in
 * sostituzione dell'oro. Ora sono i due lati della stessa iniziativa: chi paga vince
 * satoshi, chi offre il pagamento vince Tether Gold, e il totale dichiarato di
 * 21'000'000 sat è la somma delle due all'equivalenza fissata in `lib/anchor.js`.
 *
 * Date, negozi, asset accettati, registrazione ed estrazione restano condivisi e stanno in
 * `lib/constants.js`: toccarli lì li cambia su entrambi i lati.
 *
 * Il test `tests/campaigns.test.mjs` verifica che i conti tornino — che ogni quota sia la
 * somma dei suoi premi e che l'equivalenza regga — perché è l'unica cosa che il sito
 * dichiara al pubblico e che il mercato può smentire.
 */
import { PRIZES, formatXaut } from './constants.js';
import { BTC_PRIZES, BTC_USERS_SATS, BTC_USERS_WINNERS, SATS_PER_BTC, formatSats } from './bitcoin.js';
import { PRIZE_POOL, TARGET_RATIO, TOTAL_SATS } from './anchor.js';

export const POOLS = {
  users: {
    id: 'users',
    audience: 'clienti',
    /** Il verbo: chi sta su questa pagina paga. */
    verb: 'paga',
    page: '/bitcoin',
    asset: 'BTC',
    label: 'Bitcoin',
    accent: '#F7931A',
    priceApi: '/api/btc',
    items: BTC_PRIZES.users.items,
    total: BTC_USERS_SATS,
    winners: BTC_USERS_WINNERS,
    format: formatSats,
    amountOf: (item) => item.sats,
    /** Da satoshi a valuta, dato il prezzo di un bitcoin. */
    valueOf: (sats, unitPrice) => (sats / SATS_PER_BTC) * unitPrice,
  },
  merchants: {
    id: 'merchants',
    audience: 'commercianti',
    /** Un negoziante non paga: mette a disposizione il modo di pagare. */
    verb: 'offre',
    page: '/commercianti',
    asset: 'XAUT',
    label: 'Tether Gold',
    accent: '#FFD700',
    priceApi: '/api/xaut',
    items: PRIZES.merchants.items,
    total: PRIZES.merchants.pool,
    winners: PRIZES.merchants.winners,
    format: formatXaut,
    amountOf: (item) => item.amount,
    valueOf: (xaut, unitPrice) => xaut * unitPrice,
    /** Quanto vale questa quota in satoshi, al rapporto di ancoraggio. */
    satsEquivalent: PRIZE_POOL.merchantsSatsEquivalent,
  },
};

export const POOL_LIST = Object.values(POOLS);

/** Il numero che il concorso dichiara, e il rapporto a cui è vero. */
export const DECLARED = { sats: TOTAL_SATS, ratio: TARGET_RATIO };
