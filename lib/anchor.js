/**
 * Ancoraggio fra le due quote del montepremi.
 *
 * Il concorso dichiara 21'000'000 di satoshi complessivi: 11 milioni ai clienti, pagati in
 * bitcoin, e 10 milioni ai commercianti, pagati in Tether Gold. Perché la seconda frase sia
 * esatta — non «circa» — serve che il valore in oro corrisponda davvero a 10 milioni di sat.
 *
 * La condizione si riduce a un numero solo:
 *
 *     10'000'000 sat = 0,1 BTC        e        0,1 BTC = 2 XAUT
 *     ⇒  1 BTC = 20 XAUT
 *
 * Quando il mercato passa per quel rapporto, 2.00 XAUT valgono esattamente dieci milioni di
 * satoshi e i conti del concorso tornano senza arrotondamenti. È uno scarto piccolo da
 * cogliere — oggi siamo allo 0,33% — e `npm run anchor` dice quanto manca.
 *
 * Fissato l'istante, il premio resta la QUANTITÀ: 11'000'000 sat e 2.00 XAUT. Il mercato può
 * muoversi quanto vuole dopo, chi vince riceve quelle quantità. I 21 milioni restano veri
 * come equivalenza dichiarata alla data di ancoraggio, che è ciò che il regolamento cita.
 */

export const SATS_PER_BTC = 100_000_000;

/** Rapporto BTC/XAUT a cui le due quote si equivalgono esattamente. */
export const TARGET_RATIO = 20;

/** Tolleranza entro cui consideriamo l'ancoraggio "colto": 0,1% è sotto lo spread di mercato. */
export const TOLERANCE = 0.001;

export const PRIZE_POOL = {
  /** Clienti: pagati in bitcoin, quantità fissa. */
  usersSats: 11_000_000,
  /** Commercianti: pagati in oro, quantità fissa. */
  merchantsXaut: 2,
  /** Equivalente in satoshi della quota commercianti, al rapporto di ancoraggio. */
  merchantsSatsEquivalent: 10_000_000,
};

export const TOTAL_SATS = PRIZE_POOL.usersSats + PRIZE_POOL.merchantsSatsEquivalent;

/**
 * Istante in cui l'equivalenza è stata fissata, scelto perché il mercato ci è passato sopra:
 * alle 16:35 del 30 settembre 2026 il rapporto valeva 19.9997, cioè tre decimillesimi dal
 * bersaglio. A quelle quotazioni 2.00 XAUT valevano 10'000'120 satoshi: centoventi satoshi
 * sopra i dieci milioni, dieci centesimi di dollaro.
 *
 * I dati sono pubblici e riverificabili: serie a cinque minuti di CoinGecko, le stesse due
 * fonti che il sito interroga dal vivo. Il regolamento cita istante, fonte e quotazioni,
 * così chiunque può rifare il conto.
 */
export const ANCHOR = {
  at: '2026-09-30T16:35:00+02:00',
  btcUsd: 83403,
  xautUsd: 4170.2,
  ratio: 19.9997,
  source: 'CoinGecko, serie a 5 minuti',
  /* Il regolamento inglese cita la stessa fonte: tradotta, non copiata in italiano. */
  sourceEn: 'CoinGecko, 5-minute series',
};

/** Quanto valevano davvero i 2.00 XAUT all'istante di ancoraggio: 10'000'120 sat. */
export const anchoredMerchantsSats = () =>
  Math.round((PRIZE_POOL.merchantsXaut * ANCHOR.xautUsd) / (ANCHOR.btcUsd / SATS_PER_BTC));

/** Scarto dal rapporto obiettivo: positivo se bitcoin è "caro" rispetto all'oro. */
export const ratioDrift = (btcUsd, xautUsd) => (btcUsd / xautUsd / TARGET_RATIO) - 1;

/** Quanti satoshi valgono davvero, adesso, i 2.00 XAUT dei commercianti. */
export const merchantsSatsNow = (btcUsd, xautUsd) =>
  Math.round((PRIZE_POOL.merchantsXaut * xautUsd) / (btcUsd / SATS_PER_BTC));

/** Il totale reale in satoshi al cambio corrente: è il numero che il sito mostra dal vivo. */
export const totalSatsNow = (btcUsd, xautUsd) =>
  PRIZE_POOL.usersSats + merchantsSatsNow(btcUsd, xautUsd);
