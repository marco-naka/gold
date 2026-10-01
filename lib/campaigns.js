/**
 * Le due quote del montepremi, in un posto solo.
 *
 * L'iniziativa è una, i premi sono due e in due asset diversi: chi paga vince satoshi, chi
 * offre il pagamento vince Tether Gold. Non è una distinzione estetica — un negoziante non
 * paga, mette a disposizione il modo di pagare — ed è la ragione per cui le due quote hanno
 * verbi, pagine e asset diversi.
 *
 * Il totale dichiarato è 21'000'000 di satoshi: 11 milioni ai clienti più l'equivalente di 10
 * milioni pagato in oro, all'equivalenza fissata in `lib/anchor.js`.
 *
 * Date, negozi, asset accettati, registrazione ed estrazione restano condivisi e stanno in
 * `lib/constants.js`: toccarli lì li cambia su entrambi i lati.
 *
 * Il test `tests/campaigns.test.mjs` verifica che i conti tornino, perché il numero dichiarato
 * è l'unica cosa che il sito afferma al pubblico e che il mercato può smentire.
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
    page: '/',
    asset: 'BTC',
    label: 'Bitcoin',
    accent: '#F7931A',
    priceApi: '/api/btc',
    items: BTC_PRIZES.users.items,
    total: BTC_USERS_SATS,
    winners: BTC_USERS_WINNERS,
    format: formatSats,
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
    valueOf: (xaut, unitPrice) => xaut * unitPrice,
    /** Quanto vale questa quota in satoshi, al rapporto di ancoraggio. */
    satsEquivalent: PRIZE_POOL.merchantsSatsEquivalent,
  },
};

export const POOL_LIST = Object.values(POOLS);

/** Il numero che il concorso dichiara, e il rapporto a cui è vero. */
export const DECLARED = { sats: TOTAL_SATS, ratio: TARGET_RATIO };

/** Quante persone vincono qualcosa, in tutto. */
export const TOTAL_WINNERS = POOL_LIST.reduce((sum, pool) => sum + pool.winners, 0);

/**
 * L'importo di un premio, scritto nell'unità del suo asset: «5'000'000 sat», «1.00 XAUT».
 * Ogni voce porta con sé il proprio asset, così una lista mista non ha bisogno di sapere da
 * quale quota viene ciascuna riga.
 */
export const formatPrize = (item, locale = 'it') =>
  item.asset === 'XAUT' ? formatXaut(item.amount, locale) : formatSats(item.amount, locale);

/** La quota a cui appartiene un premio, dal suo asset. */
export const poolOf = (item) => (item.asset === 'XAUT' ? POOLS.merchants : POOLS.users);
