/** Testi italiani. Le chiavi devono restare allineate a en.js (verificato da un test). */
const it = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Paga in Crypto e Vinci Bitcoin',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning), USDt o XAUT". */
    assetsConjunction: 'o',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Paga in crypto nei negozi aderenti di Lugano e vinci bitcoin: 11 milioni di satoshi ai clienti, 2.00 XAUT ai commercianti.',
    ogDescription: 'Paga in crypto sui POS NAKA e partecipa all’estrazione di 11 milioni di satoshi.',
    skipLink: 'Vai al modulo di partecipazione',
    languageLabel: 'Scelta della lingua',
    languageName: 'Italiano',
    switchTo: 'English',
  },

  nav: {
    howItWorks: 'Come Funziona',
    prizes: 'Montepremi',
    map: 'Negozi Aderenti',
    upload: 'Carica Scontrino',
    merchants: 'Commercianti',
    rules: 'Regolamento',
    cta: 'Partecipa Ora',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    home: 'Paga Crypto Vinci Bitcoin — Home',
  },

  hero: {
    titleLead: 'Paga in Crypto a Lugano e vinci',
    titleGold: 'BITCOIN',
    lead: (event, week) =>
      `Nella settimana del ${event}, ${week}, paga in crypto nei negozi aderenti di Lugano con POS NAKA e registra lo scontrino sul sito: trenta secondi, nessuna app da scaricare.`,
    leadPrize: (pool, winners, draw) =>
      `In palio ${pool} in ${winners} premi, pagati in bitcoin sulla rete Lightning. L’estrazione è il ${draw}, poco dopo la chiusura, sull’hash di un blocco Bitcoin che ancora non esiste quando l’elenco delle giocate diventa pubblico: chiunque può rifare il calcolo e ottenere gli stessi vincitori.`,
    topPrize: 'Primo premio',
    ctaUpload: 'Carica Scontrino e TX ID',
    ctaMap: 'Trova Negozi Aderenti',
    area: 'Lugano',
    forumStrip: (event, dates, venue) => `${event} · ${dates} · ${venue}`,
    forumTickets: 'Biglietti del forum',
    forumNote: 'Il forum dura due giorni al Palazzo dei Congressi. L’iniziativa dura tutta la settimana nei negozi della città.',
    statMerchants: 'Merchant sul circuito NAKA a Lugano',
    statAssets: (assets) => `Asset accettati: ${assets}`,
    statPool: 'Montepremi complessivo dichiarato',
    rowTotal: 'Montepremi',
    valueNote:
      'I 21 milioni sono un’equivalenza fissata al momento della conversione: a quell’istante 2.00 XAUT valevano 10\'000\'000 di satoshi. Il controvalore in dollari si muove con i due mercati, le quantità in premio no.',
    valueLink: 'Vedi i cambi',
    rowUsers: 'Ai clienti, in bitcoin',
    rowMerchants: 'Ai commercianti, in oro',
    rowAsset: 'Come si ricevono',
    rowAssetValue: 'Lightning per i sat · Ethereum per XAUT',
    disclaimer:
      'I premi sono quantità fisse: 11\'000\'000 di satoshi e 2.00 XAUT. Il mercato può muoversi, chi vince riceve quelle quantità.',
    entryBoxTitle: 'Hai già pagato in crypto?',
    entryBoxText: 'Carica la transazione di giocata: scontrino, TX ID e importo.',
    entryBoxCta: 'Vai al modulo',
  },

  countdown: {
    loading: 'Caricamento countdown…',
    toStart: 'Mancano al via dell’iniziativa',
    demo: 'Finestra di prova — non sono le date vere',
    running: 'Iniziativa in corso — tempo residuo per giocare',
    ended: 'Concorso chiuso — estrazione in preparazione',
    days: 'Giorni',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
  },

  dual: {
    eyebrow: 'Doppia iniziativa',
    title: 'Un’iniziativa, due premi diversi',
    subtitle:
      'Chi paga vince bitcoin, chi offre il pagamento vince oro: due montepremi separati, due modi di partecipare.',
    users: {
      kicker: 'Iniziativa Clienti',
      title: 'Per chi Acquista',
      points: (assets) => [
        `Paga in ${assets} sul POS NAKA`,
        'Registra la transazione con TX ID e foto dello scontrino',
        'Partecipi automaticamente all’estrazione in bitcoin',
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
        'Premio Top Volume di transazioni crypto, in Tether Gold',
        'Premio per il miglior video social promozionale',
        'Due estrazioni riservate ai merchant con almeno 1 transazione',
      ],
      cta: 'Scopri come aderire',
    },
  },

  how: {
    eyebrow: 'Come funziona',
    title: 'Tre step, meno di un minuto',
    subtitle: 'Dal pagamento alla giocata valida senza registrazioni complesse né app da scaricare.',
    steps: () => [
      {
        title: 'Paga in Crypto',
        text: 'Effettua un acquisto su POS NAKA presso un merchant aderente all’iniziativa, con uno di questi asset.',
      },
      {
        title: 'Registra la Transazione',
        text: 'Inserisci l’ID transazione (TX ID), l’importo, il negozio e carica la foto dello scontrino/ricevuta POS nel modulo qui sotto.',
      },
      {
        title: 'Vinci Bitcoin',
        text: 'Ricevi la conferma con il tuo ID giocata e partecipa all’estrazione dei premi in satoshi.',
      },
    ],
    payEyebrow: 'Come si paga',
    payTitle: 'Due modi di pagare, due cose da sapere',
    paySubtitle:
      'Sul POS si paga in Bitcoin sulla rete Lightning oppure da un wallet, in USD₮ o Tether Gold: sono due procedure diverse. Per la prima bastano un wallet Lightning e il QR del terminale; per la seconda ci sono reti e commissioni da sapere, e le spieghiamo qui sotto.',
    guideTitle: 'In Bitcoin, sulla rete Lightning',
    guideText:
      'Si scansiona il QR del terminale e si conferma: nessun indirizzo da copiare, nessuna rete da scegliere. Serve un wallet Lightning, e il circuito Plan ₿ di Lugano ne indica tre.',
    guideWallets: 'I wallet Lightning consigliati dal circuito Plan ₿ Lugano',
    guideOnchainTitle: 'In USD₮ o Tether Gold, da un wallet',
    guideOnchainText:
      'Serve un wallet non custodial — MetaMask, Trust Wallet o equivalenti — cioè uno in cui le chiavi sono tue e i fondi li muovi tu. La procedura è la stessa per i due asset, cambiano solo le reti. Tre cose da sapere prima di arrivare alla cassa.',
    guideOnchainSteps: [
      {
        title: 'USD₮ su Ethereum o Polygon, Tether Gold su Ethereum',
        text: 'Per gli USD₮ il POS accetta Ethereum e Polygon, indifferentemente; il Tether Gold esiste solo su Ethereum ed è l’unica rete su cui si può pagare. Quello che hai su altre reti — Tron, Solana, BNB Chain — non si può usare al POS: va prima spostato.',
      },
      {
        title: 'Un po’ di gas per le commissioni',
        text: 'La commissione di rete non si paga nell’asset che stai spendendo: serve ETH su Ethereum — quindi anche per il Tether Gold — e POL su Polygon. Con il saldo pieno ma zero gas la transazione non parte.',
      },
      {
        title: 'Scansiona il QR del terminale',
        text: 'Il POS mostra un QR con importo e destinatario: il wallet li compila da sé. Prima di confermare, controlla che la rete selezionata nel wallet sia la stessa indicata sul terminale.',
      },
    ],
    guideOnchainWarningLabel: 'Avvertenze',
    guideOnchainWarning:
      'Alcuni wallet meno diffusi leggono male la richiesta di pagamento che il terminale mostra nel QR. Se il tuo segnala un errore, o se l’importo e il destinatario non ti tornano, fermati e controlla invece di forzare l’invio: una transazione partita non si annulla. La prima volta che usi un wallet per pagare in negozio, chiedi al commerciante una transazione di prova da 0.10 CHF.',
    guideCta: 'Sito ufficiale Plan ₿',
    guideCtaOther: 'In English',
  },

  brand: {
    line1: 'Paga Crypto',
    line2: 'Vinci Bitcoin',
    full: 'Paga in Crypto e Vinci Bitcoin',
  },

  prizes: {
    eyebrow: 'Montepremi',
    title: (pool) => `${pool} di montepremi complessivo`,
    subtitle: (winners) =>
      `${winners} premi in due montepremi separati: ai clienti in bitcoin, ai commercianti in Tether Gold. Il totale è dichiarato in satoshi all’equivalenza fissata alla conversione.`,
    usersKicker: 'Clienti · in bitcoin',
    merchantsKicker: 'Commercianti · in Tether Gold',
    usersNote: 'Montepremi complessivo riservato ai clienti finali',
    merchantsNote: 'Montepremi complessivo riservato ai merchant aderenti',
    poolLabel: 'montepremi',
    each: 'ciascuno',
    spritzDetails: 'Condizioni del premio',
    videoLink: 'Tutti i premi e la guida per i commercianti',
    spritzWhen: (day, from, to, area) => `${day}, dalle ${from} alle ${to} · ${area}`,
    spritzNote:
      'Stessa estrazione verificabile degli altri premi, su un elenco più piccolo: le giocate con una transazione in quella finestra, nei negozi aderenti di Piazza Cioccaro. Le stesse giocate partecipano anche all’estrazione generale, ma ognuna può vincere un solo premio: se una vince nel generale, lo Spritz passa alla successiva. Gli organizzatori annunciano i locali della serata poco prima dell’evento: da quel momento il premio si restringe a quelli.',
    spritzLink: 'L’evento sul sito della Plan ₿ Week',
    socialWhen: (deadline) => `Pubblica entro il ${deadline}`,
    socialHow: (tags) =>
      `Racconta il tuo pagamento in crypto a Lugano — video, post o foto — e pubblicalo con tutti e tre gli hashtag ${tags}. Vale per chi ha almeno una giocata registrata: il contenuto è il modo di vincere, la giocata è il biglietto d’ingresso. Sceglie la giuria NAKA, non il numero di like.`,
    socialDetails: 'Come si partecipa',
    note: (date) =>
      `Estrazione pubblica prevista il ${date}. I premi dei clienti sono erogati in bitcoin sulla rete Lightning, quelli dei commercianti in Tether Gold su Ethereum, sull’indirizzo comunicato dal vincitore.`,
    items: {
      '1° Premio': { place: '1° Premio', desc: 'Estrazione principale tra tutte le giocate valide' },
      '2° Premio': { place: '2° Premio', desc: 'Seconda estrazione tra le giocate valide' },
      '3°–10° Premio': { place: '3°–10° Premio', desc: '8 premi consolazione estratti a sorte' },
      'Video Social Clienti': {
        place: 'Premio Video Social',
        desc: 'Al miglior contenuto pubblicato da un cliente durante la settimana, scelto dalla giuria NAKA',
      },
      'Satoshi Spritz': {
        place: 'Premio Satoshi Spritz',
        desc: 'Estratto a sorte fra le giocate pagate durante la serata del Satoshi Spritz Speciale, nei negozi aderenti di Piazza Cioccaro',
      },
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
        desc: 'Due estrazioni tra tutti i merchant con almeno 1 transazione crypto registrata',
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
    receiptPreparing: 'Preparo l’immagine…',
    receiptFormats: (mb) => `JPG, PNG, WEBP o HEIC — max ${mb} MB`,
    receiptRemove: 'Rimuovi allegato',
    merchantLabel: 'Negozio',
    merchantHint:
      'Serve a ritrovare la tua transazione sul POS. Scrivilo liberamente: i suggerimenti arrivano dalla mappa del circuito.',
    merchantPlaceholder: 'Inizia a scrivere il nome del negozio…',
    confirmAge: 'Dichiaro di aver compiuto 18 anni e di conservare la prova d’acquisto: lo scontrino cartaceo o il link della ricevuta digitale.',
    acceptRulesBefore: 'Accetto il ',
    acceptRulesLink: 'Regolamento Ufficiale e l’Informativa Privacy (LPD/GDPR)',
    submit: 'Invia e Partecipa',
    submitting: 'Verifica in corso…',
    footnote:
      'Lo stesso numero di transazione può essere registrato una sola volta. Le giocate sono sottoposte a controllo incrociato con i dati del POS NAKA. L’indirizzo Lightning per ricevere il premio ti verrà richiesto via email solo in caso di vincita.',
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
      receipt_type: 'Formato non supportato: carica una foto JPG, PNG, WEBP o HEIC.',
      receipt_size: 'File troppo pesante: massimo 8 MB.',
      merchant_missing: 'Indica il negozio in cui hai pagato.',
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
      subtitle: 'Conserva la prova d’acquisto — scontrino cartaceo o ricevuta digitale — fino alla comunicazione dei vincitori.',
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
        'Riceverai una seconda email alla convalida. In caso di vincita ti chiederemo l’indirizzo Lightning su cui accreditare il premio in bitcoin: NAKA non chiede mai chiavi private o frasi di recupero.',
      close: 'Ho capito',
    },
  },

  map: {
    eyebrow: 'Mappa merchant',
    title: 'Dove pagare in crypto a Lugano',
    subtitle: (event) =>
      `Gli esercenti del circuito NAKA a Lugano, attivi durante la settimana del ${event}.`,
    allAccept: 'Tutti i negozi in elenco accettano',
    sortAlpha: 'A-Z',
    sortNear: 'Vicino a te',
    filtersLabel: 'Filtra i negozi',
    nearMe: 'Ordina per vicinanza',
    nearMeOn: 'Vicino a te',
    nearMeLoading: 'Cerco la tua posizione…',
    nearMeDenied: 'Posizione non disponibile: l’elenco resta in ordine alfabetico.',
    distance: (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m da te` : `${(m / 1000).toFixed(1)} km da te`),
    openAll: 'Apri tutti i negozi in Google Maps',
    seeAll: (n) => `Vedi tutti i ${n} negozi`,
    standaloneTitle: 'Negozi aderenti',
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
    call: 'Chiama',
    linkKinds: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      website: 'Sito',
    },
    website: 'Sito',
    badgeVerified: 'POS NAKA',
    badgePending: 'Attivazione in corso',
    badgeVerifiedTitle: 'Accetta pagamenti in crypto su terminale NAKA',
    zoneTitle: 'Zona selezionata',
    zoneClear: 'Mostra tutti',
    zoneCount: (n) => `${n} negozi in questa zona`,
    outsideCore: 'Fuori dal centro',
    mapLegend: 'I punti raggruppano i negozi vicini: tocca un punto per vedere quali sono.',
    center: 'Lugano centro',
    closeCard: 'Chiudi scheda merchant',
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
      'Resti nell’elenco ufficiale dei negozi aderenti: senza conferma il negozio non compare',
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
        a: 'Sui POS NAKA si paga in Bitcoin sulla rete Lightning, in USD₮ sulle reti Ethereum e Polygon e in Tether Gold sulla rete Ethereum: il terminale non consente altre reti. Molti esercenti accettano anche LVGA, che però non dà diritto alla partecipazione al concorso.',
        cta: { label: 'Cerca i negozi aderenti', href: '#mappa' },
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
        q: 'Come vengono accreditati i premi?',
        a: 'Non serve indicare alcun wallet per partecipare. Se risulti vincitore ti scriviamo all’email della giocata e ti chiediamo in quel momento l’indirizzo su cui accreditare il premio: un indirizzo Lightning per i premi in bitcoin dei clienti, un indirizzo Ethereum compatibile con XAUT per i premi in Tether Gold dei commercianti. Il trasferimento avviene entro 30 giorni. Un indirizzo errato non consente il recupero dei fondi.',
      },
      {
        q: 'Devo conservare lo scontrino?',
        a: 'Sì, se è cartaceo. La fotografia dello scontrino è obbligatoria già in fase di giocata, e il cartaceo va conservato fino alla comunicazione dei vincitori: in caso di vincita ne viene richiesta esibizione prima dell’erogazione del premio. Se il negozio emette una ricevuta digitale non devi stampare niente: al momento della giocata carichi la schermata e, se vinci, ti basta inoltrare il link della ricevuta che hai ricevuto. Senza una prova d’acquisto verificabile — cartacea o digitale — la giocata viene annullata e si procede a una nuova estrazione.',
      },
      {
        q: 'Chi può partecipare?',
        a: 'Tutti i clienti maggiorenni che effettuano un acquisto in crypto su POS NAKA presso un merchant aderente di Lugano nel periodo di validità del concorso.',
      },
      {
        q: 'Come faccio a sapere che l’estrazione è onesta?',
        a: 'Perché non dipende da noi. Entro mezz’ora dalla chiusura pubblichiamo l’elenco delle giocate ammesse, che da quel momento non è più modificabile, e indichiamo il blocco Bitcoin che farà da seme: uno che non è ancora stato minato. Il numero che decide i vincitori arriva quindi dopo, dalla rete Bitcoin, e nessuno può prevederlo né sceglierlo. Con quei due dati pubblici chiunque rifà il calcolo e ottiene gli stessi vincitori: procedura, file da scaricare ed esito sono nella pagina dei vincitori.',
      },
      {
        q: 'Quante volte posso partecipare?',
        a: 'Non ci sono limiti al numero di giocate: ogni transazione crypto valida e distinta genera una nuova partecipazione. Lo stesso numero di transazione però può essere registrato una sola volta.',
      },
      {
        q: 'Cosa succede se il prezzo di bitcoin o dell’oro cambia?',
        a: 'I premi sono quantità fisse — satoshi per i clienti, XAUT per i commercianti — non importi in franchi. Il controvalore in CHF può quindi aumentare o diminuire con il mercato: NAKA non garantisce alcun valore fiat minimo. Anche i 21 milioni di satoshi dichiarati sono un’equivalenza fissata a un istante preciso, citato nel regolamento all’articolo 6-bis: le variazioni successive non cambiano né le quantità né il numero dei premi.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — l’iniziativa ${organizer} per il ${event} di ${city}. Paga in crypto sui POS NAKA e vinci bitcoin.`,
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
      `© 2026 ${organizer}. Tutti i diritti riservati. I premi dei clienti sono erogati in bitcoin, quelli dei commercianti in Tether Gold (XAUT); il controvalore può variare con il mercato.`,
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
    pool: (pool, winners) => `In palio ${pool} in bitcoin, per un totale di ${winners} premi riservati ai clienti.`,
    warningLead: 'Conserva la prova d’acquisto',
    warning: (organizer) =>
      ` fino alla comunicazione dei vincitori. In caso di vincita ti chiederemo il wallet su cui ricevere il premio: ${organizer} non chiede mai chiavi private o frasi di recupero.`,
    support: (email) => `Per assistenza: ${email}`,
    footer: (organizer) =>
      `© 2026 ${organizer}. Premi erogati in bitcoin e in Tether Gold (XAUT); il controvalore può variare.`,
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
          'Il nome del negozio in cui hai pagato, che serve a ritrovare la transazione sul POS.',
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
    pendingText: (date, commitBy) =>
      `Entro le ${commitBy} del ${date} qui compaiono gli elenchi delle giocate ammesse e il numero del blocco Bitcoin che farà da seme. I vincitori arrivano appena quel blocco viene minato, insieme ai dati per rifare il calcolo.`,
    committedTitle: 'Elenchi pubblicati: si aspetta il blocco',
    committedText: (height, time) =>
      `Gli elenchi qui sotto sono stati pubblicati il ${time} e non possono più cambiare. Il seme sarà l’hash del blocco Bitcoin numero ${height}, che in quel momento non era ancora stato minato. Si estrae appena sopra di lui ne arriva almeno un altro.`,
    committedAt: 'Elenchi pubblicati il',
    tipLabel: 'Ultimo blocco al momento della pubblicazione',
    seedHeightLabel: 'Blocco che fa da seme',
    openBlock: 'Apri il blocco',
    listsTitle: 'File per rifare il calcolo',
    lists: { users: 'Giocate dei clienti', spritz: 'Giocate Satoshi Spritz', merchants: 'Merchant', commitment: 'Impegno completo', result: 'Risultato completo' },
    listCount: (n) => `${n} ID`,
    download: 'Scarica',
    hashLabel: 'Impronta SHA-256',
    reservesTitle: 'Riserve, in ordine',
    reservesNote: 'Se una giocata estratta non supera la verifica, il premio passa alla prima riserva disponibile.',
    disqualifiedTitle: 'Escluse dopo la verifica',
    archiveTitle: 'Copia indipendente',
    archiveText: (time) =>
      `L’impegno è stato depositato anche su archive.org, che ne registra data e ora: ${time}. È la prova, che non dipende da noi, che gli elenchi esistevano prima del blocco del seme.`,
    archiveLink: 'Apri la copia su archive.org',
    archivePending: 'Deposito su archive.org in corso: il link compare qui appena l’archivio conferma.',
    timingTitle: 'Perché non c’è un orario preciso',
    timingText: (blocks, from, to) =>
      `La rete Bitcoin produce un blocco ogni dieci minuti in media, ma con grande variabilità: ${blocks} blocchi possono arrivare in mezz’ora come in due ore. Per questo annunciamo una finestra e non un orario: l’estrazione avviene di norma tra le ${from} e le ${to}, mai prima delle ${from}. Se la rete è lenta si aspetta, e non cambia nulla: né gli elenchi, né il blocco, né il risultato.`,
    simpleTitle: 'In parole semplici',
    simple: [
      'Immagina di lanciare una moneta e di dover chiamare testa o croce mentre è ancora in aria. Non puoi barare: la chiamata è già uscita di bocca prima che la moneta atterri.',
      'L’estrazione funziona così. Alle 16:00 chiudiamo le registrazioni ed entro mezz’ora pubblichiamo l’elenco delle giocate: è la nostra chiamata, e da quel momento non si tocca più. Nello stesso momento diciamo quale numero deciderà: l’hash di un blocco Bitcoin che verrà minato circa un’ora dopo. Quel numero non lo sceglie nessuno: lo produce la rete Bitcoin, come fa ogni dieci minuti da più di quindici anni, senza sapere nulla di noi né del concorso.',
      'A quel punto non resta niente da decidere: una formula abbina il numero alle giocate e stabilisce l’ordine. Chiunque abbia l’elenco e il numero rifà lo stesso conto e ottiene gli stessi vincitori — noi compresi, che non possiamo ottenere un risultato diverso nemmeno volendo. Dopo resta solo da controllare che le giocate vincenti siano vere: se una non lo è, il premio passa a chi la segue nell’ordine già pubblicato.',
    ],
    howEyebrow: 'Trasparenza',
    howTitle: 'Come funziona l’estrazione',
    howIntro:
      'Il problema di qualunque concorso non è estrarre un numero a caso: è dimostrare a un estraneo che il numero non è stato scelto dopo aver visto i partecipanti. Si risolve prendendo due impegni pubblici, in quest’ordine.',
    steps: (blocks) => [
      {
        title: 'Si congela l’elenco',
        text: 'Entro mezz’ora dalla chiusura pubblichiamo gli ID di tutte le giocate ammesse, in tre elenchi (clienti, Satoshi Spritz, merchant), con l’impronta SHA-256 di ciascuno. Da quel momento cambiare anche una sola riga cambia l’impronta, e chiunque se ne accorge.',
      },
      {
        title: 'Si annuncia il seme prima che esista',
        text: `Nella stessa pubblicazione indichiamo l’ultimo blocco Bitcoin minato in quel momento e fissiamo il seme: l’hash del blocco che arriverà ${blocks} posizioni dopo, in media un’ora più tardi. Nessuno, organizzatore compreso, può prevederlo né sceglierlo.`,
      },
      {
        title: 'Il resto è aritmetica',
        text: 'Per ogni giocata si calcola sha256("seme:categoria:ID giocata") — la categoria è "users", "spritz" o "merchants" — e si ordinano i risultati dal più basso. I primi vincono, i successivi sono le riserve; ogni giocata vince al massimo un premio. Con elenchi e seme chiunque rifà il conto e ottiene gli stessi ID.',
      },
      {
        title: 'Si verificano i vincitori',
        text: 'Prima di pagare controlliamo sui dati del POS NAKA e sullo scontrino che le giocate estratte siano vere. Una giocata che non supera il controllo viene esclusa con la motivazione pubblicata qui, e il premio passa alla prima riserva. Nient’altro può cambiare.',
      },
    ],
    resultTitle: 'Risultato dell’estrazione',
    drawnAt: 'Estrazione eseguita il',
    seedLabel: 'Seme (hash del blocco Bitcoin)',
    listHashLabel: 'Impronta dell’elenco',
    participantsLabel: 'Giocate ammesse',
    usersSection: 'Premi clienti',
    spritzSection: 'Premio Satoshi Spritz',
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
    metaTitle: (pool) => `Area commercianti — ${pool} riservati ai negozi aderenti | NAKA`,
    metaDescription:
      'Tutto quello che serve a un negozio di Lugano: i tre premi riservati ai commercianti, come si aderisce, cosa dire ai clienti e le regole del premio Best Social Content.',
    back: 'Torna al montepremi',
    badge: 'Area commercianti',
    titleLead: 'Offri pagamenti crypto e vinci',
    titleGold: 'ORO',
    intro: (event, city, pool) =>
      `I clienti che pagano in crypto vincono bitcoin; tu che il pagamento lo offri vinci oro. Durante il ${event} di ${city} i negozi aderenti si giocano ${pool} in Tether Gold, in tre premi cumulabili: il volume di incassi crypto, il miglior contenuto social e un sorteggio a cui basta una transazione. Qui trovi tutti e tre, come si aderisce e cosa dire ai clienti alla cassa.`,
    ctaSubmit: 'Candida il tuo contenuto',
    ctaPrizes: 'Vedi i tre premi',
    ctaHow: 'Come si aderisce',
    ctaIdeas: 'Vedi le idee',
    statPrize: 'Montepremi merchant',
    statDeadline: 'Contenuti social entro',
    statFormat: 'Giocate e incassi fino a',

    socialEyebrow: 'Premio 2 di 3',
    socialTitle: 'Best Social Content, nel dettaglio',
    socialSubtitle:
      'Questa parte riguarda solo il premio social. Attenzione alle due date: i contenuti si pubblicano entro venerdì 23 ottobre, mentre giocate dei clienti e incassi validi per il Top Volume proseguono fino a sabato 24 alle 16:00.',
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
    merchantPrizes: {
      eyebrow: 'Tutti i premi merchant',
      title: (pool) => `${pool} riservati ai commercianti`,
      subtitle:
        'Il premio social è uno dei tre. Gli altri due si vincono senza pubblicare nulla: uno premia quanto incassi, l’altro non chiede altro che una transazione. Sono cumulabili — lo stesso negozio può vincerli tutti.',
      each: 'ciascuno',
      howLabel: 'Come si assegna',
      actionLabel: 'Cosa devi fare',
      how: {
        volume: 'Classifica oggettiva sui volumi registrati dal POS NAKA',
        jury: 'Il pubblico fa la rosa dei finalisti, la giuria NAKA sceglie il vincitore',
        draw: 'Estrazione casuale verificabile da chiunque',
      },
      items: {
        'Top Volume Transazioni': {
          title: 'Top Volume Transazioni',
          text: 'Va al negozio che nella settimana dell’iniziativa registra il più alto volume di incassi crypto sul POS NAKA. Conta il totale incassato, non il numero di scontrini.',
          action: 'Niente di speciale: incassa in crypto e invita i clienti a pagare così. La classifica la calcoliamo noi dai dati del POS.',
        },
        'Best Social Content': {
          title: 'Best Social Content',
          text: 'Va al miglior contenuto pubblicato dal profilo della tua attività: vale un video, ma anche un post o una singola immagine. Regole, formati e idee sono spiegati in questa pagina.',
          action: 'Pubblica con i tre hashtag obbligatori entro la scadenza e segnalacelo per email.',
        },
        'Estrazione Riservata Merchant': {
          title: 'Estrazione Riservata Merchant',
          text: 'È il premio più facile da raggiungere: basta una transazione crypto incassata durante la settimana per entrare nell’estrazione. I premi estratti sono due, da 0.25 XAUT ciascuno. Ogni negozio ha un biglietto, uno solo: incassarne cento non aumenta le probabilità.',
          action: 'Aderire e incassare almeno un pagamento in crypto. Nient’altro.',
        },
      },
      note: (date) =>
        `Volumi e vincitori si stabiliscono a iniziativa chiusa; l’estrazione riservata ai merchant si tiene il ${date} con la stessa procedura verificabile usata per i clienti. I premi sono erogati in Tether Gold (XAUT) sull’indirizzo comunicato dal vincitore.`,
    },
    merchantGuide: {
      eyebrow: 'Guida per i commercianti',
      title: 'Come funziona per te, passo per passo',
      subtitle:
        'Tutto quello che devi sapere sull’iniziativa dal lato commerciante: cosa fare prima, durante e dopo la settimana del forum.',
      steps: [
        {
          title: '1. Aderisci rispondendo a un’email',
          text: 'Non c’è alcun modulo da compilare né contratto da firmare: rispondi all’email di invito che hai ricevuto da NAKA confermando nome, indirizzo e referente dell’attività. Da quel momento il tuo negozio resta nell’elenco ufficiale dell’iniziativa, quello che i clienti consultano per scegliere dove spendere: chi non conferma viene rimosso prima della pubblicazione definitiva.',
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
          text: 'È il passaggio che molti dimenticano: la transazione da sola non basta, il cliente deve registrarla sul sito caricando numero della transazione e foto dello scontrino. La frase che funziona alla cassa è una sola: «se registri lo scontrino partecipi all’estrazione di 11 milioni di satoshi». Esponi il materiale che ti forniamo e inquadra il QR code: bastano dieci secondi e il cliente entra nell’estrazione.',
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
    mentionsTitle: 'Profili che puoi menzionare',
    mentionsNote: 'Le menzioni sono facoltative e servono solo a farci trovare il contenuto: obbligatori sono i tre hashtag.',
    noLimitTitle: 'Quanti contenuti vuoi',
    noLimitText:
      'Non c’è un massimo: puoi pubblicare un contenuto al giorno o dieci nella stessa giornata. In finale ci va il contenuto, non il negozio, quindi pubblicarne di più aumenta le probabilità — a patto che ognuno porti i tre hashtag.',
    stepsEyebrow: 'Come partecipare',
    stepsTitle: 'Quattro passaggi',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Gira il video',
        text: `Da ${min} a ${max} secondi, formato ${ratio}. Deve mostrare un pagamento in crypto sul POS NAKA nel tuo negozio.`,
      },
      {
        title: 'Pubblica con gli hashtag',
        text: `Su ${platforms}, dal profilo pubblico della tua attività, con tutti gli hashtag obbligatori nella didascalia.`,
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
    articles: ({
      contest,
      organizer,
      event,
      city,
      from,
      to,
      draw,
      commitBy,
      blocks,
      drawFrom,
      drawTo,
      support,
      users,
      merchants,
      declared,
      prizeList,
      anchor,
      spritz,
      social,
    }) => [
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
          `L’estrazione dei premi si tiene il ${draw}, con la procedura e nei tempi dell’articolo 7. Le registrazioni pervenute oltre il termine di chiusura non sono ammesse.`,
        ],
      },
      {
        title: '3. Eleggibilità dei partecipanti',
        body: [
          'Possono partecipare tutte le persone fisiche maggiorenni (18 anni compiuti) che effettuino un acquisto regolato in criptovaluta su POS NAKA presso un esercente aderente.',
          'Sono ammesse le sole transazioni regolate su POS NAKA in Bitcoin sulla rete Lightning, in USD₮ sulle reti Ethereum o Polygon e in Tether Gold sulla rete Ethereum. I pagamenti effettuati in valuta tradizionale o tramite altri circuiti, incluso LVGA, non danno diritto a partecipare.',
          'La partecipazione è gratuita: non è previsto alcun costo aggiuntivo rispetto al normale prezzo di acquisto.',
        ],
      },
      {
        title: '4. Modalità di partecipazione',
        body: [
          'Per ogni transazione il partecipante registra la giocata sul presente sito indicando la propria email, le ultime cifre del numero della transazione, l’importo, l’esercente e la fotografia della prova d’acquisto. Tutti i campi sono obbligatori: il numero della transazione e l’importo servono a riscontrarla sul terminale, l’esercente a individuare il terminale stesso.',
          'L’indirizzo wallet per la ricezione del premio non è richiesto al momento della giocata: viene domandato via email ai soli vincitori, dopo la validazione della partecipazione.',
          'Ogni transazione valida e distinta dà diritto a una singola partecipazione. Non sono previsti limiti al numero di transazioni per partecipante.',
          'Il partecipante è tenuto a conservare la prova d’acquisto fino alla comunicazione dei vincitori: lo scontrino cartaceo in originale oppure, se l’esercente emette una ricevuta digitale, il link o il documento ricevuto. In caso di vincita ne è richiesta esibizione prima dell’erogazione del premio.',
        ],
      },
      {
        title: '5. Verifica delle transazioni e prevenzione frodi',
        body: [
          'Ogni numero di transazione può essere registrato una sola volta: eventuali duplicati vengono automaticamente rifiutati dal sistema.',
          'Tutte le giocate sono sottoposte a controllo incrociato con i dati di regolamento del gateway POS NAKA per verificarne autenticità, esercente, importo e collocazione temporale nel periodo di gara.',
          'NAKA si riserva il diritto di annullare, senza preavviso, le giocate riconducibili a transazioni annullate, stornate, non riscontrate, generate con finalità elusive o ottenute mediante sistemi automatizzati, nonché di escludere il partecipante dal concorso.',
          'In caso di sospetta frode NAKA può richiedere l’esibizione della prova d’acquisto e di un documento d’identità valido prima dell’erogazione del premio.',
        ],
      },
      {
        title: '6. Premi',
        body: [
          `Montepremi riservato ai clienti: ${users}, erogati in bitcoin sulla rete Lightning, così ripartito: ${prizeList.users}.`,
          `Montepremi riservato ai merchant: ${merchants} in Tether Gold (XAUT) sulla rete Ethereum, così ripartito: ${prizeList.merchants}.`,
          'Il premio Top Volume è assegnato sulla base dei volumi registrati dal POS NAKA; i due premi per i contenuti social — uno riservato ai commercianti, uno ai clienti — sono assegnati da una giuria; tutti gli altri premi sono estratti a sorte.',
          'I premi non sono convertibili in denaro contante né sostituibili con altri beni o servizi.',
        ],
      },
      {
        title: '6-bis. Montepremi complessivo e istante di conversione',
        body: [
          `Il montepremi complessivo è dichiarato in satoshi: ${declared}. La cifra è la somma della quota riservata ai clienti, espressa in satoshi, e del controvalore in satoshi della quota riservata ai merchant, espressa in Tether Gold.`,
          `Il controvalore è fissato a un istante determinato e non viene più ricalcolato: il ${anchor.at} (fonte: ${anchor.source}), quando 1 BTC quotava USD ${anchor.btcUsd} e 1 XAUT quotava USD ${anchor.xautUsd}. A quelle quotazioni 2.00 XAUT valevano ${anchor.merchantsSats} satoshi, arrotondati per difetto a 10'000'000 nella cifra dichiarata: il montepremi complessivo annunciato è quindi pari o inferiore al valore effettivo al momento della conversione, mai superiore.`,
          'I premi sono e restano quantità fisse nei rispettivi asset. Le variazioni di mercato successive all’istante di conversione non modificano né le quantità assegnate, né il numero dei premi, né l’ammissibilità dei partecipanti, e non danno diritto ad alcun conguaglio.',
        ],
      },
      {
        title: '6-ter. Premio riservato all’evento Satoshi Spritz',
        body: [
          `Uno dei premi da 500'000 satoshi è riservato all’evento Satoshi Spritz Speciale della Plan ₿ Week. Concorrono a questo premio le sole giocate la cui transazione è stata effettuata fra il ${spritz.from} e le ore ${spritz.to}, presso gli esercenti aderenti all’iniziativa situati in ${spritz.area}.`,
          `L’elenco puntuale dei locali partecipanti alla serata è pubblicato dagli organizzatori dell’evento e riportato su questo sito prima dell’inizio della finestra oraria indicata. In assenza di tale pubblicazione entro l’inizio della finestra, si considerano ammessi tutti gli esercenti aderenti situati all’indirizzo indicato. L’elenco non può essere modificato dopo l’inizio della finestra. Informazioni sull’evento: ${spritz.url}`,
          `L’orario che conta è quello della transazione registrato dal POS NAKA. Se al momento della pubblicazione degli elenchi quel dato non è ancora disponibile, entrano nell’elenco le giocate presso quegli esercenti registrate tra l’inizio della serata e le ore ${spritz.registeredUntil}; per la giocata estratta l’orario della transazione viene verificato sul POS prima del pagamento, come previsto dall’articolo 7, lettera (d).`,
          'Il premio è estratto con la stessa procedura verificabile di cui all’articolo 7, applicata all’elenco ristretto delle giocate ammesse a questo premio, impegnato pubblicamente insieme agli altri. Una giocata ammessa a questo premio partecipa anche all’estrazione generale riservata ai clienti, ma ogni giocata può vincere un solo premio: l’estrazione generale si calcola per prima e, nell’estrazione di questo premio, le giocate già vincitrici nell’estrazione generale vengono saltate.',
        ],
      },
      {
        title: '6-quater. Premio per i contenuti social',
        body: [
          'Due premi non sono estratti a sorte ma assegnati da una giuria: uno riservato ai commercianti aderenti, uno ai clienti. Il premio riservato ai clienti è di 500’000 satoshi.',
          `Possono concorrere le persone fisiche maggiorenni che abbiano registrato almeno una giocata valida nel periodo del concorso. Il contenuto — video, post o immagine — deve essere pubblicato su un profilo pubblico entro il ${social.deadline}, su una delle piattaforme ammesse, e riportare tutti e tre gli hashtag ${social.tags}. Senza tutti e tre gli hashtag il contenuto non è reperibile e non viene valutato.`,
          'La giuria è nominata da NAKA e valuta la qualità del contenuto: l’idea, la cura, la chiarezza del messaggio. Il numero di visualizzazioni o di reazioni non determina il vincitore e non dà diritto ad alcun premio.',
          'Pubblicando il contenuto il partecipante dichiara di esserne l’autore o di averne i diritti, di aver ottenuto il consenso delle persone riprese, e concede a NAKA il diritto non esclusivo di ripubblicarlo sui propri canali citando l’autore, per la durata dell’iniziativa e i sei mesi successivi. Sono esclusi i contenuti offensivi, ingannevoli o che riprendano persone senza il loro consenso.',
        ],
      },
      {
        title: '7. Estrazione verificabile e notifica dei vincitori',
        body: [
          'L’estrazione dei premi sorteggiati è pubblicamente verificabile: chiunque può controllare che i vincitori non siano stati scelti. Si svolge in quattro fasi, sempre in quest’ordine.',
          `(a) Impegno sugli elenchi. Entro le ${commitBy} del ${draw} NAKA pubblica, con una procedura automatica, nella pagina «Vincitori» di questo sito tre elenchi di ID: le giocate ammesse all’estrazione riservata ai clienti, quelle ammesse al premio dell’articolo 6-ter e gli esercenti ammessi all’estrazione riservata ai merchant. Per ciascun elenco pubblica l’impronta SHA-256. Sono ammesse tutte le giocate registrate entro la chiusura e non respinte in sede di verifica, comprese quelle la cui verifica è ancora in corso. Dopo la pubblicazione gli elenchi non possono essere modificati. Una copia dell’impegno è depositata subito presso un archivio pubblico indipendente (Internet Archive, web.archive.org), che ne attesta data e ora.`,
          `(b) Annuncio del seme. Nella stessa pubblicazione NAKA indica l’altezza dell’ultimo blocco della catena Bitcoin in quel momento e fissa come seme l’hash del blocco che si troverà ${blocks} posizioni più avanti. Quel blocco non esiste ancora al momento della pubblicazione: nessuno, NAKA compresa, può conoscerne o sceglierne l’hash. Fa fede il blocco a quell’altezza nella catena con il maggior lavoro accumulato, letto da almeno due esploratori pubblici indipendenti.`,
          '(c) Calcolo. Quando sopra il blocco del seme è stato minato almeno un altro blocco, per ogni ID si calcola sha256("seme:categoria:ID"), dove la categoria è "users" per l’estrazione riservata ai clienti, "spritz" per il premio dell’articolo 6-ter e "merchants" per quella riservata agli esercenti. Gli ID si ordinano dal valore più basso e i premi si assegnano nell’ordine dell’articolo 6; gli ID che seguono sono le riserve, nello stesso ordine. Ogni giocata può vincere un solo premio: l’estrazione riservata ai clienti si calcola per prima, e in quella dell’articolo 6-ter si saltano le giocate che hanno già vinto. Seme, vincitori e riserve sono pubblicati integralmente.',
          '(d) Verifica dei vincitori. Prima del pagamento ogni giocata estratta è riscontrata sui dati del POS NAKA e sulla prova d’acquisto. Una giocata che non supera la verifica, o il cui titolare non risponde nei termini, è esclusa con la motivazione pubblicata accanto al suo ID, e il premio passa alla prima riserva disponibile. Dopo la pubblicazione degli elenchi non è possibile nessun’altra modifica.',
          `La rete Bitcoin produce in media un blocco ogni dieci minuti, con forte variabilità: l’estrazione avviene di norma tra le ${drawFrom} e le ${drawTo} del ${draw} e mai prima delle ${drawFrom}. Un ritardo della rete non modifica né gli elenchi né il seme. Le giocate sono identificate dal solo ID, senza dati personali.`,
          'I vincitori sono notificati via email all’indirizzo indicato in fase di registrazione entro 7 giorni dall’estrazione e devono confermare l’accettazione entro 14 giorni.',
          'Con la comunicazione di vincita viene richiesto al vincitore l’indirizzo su cui accreditare il premio: un indirizzo Lightning per i premi in bitcoin, un indirizzo Ethereum compatibile con il token XAUT per i premi in Tether Gold. Il trasferimento avviene entro 30 giorni dalla ricezione dell’indirizzo. NAKA non risponde di indirizzi errati, incompatibili con l’asset del premio o non più accessibili.',
        ],
      },
      {
        title: '8. Trattamento dei dati personali (LPD / GDPR)',
        body: [
          'Titolare del trattamento è NAKA. I dati raccolti (email, dati della transazione, nome dell’esercente, immagine della prova d’acquisto e, per i soli vincitori, l’indirizzo su cui ricevere il premio) sono trattati esclusivamente per la gestione del concorso, la verifica antifrode e l’erogazione dei premi.',
          'La base giuridica del trattamento è l’esecuzione del rapporto contrattuale derivante dalla partecipazione al concorso e l’adempimento di obblighi legali.',
          'I dati sono conservati per il tempo necessario alla gestione dell’iniziativa e ai successivi obblighi di legge, quindi cancellati o anonimizzati. Le immagini delle prove d’acquisto sono cancellate al più tardi al ritiro del sito, un mese dopo la comunicazione dei vincitori.',
          `Il partecipante può esercitare in ogni momento i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità scrivendo a ${support}, ai sensi della Legge federale svizzera sulla protezione dei dati (LPD) e del Regolamento (UE) 2016/679 (GDPR).`,
        ],
      },
      {
        title: '9. Manleva e fluttuazione del mercato crypto',
        body: [
          'I premi sono espressi in quantità di criptovaluta — satoshi per i clienti, Tether Gold (XAUT) per i merchant — e non in valuta fiat: il relativo controvalore in CHF/EUR può variare sensibilmente in funzione del prezzo del bitcoin e dell’oro e delle condizioni di mercato. NAKA non garantisce alcun valore minimo.',
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

  /**
   * Sezione «nessuno può scegliere chi vince», in home.
   *
   * È l'argomento più forte con questo pubblico — in quella settimana Lugano è piena di gente
   * che sa cos'è un hash — e nel regolamento, all'articolo 7, non lo legge nessuno.
   */
  draw: {
    eyebrow: 'Estrazione',
    title: 'Nessuno può scegliere chi vince',
    subtitle: 'Nemmeno NAKA. L’esito è un calcolo che chiunque può rifare con i dati pubblicati.',
    steps: (blocks) => [
      {
        title: 'Si congela l’elenco',
        text: 'Entro mezz’ora dalla chiusura pubblichiamo l’elenco di tutte le giocate ammesse e la sua impronta SHA-256. Da lì togliere o aggiungere anche una sola giocata cambierebbe l’impronta, e chiunque se ne accorgerebbe.',
      },
      {
        title: 'Il dado lo tira la rete Bitcoin',
        text: `Nello stesso momento indichiamo il blocco Bitcoin che farà da seme: quello che verrà minato ${blocks} blocchi più avanti, circa un’ora dopo. Quando l’elenco è congelato quel blocco non esiste ancora: nessuno, nemmeno noi, può conoscerne o sceglierne l’hash.`,
      },
      {
        title: 'Il resto è aritmetica',
        text: 'Ogni giocata riceve sha256("seme:users:ID"), la stessa formula che usa lo script di estrazione. Si ordinano dal valore più basso: i primi vincono, i successivi sono le riserve. Dato l’elenco e il seme, il risultato è uno solo.',
      },
    ],
    cta: 'Come funziona l’estrazione, in dettaglio',
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
