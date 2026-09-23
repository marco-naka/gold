// Parametri di campagna centralizzati: modificare qui per aggiornare tutta la landing.
export const EVENT = {
  name: 'Plan ₿ Forum 2026',
  city: 'Lugano',
  venue: 'Palazzo dei Congressi, Lugano',
  // Date ufficiali dell'evento (ISO, fuso Europe/Zurich). Aggiornare se cambiano.
  startsAt: '2026-10-23T09:00:00+02:00',
  endsAt: '2026-10-24T20:00:00+02:00',
};

export const CONTEST = {
  title: 'Paga in Crypto e Vinci Oro Digitale',
  organizer: 'NAKA',
  supportEmail: 'contest@naka.com',
  merchantEmail: 'merchants@naka.com',
  /** Assistenza dedicata ai commercianti. */
  merchantSupportEmail: 'assistenza@naka.com',
  /** TODO: numero di assistenza NAKA — finché è vuoto la riga non viene mostrata. */
  merchantSupportPhone: '',
  /** Recensione Google del servizio NAKA, da proporre ai merchant soddisfatti. */
  googleReviewUrl: 'https://g.page/r/CfXzZF7MKDh_EBI/review',
  // Periodo di validità delle transazioni ammesse al concorso.
  // Sovrascrivibile via env per demo e staging (NEXT_PUBLIC_ perché serve anche al client).
  validFrom: process.env.NEXT_PUBLIC_CONTEST_VALID_FROM || '2026-10-19T08:00:00+02:00',
  validTo: process.env.NEXT_PUBLIC_CONTEST_VALID_TO || '2026-10-24T16:00:00+02:00',
  drawDate: '2026-11-06T15:00:00+01:00',
  /** L'iniziativa dura l'intera settimana del forum: da lunedì a sabato a mezzogiorno-pomeriggio. */
  weekLabel: 'da lunedì 19 ottobre alle 08:00 a sabato 24 ottobre alle 16:00',
  weekLabelEn: 'from Monday 19 October at 8 am to Saturday 24 October at 4 pm',
};

/**
 * Asset accettati sui POS aderenti. Unica fonte per i testi e per le statistiche in pagina.
 * NB: nei dati della crypto map cittadina i merchant risultano accettare BTC e USDt;
 * XAUT è confermato da NAKA come asset di pagamento oltre che come premio.
 */
export const PAYMENT_ASSETS = [
  { code: 'BTC', label: 'Bitcoin (Lightning)', short: 'BTC/LN' },
  { code: 'USDT', label: 'USDt', short: 'USDt' },
  { code: 'XAUT', label: 'XAUT', short: 'XAUT' },
];

/** "Bitcoin (Lightning), USDt o XAUT" */
export const assetSentence = (conjunction = 'o') => {
  const labels = PAYMENT_ASSETS.map((a) => a.label);
  return `${labels.slice(0, -1).join(', ')} ${conjunction} ${labels[labels.length - 1]}`;
};

/** Gli importi si scrivono sempre con due decimali, come un valore monetario: "4.20 XAUT". */
export const formatXaut = (amount) =>
  `${Number(amount).toLocaleString('it-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAUT`;

/**
 * Premi in Tether Gold. `amount` è la quantità per singolo vincitore e `count` il numero di
 * vincitori: i montepremi e il numero totale di premiati sono derivati da qui, così le cifre
 * mostrate in pagina e quelle del regolamento non possono divergere.
 *
 * `assignment` dice come si assegna il premio:
 *   draw   — estrazione casuale verificabile (scripts/draw.mjs)
 *   volume — classifica oggettiva sui volumi registrati dal POS NAKA
 *   jury   — valutazione della giuria (vedi /best-social-video)
 */
const PRIZE_TIERS = {
  users: {
    items: [
      { place: '1° Premio', amount: 2, count: 1, assignment: 'draw', desc: 'Estrazione principale tra tutte le giocate valide' },
      { place: '2° Premio', amount: 1, count: 1, assignment: 'draw', desc: 'Seconda estrazione tra le giocate valide' },
      { place: '3°–14° Premio', amount: 0.1, count: 12, assignment: 'draw', desc: '12 premi consolazione estratti a sorte' },
    ],
  },
  merchants: {
    items: [
      {
        place: 'Top Volume Transazioni',
        amount: 1,
        count: 1,
        assignment: 'volume',
        desc: 'Al merchant con il più alto volume di incassi crypto su POS NAKA nel periodo di gara',
      },
      {
        place: 'Best Social Video',
        amount: 0.5,
        count: 1,
        assignment: 'jury',
        desc: 'Al miglior contenuto video promozionale pubblicato con #PagaInCryptoLugano e tag @naka',
      },
      {
        place: 'Estrazione Riservata Merchant',
        amount: 0.5,
        count: 1,
        assignment: 'draw',
        desc: 'Estrazione tra tutti i merchant con almeno 1 transazione crypto registrata',
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
  users: withTotals(PRIZE_TIERS.users),
  merchants: withTotals(PRIZE_TIERS.merchants),
};

/** Montepremi complessivo e numero di vincitori, derivati dai premi. */
export const TOTAL_POOL = round2(PRIZES.users.pool + PRIZES.merchants.pool);
export const TOTAL_WINNERS = PRIZES.users.winners + PRIZES.merchants.winners;

/**
 * Premio "Best Social Video": regole operative del contest creativo riservato ai merchant.
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
  hashtags: ['#PayCryptoWinGold', '#LuganoPlanB', '#Naka'],
  mentions: [
    { platform: 'LinkedIn', handle: 'NAKA', url: 'https://www.linkedin.com/company/nakafinances/' },
    { platform: 'Instagram', handle: '@luganoplanb', url: 'https://www.instagram.com/luganoplanb' },
    { platform: 'X', handle: '@LuganoPlanB', url: 'https://x.com/LuganoPlanB' },
  ],
  /** Piattaforme ammesse. Su LinkedIn si può anche taggare direttamente la pagina NAKA. */
  platforms: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn'],
  /** Non solo video: vale qualunque contenuto che attiri davvero l'attenzione. */
  contentTypes: ['video', 'post', 'image'],
  specs: {
    minSeconds: 15,
    maxSeconds: 60,
    ratio: '9:16 verticale',
    minResolution: '1080 × 1920 px',
  },
  /**
   * Selezione in due fasi: il pubblico decide quali video entrano in finale,
   * la giuria sceglie il preferito tra quelli.
   */
  selection: [
    {
      phase: 'Fase 1 — Il pubblico',
      title: 'I video di maggior successo vanno in finale',
      desc: 'Contano visualizzazioni, like, commenti e condivisioni raccolti entro la chiusura dell\u2019iniziativa. I contenuti che hanno ottenuto il riscontro più alto formano la rosa dei finalisti.',
    },
    {
      phase: 'Fase 2 — La giuria',
      title: 'Tra i finalisti vince quello che piace di più',
      desc: 'Tra i video in finale, la giuria NAKA premia quello che racconta meglio l\u2019iniziativa: idea, simpatia, chiarezza del pagamento in crypto e capacità di far venire voglia di provarci.',
    },
  ],
  ideas: [
    {
      title: 'Il pagamento in 10 secondi',
      desc: 'Primo piano sul POS: QR, scansione, conferma. Nessun parlato, solo il suono della conferma e una scritta finale.',
      why: 'Il formato più condiviso: dimostra che pagare in crypto è più rapido della carta.',
    },
    {
      title: 'Prima volta',
      desc: 'Un cliente che non ha mai pagato in crypto lo fa davanti alla telecamera, con la sua reazione a fine transazione.',
      why: 'La faccia di chi scopre una cosa nuova vale più di qualsiasi spiegazione.',
    },
    {
      title: 'Crypto vs contanti',
      desc: 'Schermo diviso: due clienti pagano lo stesso conto, uno in contanti e uno in Lightning. Cronometro a vista.',
      why: 'Formato a gara: tiene lo spettatore fino alla fine per vedere chi vince.',
    },
    {
      title: 'Il tuo prodotto in oro',
      desc: 'Il piatto, il taglio di capelli o il prodotto del negozio raccontato in chiave "oro": luce calda, dettagli, chiusura sul pagamento.',
      why: 'Lega il tuo prodotto al tema del concorso senza sembrare uno spot.',
    },
    {
      title: 'Dietro il bancone',
      desc: 'Il titolare spiega in prima persona perché ha scelto di accettare crypto e cosa è cambiato in negozio.',
      why: 'Autenticità: funziona bene con il pubblico locale e con i media.',
    },
    {
      title: 'Tour del quartiere',
      desc: 'Una camminata tra più negozi aderenti della stessa via, un pagamento per tappa.',
      why: 'Collabori con i vicini e moltiplicate la portata pubblicando tutti lo stesso video.',
    },
    {
      title: 'Turista al forum',
      desc: 'Un partecipante del Plan ₿ Forum arriva in negozio e paga in Lightning senza avere franchi in tasca.',
      why: 'Racconta il motivo per cui l\u2019iniziativa esiste, nella settimana in cui la città è piena di visitatori.',
    },
    {
      title: 'Errori da evitare',
      desc: 'Tono ironico: tutti i modi sbagliati di pagare, e poi quello giusto sul POS NAKA.',
      why: 'L\u2019umorismo è il contenuto che viene salvato e rimandato agli amici.',
    },
  ],
  avoid: [
    'Musica protetta da copyright: fa rimuovere il video e ti esclude dal premio',
    'Riprendere clienti o dipendenti senza il loro consenso',
    'Mostrare QR code, importi o dati di transazioni reali di altri clienti',
    'Promesse di vincita o messaggi che facciano passare il concorso per una lotteria garantita',
    'Video ripubblicati da altri o contenuti generati senza alcuna ripresa originale in negozio',
  ],
};

export const MAILTO_MERCHANT = `mailto:${CONTEST.merchantEmail}?subject=${encodeURIComponent(
  'Adesione concorso "Paga in Crypto e Vinci Oro Digitale" - Plan B Forum 2026'
)}&body=${encodeURIComponent(
  [
    'Buongiorno Team NAKA,',
    '',
    'confermo l’adesione della mia attività al concorso "Paga in Crypto e Vinci Oro Digitale" durante il Plan ₿ Forum 2026 di Lugano.',
    '',
    'Nome attività: ',
    'Indirizzo a Lugano: ',
    'Categoria (Ristorazione / Shopping / Hotel / Servizi): ',
    'Referente e telefono: ',
    'ID terminale POS NAKA (se disponibile): ',
    '',
    'Il POS NAKA resta acceso e operativo per tutta la durata dell’evento.',
    '',
    'Cordiali saluti,',
  ].join('\n')
)}`;
