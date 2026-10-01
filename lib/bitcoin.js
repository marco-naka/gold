/**
 * Variante Bitcoin del concorso: "Pay on NAKA, Win Satoshi".
 *
 * Stessa meccanica, stesse date, stessi negozi: cambia solo che cosa si vince. Le date, gli
 * asset accettati e i contatti restano in `lib/constants.js` — qui c'è unicamente il
 * montepremi, così le due varianti non possono divergere su tutto il resto.
 *
 * Il totale è 21'000'000 di satoshi: 0,21 BTC, e il richiamo ai 21 milioni di bitcoin
 * dell'offerta massima è il motivo per cui la cifra è quella e non una vicina.
 */

export const SATS_PER_BTC = 100_000_000;

export const BITCOIN_CONTEST = {
  title: 'Pay on NAKA, Win Satoshi',
  titleIt: 'Paga in Crypto a Lugano e vinci Bitcoin',
  /** Un satoshi è un centomilionesimo di bitcoin: l'unità con cui si contano le somme piccole. */
  unit: 'sat',
  asset: 'Bitcoin',
  symbol: 'BTC',
};

/**
 * Ultimo prezzo noto di Bitcoin, usato se la quotazione in tempo reale non risponde.
 * Va aggiornato di tanto in tanto: la data mostrata in pagina è questa.
 */
export const BTC_FALLBACK = { usd: 83585, chf: 69863, at: '2026-09-30T22:00:00+02:00' };

export const BTC_PRICE_URL = 'https://www.coingecko.com/en/coins/bitcoin';

/** "5'000'000 sat" — raggruppamento svizzero, che è come si leggono le cifre qui. */
export const formatSats = (sats) => `${Number(sats).toLocaleString('it-CH')} sat`;

/** "0.05000000 BTC" — otto decimali, come si scrive un importo in bitcoin. */
export const formatBtc = (sats) => `${(sats / SATS_PER_BTC).toFixed(8)} BTC`;

/**
 * Premi in satoshi, con la stessa struttura della variante in oro: un primo premio, un
 * secondo, dieci di consolazione per i clienti; volume, social ed estrazione per i merchant.
 * `assignment` ha lo stesso significato di `PRIZES` in constants.js.
 */
const TIERS = {
  users: {
    items: [
      { place: '1° Premio', sats: 5_000_000, count: 1, assignment: 'draw', desc: 'Estrazione principale tra tutte le giocate valide' },
      { place: '2° Premio', sats: 1_000_000, count: 1, assignment: 'draw', desc: 'Seconda estrazione tra le giocate valide' },
      { place: '3°–12° Premio', sats: 500_000, count: 10, assignment: 'draw', desc: '10 premi consolazione estratti a sorte' },
    ],
  },
  merchants: {
    items: [
      {
        place: 'Top Volume Transazioni',
        sats: 5_000_000,
        count: 1,
        assignment: 'volume',
        desc: 'Al negozio con il più alto volume di incassi crypto su POS NAKA nella settimana',
      },
      {
        place: 'Best Social Content',
        sats: 2_500_000,
        count: 1,
        assignment: 'jury',
        desc: 'Al miglior contenuto pubblicato dal profilo dell’attività',
      },
      {
        place: 'Estrazione Riservata Merchant',
        sats: 2_500_000,
        count: 1,
        assignment: 'draw',
        desc: 'Estrazione tra tutti i negozi con almeno una transazione crypto',
      },
    ],
  },
};

const withTotals = (tier) => ({
  ...tier,
  pool: tier.items.reduce((sum, i) => sum + i.sats * i.count, 0),
  winners: tier.items.reduce((sum, i) => sum + i.count, 0),
});

export const BTC_PRIZES = {
  users: withTotals(TIERS.users),
  merchants: withTotals(TIERS.merchants),
};

export const BTC_TOTAL_SATS = BTC_PRIZES.users.pool + BTC_PRIZES.merchants.pool;
export const BTC_TOTAL_WINNERS = BTC_PRIZES.users.winners + BTC_PRIZES.merchants.winners;
