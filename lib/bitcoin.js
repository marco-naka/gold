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

import { formatNumber } from './number-format.js';
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


/**
 * "5'000'000 sat" in italiano, "5,000,000 sat" in inglese.
 *
 * Il raggruppamento con l'apostrofo è lo standard svizzero e in italiano va tenuto. In inglese
 * no: la pagina inglese scriveva a mano «11,000,000 satoshi» e due righe sopra ne stampava
 * «11'000'000», e lo stesso numero sembrava due numeri diversi.
 */
export const formatSats = (sats, locale = 'it') =>
  `${formatNumber(sats, locale)} sat`;

/** "0.05000000 BTC" — otto decimali, come si scrive un importo in bitcoin. */
export const formatBtc = (sats) => `${(sats / SATS_PER_BTC).toFixed(8)} BTC`;

/**
 * Premi dei CLIENTI, in satoshi. Sono 11'000'000: l'altra metà del montepremi va ai
 * commercianti ed è pagata in Tether Gold — sta in `PRIZES.merchants` di constants.js,
 * perché è una quantità in oro e non in sats.
 *
 * `assignment` ha lo stesso significato di `PRIZES` in constants.js.
 */
const TIERS = {
  users: {
    items: [
      { place: '1° Premio', amount: 5_000_000, asset: 'BTC', count: 1, assignment: 'draw', desc: 'Estrazione principale tra tutte le giocate valide' },
      { place: '2° Premio', amount: 1_000_000, asset: 'BTC', count: 1, assignment: 'draw', desc: 'Seconda estrazione tra le giocate valide' },
      { place: '3°–10° Premio', amount: 500_000, asset: 'BTC', count: 8, assignment: 'draw', desc: '8 premi consolazione estratti a sorte' },
      /*
       * Uno degli otto premi da 500'000 sat non si estrae: va al miglior contenuto pubblicato
       * da un cliente. È l'unico premio del concorso che si vince facendo qualcosa invece che
       * comprando qualcosa, ed è il motivo per cui esiste — il passaparola della settimana
       * vale più di una giocata in più.
       */
      {
        place: 'Video Social Clienti',
        amount: 500_000,
        asset: 'BTC',
        count: 1,
        assignment: 'jury',
        desc: 'Al miglior contenuto pubblicato da un cliente con gli hashtag ufficiali, scelto dalla giuria',
      },
      /*
       * Uno dei dieci premi da 500'000 sat non si estrae fra tutte le giocate: è riservato al
       * Satoshi Spritz, l'aperitivo bitcoin di Lugano, nella serata speciale della Plan ₿ Week.
       * Il montepremi non cambia — undici milioni restano undici milioni — cambia solo come
       * questo premio trova il suo vincitore.
       */
      {
        place: 'Satoshi Spritz',
        amount: 500_000,
        asset: 'BTC',
        count: 1,
        assignment: 'draw',
        /** Si estrae come gli altri, ma su un elenco ristretto: vedi `SATOSHI_SPRITZ`. */
        pool: 'spritz',
        desc: 'Riservato all’evento Satoshi Spritz Speciale del 22 ottobre in Piazza Cioccaro',
      },
    ],
  },
};

const withTotals = (tier) => ({
  ...tier,
  pool: tier.items.reduce((sum, i) => sum + i.amount * i.count, 0),
  winners: tier.items.reduce((sum, i) => sum + i.count, 0),
});

export const BTC_PRIZES = { users: withTotals(TIERS.users) };

export const BTC_USERS_SATS = BTC_PRIZES.users.pool;
export const BTC_USERS_WINNERS = BTC_PRIZES.users.winners;

/**
 * L'evento a cui è riservato uno dei premi da 500'000 sat.
 *
 * Il premio si estrae come gli altri — stesso seme, stessa formula verificabile — ma su un
 * sottoinsieme: solo le giocate registrate durante la serata, nei locali che partecipano.
 * Finestra e luogo sono quelli pubblicati dagli organizzatori, non scelti da noi: se l'evento
 * cambia orario, qui vanno cambiati `from` e `to` e tutte le pagine seguono.
 *
 * L'elenco dei locali non è ancora pubblico — «the full line-up of participating venues will be
 * announced closer to the date» — quindi il regolamento rimanda all'annuncio ufficiale invece
 * di promettere un elenco che oggi non esiste.
 */
export const SATOSHI_SPRITZ = {
  name: 'Satoshi Spritz Speciale',
  url: 'https://planbweek.com/events/satoshi-spritz-speciale',
  from: '2026-10-22T18:00:00+02:00',
  to: '2026-10-22T23:00:00+02:00',
  area: 'Piazza Cioccaro, 6900 Lugano',
  /**
   * TODO prima del go-live: l'elenco dei locali aderenti, quando gli organizzatori lo
   * pubblicano. Finché è `null` il premio si definisce per indirizzo — i negozi aderenti di
   * Piazza Cioccaro — che è un criterio verificabile oggi, mentre un elenco di nomi che non
   * esiste ancora non lo sarebbe. Quando i nomi arrivano, si restringe a quelli.
   */
  venues: null,
};
