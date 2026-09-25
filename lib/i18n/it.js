/** Testi italiani. Le chiavi devono restare allineate a en.js (verificato da un test). */
const it = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Paga in Crypto e Vinci Oro Digitale',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning), USDt o XAUT". */
    assetsConjunction: 'o',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Paga in crypto nei merchant aderenti di Lugano e vinci Oro Digitale in Tether Gold (XAUT).',
    ogDescription: 'Paga in crypto sui POS NAKA e partecipa all’estrazione in Tether Gold (XAUT).',
    skipLink: 'Vai al modulo di partecipazione',
    languageLabel: 'Scelta della lingua',
    languageName: 'Italiano',
    switchTo: 'English',
  },

  nav: {
    howItWorks: 'Come Funziona',
    prizes: 'Montepremi',
    map: 'Mappa Merchant',
    upload: 'Carica Scontrino',
    rules: 'Regolamento',
    cta: 'Partecipa Ora',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    home: 'NAKA - Home',
  },

  hero: {
    titleLead: 'Paga in Crypto a Lugano e vinci',
    titleGold: 'ORO Digitale!',
    subtitle: (event) =>
      `Paga i tuoi acquisti in crypto nei negozi di Lugano con POS NAKA e partecipa all’estrazione di premi in Tether Gold (XAUT). Nella settimana del ${event}.`,
    ctaUpload: 'Carica Scontrino e TX ID',
    ctaMap: 'Trova Negozi Aderenti',
    area: 'Lugano',
    forumStrip: (event, dates, venue) => `${event} · ${dates} · ${venue}`,
    forumTickets: 'Biglietti del forum',
    forumNote: 'Il forum dura due giorni al Palazzo dei Congressi. L’iniziativa dura tutta la settimana nei negozi della città.',
    statMerchants: 'Merchant sul circuito NAKA a Lugano',
    statAssets: (assets) => `Asset accettati: ${assets}`,
    statPool: 'Montepremi totale in Oro Digitale',
    rowUsers: 'Montepremi Clienti',
    rowMerchants: 'Montepremi Merchant',
    rowAsset: 'Asset del premio',
    rowAssetValue: 'Tether Gold · 1 XAUT = 1 oz oro',
    disclaimer:
      'XAUT è un token garantito da oro fisico custodito in Svizzera. Il valore in CHF può variare con il mercato.',
  },

  countdown: {
    loading: 'Caricamento countdown…',
    toStart: 'Mancano al via dell’iniziativa',
    running: 'Iniziativa in corso — tempo residuo per giocare',
    ended: 'Concorso chiuso — estrazione in preparazione',
    days: 'Giorni',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
  },

  dual: {
    eyebrow: 'Doppia iniziativa',
    title: 'Un concorso, due modi per vincere oro',
    subtitle: 'Clienti e commercianti partecipano a due montepremi distinti in Tether Gold (XAUT).',
    users: {
      kicker: 'Iniziativa Clienti',
      title: 'Per chi Acquista',
      points: (assets) => [
        `Paga in ${assets} sul POS NAKA`,
        'Registra la transazione con TX ID e foto dello scontrino',
        'Partecipi automaticamente all’estrazione in Oro Digitale',
        'Nessun limite: ogni transazione valida = 1 giocata',
        'Si somma al cashback del circuito cittadino MyLugano',
      ],
      cta: 'Registra la tua giocata',
    },
    merchants: {
      kicker: 'Iniziativa Merchant',
      title: 'Per i Commercianti',
      points: () => [
        'Aumenta le vendite durante la settimana del Plan ₿ Forum',
        'Premio Top Volume di transazioni crypto',
        'Premio per il miglior video social promozionale',
        'Estrazione riservata a tutti i merchant con almeno 1 transazione',
      ],
      cta: 'Scopri come aderire',
    },
  },

  how: {
    eyebrow: 'Come funziona',
    title: 'Tre step, meno di un minuto',
    subtitle: 'Dal pagamento alla giocata valida senza registrazioni complesse né app da scaricare.',
    steps: (assets) => [
      {
        title: 'Paga in Crypto',
        text: `Effettua un acquisto su POS NAKA presso un merchant aderente all’iniziativa, in ${assets}.`,
      },
      {
        title: 'Registra la Transazione',
        text: 'Inserisci l’ID transazione (TX ID) e carica la foto dello scontrino/ricevuta POS nel modulo qui sotto. Il negozio è facoltativo.',
      },
      {
        title: 'Vinci Tether Gold (XAUT)',
        text: 'Ricevi la conferma con il tuo ID giocata e partecipa all’estrazione dei premi in Oro Digitale.',
      },
    ],
    guideTitle: 'Non hai mai pagato in crypto sui POS?',
    guideText:
      'Il circuito Plan ₿ di Lugano ha già una guida ufficiale che spiega come funziona il pagamento in negozio, quali asset sono accettati e come procurarsi BTC e USD₮ in città.',
    guideWallets: 'Wallet Lightning consigliati:',
    guideCta: 'Guida ufficiale Plan ₿',
    guideCtaOther: 'Read it in English',
  },

  prizes: {
    eyebrow: 'Montepremi',
    title: (pool) => `${pool} di Oro Digitale in palio`,
    subtitle: (winners) =>
      `${winners} premi in palio, divisi in due montepremi separati: uno per i clienti che pagano in crypto, uno per i merchant aderenti.`,
    usersKicker: 'Sezione Clienti',
    merchantsKicker: 'Sezione Merchant',
    usersNote: 'Montepremi complessivo riservato ai clienti finali',
    merchantsNote: 'Montepremi complessivo riservato ai merchant aderenti',
    poolLabel: 'montepremi',
    videoLink: 'Regole, hashtag e idee per il video',
    note: (date) =>
      `Estrazione pubblica prevista il ${date}. I premi sono erogati in Tether Gold (XAUT) sull’indirizzo comunicato dal vincitore. Il controvalore in CHF può variare in funzione del prezzo dell’oro.`,
    items: {
      '1° Premio': { place: '1° Premio', desc: 'Estrazione principale tra tutte le giocate valide' },
      '2° Premio': { place: '2° Premio', desc: 'Seconda estrazione tra le giocate valide' },
      '3°–14° Premio': { place: '3°–14° Premio', desc: '12 premi consolazione estratti a sorte' },
      'Top Volume Transazioni': {
        place: 'Top Volume Transazioni',
        desc: 'Al merchant con il più alto volume di incassi crypto su POS NAKA nel periodo di gara',
      },
      'Best Social Content': {
        place: 'Best Social Content',
        desc: 'Al miglior contenuto video promozionale pubblicato con gli hashtag ufficiali',
      },
      'Estrazione Riservata Merchant': {
        place: 'Estrazione Riservata Merchant',
        desc: 'Estrazione tra tutti i merchant con almeno 1 transazione crypto registrata',
      },
    },
  },

  form: {
    eyebrow: 'Registra la giocata',
    title: 'Carica Scontrino e TX ID',
    subtitle:
      'Inserisci il numero della transazione e la foto dello scontrino: servono entrambi per convalidare la giocata.',
    email: 'La tua email',
    emailHint: 'Ti contattiamo qui se vinci: è l’unico dato che ti serve per essere raggiungibile.',
    emailPlaceholder: 'nome@dominio.ch',
    proofLegend: 'Prova d’acquisto',
    proofIntro: ['Servono', 'entrambe', ': il numero della transazione per il riscontro automatico sul POS e la foto dello scontrino per la verifica documentale.'],
    txLabel: 'Ultime 6 cifre del n° transazione',
    txHint: 'Bastano le ultime 6: le trovi in fondo alla riga «N° TRANSAZIONE» della ricevuta.',
    txPlaceholder: 'es. 0adca2',
    amountLabel: 'Importo',
    amountHint: 'Il totale pagato, come sulla ricevuta.',
    amountPlaceholder: 'es. 0.10',
    receiptLabel: 'Foto dello scontrino',
    receiptCta: 'Tocca per scattare o caricare',
    receiptFormats: (mb) => `JPG, PNG, WEBP, HEIC o PDF — max ${mb} MB`,
    receiptRemove: 'Rimuovi allegato',
    merchantLabel: 'Negozio',
    merchantOptional: '(facoltativo)',
    merchantHint:
      'Se lo indichi velocizzi la verifica. Scrivilo liberamente: i suggerimenti arrivano dalla mappa del circuito.',
    merchantPlaceholder: 'Inizia a scrivere il nome del negozio…',
    confirmAge: 'Dichiaro di aver compiuto 18 anni e di conservare lo scontrino originale.',
    acceptRulesBefore: 'Accetto il ',
    acceptRulesLink: 'Regolamento Ufficiale e l’Informativa Privacy (LPD/GDPR)',
    submit: 'Invia e Partecipa',
    submitting: 'Verifica in corso…',
    footnote:
      'Lo stesso numero di transazione può essere registrato una sola volta. Le giocate sono sottoposte a controllo incrociato con i dati del POS NAKA. L’indirizzo per ricevere il premio in XAUT ti verrà richiesto via email solo in caso di vincita.',
    networkError: 'Connessione non disponibile. Verifica la rete e riprova.',
    genericError: 'Invio non riuscito. Riprova tra qualche istante.',
    errors: {
      email_invalid: 'Inserisci un indirizzo email valido (es. nome@dominio.ch).',
      tx_missing: 'Inserisci il numero della transazione: lo trovi sulla ricevuta del POS o nel tuo wallet.',
      tx_invalid: 'Numero transazione non valido: copialo dalla ricevuta o dal wallet (min. 6 caratteri).',
      tx_duplicate: 'Queste cifre e questo importo risultano già registrati. Se non sei stato tu, scrivici: la giocata viene verificata a mano.',
      amount_missing: 'Inserisci l’importo totale che hai pagato.',
      amount_invalid: 'Importo non valido: scrivilo come sulla ricevuta, per esempio 0.10 oppure 84.50.',
      receipt_missing: 'Carica la foto dello scontrino o della ricevuta POS.',
      receipt_type: 'Formato non supportato: carica JPG, PNG, WEBP, HEIC o PDF.',
      receipt_size: 'File troppo pesante: massimo 8 MB.',
      merchant_too_long: 'Nome negozio troppo lungo (max 120 caratteri).',
      age_required: 'Devi dichiarare la maggiore età e la conservazione dello scontrino.',
      rules_required: 'Devi accettare Regolamento e Informativa Privacy per partecipare.',
    },
    apiErrors: {
      invalid_fields: 'Alcuni campi non sono validi: controlla il modulo.',
      duplicate_tx: 'Questa transazione risulta già registrata.',
      rate_limited: 'Troppe registrazioni ravvicinate. Riprova tra qualche minuto.',
      storage_error: 'Non siamo riusciti a salvare lo scontrino. Riprova tra qualche istante.',
      bad_request: 'Richiesta non valida.',
      demo: 'Questa è un’anteprima del sito: le registrazioni non sono ancora attive. Nessun dato viene salvato.',
    },
    proof: {
      tx_and_receipt: 'Numero transazione + scontrino',
    },
    honeypot: 'Azienda (non compilare)',
    trust: {
      title: 'Chi eroga i premi',
      text: (organizer) =>
        `${organizer} è il circuito di pagamento che alimenta i POS crypto dei negozi di Lugano. Il concorso è promosso e i premi sono erogati direttamente da ${organizer}: i tuoi dati non vengono ceduti a nessun altro.`,
      link: 'naka.com',
    },

    txHelp: {
      toggle: 'Dove trovo questo numero?',
      text: 'Sulla ricevuta NAKA cerca la voce «N° TRANSAZIONE», stampata su due righe sopra il terminale. Ti servono solo le ultime 6 cifre, cioè la fine della seconda riga: nell’esempio b72134bf088d4df88eaf5 5c3b90adca2 sono 0adca2. Se preferisci incollare il numero intero, va bene lo stesso.',
      receiptLabel: 'NAKA',
    },

    closed: {
      demoTitle: 'Anteprima del sito',
      demoText:
        'Stai guardando una versione dimostrativa: il modulo di partecipazione verrà attivato all’apertura del concorso. Nessun dato viene raccolto.',
      upcomingTitle: 'Le registrazioni non sono ancora aperte',
      upcomingText: (date) =>
        `Potrai registrare le tue giocate dal ${date}. Nel frattempo scopri i negozi aderenti.`,
      closedTitle: 'Registrazioni chiuse',
      closedText: (date) =>
        `Il termine per registrare le giocate è scaduto il ${date}. I vincitori vengono avvisati via email.`,
      cta: 'Vedi i negozi aderenti',
    },
    modal: {
      title: 'Giocata registrata!',
      subtitle: 'Conserva lo scontrino originale fino alla comunicazione dei vincitori.',
      idLabel: 'Il tuo ID giocata è',
      copied: 'Copiato negli appunti',
      rowEmail: 'Email',
      rowProof: 'Prova d’acquisto',
      rowTx: 'Ultime 6 cifre',
      rowAmount: 'Importo',
      rowMerchant: 'Negozio',
      rowDate: 'Registrata il',
      rowStatus: 'Stato',
      statusValue: 'In verifica sul backend POS NAKA',
      emailSent: (email) => `Abbiamo inviato la conferma a ${email} con il riepilogo della giocata. Se non la trovi, controlla la posta indesiderata.`,
      nextSteps:
        'Riceverai una seconda email alla convalida. In caso di vincita ti chiederemo l’indirizzo wallet su cui accreditare il premio in XAUT: NAKA non chiede mai chiavi private o frasi di recupero.',
      close: 'Ho capito',
    },
  },

  map: {
    eyebrow: 'Mappa merchant',
    title: 'Dove pagare in crypto a Lugano',
    subtitle: (event) =>
      `Gli esercenti del circuito NAKA a Lugano, attivi durante la settimana del ${event}.`,
    searchPlaceholder: 'Cerca per nome o via…',
    searchLabel: 'Cerca merchant',
    clearSearch: 'Cancella ricerca',
    resultsOne: 'merchant trovato',
    resultsMany: 'merchant trovati',
    inCategory: (category) => ` in "${category}"`,
    showMore: (n) => `Mostra altri ${n} merchant`,
    emptyTitle: 'Nessun merchant trovato',
    emptyText: 'Prova con un altro nome, via o categoria.',
    directions: 'Indicazioni Mappa',
    website: 'Sito',
    badgeVerified: 'POS NAKA Attivo',
    badgeCircuit: 'Circuito NAKA',
    badgePending: 'Attivazione in corso',
    badgeVerifiedTitle: 'Adesione al concorso confermata da NAKA',
    badgeCircuitTitle:
      'Accetta crypto sul circuito NAKA secondo la mappa della Città; adesione al concorso da confermare',
    zoneTitle: 'Zona selezionata',
    zoneClear: 'Mostra tutti',
    zoneCount: (n) => `${n} negozi in questa zona`,
    outsideCore: 'Fuori dal centro',
    mapLegend: 'I punti raggruppano i negozi vicini: tocca un punto per vedere quali sono.',
    center: 'Lugano centro',
    closeCard: 'Chiudi scheda merchant',
    sourcePrefix: 'Elenco derivato dalla ',
    sourceSuffix: (date) => ` · aggiornato al ${date}. L’attivazione del POS NAKA per il concorso è confermata dal team NAKA.`,
    categories: {
      all: 'Tutti',
      food: 'Ristoranti & Bar',
      shopping: 'Shopping',
      hotel: 'Hotel',
      services: 'Servizi',
    },
  },

  b2b: {
    eyebrow: 'Area Commercianti',
    titleLead: 'Sei un commerciante di',
    titleGold: 'Lugano',
    text: 'Per aderire non serve alcuna procedura complessa: ti basta rispondere direttamente all’email di invito ricevuta da NAKA e tenere acceso il tuo POS.',
    perks: (pool) => [
      'Zero procedure: rispondi all’email di invito NAKA',
      'Visibilità sulla mappa ufficiale del concorso',
      `${pool} di premi riservati ai merchant aderenti`,
    ],
    cta: 'Invia Email di Adesione',
    ctaGuide: 'Guida per i commercianti',
    ctaVideo: 'Premio Best Social Content',
    merchantJoin: {
      question: 'Non hai ricevuto l’email di invito?',
      cta: 'Chiedi di aderire',
      subject: 'Richiesta di adesione all’iniziativa',
      body: [
        'Buongiorno Team NAKA,',
        '',
        'non ho ricevuto l’email di invito ma vorrei aderire all’iniziativa con la mia attività.',
        '',
        'Nome attività: ',
        'Indirizzo a Lugano: ',
        'Referente e telefono: ',
        'Ho già un POS NAKA (sì / no): ',
        '',
        'Cordiali saluti,',
      ],
    },

    checklistTitle: 'Checklist adesione',
    checklist: [
      'Rispondi all’email di invito NAKA confermando i dati dell’attività.',
      'Verifica che il POS NAKA sia acceso e aggiornato.',
      'Esponi il materiale promozionale che riceverai dal team.',
      'Incassa in crypto durante la settimana del forum: ogni transazione conta.',
    ],
  },

  faq: {
    eyebrow: 'FAQ & Assistenza',
    title: 'Domande frequenti',
    helpTitle: 'Non hai trovato la risposta?',
    helpText: 'Il team assistenza risponde entro 24 ore lavorative.',
    helpCta: 'Contatta l’assistenza',
    items: [
      {
        q: 'Quali criptovalute posso usare su POS NAKA?',
        a: 'Sui POS NAKA si paga in Bitcoin su rete Lightning (BTC), Tether (USD₮) e Tether Gold (XAUT); molti accettano anche LVGA, che però non dà diritto alla partecipazione al concorso. Ogni merchant può abilitare uno o più asset: la disponibilità è indicata sulla scheda del negozio nella mappa.',
      },
      {
        q: 'Non ho ancora un wallet: come faccio a pagare?',
        a: 'Ti serve un wallet che supporti la rete Lightning. Il circuito Plan ₿ consiglia Bitkit, Breez e Wallet of Satoshi: trovi i tutorial ufficiali nella sezione "Come funziona" di questa pagina. La configurazione richiede pochi minuti e non serve alcun conto bancario.',
      },
      {
        q: 'Il concorso si somma al cashback MyLugano?',
        a: 'Sì. Il cashback riconosciuto dal circuito cittadino tramite l’app MyLugano resta invariato: la partecipazione al concorso NAKA è un vantaggio aggiuntivo che non sostituisce né riduce le promozioni della Città di Lugano.',
      },
      {
        q: 'Come vengono accreditati i premi in Tether Gold?',
        a: 'Non serve indicare alcun wallet per partecipare. Se risulti vincitore ti scriviamo all’email della giocata e ti chiediamo in quel momento l’indirizzo (wallet compatibile con XAUT o container NAKA) su cui accreditare il premio, trasferito entro 30 giorni. Un indirizzo errato non consente il recupero dei fondi.',
      },
      {
        q: 'Devo conservare lo scontrino cartaceo?',
        a: 'Sì. La fotografia dello scontrino è obbligatoria già in fase di giocata, e l’originale va conservato fino alla comunicazione dei vincitori: in caso di vincita ne viene richiesta esibizione prima dell’erogazione del premio. Senza scontrino originale la giocata viene annullata e si procede a una nuova estrazione.',
      },
      {
        q: 'Chi può partecipare?',
        a: 'Tutti i clienti maggiorenni che effettuano un acquisto in crypto su POS NAKA presso un merchant aderente di Lugano nel periodo di validità del concorso. Sono esclusi i dipendenti di NAKA e i loro familiari diretti.',
      },
      {
        q: 'Come faccio a sapere che l’estrazione è onesta?',
        a: 'Perché non dipende da noi. Alla chiusura pubblichiamo l’elenco delle giocate ammesse, che da quel momento non è più modificabile. Il numero che decide i vincitori arriva dopo, dalla rete Bitcoin, e nessuno può prevederlo né sceglierlo. Con quei due dati pubblici chiunque rifà il calcolo e ottiene gli stessi vincitori: trovi tutto, procedura ed esito, nella pagina dei vincitori.',
      },
      {
        q: 'Quante volte posso partecipare?',
        a: 'Non ci sono limiti al numero di giocate: ogni transazione crypto valida e distinta genera una nuova partecipazione. Lo stesso numero di transazione però può essere registrato una sola volta.',
      },
      {
        q: 'Cosa succede se il prezzo dell’oro cambia?',
        a: 'Il premio è espresso in quantità di XAUT, non in franchi. Il controvalore in CHF può quindi aumentare o diminuire in funzione dell’andamento del prezzo dell’oro e del mercato crypto: NAKA non garantisce alcun valore fiat minimo.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — l’iniziativa ${organizer} per il ${event} di ${city}. Paga in crypto sui POS NAKA e vinci Oro Digitale.`,
    contestHeading: 'Concorso',
    legalHeading: 'Legale',
    faq: 'FAQ & Assistenza',
    payGuide: 'Come pagare sui POS',
    winners: 'Vincitori ed estrazione',
    linkedin: 'NAKA su LinkedIn',
    bestVideo: 'Best Social Content',
    rules: 'Regolamento Completo',
    privacy: 'Privacy Policy (LPD/GDPR)',
    support: 'Contatti Assistenza',
    copyright: (organizer) =>
      `© 2026 ${organizer}. Tutti i diritti riservati. I premi sono erogati in Tether Gold (XAUT); il controvalore può variare con il mercato.`,
    backToTop: 'Torna su',
    navLabel: 'Navigazione sezioni',
    legalLabel: 'Informazioni legali',
  },

  email: {
    subject: (id, contest) => `Giocata ${id} registrata — ${contest}`,
    greeting: 'Ciao,',
    intro: (contest, event, city) =>
      `abbiamo registrato la tua partecipazione al concorso "${contest}" — ${event}, ${city}.`,
    heading: 'Giocata registrata',
    rowId: 'ID giocata',
    rowTx: 'Ultime 6 cifre',
    rowAmount: 'Importo',
    rowMerchant: 'Negozio',
    rowReceipt: 'Scontrino allegato',
    rowDate: 'Registrata il',
    rowStatus: 'Stato',
    statusValue: 'In verifica sul backend POS NAKA',
    nextTitle: 'Che cosa succede ora',
    next: (drawDate) => [
      'Verifichiamo la transazione confrontandola con i dati registrati sul POS NAKA.',
      'Ricevi una seconda email quando la giocata è convalidata.',
      `Il ${drawDate} si tiene l’estrazione pubblica.`,
    ],
    pool: (pool, winners) => `In palio ${pool} in Tether Gold, per un totale di ${winners} premi.`,
    warningLead: 'Conserva lo scontrino originale',
    warning: (organizer) =>
      ` fino alla comunicazione dei vincitori. In caso di vincita ti chiederemo il wallet su cui ricevere il premio: ${organizer} non chiede mai chiavi private o frasi di recupero.`,
    support: (email) => `Per assistenza: ${email}`,
    footer: (organizer) =>
      `© 2026 ${organizer}. Premi erogati in Tether Gold (XAUT); il controvalore può variare.`,
    yes: 'sì',
  },

  quick: {
    title: 'Registra la tua giocata',
    intro: 'Hai pagato in crypto sul POS NAKA? Bastano email, numero della transazione e foto dello scontrino.',
    backToSite: 'Vai al sito del concorso',
    deadline: (date) => `Registrazioni aperte fino al ${date}`,
  },

  stats: {
    entries: 'giocate registrate',
    prizes: 'premi in palio',
    merchants: 'negozi aderenti',
    odds: (entries, prizes) => `${entries} giocate finora per ${prizes} premi: prima giochi, meglio è.`,
  },

  consent: {
    title: 'Misurazione del traffico',
    text: 'Vorremmo usare uno strumento di analisi che installa cookie per capire come viene usato il sito. Nessun dato viene usato a fini pubblicitari.',
    link: 'Leggi l’informativa',
    accept: 'Accetto',
    reject: 'Rifiuto',
  },




  privacy: {
    metaTitle: 'Informativa privacy e cookie',
    metaDescription:
      'Quali dati raccoglie il concorso NAKA, perché, per quanto tempo e come esercitare i propri diritti. Informativa ai sensi della LPD svizzera e del GDPR.',
    title: 'Privacy e cookie',
    updated: (date) => `Ultimo aggiornamento: ${date}`,
    back: 'Torna al sito del concorso',
    cookieBadge: 'Questo sito non usa cookie di profilazione',
    cookieLead:
      'Non ci sono cookie di tracciamento, né pixel pubblicitari, né strumenti di analisi di terze parti. I font sono ospitati sul nostro dominio: nessuna richiesta esce verso Google o altri fornitori mentre navighi.',
    sections: ({ organizer, support, merchantSupport, collectedUntil, drawDate, onlineUntil }) => [
      {
        title: 'Chi tratta i tuoi dati',
        body: [
          `Titolare del trattamento è ${organizer}, che promuove il concorso e eroga i premi. Per qualunque richiesta relativa ai tuoi dati puoi scrivere a ${support}.`,
        ],
      },
      {
        title: 'Quali dati raccogliamo, e solo quando partecipi',
        body: [
          'Navigare il sito non richiede alcun dato. I dati vengono raccolti soltanto se registri una giocata, e sono quelli che il modulo ti chiede esplicitamente:',
        ],
        list: [
          'Il tuo indirizzo email, per confermarti la registrazione e avvisarti in caso di vincita.',
          'Il numero della transazione, per il riscontro con i pagamenti registrati sul POS NAKA.',
          'La fotografia dello scontrino, come prova documentale dell’acquisto.',
          'Il nome del negozio, se scegli di indicarlo: è facoltativo e serve solo a velocizzare la verifica.',
          'La lingua scelta e l’etichetta del materiale da cui arrivi (volantino, locandina, vetrina), per sapere quale materiale ha funzionato. L’etichetta è un testo fisso, non un identificatore: non permette di risalire a te.',
        ],
      },
      {
        title: 'Perché li trattiamo',
        body: [
          'Per gestire la tua partecipazione: verificare che la transazione sia reale, evitare giocate duplicate o fraudolente, effettuare l’estrazione e consegnare il premio. La base giuridica è l’esecuzione del rapporto che nasce con la tua partecipazione, insieme agli obblighi di legge che ne derivano.',
          'L’indirizzo del wallet viene chiesto soltanto ai vincitori, via email, dopo l’estrazione: non lo raccogliamo da chi partecipa e basta.',
        ],
      },
      {
        title: 'Per quanto tempo',
        body: [
          `Le giocate si raccolgono fino al ${collectedUntil}. L’estrazione si tiene il ${drawDate} e l’elenco dei vincitori resta pubblicato fino al ${onlineUntil}, con i soli ID delle giocate: nessun nome, nessuna email.`,
          `Entro quella data email, fotografie degli scontrini e numeri di transazione vengono cancellati in modo irreversibile. Restano soltanto dati che non identificano nessuno — ID della giocata, esito, data — necessari al rendiconto e a lasciare verificabile l’estrazione già pubblicata.`,
        ],
      },
      {
        title: 'Chi altro li vede',
        body: [
          'Nessuna cessione, nessuna vendita, nessun uso pubblicitario. I dati sono trattati sui nostri sistemi e da due fornitori tecnici che agiscono per nostro conto: il servizio che ospita il sito e quello che invia le email di conferma. Le transazioni sono verificate con il gateway POS NAKA.',
          'L’infrastruttura è collocata nell’Unione Europea. Eventuali trasferimenti verso fornitori extra-UE avvengono sulla base delle garanzie previste dalla normativa.',
        ],
      },
      {
        title: 'I tuoi diritti',
        body: [
          `Puoi chiedere in qualunque momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, opporti o riceverli in formato leggibile, scrivendo a ${support}. La cancellazione prima dell’estrazione comporta l’esclusione dal concorso, perché senza i dati della giocata non è possibile verificarla né assegnare un premio.`,
          'Se ritieni che il trattamento non sia corretto puoi rivolgerti all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT) in Svizzera o all’autorità di controllo del tuo Paese.',
        ],
      },
      {
        title: 'Cookie e tecnologie simili',
        body: [
          'Il sito non installa cookie di profilazione, non usa pixel pubblicitari e non impiega strumenti di analisi di terze parti. Non c’è nulla da accettare o rifiutare, e per questo non vedi alcun banner.',
          'Contiamo quante volte viene aperta una pagina per ciascun materiale promozionale, ma il conteggio è aggregato: non usa cookie, non registra indirizzi IP e non crea identificatori. Non è possibile ricondurre un’apertura a una persona.',
          `I caratteri tipografici sono serviti dal nostro dominio e non da servizi esterni: navigando, il tuo indirizzo IP non viene comunicato a fornitori terzi. Se in futuro introdurremo strumenti di misurazione che richiedono cookie, comparirà una richiesta di consenso preventiva e questa pagina verrà aggiornata.`,
        ],
      },
      {
        title: 'Assistenza commercianti',
        body: [
          `Gli esercenti che aderiscono all’iniziativa possono scrivere a ${merchantSupport}. I dati di contatto dei negozi sono trattati per la gestione dell’adesione e la comunicazione dell’iniziativa.`,
        ],
      },
    ],
  },

  winners: {
    metaTitle: 'Vincitori ed estrazione verificabile',
    metaDescription:
      'Risultato dell’estrazione, elenco dei vincitori e procedura per verificare da sé che il sorteggio non sia stato manipolato.',
    title: 'Vincitori',
    backToSite: 'Torna al sito del concorso',
    pendingTitle: 'L’estrazione non è ancora avvenuta',
    pendingText: (date) =>
      `I vincitori vengono pubblicati qui dopo l’estrazione del ${date}, insieme ai dati che permettono a chiunque di rifare il calcolo.`,
    simpleTitle: 'In parole semplici',
    simple: [
      'Immagina di lanciare una moneta e di dover chiamare testa o croce mentre è ancora in aria. Non puoi barare: la chiamata è già uscita di bocca prima che la moneta atterri.',
      'L’estrazione funziona così. Alle 16:00 chiudiamo le giocate e pubblichiamo la lista: è la nostra chiamata, e da quel momento non si tocca più. Poi aspettiamo il numero che decide, e quel numero non lo scegliamo noi — lo produce la rete Bitcoin nella mezz’ora successiva, come fa ogni dieci minuti da quindici anni, senza sapere nulla di noi né del concorso.',
      'A quel punto non resta niente da decidere: una formula abbina il numero alle giocate e stabilisce l’ordine. Chiunque abbia la lista e il numero rifà lo stesso conto e ottiene gli stessi vincitori — noi compresi, che non possiamo ottenere un risultato diverso nemmeno volendo.',
    ],
    howTitle: 'Come funziona l’estrazione',
    howIntro:
      'Il problema di qualunque concorso non è estrarre un numero a caso: è dimostrare a un estraneo che il numero non è stato scelto dopo aver visto i partecipanti. Si risolve prendendo due impegni pubblici, in quest’ordine.',
    steps: [
      {
        title: '1. Si congela l’elenco',
        text: 'A registrazioni chiuse pubblichiamo l’impronta SHA-256 dell’elenco ordinato delle giocate valide. Da quel momento aggiungere, togliere o riordinare anche una sola giocata cambia l’impronta, e chiunque se ne accorge.',
      },
      {
        title: '2. Si annuncia il seme prima che esista',
        text: 'Dichiariamo in anticipo che la sorgente casuale sarà il primo blocco Bitcoin minato dopo la chiusura delle giocate. Il suo hash non lo conosce nessuno prima che il blocco esista, organizzatore compreso, e nessuno può sceglierlo.',
      },
      {
        title: '3. Il resto è aritmetica',
        text: 'Per ogni giocata si calcola sha256("seme:ID giocata") e si ordinano i risultati. I primi vincono. Con elenco e seme pubblici chiunque rifà il conto e ottiene gli stessi nomi.',
      },
    ],
    resultTitle: 'Risultato dell’estrazione',
    drawnAt: 'Estrazione eseguita il',
    seedLabel: 'Seme (hash del blocco Bitcoin)',
    listHashLabel: 'Impronta dell’elenco',
    participantsLabel: 'Giocate ammesse',
    usersSection: 'Premi clienti',
    merchantsSection: 'Premi merchant',
    entryId: 'ID giocata',
    prizeCol: 'Premio',
    amountCol: 'Importo',
    notDrawnTitle: 'Premi non sorteggiati',
    notDrawnText:
      'Top Volume è una classifica sui volumi registrati dal POS e Best Social Content è deciso dalla giuria: non passano dall’estrazione.',
    publishedUntil: (date) => `Questo elenco resta pubblicato fino al ${date}. Dopo quella data il concorso viene archiviato e i dati personali dei partecipanti cancellati.`,
    contacted: 'I vincitori sono contattati via email all’indirizzo usato per la giocata. Le giocate sono identificate dal solo ID: nessun dato personale viene pubblicato.',
  },

  video: {
    metaTitle: (prize) => `Best Social Content — ${prize} in palio | NAKA`,
    metaDescription:
      'Come partecipare al premio Best Social Content del concorso NAKA: hashtag, requisiti, criteri di selezione e idee per il tuo contenuto.',
    back: 'Torna al montepremi',
    badge: 'Premio riservato ai merchant',
    titleLead: 'Best',
    titleGold: 'Social Content',
    intro: (event, city, week, prize) =>
      `Racconta l’iniziativa con un video, un post o un’immagine e promuovila durante il ${event} di ${city}: ${week}. Tra i contenuti di maggior successo, quello che piace di più vince ${prize} in Tether Gold.`,
    ctaSubmit: 'Candida il tuo contenuto',
    ctaIdeas: 'Vedi le idee',
    statPrize: 'Premio',
    statDeadline: 'Pubblica entro',
    statFormat: 'Formato',

    contentTitle: 'Che cosa puoi pubblicare',
    contentSubtitle:
      'Non serve per forza un video: vale qualunque contenuto capace di attirare davvero l’attenzione del pubblico, purché parli dell’iniziativa e porti i tre hashtag.',
    contentTypes: [
      { title: 'Un video', desc: 'Reel, TikTok o clip breve: mostra il pagamento in crypto sul POS o racconta l’iniziativa.' },
      { title: 'Un post', desc: 'Un testo che spiega perché accetti crypto e invita i clienti a partecipare al concorso.' },
      { title: 'Un’immagine', desc: 'Una foto curata del negozio, della vetrina o del materiale dell’iniziativa, con una didascalia che racconta.' },
    ],
    platformsTitle: 'Dove pubblicare',
    platformsNote: 'Su LinkedIn puoi anche taggare direttamente la pagina NAKA.',
    merchantGuide: {
      eyebrow: 'Guida per i commercianti',
      title: 'Come funziona per te, passo per passo',
      subtitle:
        'Tutto quello che devi sapere sull’iniziativa dal lato commerciante: cosa fare prima, durante e dopo la settimana del forum.',
      steps: [
        {
          title: '1. Aderisci rispondendo a un’email',
          text: 'Non c’è alcun modulo da compilare né contratto da firmare: rispondi all’email di invito che hai ricevuto da NAKA confermando nome, indirizzo e referente dell’attività. Da quel momento il tuo negozio entra nell’elenco ufficiale dell’iniziativa e compare sulla mappa pubblica consultata dai clienti.',
        },
        {
          title: '2. Tieni acceso il POS NAKA',
          text: 'È l’unico requisito tecnico. Il terminale che usi già per incassare in Bitcoin Lightning e USDt è lo stesso che registra le transazioni valide per il concorso: non devi installare nulla, non devi cambiare le tue procedure di cassa e non ci sono costi aggiuntivi.',
        },
        {
          title: '3. Incassa in crypto durante la settimana',
          text: 'L’iniziativa vive dal lunedì mattina al sabato pomeriggio. Ogni pagamento in crypto che ricevi in quei giorni conta due volte: vale per il tuo premio Top Volume e dà al cliente il diritto di partecipare all’estrazione. Più incassi in crypto, più cresce la tua posizione in classifica.',
        },
        {
          title: '4. Di’ ai clienti di registrare lo scontrino',
          text: 'È il passaggio che molti dimenticano: la transazione da sola non basta, il cliente deve registrarla sul sito caricando numero della transazione e foto dello scontrino. Esponi il materiale che ti forniamo e inquadra il QR code alla cassa: bastano dieci secondi e il cliente entra nell’estrazione.',
        },
        {
          title: '5. Pubblica un contenuto e punta al premio social',
          text: 'Un video, un post o un’immagine con i tre hashtag ufficiali ti mette in gara per il premio Best Social. È l’occasione per farti vedere dai visitatori del forum e dal pubblico locale, non solo per vincere: i contenuti migliori vengono ripubblicati anche dai canali NAKA.',
        },
        {
          title: '6. Ricevi i premi in Tether Gold',
          text: 'A concorso chiuso verifichiamo i volumi registrati dal POS, la giuria sceglie il contenuto vincitore e l’estrazione riservata ai merchant avviene con procedura pubblicamente verificabile. Se vinci ti contattiamo via email e ti chiediamo l’indirizzo su cui accreditare il premio in XAUT.',
        },
      ],
      qrTitle: 'Materiale informativo con QR',
      qrText:
        'Sul materiale che esponi in negozio trovi un QR code che porta direttamente a questa pagina: è pensato per te e per il tuo personale, così chi è alla cassa ha sempre sottomano regole, scadenze e contatti dell’assistenza.',
    },
    support: {
      title: 'Assistenza commercianti',
      text: 'Hai un dubbio sul POS, sull’adesione o sui premi? Il team NAKA risponde direttamente.',
      emailLabel: 'Email assistenza',
      phoneLabel: 'Telefono assistenza',
      whatsappLabel: 'WhatsApp assistenza',
      reviewTitle: 'Sei soddisfatto del servizio NAKA?',
      reviewText: 'Lasciare una recensione aiuta altri commercianti della zona a decidere se accettare crypto.',
      reviewCta: 'Lascia una recensione su Google',
    },
    announcement: {
      text: 'L’annuncio ufficiale dell’iniziativa è pubblicato sulla pagina LinkedIn di NAKA: seguila per aggiornamenti, vincitori e ricondivisioni dei contenuti migliori.',
      cta: 'Vai alla pagina LinkedIn di NAKA',
    },
    hashtagsTitle: 'Hashtag obbligatori',
    hashtagsText: ['Devono comparire ', 'tutti e tre', ' nella didascalia: sono il criterio con cui individuiamo i video in gara. Senza, il contenuto non viene conteggiato.'],
    mentionsTitle: 'Profili da menzionare',
    stepsEyebrow: 'Come partecipare',
    stepsTitle: 'Quattro passaggi',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Gira il video',
        text: `Da ${min} a ${max} secondi, formato ${ratio}. Deve mostrare un pagamento in crypto sul POS NAKA nel tuo negozio.`,
      },
      {
        title: 'Pubblica con gli hashtag',
        text: `Su ${platforms} o Facebook Reels, dal profilo pubblico della tua attività, con tutti gli hashtag obbligatori nella didascalia.`,
      },
      {
        title: 'Tagga i profili',
        text: 'Menziona NAKA e Lugano Plan ₿ nella didascalia o nel video: serve a farci trovare il contenuto e ad amplificarne la portata.',
      },
      {
        title: 'Segnalacelo',
        text: `Inviaci il link a ${email} entro il ${deadline}: è il passaggio che mette ufficialmente in gara il video.`,
      },
    ],
    selectionEyebrow: 'Come si vince',
    selectionTitle: 'Prima il pubblico, poi la giuria',
    selection: [
      {
        phase: 'Fase 1 — Il pubblico',
        title: 'I contenuti di maggior successo vanno in finale',
        desc: 'Contano visualizzazioni, like, commenti e condivisioni raccolti entro la chiusura dell’iniziativa, su qualsiasi piattaforma ammessa. I contenuti con il riscontro più alto formano la rosa dei finalisti.',
      },
      {
        phase: 'Fase 2 — La giuria',
        title: 'Tra i finalisti vince quello che piace di più',
        desc: 'Tra i contenuti in finale, la giuria NAKA premia quello che racconta meglio l’iniziativa: idea, simpatia, chiarezza del messaggio e capacità di far venire voglia di provarci.',
      },
    ],
    selectionNote:
      'Tradotto: più fai girare il video, più possibilità hai di entrare in finale — ma in finale non vince il più visto, vince il più bello. Un contenuto curato e simpatico batte un numero alto di visualizzazioni, e un video perfetto che nessuno guarda non arriva nemmeno alla rosa.',
    ideasEyebrow: 'Spunti',
    ideasTitle: 'Otto idee che funzionano',
    ideasSubtitle:
      'Non serve un videomaker: bastano uno smartphone, luce decente e un’idea chiara. Prendi uno di questi format e adattalo alla tua attività.',
    ideas: [
      { title: 'Il pagamento in 10 secondi', desc: 'Primo piano sul POS: QR, scansione, conferma. Nessun parlato, solo il suono della conferma e una scritta finale.', why: 'Il formato più condiviso: dimostra che pagare in crypto è più rapido della carta.' },
      { title: 'Prima volta', desc: 'Un cliente che non ha mai pagato in crypto lo fa davanti alla telecamera, con la sua reazione a fine transazione.', why: 'La faccia di chi scopre una cosa nuova vale più di qualsiasi spiegazione.' },
      { title: 'Crypto vs contanti', desc: 'Schermo diviso: due clienti pagano lo stesso conto, uno in contanti e uno in Lightning. Cronometro a vista.', why: 'Formato a gara: tiene lo spettatore fino alla fine per vedere chi vince.' },
      { title: 'Il tuo prodotto in oro', desc: 'Il piatto, il taglio di capelli o il prodotto del negozio raccontato in chiave "oro": luce calda, dettagli, chiusura sul pagamento.', why: 'Lega il tuo prodotto al tema del concorso senza sembrare uno spot.' },
      { title: 'Dietro il bancone', desc: 'Il titolare spiega in prima persona perché ha scelto di accettare crypto e cosa è cambiato in negozio.', why: 'Autenticità: funziona bene con il pubblico locale e con i media.' },
      { title: 'Tour del quartiere', desc: 'Una camminata tra più negozi aderenti della stessa via, un pagamento per tappa.', why: 'Collabori con i vicini e moltiplicate la portata pubblicando tutti lo stesso video.' },
      { title: 'Turista al forum', desc: 'Un partecipante del Plan ₿ Forum arriva in negozio e paga in Lightning senza avere franchi in tasca.', why: 'Racconta il motivo per cui l’iniziativa esiste, nella settimana in cui la città è piena di visitatori.' },
      { title: 'Errori da evitare', desc: 'Tono ironico: tutti i modi sbagliati di pagare, e poi quello giusto sul POS NAKA.', why: 'L’umorismo è il contenuto che viene salvato e rimandato agli amici.' },
    ],
    requirementsTitle: 'Requisiti',
    requirements: ({ min, max, ratio, resolution, deadline }) => [
      `Durata tra ${min} e ${max} secondi`,
      `Formato ${ratio}, almeno ${resolution}`,
      'Girato nel tuo negozio, con un pagamento reale sul POS NAKA',
      'Pubblicato da un profilo pubblico della tua attività',
      `Pubblicato entro il ${deadline}`,
      'Contenuto originale e inedito, prodotto per questa iniziativa',
    ],
    avoidTitle: 'Da evitare',
    avoid: [
      'Musica protetta da copyright: fa rimuovere il video e ti esclude dal premio',
      'Riprendere clienti o dipendenti senza il loro consenso',
      'Mostrare QR code, importi o dati di transazioni reali di altri clienti',
      'Promesse di vincita o messaggi che facciano passare il concorso per una lotteria garantita',
      'Video ripubblicati da altri o contenuti generati senza alcuna ripresa originale in negozio',
    ],
    rightsTitle: 'Diritti d’uso e responsabilità',
    rights: (organizer) => [
      `Candidando il video, il merchant dichiara di esserne l’autore o di averne la piena disponibilità e concede a ${organizer} una licenza gratuita, non esclusiva e limitata al periodo dell’iniziativa per ripubblicarlo sui propri canali, citando l’attività.`,
      `È responsabilità del merchant raccogliere il consenso delle persone riprese e utilizzare soltanto musica libera da diritti. ${organizer} può escludere in qualsiasi momento i contenuti che violino i termini delle piattaforme, la normativa svizzera sulla protezione dei dati o il buon nome dell’iniziativa.`,
    ],
    rightsLinkBefore: 'Restano validi tutti i termini del ',
    rightsLink: 'regolamento ufficiale del concorso',
    rightsLinkAfter: ', di cui questa pagina è attuazione operativa.',
    finalTitle: 'Hai pubblicato il tuo contenuto?',
    finalText:
      'Mandaci il link: senza la segnalazione via email il contenuto non entra ufficialmente in gara, anche se hai usato tutti gli hashtag.',
    mailSubject: 'Best Social Content — candidatura',
    mailBody: [
      'Buongiorno Team NAKA,',
      '',
      'candido il mio contenuto al premio Best Social Content.',
      '',
      'Nome attività: ',
      'Link al contenuto: ',
      'Piattaforma: ',
      'Data di pubblicazione: ',
      'Referente e telefono: ',
      '',
      'Confermo di aver pubblicato il contenuto con gli hashtag richiesti e di avere il consenso delle persone riprese.',
      '',
      'Cordiali saluti,',
    ],
  },

  rules: {
    title: 'Regolamento Ufficiale',
    subtitle: (contest, event, city) => `${contest} — ${event}, ${city}`,
    draftNotice:
      'Bozza operativa predisposta per la campagna: prima della pubblicazione il testo deve essere validato dal consulente legale di NAKA e, se richiesto, notificato all’autorità cantonale competente in materia di concorsi a premio.',
    close: 'Chiudi',
    accept: 'Accetto e partecipo',
    updated: (date, organizer) => `Ultimo aggiornamento del regolamento: ${date} · ${organizer} © 2026`,
    prevailing: '', // la versione italiana è quella originale: nessuna nota di prevalenza
    articles: ({ contest, organizer, event, city, from, to, draw, support, users, merchants, prizeList }) => [
      {
        title: '1. Promotore e oggetto',
        body: [
          `Il concorso "${contest}" è promosso da ${organizer} in occasione del ${event} di ${city}.`,
          'L’iniziativa ha lo scopo di promuovere l’utilizzo dei pagamenti in criptovaluta tramite terminali POS NAKA presso gli esercenti aderenti del territorio di Lugano.',
        ],
      },
      {
        title: '2. Periodo di validità',
        body: [
          `Sono ammesse le transazioni effettuate dal ${from} al ${to} (fuso orario Europe/Zurich).`,
          `L’estrazione dei premi è prevista il ${draw}. Le registrazioni pervenute oltre il termine di chiusura non sono ammesse.`,
        ],
      },
      {
        title: '3. Eleggibilità dei partecipanti',
        body: [
          'Possono partecipare tutte le persone fisiche maggiorenni (18 anni compiuti) che effettuino un acquisto regolato in criptovaluta su POS NAKA presso un esercente aderente.',
          'Sono esclusi dipendenti e collaboratori di NAKA, degli esercenti aderenti e dei partner dell’iniziativa, nonché i loro familiari diretti.',
          'La partecipazione è gratuita: non è previsto alcun costo aggiuntivo rispetto al normale prezzo di acquisto.',
        ],
      },
      {
        title: '4. Modalità di partecipazione',
        body: [
          'Per ogni transazione il partecipante registra la giocata sul presente sito indicando la propria email, il numero della transazione e la fotografia dello scontrino/ricevuta POS: entrambe le prove d’acquisto sono obbligatorie. L’indicazione dell’esercente è facoltativa e serve unicamente a velocizzare la verifica.',
          'L’indirizzo wallet per la ricezione del premio non è richiesto al momento della giocata: viene domandato via email ai soli vincitori, dopo la validazione della partecipazione.',
          'Ogni transazione valida e distinta dà diritto a una singola partecipazione. Non sono previsti limiti al numero di transazioni per partecipante.',
          'Il partecipante è tenuto a conservare lo scontrino o la ricevuta POS originale fino alla comunicazione dei vincitori.',
        ],
      },
      {
        title: '5. Verifica delle transazioni e prevenzione frodi',
        body: [
          'Ogni numero di transazione può essere registrato una sola volta: eventuali duplicati vengono automaticamente rifiutati dal sistema.',
          'Tutte le giocate sono sottoposte a controllo incrociato con i dati di regolamento del gateway POS NAKA per verificarne autenticità, esercente, importo e collocazione temporale nel periodo di gara.',
          'NAKA si riserva il diritto di annullare, senza preavviso, le giocate riconducibili a transazioni annullate, stornate, non riscontrate, generate con finalità elusive o ottenute mediante sistemi automatizzati, nonché di escludere il partecipante dal concorso.',
          'In caso di sospetta frode NAKA può richiedere la prova originale d’acquisto e un documento d’identità valido prima dell’erogazione del premio.',
        ],
      },
      {
        title: '6. Premi',
        body: [
          `Montepremi riservato ai clienti: ${users} in Tether Gold (XAUT), così ripartito: ${prizeList.users}.`,
          `Montepremi riservato ai merchant: ${merchants} in Tether Gold (XAUT), così ripartito: ${prizeList.merchants}.`,
          'Il premio Top Volume è assegnato sulla base dei volumi registrati dal POS NAKA; il premio Best Social Video è assegnato da una giuria tra i video di maggior successo; gli altri premi sono estratti a sorte.',
          'I premi non sono convertibili in denaro contante né sostituibili con altri beni o servizi.',
        ],
      },
      {
        title: '7. Estrazione e notifica dei vincitori',
        body: [
          'L’estrazione avviene tra tutte le giocate validate mediante procedura deterministica e pubblicamente verificabile, articolata in tre fasi: (a) a registrazioni chiuse NAKA pubblica l’impronta SHA-256 dell’elenco ordinato delle giocate ammesse, che da quel momento non è più modificabile; (b) viene annunciato in anticipo che il seme casuale sarà l’hash del primo blocco Bitcoin minato dopo la chiusura delle giocate, valore che nessuno può conoscere né influenzare prima che quel blocco esista; (c) i vincitori sono determinati ordinando, per ciascuna giocata, il valore sha256("seme:ID giocata").',
          'Elenco impegnato, seme e risultato sono pubblicati integralmente: chiunque può rieseguire il calcolo e ottenere gli stessi vincitori. Le giocate sono identificate dal solo ID, senza dati personali.',
          'I vincitori sono notificati via email all’indirizzo indicato in fase di registrazione entro 7 giorni dall’estrazione e devono confermare l’accettazione entro 14 giorni.',
          'In assenza di riscontro, o in caso di dati non verificabili, il premio viene riassegnato mediante nuova estrazione tra le giocate valide residue.',
          'Con la comunicazione di vincita viene richiesto al vincitore l’indirizzo wallet (o container NAKA) su cui accreditare il premio. Il trasferimento in XAUT avviene entro 30 giorni dalla ricezione dell’indirizzo. NAKA non risponde di indirizzi errati, incompatibili con il token XAUT o non più accessibili.',
        ],
      },
      {
        title: '8. Trattamento dei dati personali (LPD / GDPR)',
        body: [
          'Titolare del trattamento è NAKA. I dati raccolti (email, dati della transazione, eventuale immagine dello scontrino e, per i soli vincitori, l’indirizzo wallet) sono trattati esclusivamente per la gestione del concorso, la verifica antifrode e l’erogazione dei premi.',
          'La base giuridica del trattamento è l’esecuzione del rapporto contrattuale derivante dalla partecipazione al concorso e l’adempimento di obblighi legali.',
          'I dati sono conservati per il tempo necessario alla gestione dell’iniziativa e ai successivi obblighi di legge, quindi cancellati o anonimizzati.',
          `Il partecipante può esercitare in ogni momento i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità scrivendo a ${support}, ai sensi della Legge federale svizzera sulla protezione dei dati (LPD) e del Regolamento (UE) 2016/679 (GDPR).`,
        ],
      },
      {
        title: '9. Manleva e fluttuazione del mercato crypto',
        body: [
          'Il premio è espresso in quantità di Tether Gold (XAUT) e non in valuta fiat: il relativo controvalore in CHF/EUR può variare sensibilmente in funzione del prezzo dell’oro e delle condizioni di mercato. NAKA non garantisce alcun valore minimo.',
          'Il partecipante riconosce i rischi connessi alla detenzione di asset digitali, inclusa la volatilità e la responsabilità esclusiva sulla custodia delle proprie chiavi private.',
          'NAKA non risponde di malfunzionamenti di rete, ritardi delle blockchain, indisponibilità dei terminali POS o di eventi di forza maggiore che impediscano la registrazione di una giocata.',
          'La partecipazione al concorso implica l’accettazione integrale del presente regolamento.',
        ],
      },
      {
        title: '10. Legge applicabile e foro competente',
        body: [
          'Il presente regolamento è disciplinato dal diritto svizzero. Per ogni controversia è competente il foro di Lugano, Canton Ticino, fatte salve le disposizioni imperative a tutela dei consumatori.',
        ],
      },
    ],
  },

  modal: { close: 'Chiudi' },

  notFound: {
    title: 'Questa pagina non esiste',
    text: (contest) =>
      `Il link potrebbe essere scaduto o digitato male. Torna alla home del concorso «${contest}» per registrare la tua giocata o trovare i negozi aderenti.`,
    home: 'Torna alla home',
    map: 'Mappa merchant',
  },

  error: {
    title: 'Qualcosa è andato storto',
    text: 'La pagina non si è caricata correttamente. Riprova: se il problema persiste scrivici a',
    retry: 'Riprova',
  },
};

export default it;
