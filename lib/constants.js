// Parametri di campagna centralizzati: modificare qui per aggiornare tutta la landing.
/**
 * Il forum e l'iniziativa sono due cose distinte e vanno tenute separate in pagina:
 * il forum dura due giorni al Palazzo dei Congressi, l'iniziativa dura una settimana
 * e vive nei negozi della città.
 * Date confermate dal sito ufficiale: "PLAN ₿ FORUM, 23-24 OCTOBER 2026, LUGANO".
 */
import { formatNumber } from './number-format.js';
export const EVENT = {
  name: 'Plan ₿ Forum 2026',
  city: 'Lugano',
  venue: 'Palazzo dei Congressi',
  ticketsUrl: 'https://planb.lugano.ch/planb-forum/#tickets',
  // 23–24 ottobre 2026. Gli orari di apertura non sono pubblicati: si rimanda al ticketing.
  startsAt: '2026-10-23T00:00:00+02:00',
  endsAt: '2026-10-24T23:59:59+02:00',
};

export const CONTEST = {
  title: 'Paga in Crypto e Vinci Bitcoin',
  organizer: 'NAKA',
  /**
   * L'unico indirizzo email del sito: clienti, commercianti, privacy, mittente delle conferme.
   * NAKA non ha caselle dedicate al concorso, tutto arriva all'assistenza.
   */
  supportEmail: 'assistenza@naka.com',
  merchantSupportEmail: 'assistenza@naka.com',
  /** Assistenza telefonica NAKA (numero svizzero, prefisso 0 sostituito da +41 nei link). */
  merchantSupportPhone: '091 222 02 00',
  merchantSupportWhatsapp: '077 991 65 87',
  /**
   * Recensione Google del servizio NAKA, da proporre ai merchant soddisfatti.
   * Il QR mostrato dai rilevatori è generato da questo indirizzo: `npm run qr:review`.
   */
  googleReviewUrl: 'https://g.page/r/CfXzZF7MKDh_EAE/review',
  // Periodo di validità delle transazioni ammesse al concorso.
  // Sovrascrivibile via env per demo e staging (NEXT_PUBLIC_ perché serve anche al client).
  validFrom: process.env.NEXT_PUBLIC_CONTEST_VALID_FROM || '2026-10-19T08:00:00+02:00',
  validTo: process.env.NEXT_PUBLIC_CONTEST_VALID_TO || '2026-10-24T16:00:00+02:00',
  /**
   * Vero quando le date arrivano dall'ambiente invece che da qui.
   *
   * Serve a demo e staging, dove si anticipa l'apertura per poter compilare il modulo. Il
   * problema è che il countdown, da solo, non può saperlo: dice «iniziativa in corso» con la
   * stessa faccia con cui lo direbbe il 19 ottobre, e chi guarda la pagina crede che il
   * concorso sia partito. Quando è vero, la pagina lo dichiara.
   */
  isDemoWindow: Boolean(
    process.env.NEXT_PUBLIC_CONTEST_VALID_FROM || process.env.NEXT_PUBLIC_CONTEST_VALID_TO
  ),
  /**
   * Il giorno dell'estrazione e l'ora più presto in cui può avvenire. L'ora vera non la
   * decidiamo noi: dipende da quando la rete Bitcoin mina il blocco del seme (vedi `DRAW`).
   * Qui c'è l'inizio della finestra annunciata, che serve a dire «non prima di».
   */
  drawDate: '2026-10-24T17:00:00+02:00',
  /** Nessuna tolleranza: alle 16:00 le registrazioni chiudono, mezz'ora dopo si estrae. */
  graceMinutes: 0,
  /**
   * Ciclo di vita del sito: l'elenco dei vincitori resta online un mese dalla chiusura,
   * poi il sito viene ritirato e i dati personali cancellati (vedi `npm run entries purge`).
   */
  onlineUntil: '2026-11-24T23:59:59+01:00',
};

/**
 * Estrazione verificabile: tempi e regole del seme.
 *
 * L'ordine è tutto. Prima si impegnano pubblicamente gli elenchi, POI nasce il seme: se il
 * seme esistesse già quando si fissano gli elenchi, chi li fissa potrebbe scegliere chi
 * lasciare dentro guardando chi vincerebbe. Per questo il seme non è «il primo blocco dopo
 * la chiusura» — quello arriva in pochi minuti, mentre l'elenco si prepara — ma un blocco
 * annunciato DENTRO l'impegno, qualche posizione più avanti della cima della catena.
 *
 *   16:00  chiusura delle registrazioni
 *   16:30  al più tardi: elenchi, impronte e altezza del blocco-seme pubblicati (`commitBy`)
 *   +6     blocchi: viene minato il blocco-seme (in media un'ora, raramente più di due)
 *   +1     blocco sopra il seme: il seme è definitivo e si estrae
 *
 * Con 7 blocchi da attendere (6 + 1 di conferma) la rete impiega in media 70 minuti; nel
 * 95% dei casi meno di due ore. La finestra annunciata (`expectedFrom`–`expectedBy`) copre
 * praticamente tutti i casi; se la rete fosse più lenta si aspetta, e non cambia nulla.
 *
 * Le giocate non devono essere già convalidate per entrare nell'elenco: ci entrano tutte quelle
 * registrate in tempo e non respinte. La verifica sul POS si fa durante la settimana e, per chi
 * vince, prima di pagare: una giocata estratta che non la supera lascia il premio alla prima
 * riserva, nell'ordine già pubblicato. È ciò che permette di impegnare l'elenco subito dopo la
 * chiusura invece che a fine verifica, ore dopo.
 */
export const DRAW = {
  /** Entro quando si pubblica l'impegno sugli elenchi. */
  commitBy: '2026-10-24T16:30:00+02:00',
  /** Il seme è l'hash del blocco minato questo numero di posizioni dopo la cima al momento dell'impegno. */
  blocksAhead: 6,
  /** Blocchi da attendere SOPRA il seme prima di estrarre: uno basta a escludere i blocchi orfani più comuni. */
  confirmationsAbove: 1,
  /** Finestra in cui l'estrazione avviene in quasi tutti i casi. */
  expectedFrom: '2026-10-24T17:00:00+02:00',
  expectedBy: '2026-10-24T19:00:00+02:00',
  /** Riserve pubblicate per ogni estrazione, in ordine, oltre ai vincitori. */
  reserves: 10,
  /**
   * Due esploratori indipendenti, con la stessa API (Esplora): lo script accetta altezza e hash
   * solo se coincidono, così un servizio guasto o compromesso non può decidere il seme.
   */
  explorers: ['https://mempool.space/api', 'https://blockstream.info/api'],
  /** Pagina pubblica di un blocco, per chi vuole controllare il seme senza strumenti. */
  blockUrl: (height) => `https://mempool.space/block/${height}`,
};

/**
 * Asset accettati sui POS aderenti. Unica fonte per i testi e per le statistiche in pagina.
 *
 * XAUT è accettato sui POS NAKA oltre a essere l'asset del premio (confermato dal team).
 * Nella crypto map della Città i singoli esercenti risultano invece su BTC e USDt soltanto:
 * le etichette sulle schede riflettono quella fonte, questo elenco riflette il circuito NAKA.
 */
export const PAYMENT_ASSETS = [
  { code: 'BTC', label: 'Bitcoin', short: 'BTC', networks: ['Lightning'] },
  // `label` è il nome mostrato (USD₮, la grafia di Tether); `short` resta USDt perché è il valore
  // già salvato nelle risposte delle rilevazioni: cambiarlo lascerebbe orfane quelle risposte.
  { code: 'USDT', label: 'USD₮', short: 'USDt', networks: ['Ethereum', 'Polygon'] },
  { code: 'XAUT', label: 'Tether Gold', short: 'XAUT', networks: ['Ethereum'] },
];

/** "Bitcoin, USDt o Tether Gold" */
export const assetSentence = (conjunction = 'o') => {
  const labels = PAYMENT_ASSETS.map((a) => a.label);
  return `${labels.slice(0, -1).join(', ')} ${conjunction} ${labels[labels.length - 1]}`;
};

/** Gli importi si scrivono sempre con due decimali, come un valore monetario: "4.20 XAUT". */
/**
 * Ultimo valore noto di XAUT, usato se la quotazione in tempo reale non è raggiungibile.
 * Va aggiornato di tanto in tanto: la data mostrata in pagina è questa.
 */
export const XAUT_FALLBACK = { usd: 4271.33, chf: 3541.75, at: '2026-09-25T08:00:00+02:00' };


export const formatXaut = (amount, locale = 'it') =>
  `${formatNumber(amount, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAUT`;

/**
 * Premi dei COMMERCIANTI, in Tether Gold. I premi dei clienti sono in satoshi e stanno in
 * `lib/bitcoin.js`: è la divisione portante dell'iniziativa — chi paga vince bitcoin, chi
 * offre il pagamento vince oro — e le due quote si incontrano solo in `lib/campaigns.js`.
 *
 * `amount` è la quantità per singolo vincitore e `count` il numero di vincitori: montepremi e
 * numero di premiati sono derivati da qui, così le cifre in pagina e quelle del regolamento
 * non possono divergere.
 *
 * `assignment` dice come si assegna il premio:
 *   draw   — estrazione casuale verificabile (scripts/draw.mjs)
 *   transactions — classifica oggettiva sul numero di transazioni registrate dal POS NAKA
 *   jury   — valutazione della giuria (vedi /commercianti)
 */
const PRIZE_TIERS = {
  merchants: {
    items: [
      {
        // Conta il numero di pagamenti ricevuti, non l'importo incassato: un premio sul
        // numero (e non più sull'importo) mette un bar con cento caffè alla pari con una gioielleria.
        place: 'Top Numero Transazioni',
        amount: 1,
        asset: 'XAUT',
        count: 1,
        assignment: 'transactions',
        desc: 'Al merchant che riceve il maggior numero di transazioni crypto sul POS NAKA nel periodo di gara',
      },
      {
        place: 'Best Social Content',
        amount: 0.5,
        asset: 'XAUT',
        count: 1,
        assignment: 'jury',
        desc: 'Al miglior contenuto pubblicato con gli hashtag ufficiali e i tag dei canali NAKA e Plan ₿',
      },
      {
        // Due premi da 0.25 invece di uno da 0.50: a parità di spesa raddoppiano le probabilità
        // di vincere, e per un negoziante «posso vincere» conta più di «posso vincere tanto».
        place: 'Estrazione Riservata Merchant',
        amount: 0.25,
        asset: 'XAUT',
        count: 2,
        assignment: 'draw',
        desc: 'Due estrazioni tra tutti i merchant con almeno 1 transazione crypto registrata',
      },
    ],
  },
};

/** Arrotondamento a 2 decimali: evita i residui in virgola mobile (0.1 × 12). */
const round2 = (n) => Math.round(n * 100) / 100;

const withTotals = (tier) => ({
  ...tier,
  pool: round2(tier.items.reduce((sum, i) => sum + i.amount * i.count, 0)),
  winners: tier.items.reduce((sum, i) => sum + i.count, 0),
});

export const PRIZES = {
  merchants: withTotals(PRIZE_TIERS.merchants),
};

/** Montepremi e vincitori della quota in oro. Il totale delle due quote sta in campaigns.js. */
export const MERCHANTS_XAUT = PRIZES.merchants.pool;
export const MERCHANTS_WINNERS = PRIZES.merchants.winners;

/**
 * Premio "Best Social Content": regole operative del contest creativo riservato ai merchant.
 * ATTENZIONE: gli handle social di NAKA sono segnaposto — vanno confermati dal team prima del
 * go-live. Quelli di Plan ₿ Lugano sono ripresi dal sito ufficiale planb.lugano.ch.
 */
/**
 * Canali ufficiali. Lo slug LinkedIn di NAKA (`nakafinances`) è quello usato nei post
 * aziendali pubblici; gli handle Instagram/TikTok restano da confermare al team.
 */
export const OFFICIAL_CHANNELS = {
  linkedin: { label: 'NAKA su LinkedIn', url: 'https://www.linkedin.com/company/nakafinances/' },
  planbInstagram: { label: '@luganoplanb', url: 'https://www.instagram.com/luganoplanb' },
  planbX: { label: '@LuganoPlanB', url: 'https://x.com/LuganoPlanB' },
};

export const SOCIAL_CONTEST = {
  /** I video vanno pubblicati entro venerdì 23: l'ultimo giorno serve a votare e valutare. */
  publishDeadline: '2026-10-23T23:59:59+02:00',
  /*
   * Un hashtag solo per tutta la campagna, clienti e commercianti insieme. Era
   * #PayCryptoWinGold, da quando l'oro era il premio di tutti: oggi i clienti vincono
   * satoshi, e un negoziante che pubblica un contenuto sta promuovendo proprio quello.
   * Due hashtag spezzerebbero in due la presenza social della settimana per separare
   * contenuti che la giuria distingue comunque — i commercianti ci mandano il link.
   */
  hashtags: ['#PayCryptoWinBitcoin', '#LuganoPlanB', '#Naka'],
  mentions: [
    { platform: 'LinkedIn', handle: 'NAKA', url: 'https://www.linkedin.com/company/nakafinances/' },
    { platform: 'Instagram', handle: '@luganoplanb', url: 'https://www.instagram.com/luganoplanb' },
    { platform: 'X', handle: '@LuganoPlanB', url: 'https://x.com/LuganoPlanB' },
  ],
  /**
   * Piattaforme ammesse. Su LinkedIn si può anche taggare direttamente la pagina NAKA;
   * X è in elenco perché Lugano Plan ₿ ha un profilo attivo e il pubblico bitcoin vive lì.
   */
  platforms: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X'],
  specs: {
    minSeconds: 15,
    maxSeconds: 60,
    // Solo il rapporto: «verticale» / «portrait» sta nei dizionari, nella lingua della pagina.
    ratio: '9:16',
    minResolution: '1080 × 1920 px',
  },
  // Selezione, idee e cose da evitare stanno nei dizionari (video.*): sono testi, e le copie
  // qui erano rimaste indietro rispetto alla pagina.
};

/**
 * Da numero svizzero in formato locale a formato internazionale: "091 222 02 00" -> "+41912220200".
 * Serve perché `tel:` e wa.me funzionino anche da un telefono estero, cioè da chi è al forum.
 */
export const toInternational = (phone) => `+41${phone.replace(/\D/g, '').replace(/^0/, '')}`;
export const whatsappUrl = (phone) => `https://wa.me/${toInternational(phone).replace('+', '')}`;

