/** Testi italiani. Le chiavi devono restare allineate a en.js (verificato da un test). */
const it = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Paga in Crypto e Vinci Bitcoin',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning), USD₮ o XAUT". */
    assetsConjunction: 'o',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Paga in crypto nei negozi aderenti di Lugano e vinci bitcoin: 11 milioni di satoshi in 12 premi, estratti in modo verificabile.',
    ogDescription: 'Paga in crypto sui POS NAKA e partecipa all’estrazione di 11 milioni di satoshi.',
    skipLink: 'Vai al modulo di partecipazione',
    languageLabel: 'Scelta della lingua',
    languageName: 'Italiano',
    switchTo: 'English',
  },

  nav: {
    howItWorks: 'Come funziona',
    prizes: 'Montepremi',
    map: 'Negozi aderenti',
    upload: 'Partecipa',
    merchants: 'Commercianti',
    rules: 'Regolamento',
    cta: 'Registra il pagamento',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    home: 'Paga Crypto Vinci Bitcoin — Home',
  },

  hero: {
    titleLead: 'Paga in Crypto a Lugano e vinci',
    titleGold: 'BITCOIN',
    lead: (event, week) =>
      `Nella settimana del ${event} paga in crypto nei negozi aderenti di Lugano con POS NAKA e registra lo scontrino sul sito: per registrarti bastano trenta secondi, senza app.`,
    leadPrize: (pool, winners, draw) =>
      `In palio ${pool} in ${winners} premi, pagati in bitcoin sulla rete Lightning. L’estrazione è il ${draw}, poco dopo la chiusura: il numero vincente lo decide la rete Bitcoin, non noi, e chiunque può controllare il risultato.`,
    topPrize: 'Primo premio',
    ctaUpload: 'Registra il pagamento',
    ctaMap: 'Trova i negozi aderenti',
    area: 'Lugano',
    /** «da lunedì 19 ottobre alle 08:00 a sabato 24 ottobre alle 16:00», dalle date in CONTEST. */
    week: (fromDay, fromTime, toDay, toTime) => `da ${fromDay} alle ${fromTime} a ${toDay} alle ${toTime}`,
    forumStrip: (event, dates, venue) => `${event} · ${dates} · ${venue}`,
    forumTickets: 'Biglietti del forum',
    forumNote: 'Il forum dura due giorni al Palazzo dei Congressi. L’iniziativa dura tutta la settimana nei negozi della città.',
    statMerchants: 'Negozi del circuito NAKA a Lugano',
    statAssets: (assets) => `Asset accettati: ${assets}`,
    statPool: 'Montepremi complessivo dichiarato',
    rowTotal: 'Montepremi',
    valueNote:
      'Il montepremi complessivo è di 21 milioni di satoshi: 11 milioni ai clienti, in bitcoin, e l’equivalente di 10 milioni ai negozi aderenti.',
    rowUsers: 'Ai clienti, in bitcoin',
    rowMerchants: 'Ai commercianti',
    merchantsLink: 'Sei un commerciante? I tuoi premi',
    rowAsset: 'Come si ricevono',
    rowAssetValue: 'In bitcoin, sulla rete Lightning',
    disclaimer:
      'I premi sono quantità fisse di satoshi: il controvalore in franchi o in dollari può cambiare, la quantità che ricevi no.',
    entryBoxTitle: 'Hai già pagato in crypto?',
    entryBoxText: 'Foto dello scontrino, numero della transazione e importo: è tutto quello che serve.',
    entryBoxCta: 'Registra il pagamento',
  },

  countdown: {
    loading: 'Caricamento countdown…',
    toStart: 'Mancano al via dell’iniziativa',
    demo: 'Finestra di prova — non sono le date vere',
    running: 'Iniziativa in corso — tempo rimasto per partecipare',
    ended: 'Concorso chiuso — estrazione in preparazione',
    days: 'Giorni',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
  },

  how: {
    eyebrow: 'Come funziona',
    title: 'Tre passaggi, meno di un minuto',
    subtitle: 'Dal pagamento alla partecipazione valida: niente account e niente app per registrarti.',
    steps: () => [
      {
        title: 'Paga in crypto',
        text: 'Fai un acquisto in un negozio aderente e paga sul POS NAKA con uno di questi asset.',
      },
      {
        title: 'Registra il pagamento',
        text: 'Nel modulo qui sotto inserisci il numero della transazione stampato sulla ricevuta, l’importo, il negozio e la foto dello scontrino.',
      },
      {
        title: 'Vinci bitcoin',
        text: 'Ricevi per email la conferma con il tuo ID di partecipazione: sei nell’estrazione dei premi in satoshi.',
      },
    ],
    payEyebrow: 'Come si paga',
    payTitle: 'Due modi di pagare, due cose da sapere',
    paySubtitle:
      'Sul POS si paga in bitcoin sulla rete Lightning oppure in USD₮ o Tether Gold dalla loro rete: sono due procedure diverse. Per la prima bastano un wallet Lightning e il QR del terminale; per la seconda ci sono reti e commissioni da sapere, e le spieghiamo qui sotto.',
    guideTitle: 'In bitcoin, sulla rete Lightning',
    guideText:
      'Si scansiona il QR del terminale e si conferma: nessun indirizzo da copiare, nessuna rete da scegliere. Serve un wallet Lightning, e il circuito Plan ₿ di Lugano ne indica tre.',
    guideWallets: 'I wallet Lightning consigliati dal circuito Plan ₿ Lugano',
    /** Una riga per wallet, per nome: i nomi e i link stanno in lib/wallets.js. */
    walletNotes: {
      Bitkit: 'Wallet Lightning self-custodial, semplice da avviare.',
      Breez: 'Pagamenti Lightning istantanei, adatto ai pagamenti in negozio.',
      'Wallet of Satoshi': 'Custodial, il più rapido da configurare per chi inizia oggi.',
    },
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
      'Alcuni wallet meno diffusi leggono male la richiesta di pagamento che il terminale mostra nel QR. Se il tuo segnala un errore, o se l’importo e il destinatario non ti tornano, fermati e controlla invece di forzare l’invio: una transazione partita non si annulla. La prima volta che usi un wallet per pagare in negozio, prova con un importo piccolo su Polygon, dove la commissione costa pochi centesimi: su Ethereum la commissione supererebbe l’importo della prova.',
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
      `${winners} premi in bitcoin, pagati sulla rete Lightning. I 21 milioni comprendono anche 10 milioni di satoshi riservati ai negozi aderenti, che hanno premi e regole propri.`,
    usersKicker: 'Clienti · in bitcoin',
    usersNote: 'Montepremi complessivo riservato ai clienti finali',
    poolLabel: 'montepremi',
    each: 'ciascuno',
    spritzDetails: 'Condizioni del premio',
    merchantsRefTitle: 'Hai un negozio aderente?',
    merchantsRefText: 'Per i commercianti ci sono altri 10 milioni di satoshi, con premi e regole propri: li trovi nell’area commercianti.',
    spritzWhen: (day, from, to, area) => `${day}, dalle ${from} alle ${to} · ${area}`,
    spritzNote:
      'Stessa estrazione verificabile degli altri premi, su un elenco più piccolo: le partecipazioni con una transazione in quella finestra, nei negozi aderenti di Piazza Cioccaro. Le stesse partecipazioni entrano anche nell’estrazione generale, ma ognuna può vincere un solo premio: se una vince nel generale, lo Spritz passa alla successiva. Gli organizzatori annunciano i locali della serata poco prima dell’evento: da quel momento il premio si restringe a quelli.',
    spritzLink: 'L’evento sul sito della Plan ₿ Week',
    socialWhen: (deadline) => `Pubblica entro il ${deadline}`,
    socialHow: (tags) =>
      `Racconta il tuo pagamento in crypto a Lugano — video, post o foto — e pubblicalo con tutti e tre gli hashtag ${tags}. Vale per chi ha almeno una partecipazione registrata: il contenuto è il modo di vincere, la partecipazione è il biglietto d’ingresso. Sceglie la giuria NAKA, non il numero di like.`,
    socialDetails: 'Come si partecipa',
    note: (date) =>
      `Estrazione pubblica prevista il ${date}. I premi sono pagati in bitcoin sulla rete Lightning, all’indirizzo che il vincitore comunica dopo l’estrazione.`,
    items: {
      '1° Premio': { place: '1° Premio', desc: 'Estrazione principale tra tutte le partecipazioni valide' },
      '2° Premio': { place: '2° Premio', desc: 'Seconda estrazione tra le partecipazioni valide' },
      '3°–10° Premio': { place: '3°–10° Premio', desc: '8 premi consolazione estratti a sorte' },
      'Video Social Clienti': {
        place: 'Premio Social',
        desc: 'Al miglior contenuto pubblicato da un cliente durante la settimana, scelto dalla giuria NAKA',
      },
      'Satoshi Spritz': {
        place: 'Premio Satoshi Spritz',
        desc: 'Estratto a sorte fra le partecipazioni pagate durante la serata del Satoshi Spritz Speciale, nei negozi aderenti di Piazza Cioccaro',
      },
      'Top Numero Transazioni': {
        place: 'Top Numero di Transazioni',
        desc: 'Al negozio che riceve il maggior numero di transazioni crypto sul POS NAKA nel periodo di gara',
      },
      'Best Social Content': {
        place: 'Best Social Content',
        desc: 'Al miglior contenuto pubblicato da un negozio con gli hashtag ufficiali',
      },
      'Estrazione Riservata Merchant': {
        place: 'Estrazione riservata ai negozi',
        desc: 'Due estrazioni tra tutti i negozi con almeno una transazione crypto registrata',
      },
    },
  },

  form: {
    eyebrow: 'Partecipa',
    title: 'Registra il pagamento',
    subtitle:
      'Inserisci il numero della transazione e la foto dello scontrino: servono entrambi per convalidare la partecipazione.',
    email: 'La tua email',
    emailHint: 'La usiamo solo per la conferma e per avvisarti se vinci.',
    emailPlaceholder: 'nome@dominio.ch',
    proofLegend: 'Prova d’acquisto',
    proofIntro: ['Servono', 'entrambe', ': il numero della transazione per il riscontro automatico sul POS e la foto dello scontrino per la verifica documentale.'],
    txLabel: 'Ultimi 6 caratteri del n° transazione',
    txHint: 'Bastano gli ultimi 6, lettere comprese: li trovi in fondo alla riga «N° TRANSAZIONE» della ricevuta.',
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
    acceptRulesLink: 'Regolamento ufficiale e l’Informativa privacy (LPD/GDPR)',
    submit: 'Registra il pagamento',
    submitting: 'Verifica in corso…',
    footnote:
      'Lo stesso numero di transazione può essere registrato una sola volta. Le partecipazioni sono sottoposte a controllo incrociato con i dati del POS NAKA. L’indirizzo Lightning per ricevere il premio ti verrà richiesto via email solo in caso di vincita.',
    networkError: 'Connessione non disponibile. Verifica la rete e riprova.',
    genericError: 'Invio non riuscito. Riprova tra qualche istante.',
    errors: {
      email_invalid: 'Inserisci un indirizzo email valido (es. nome@dominio.ch).',
      tx_missing: 'Inserisci il numero della transazione: lo trovi sulla ricevuta del POS.',
      tx_invalid: 'Numero della transazione non valido: copialo dalla ricevuta (almeno 6 caratteri).',
      tx_duplicate: 'Questi caratteri e questo importo risultano già registrati. Se non sei stato tu, scrivici: la partecipazione viene verificata a mano.',
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
        `${organizer} gestisce i POS crypto dei negozi aderenti. Il concorso è promosso e i premi sono erogati direttamente da ${organizer}: i tuoi dati non vengono ceduti a nessun altro.`,
      link: 'naka.com',
    },

    txHelp: {
      toggle: 'Dove trovo questo numero?',
      text: 'Sulla ricevuta NAKA cerca la voce «N° TRANSAZIONE», stampata su due righe, sopra la voce del terminale. Ti servono solo gli ultimi 6 caratteri, cioè la fine della seconda riga: nell’esempio b72134bf088d4df88eaf5 5c3b90adca2 sono 0adca2. Se preferisci incollare il numero intero, va bene lo stesso.',
      receiptLabel: 'NAKA',
    },

    closed: {
      demoTitle: 'Anteprima del sito',
      demoText:
        'Stai guardando una versione dimostrativa: il modulo di partecipazione verrà attivato all’apertura del concorso. Nessun dato viene raccolto.',
      upcomingTitle: 'Le registrazioni non sono ancora aperte',
      upcomingText: (date) =>
        `Potrai registrare le tue partecipazioni dal ${date}. Nel frattempo scopri i negozi aderenti.`,
      closedTitle: 'Registrazioni chiuse',
      closedText: (date) =>
        `Il termine per registrare le partecipazioni è scaduto il ${date}. I vincitori vengono avvisati via email.`,
      cta: 'Vedi i negozi aderenti',
    },
    modal: {
      title: 'Partecipazione registrata!',
      subtitle: 'Conserva la prova d’acquisto — scontrino cartaceo o ricevuta digitale — fino alla comunicazione dei vincitori.',
      idLabel: 'Il tuo ID di partecipazione è',
      copied: 'Copiato negli appunti',
      rowEmail: 'Email',
      rowProof: 'Prova d’acquisto',
      rowTx: 'Ultimi 6 caratteri',
      rowAmount: 'Importo',
      rowMerchant: 'Negozio',
      rowDate: 'Registrata il',
      rowStatus: 'Stato',
      statusValue: 'In verifica',
      emailSent: (email) => `Abbiamo inviato la conferma a ${email} con il riepilogo della partecipazione. Se non la trovi, controlla la posta indesiderata.`,
      nextSteps:
        'Riceverai una seconda email alla convalida. In caso di vincita ti chiederemo l’indirizzo Lightning su cui accreditare il premio in bitcoin: NAKA non chiede mai chiavi private o frasi di recupero.',
      close: 'Ho capito',
    },
  },

  map: {
    eyebrow: 'Negozi',
    title: 'Dove pagare in crypto a Lugano',
    subtitle: (event) =>
      `I negozi del circuito NAKA a Lugano, attivi durante la settimana del ${event}.`,
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
    openMap: 'Apri la mappa dei negozi',
    standaloneTitle: 'Negozi aderenti',
    searchPlaceholder: 'Cerca per nome o via…',
    searchLabel: 'Cerca un negozio',
    clearSearch: 'Cancella ricerca',
    resultsOne: 'negozio trovato',
    resultsMany: 'negozi trovati',
    inCategory: (category) => ` in "${category}"`,
    showMore: (n) => `Mostra altri ${n} negozi`,
    emptyTitle: 'Nessun negozio trovato',
    emptyText: 'Prova con un altro nome, via o categoria.',
    directions: 'Indicazioni',
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
    closeCard: 'Chiudi la scheda del negozio',
    categories: {
      all: 'Tutti',
      food: 'Ristoranti e bar',
      shopping: 'Shopping',
      hotel: 'Hotel',
      services: 'Servizi',
    },
  },

  mapPage: {
    metaTitle: 'Mappa dei negozi che accettano crypto a Lugano',
    metaDescription:
      'La mappa dei negozi aderenti di Lugano dove pagare in bitcoin, USD₮ e Tether Gold sul POS NAKA: trova quelli vicino a te.',
    eyebrow: 'Mappa',
    title: 'Dove pagare in crypto, vicino a te',
    intro: (n) =>
      `${n} negozi di Lugano con il POS NAKA. Attiva la posizione per vedere i più vicini, oppure cerca per nome, via o categoria.`,
    backToSite: 'Torna al concorso',
    locate: 'Trova i negozi vicino a me',
    locateAgain: 'Aggiorna la mia posizione',
    locating: 'Cerco la tua posizione…',
    denied: 'Non abbiamo accesso alla posizione: puoi attivarla nelle impostazioni del browser, oppure cercare per via.',
    unsupported: 'Questo browser non condivide la posizione: cerca il negozio per nome o per via.',
    far: 'Sei lontano da Lugano: ti mostriamo comunque i negozi più vicini a te.',
    nearest: (name, distance) => `Il più vicino: ${name}, ${distance}`,
    privacy: 'La posizione resta sul tuo telefono: serve solo a ordinare i negozi e non viene inviata a nessuno.',
    youAreHere: 'Sei qui',
    listNear: 'I più vicini a te',
    listAll: 'Tutti i negozi',
    showOnMap: 'Mostra sulla mappa',
    resetView: 'Tutta Lugano',
    showMore: (n) => `Mostra altri ${n}`,
    attribution: 'Mappa © contributori di OpenStreetMap',
    howToPay: 'Paga sul POS NAKA, poi registra il pagamento per partecipare all’estrazione.',
    enter: 'Registra il pagamento',
  },

  faq: {
    eyebrow: 'FAQ e assistenza',
    title: 'Domande frequenti',
    helpTitle: 'Non hai trovato la risposta?',
    helpText: 'Il team assistenza risponde entro 24 ore lavorative.',
    helpCta: 'Contatta l’assistenza',
    items: [
      {
        q: 'Chi può partecipare?',
        a: 'Chiunque sia maggiorenne e paghi in crypto su un POS NAKA in un negozio aderente di Lugano, dal 19 ottobre alle 08:00 al 24 ottobre alle 16:00. Non serve abitare in Svizzera: valgono anche i visitatori del forum.',
      },
      {
        q: 'Serve un account o un’app?',
        a: 'No. Registri il pagamento dal modulo del sito, anche dal QR esposto in negozio: email, ultimi 6 caratteri del numero della transazione, importo, negozio e foto dello scontrino. Ricevi una conferma con il tuo ID di partecipazione.',
      },
      {
        q: 'Quali criptovalute posso usare su POS NAKA?',
        a: 'Sui POS NAKA si paga in bitcoin sulla rete Lightning, in USD₮ sulle reti Ethereum e Polygon e in Tether Gold sulla rete Ethereum: il terminale non consente altre reti. Molti negozi accettano anche LVGA, che però non dà diritto alla partecipazione al concorso.',
        cta: { label: 'Cerca i negozi aderenti', href: '#mappa' },
      },
      {
        q: 'Non ho ancora un wallet: come faccio a pagare?',
        a: 'Ti serve un wallet che supporti la rete Lightning. Il circuito Plan ₿ consiglia Bitkit, Breez e Wallet of Satoshi: trovi i tutorial ufficiali nella sezione "Come funziona" di questa pagina. La configurazione richiede pochi minuti e non serve alcun conto bancario. Per procurarti i bitcoin, la guida ufficiale del circuito Plan ₿, linkata nella stessa sezione, indica dove comprarli in città.',
      },
      {
        q: 'Entro quando devo registrare il pagamento?',
        a: 'Entro sabato 24 ottobre alle 16:00. Valgono solo i pagamenti fatti nel periodo del concorso, dal 19 ottobre alle 08:00.',
      },
      {
        q: 'Quante volte posso partecipare?',
        a: 'Non ci sono limiti al numero di partecipazioni: ogni transazione crypto valida e distinta genera una nuova partecipazione. Lo stesso numero di transazione però può essere registrato una sola volta.',
      },
      {
        q: 'Posso vincere più di un premio?',
        a: 'Ogni partecipazione vince al massimo un premio. Ogni pagamento registrato però è un biglietto a sé: con più partecipazioni puoi vincere più di una volta.',
      },
      {
        q: 'Devo conservare lo scontrino?',
        a: 'Sì, se è cartaceo. La fotografia dello scontrino è obbligatoria già al momento della registrazione, e il cartaceo va conservato fino alla comunicazione dei vincitori: in caso di vincita ne viene richiesta esibizione prima dell’erogazione del premio. Se il negozio emette una ricevuta digitale non devi stampare niente: al momento della partecipazione carichi la schermata e, se vinci, ti basta inoltrare il link della ricevuta che hai ricevuto. Senza una prova d’acquisto verificabile — cartacea o digitale — la partecipazione viene annullata e si procede a una nuova estrazione.',
      },
      {
        q: 'Il concorso si somma al cashback MyLugano?',
        a: 'Sì. Il cashback riconosciuto dal circuito cittadino tramite l’app MyLugano resta invariato: la partecipazione al concorso NAKA è un vantaggio aggiuntivo che non sostituisce né riduce le promozioni della Città di Lugano.',
      },
      {
        q: 'Come faccio a sapere che l’estrazione è onesta?',
        a: 'Perché il numero vincente non lo sceglie nessuno. Prima pubblichiamo l’elenco sigillato di tutte le partecipazioni; poi il numero arriva da un blocco Bitcoin che, quando l’elenco viene sigillato, non esiste ancora. Con questi due dati pubblici chiunque rifà il calcolo e trova gli stessi vincitori: la sezione «Nessuno può scegliere chi vince» lo spiega passo per passo, anche per chi vuole controllare con i propri strumenti.',
      },
      {
        q: 'Come so se ho vinto?',
        a: 'Ti scriviamo all’email della partecipazione entro 7 giorni dall’estrazione. Puoi anche controllare da te: la pagina «Vincitori» pubblica gli ID estratti, e il tuo ID è nell’email di conferma. Nessun dato personale viene pubblicato.',
      },
      {
        q: 'Come vengono accreditati i premi?',
        a: 'Non serve indicare alcun wallet per partecipare. Se risulti vincitore ti scriviamo all’email indicata nel modulo e ti chiediamo in quel momento l’indirizzo su cui accreditare il premio: un indirizzo Lightning, su cui arrivano i satoshi. Il trasferimento avviene entro 30 giorni. Un indirizzo errato non consente il recupero dei fondi.',
      },
      {
        q: 'Cosa succede se il prezzo di bitcoin cambia?',
        a: 'I premi sono quantità fisse di satoshi, non importi in franchi. Il controvalore in CHF può quindi aumentare o diminuire con il mercato: NAKA non garantisce alcun valore fiat minimo. Anche i 21 milioni di satoshi dichiarati sono un’equivalenza fissata a un istante preciso, citato nel regolamento all’articolo 6-bis: le variazioni successive non cambiano né le quantità né il numero dei premi.',
      },
      {
        q: 'Che cosa fate dei miei dati?',
        a: 'Li usiamo solo per gestire il concorso, verificare le partecipazioni ed erogare i premi: email, dati della transazione, negozio e foto dello scontrino; l’indirizzo per ricevere il premio lo chiediamo solo ai vincitori. A concorso archiviato i dati personali vengono cancellati. Tutti i dettagli sono nell’informativa privacy.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — l’iniziativa ${organizer} per il ${event} di ${city}. Paga in crypto sui POS NAKA e vinci bitcoin.`,
    contestHeading: 'Concorso',
    legalHeading: 'Legale',
    faq: 'FAQ e assistenza',
    mapPage: 'Mappa dei negozi',
    winners: 'Vincitori ed estrazione',
    linkedin: 'NAKA su LinkedIn',
    bestVideo: 'Area commercianti',
    rules: 'Regolamento completo',
    privacy: 'Informativa privacy (LPD/GDPR)',
    support: 'Contatti dell’assistenza',
    copyright: (organizer) =>
      `© 2026 ${organizer}. Tutti i diritti riservati. I premi sono quantità fisse di criptovaluta: il loro controvalore può variare con il mercato.`,
    backToTop: 'Torna su',
    navLabel: 'Navigazione sezioni',
    legalLabel: 'Informazioni legali',
  },

  email: {
    subject: (id, contest) => `Partecipazione ${id} registrata — ${contest}`,
    greeting: 'Ciao,',
    intro: (contest, event, city) =>
      `abbiamo registrato la tua partecipazione al concorso "${contest}" — ${event}, ${city}.`,
    heading: 'Partecipazione registrata',
    rowId: 'ID di partecipazione',
    rowTx: 'Ultimi 6 caratteri',
    rowAmount: 'Importo',
    rowMerchant: 'Negozio',
    rowReceipt: 'Scontrino allegato',
    rowDate: 'Registrata il',
    rowStatus: 'Stato',
    statusValue: 'In verifica',
    nextTitle: 'Che cosa succede ora',
    next: (drawDate) => [
      'Verifichiamo la transazione confrontandola con i dati registrati sul POS NAKA.',
      'Ricevi una seconda email quando la partecipazione è convalidata.',
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
    title: 'Registra il pagamento',
    intro: 'Hai pagato in crypto sul POS NAKA? Bastano email, numero della transazione e foto dello scontrino.',
    backToSite: 'Vai al sito del concorso',
    deadline: (date) => `Registrazioni aperte fino al ${date}`,
  },

  stats: {
    entries: 'partecipazioni registrate',
    prizes: 'premi in palio',
    merchants: 'negozi aderenti',
    odds: (entries, prizes) => `${entries} partecipazioni finora per ${prizes} premi.`,
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
          `Titolare del trattamento è ${organizer}, che promuove il concorso ed eroga i premi. Per qualunque richiesta relativa ai tuoi dati puoi scrivere a ${support}.`,
        ],
      },
      {
        title: 'Quali dati raccogliamo, e solo quando partecipi',
        body: [
          'Navigare il sito non richiede alcun dato. I dati vengono raccolti soltanto se registri una partecipazione, e sono quelli che il modulo ti chiede esplicitamente:',
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
          'Per gestire la tua partecipazione: verificare che la transazione sia reale, evitare partecipazioni duplicate o fraudolente, effettuare l’estrazione e consegnare il premio. La base giuridica è l’esecuzione del rapporto che nasce con la tua partecipazione, insieme agli obblighi di legge che ne derivano.',
          'L’indirizzo del wallet viene chiesto soltanto ai vincitori, via email, dopo l’estrazione: non lo raccogliamo da chi partecipa e basta.',
        ],
      },
      {
        title: 'Per quanto tempo',
        body: [
          `Le partecipazioni si raccolgono fino al ${collectedUntil}. L’estrazione si tiene il ${drawDate} e l’elenco dei vincitori resta pubblicato fino al ${onlineUntil}, con i soli ID delle partecipazioni: nessun nome, nessuna email.`,
          `Entro quella data email, fotografie degli scontrini e numeri di transazione vengono cancellati in modo irreversibile. Restano soltanto dati che non identificano nessuno — ID della partecipazione, esito, data — necessari al rendiconto e a lasciare verificabile l’estrazione già pubblicata.`,
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
          `Puoi chiedere in qualunque momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, opporti o riceverli in formato leggibile, scrivendo a ${support}. La cancellazione prima dell’estrazione comporta l’esclusione dal concorso, perché senza i dati della partecipazione non è possibile verificarla né assegnare un premio.`,
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
          `I commercianti che aderiscono all’iniziativa possono scrivere a ${merchantSupport}. I dati di contatto dei negozi sono trattati per la gestione dell’adesione e la comunicazione dell’iniziativa.`,
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
      `Entro le ${commitBy} del ${date} qui compaiono gli elenchi delle partecipazioni ammesse e il numero del blocco Bitcoin che farà da seme. I vincitori arrivano appena quel blocco viene minato, insieme ai dati per rifare il calcolo.`,
    committedTitle: 'Elenchi pubblicati: si aspetta il blocco',
    committedText: (height, time) =>
      `Gli elenchi qui sotto sono stati pubblicati il ${time} e non possono più cambiare. Il seme sarà l’hash del blocco Bitcoin numero ${height}, che in quel momento non era ancora stato minato. Si estrae appena sopra di lui ne arriva almeno un altro.`,
    committedAt: 'Elenchi pubblicati il',
    tipLabel: 'Ultimo blocco al momento della pubblicazione',
    seedHeightLabel: 'Blocco che fa da seme',
    openBlock: 'Apri il blocco',
    listsTitle: 'File per rifare il calcolo',
    lists: { users: 'Partecipazioni dei clienti', spritz: 'Partecipazioni Satoshi Spritz', merchants: 'Negozi', commitment: 'Impegno completo', result: 'Risultato completo' },
    listCount: (n) => `${n} ID`,
    download: 'Scarica',
    hashLabel: 'Impronta SHA-256',
    reservesTitle: 'Riserve, in ordine',
    reservesNote: 'Se una partecipazione estratta non supera la verifica, il premio passa alla prima riserva disponibile.',
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
      'Immagina un’urna con dentro tutte le partecipazioni, sigillata davanti a tutti prima che si sappia quale numero vincerà. Una volta sigillata non si può più aggiungere né togliere nessuno, e il numero lo estrae qualcuno che nessuno controlla.',
      'L’estrazione funziona così. Alle 16:00 chiudiamo le registrazioni ed entro mezz’ora pubblichiamo l’elenco delle partecipazioni: è l’urna sigillata, e da quel momento non si tocca più. Nello stesso momento diciamo quale numero deciderà: l’hash di un blocco Bitcoin che verrà minato circa un’ora dopo. Quel numero non lo sceglie nessuno: lo produce la rete Bitcoin, come fa ogni dieci minuti da più di quindici anni, senza sapere nulla di noi né del concorso.',
      'A quel punto non resta niente da decidere: una formula abbina il numero alle partecipazioni e stabilisce l’ordine. Chiunque abbia l’elenco e il numero rifà lo stesso conto e ottiene gli stessi vincitori — noi compresi, che non possiamo ottenere un risultato diverso nemmeno volendo. Dopo resta solo da controllare che le partecipazioni vincenti siano vere: se una non lo è, il premio passa a chi la segue nell’ordine già pubblicato.',
    ],
    howEyebrow: 'Trasparenza',
    howTitle: 'Come funziona l’estrazione',
    howIntro:
      'Il problema di qualunque concorso non è estrarre un numero a caso: è dimostrare a un estraneo che il numero non è stato scelto dopo aver visto i partecipanti. Si risolve prendendo due impegni pubblici, in quest’ordine.',
    steps: (blocks) => [
      {
        title: 'Si congela l’elenco',
        text: 'Entro mezz’ora dalla chiusura pubblichiamo gli ID di tutte le partecipazioni ammesse, in tre elenchi (clienti, Satoshi Spritz, negozi), con l’impronta SHA-256 di ciascuno. Da quel momento cambiare anche una sola riga cambia l’impronta, e chiunque se ne accorge.',
      },
      {
        title: 'Si annuncia il seme prima che esista',
        text: `Nella stessa pubblicazione indichiamo l’ultimo blocco Bitcoin minato in quel momento e fissiamo il seme: l’hash del blocco che arriverà ${blocks} posizioni dopo, in media un’ora più tardi. Nessuno, organizzatore compreso, può prevederlo né sceglierlo.`,
      },
      {
        title: 'Il resto è aritmetica',
        text: 'Per ogni partecipazione si calcola sha256("seme:categoria:ID") — la categoria è "users", "spritz" o "merchants" — e si ordinano i risultati dal più basso. I primi vincono, i successivi sono le riserve; ogni partecipazione vince al massimo un premio. Con elenchi e seme chiunque rifà il conto e ottiene gli stessi ID.',
      },
      {
        title: 'Si verificano i vincitori',
        text: 'Prima di pagare controlliamo sui dati del POS NAKA e sullo scontrino che le partecipazioni estratte siano vere. Una partecipazione che non supera il controllo viene esclusa con la motivazione pubblicata qui, e il premio passa alla prima riserva. Nient’altro può cambiare.',
      },
    ],
    resultTitle: 'Risultato dell’estrazione',
    drawnAt: 'Estrazione eseguita il',
    seedLabel: 'Seme (hash del blocco Bitcoin)',
    listHashLabel: 'Impronta dell’elenco',
    participantsLabel: 'Partecipazioni ammesse',
    usersSection: 'Premi clienti',
    spritzSection: 'Premio Satoshi Spritz',
    merchantsSection: 'Premi dei negozi',
    entryId: 'ID di partecipazione',
    prizeCol: 'Premio',
    amountCol: 'Importo',
    notDrawnTitle: 'Premi non sorteggiati',
    notDrawnText:
      'Top Numero di Transazioni è una classifica sul numero di pagamenti registrati dal POS e Best Social Content è deciso dalla giuria: non passano dall’estrazione.',
    publishedUntil: (date) => `Questo elenco resta pubblicato fino al ${date}. Dopo quella data il concorso viene archiviato e i dati personali dei partecipanti cancellati.`,
    contacted: 'I vincitori sono contattati via email all’indirizzo usato per la partecipazione. Le partecipazioni sono identificate dal solo ID: nessun dato personale viene pubblicato.',
  },

  video: {
    metaTitle: (pool) => `Area commercianti — ${pool} riservati ai negozi aderenti | NAKA`,
    metaDescription:
      'Tutto quello che serve a un negozio di Lugano: come si aderisce, i premi in Tether Gold riservati ai commercianti, quanto valgono, come si ricevono e le regole del premio social.',
    back: 'Torna al sito del concorso',
    badge: 'Area commercianti',
    titleLead: 'Offri pagamenti crypto e vinci',
    titleGold: 'ORO',
    intro: (event, city, pool) =>
      `I clienti che pagano in crypto vincono bitcoin; tu che il pagamento lo offri vinci oro. Durante il ${event} di ${city} i negozi aderenti si dividono ${pool} in Tether Gold, in quattro premi cumulabili: uno al negozio con più pagamenti crypto, uno al miglior contenuto social e due estratti a sorte. Qui trovi cosa fare, come si vince e chi chiamare.`,
    ctaJoin: 'Conferma l’adesione',
    ctaPrizes: 'Vedi i premi',
    statPrize: 'Montepremi dei negozi',
    statSats: (sats) => `pari a ${sats}`,
    statPeriod: 'Periodo di gara',
    statDeadline: 'Contenuti social entro',
    statSupport: 'Assistenza',
    todoTitle: 'Cosa devi fare',
    todo: [
      'Conferma l’adesione rispondendo all’email di invito, o con il pulsante qui sotto.',
      'Tieni acceso il POS NAKA e incassa in crypto dal 19 al 24 ottobre.',
      'Ricorda a ogni cliente di registrare lo scontrino dal QR.',
    ],

    join: {
      eyebrow: 'Adesione',
      title: 'Aderire richiede due minuti',
      text: 'Nessun modulo e nessun contratto: rispondi all’email di invito di NAKA confermando i dati dell’attività, oppure usa il pulsante qui sotto, che apre un’email già compilata. Senza conferma il negozio non compare nell’elenco ufficiale che i clienti consultano.',
      cta: 'Invia l’email di adesione',
      subject: 'Adesione al concorso "Paga in Crypto e Vinci Bitcoin" - Plan ₿ Forum 2026',
      body: [
        'Buongiorno Team NAKA,',
        '',
        'confermo l’adesione della mia attività al concorso "Paga in Crypto e Vinci Bitcoin" durante il Plan ₿ Forum 2026 di Lugano.',
        '',
        'Nome attività: ',
        'Indirizzo a Lugano: ',
        'Categoria (Ristorazione / Shopping / Hotel / Servizi): ',
        'Referente e telefono: ',
        'ID terminale POS NAKA (se disponibile): ',
        '',
        'Il POS NAKA resta acceso e operativo per tutta la durata dell’iniziativa.',
        '',
        'Cordiali saluti,',
      ],
      missingQuestion: 'Non hai ricevuto l’email di invito?',
      missingCta: 'Chiedi di aderire',
      missingSubject: 'Richiesta di adesione all’iniziativa',
      missingBody: [
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

    merchantPrizes: {
      eyebrow: 'I premi dei negozi',
      title: (pool) => `${pool} riservati ai commercianti`,
      subtitle:
        'Tre categorie, quattro premi, tutti cumulabili: lo stesso negozio può vincerli tutti. Solo il premio social chiede di pubblicare qualcosa; per gli altri basta incassare in crypto.',
      each: 'ciascuno',
      howLabel: 'Come si assegna',
      actionLabel: 'Cosa devi fare',
      how: {
        transactions: 'Classifica sul numero di transazioni registrate dal POS NAKA',
        jury: 'Il pubblico porta in finale i contenuti più seguiti, la giuria NAKA sceglie il vincitore',
        draw: 'Estrazione casuale, verificabile da chiunque',
      },
      items: {
        'Top Numero Transazioni': {
          title: 'Top Numero di Transazioni',
          text: 'Va al negozio che riceve più transazioni crypto sul POS NAKA nel periodo di gara. Conta quante volte incassi, non quanto: un caffè vale quanto un orologio. Conta ogni pagamento andato a buon fine, anche se il cliente non lo registra sul sito.',
          action: 'Accetta crypto a ogni occasione. Non contano i pagamenti annullati o rimborsati, quelli fatti da te o dal tuo personale e gli importi divisi apposta o simbolici. A parità vince chi ha incassato di più in totale. La classifica la calcoliamo noi dai dati del POS.',
        },
        'Best Social Content': {
          title: 'Best Social Content',
          text: 'Va al miglior contenuto pubblicato dal profilo della tua attività: un video, un post o un’immagine sull’iniziativa. Le regole sono più in basso, nella sezione dedicata.',
          action: 'Pubblica con i tre hashtag entro la scadenza e mandaci il link.',
        },
        'Estrazione Riservata Merchant': {
          title: 'Estrazione riservata ai negozi',
          text: 'Due premi da 0.25 XAUT, estratti a sorte fra i negozi con almeno un pagamento crypto registrato sul sito da un cliente. Ogni negozio ha un solo biglietto: incassarne cento non aumenta le probabilità.',
          action: 'Incassa almeno un pagamento in crypto e chiedi al cliente di registrarlo.',
        },
      },
      note: (date) =>
        `Il premio Top Numero di Transazioni si assegna dai dati del POS a iniziativa chiusa; le estrazioni riservate ai negozi si tengono il ${date} con la stessa procedura verificabile usata per i clienti.`,
    },

    value: {
      eyebrow: 'Quanto vale e come lo ricevi',
      title: 'Premi in oro, in quantità fisse',
      items: ({ at, btcUsd, xautUsd, source }) => [
        {
          title: 'Quanto vale',
          text: `I 2.00 XAUT del montepremi dei negozi valevano 10'000'000 di satoshi al cambio del ${at} (1 XAUT = USD ${xautUsd}, 1 BTC = USD ${btcUsd}, fonte ${source}). È per questo che il concorso dichiara 21 milioni di satoshi in tutto: 11 ai clienti e 10 ai negozi.`,
        },
        {
          title: 'Quantità fisse',
          text: 'Vinci XAUT, non franchi: il controvalore segue il prezzo dell’oro e può salire o scendere, la quantità vinta no. NAKA non garantisce un valore minimo.',
        },
        {
          title: 'Dove arriva',
          text: 'In Tether Gold sulla rete Ethereum. Serve un indirizzo Ethereum che accetti XAUT, per esempio di MetaMask o Trust Wallet: te lo chiediamo solo se vinci. Un indirizzo sbagliato non permette di recuperare i fondi.',
        },
        {
          title: 'Quando',
          text: 'Ti scriviamo entro 7 giorni dall’estrazione; hai 14 giorni per accettare e indicarci l’indirizzo, e il premio arriva entro 30 giorni.',
        },
      ],
    },

    merchantGuide: {
      eyebrow: 'Guida per i commercianti',
      title: 'Come funziona per te, passo per passo',
      subtitle: 'Cosa fare prima, durante e dopo la settimana del forum.',
      steps: [
        {
          title: '1. Conferma l’adesione',
          text: 'Rispondi all’email di invito confermando nome, indirizzo e referente dell’attività, oppure usa il pulsante «Invia l’email di adesione» più in alto. Da quel momento il negozio è nell’elenco ufficiale e sulla mappa che i clienti consultano.',
        },
        {
          title: '2. Tieni acceso il POS NAKA',
          text: 'È l’unico requisito tecnico. Il terminale con cui già incassi bitcoin su Lightning, USD₮ e Tether Gold registra da solo le transazioni valide: non installi nulla, non cambi le procedure di cassa, non ci sono costi aggiuntivi.',
        },
        {
          title: '3. Incassa in crypto durante la settimana',
          text: 'Il periodo di gara va da lunedì 19 ottobre alle 08:00 a sabato 24 ottobre alle 16:00. Ogni pagamento in crypto di un cliente conta due volte: per il tuo Top Numero di Transazioni e come partecipazione del cliente all’estrazione.',
        },
        {
          title: '4. Ricorda ai clienti di registrare lo scontrino',
          text: 'Il pagamento da solo non basta al cliente: deve registrarlo sul sito con numero della transazione e foto dello scontrino. La frase che funziona alla cassa è una: «se registri lo scontrino partecipi all’estrazione di 11 milioni di satoshi». Una registrazione serve anche a te: senza, il negozio non entra nell’estrazione a lui riservata.',
        },
        {
          title: '5. Se vuoi, punta al premio social',
          text: 'Un video, un post o un’immagine con i tre hashtag ti mette in gara per il Best Social Content, e ti fa vedere dai visitatori del forum e dal pubblico locale. I contenuti migliori li ripubblica anche NAKA.',
        },
        {
          title: '6. Ricevi i premi in Tether Gold',
          text: 'A concorso chiuso contiamo le transazioni del POS, la giuria sceglie il contenuto vincitore e si tengono le estrazioni riservate ai negozi. Se vinci ti scriviamo noi: tempi e indirizzo sono spiegati in «Quanto vale e come lo ricevi».',
        },
      ],
      qrTitle: 'Il materiale e i suoi QR',
      qrText:
        'Locandina, cartoncino da banco e vetrofania hanno il QR per i clienti: porta al modulo di registrazione ed è quello da far inquadrare alla cassa. Il volantino per i commercianti ha invece il QR che porta a questa pagina, per te e il tuo personale.',
    },

    faqEyebrow: 'Domande dei negozi',
    faqTitle: 'Domande frequenti dei commercianti',
    faq: [
      {
        q: 'Un pagamento conta anche se il cliente non lo registra?',
        a: 'Per il Top Numero di Transazioni sì: contano tutte le transazioni crypto andate a buon fine sul tuo POS. Per l’estrazione riservata ai negozi invece serve almeno un pagamento registrato sul sito da un cliente: per questo conviene ricordarlo a tutti.',
      },
      {
        q: 'Contano i pagamenti fatti da me o dal mio personale?',
        a: 'No. Non contano le transazioni del titolare o del personale, quelle annullate o rimborsate e quelle divise apposta o di importo simbolico per far crescere il numero.',
      },
      {
        q: 'Posso vincere più di un premio?',
        a: 'Sì: i premi sono cumulabili, lo stesso negozio può vincerli tutti.',
      },
      {
        q: 'Devo installare qualcosa o pagare qualcosa?',
        a: 'No. Basta il POS NAKA che usi già, acceso e aggiornato: non ci sono costi aggiuntivi.',
      },
      {
        q: 'E se il prezzo dell’oro cambia?',
        a: 'I premi sono quantità fisse di XAUT: il loro controvalore in franchi può salire o scendere, la quantità che ricevi no.',
      },
      {
        q: 'Il mio negozio non è nell’elenco: posso aderire?',
        a: 'Sì: usa «Chiedi di aderire» nella sezione Adesione, o scrivi all’assistenza commercianti.',
      },
    ],

    socialEyebrow: 'Premio Best Social Content',
    socialTitle: 'Il premio social, in breve',
    socialSubtitle: (deadline, close) =>
      `Attenzione alle due date: i contenuti si pubblicano entro ${deadline}, mentre le transazioni e le partecipazioni dei clienti contano fino a ${close}.`,
    contentTitle: 'Che cosa puoi pubblicare',
    contentSubtitle: 'Un video, un post o un’immagine: vale qualunque contenuto che parli dell’iniziativa e attiri davvero l’attenzione.',
    contentTypes: [
      { title: 'Un video', desc: 'Reel, TikTok o clip breve: mostra il pagamento in crypto sul POS o racconta l’iniziativa.' },
      { title: 'Un post', desc: 'Un testo che spiega perché accetti crypto e invita i clienti a partecipare al concorso.' },
      { title: 'Un’immagine', desc: 'Una foto curata del negozio, della vetrina o del materiale dell’iniziativa, con una didascalia che racconta.' },
    ],
    platformsTitle: 'Dove pubblicare',
    platformsNote: 'Su LinkedIn puoi anche taggare direttamente la pagina NAKA.',
    hashtagsTitle: 'Hashtag obbligatori',
    hashtagsText: ['Devono comparire ', 'tutti e tre', ' nella didascalia: è così che troviamo i contenuti in gara. Senza, il contenuto non viene conteggiato.'],
    mentionsTitle: 'Profili che puoi menzionare',
    mentionsNote: 'Le menzioni sono facoltative: servono solo ad aiutarci a trovare il contenuto.',
    stepsTitle: 'Tre passaggi',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Prepara il contenuto',
        text: `Un video, un post o un’immagine sull’iniziativa. Se è un video: da ${min} a ${max} secondi, in verticale ${ratio}.`,
      },
      {
        title: 'Pubblica con i tre hashtag',
        text: `Su ${platforms}, dal profilo pubblico della tua attività.`,
      },
      {
        title: 'Mandaci il link',
        text: `A ${email}, entro il ${deadline}: è il passaggio che mette ufficialmente in gara il contenuto.`,
      },
    ],
    selectionTitle: 'Prima il pubblico, poi la giuria',
    selection: [
      {
        phase: 'Fase 1 — Il pubblico',
        title: 'I contenuti più seguiti vanno in finale',
        desc: 'Contano visualizzazioni, like, commenti e condivisioni raccolti entro la chiusura dell’iniziativa, su qualsiasi piattaforma ammessa. I contenuti con il riscontro più alto formano la rosa dei finalisti.',
      },
      {
        phase: 'Fase 2 — La giuria',
        title: 'Tra i finalisti vince il più convincente',
        desc: 'Tra i contenuti in finale, la giuria NAKA premia quello che racconta meglio l’iniziativa: idea, cura, chiarezza del messaggio e capacità di far venire voglia di provarci.',
      },
    ],
    selectionNote:
      'In pratica: più il contenuto gira, più facile è entrare in finale; in finale però non vince il più visto, vince il più riuscito.',
    noLimitTitle: 'Quanti contenuti vuoi',
    noLimitText:
      'Non c’è un massimo: in finale ci va il contenuto, non il negozio, quindi pubblicarne di più aumenta le probabilità. Ognuno deve avere i tre hashtag ed esserci segnalato.',
    moreTitle: 'Approfondisci: idee, requisiti e diritti d’uso',
    ideasTitle: 'Otto idee che funzionano',
    ideasSubtitle:
      'Non serve un videomaker: bastano uno smartphone, buona luce e un’idea chiara. Prendi uno di questi formati e adattalo alla tua attività.',
    ideas: [
      { title: 'Il pagamento in 10 secondi', desc: 'Primo piano sul POS: QR, scansione, conferma. Nessun parlato, solo il suono della conferma e una scritta finale.', why: 'Il formato più condiviso: dimostra che pagare in crypto è più rapido della carta.' },
      { title: 'Prima volta', desc: 'Un cliente che non ha mai pagato in crypto lo fa davanti alla telecamera, con la sua reazione a fine transazione.', why: 'La faccia di chi scopre una cosa nuova vale più di qualsiasi spiegazione.' },
      { title: 'Crypto vs contanti', desc: 'Schermo diviso: due clienti pagano lo stesso conto, uno in contanti e uno in Lightning. Cronometro a vista.', why: 'Formato a gara: tiene lo spettatore fino alla fine per vedere chi vince.' },
      { title: 'Il tuo prodotto in oro', desc: 'Il piatto, il taglio di capelli o il prodotto del negozio raccontato in chiave "oro": luce calda, dettagli, chiusura sul pagamento.', why: 'Lega il tuo prodotto al tema del concorso senza sembrare uno spot.' },
      { title: 'Dietro il bancone', desc: 'Il titolare spiega in prima persona perché ha scelto di accettare crypto e cosa è cambiato in negozio.', why: 'Autenticità: funziona bene con il pubblico locale e con i media.' },
      { title: 'Tour del quartiere', desc: 'Una camminata tra più negozi aderenti della stessa via, un pagamento per tappa.', why: 'Collabori con i vicini: ognuno pubblica la propria versione e vi rilanciate a vicenda.' },
      { title: 'Turista al forum', desc: 'Un partecipante del Plan ₿ Forum arriva in negozio e paga in Lightning senza avere franchi in tasca.', why: 'Racconta il motivo per cui l’iniziativa esiste, nella settimana in cui la città è piena di visitatori.' },
      { title: 'Errori da evitare', desc: 'Tono ironico: tutti i modi sbagliati di pagare, e poi quello giusto sul POS NAKA.', why: 'L’umorismo è il contenuto che viene salvato e rimandato agli amici.' },
    ],
    requirementsTitle: 'Requisiti',
    requirementsAll: (deadline) => [
      'Pubblicato da un profilo pubblico della tua attività',
      `Pubblicato entro il ${deadline}, con i tre hashtag`,
      'Originale e realizzato per questa iniziativa',
    ],
    requirementsVideoTitle: 'Solo per i video',
    requirementsVideo: ({ min, max, ratio, resolution }) => [
      `Durata tra ${min} e ${max} secondi`,
      `Formato verticale ${ratio}, almeno ${resolution}`,
    ],
    avoidTitle: 'Da evitare',
    avoid: [
      'Musica protetta da copyright: fa rimuovere il contenuto e ti esclude dal premio',
      'Riprendere clienti o dipendenti senza il loro consenso',
      'Mostrare QR code, importi o dati di transazioni reali di altri clienti',
      'Promesse di vincita o messaggi che facciano passare il concorso per una lotteria garantita',
      'Contenuti copiati o ripubblicati da altri',
    ],
    rightsTitle: 'Diritti d’uso e responsabilità',
    rights: (organizer) => [
      `Candidando il contenuto, il commerciante dichiara di esserne l’autore o di averne la piena disponibilità e concede a ${organizer} una licenza gratuita, non esclusiva e senza limiti di tempo per ripubblicarlo sui propri canali, citando l’attività.`,
      `È responsabilità del commerciante raccogliere il consenso delle persone riprese e usare soltanto musica libera da diritti. ${organizer} può escludere in qualsiasi momento i contenuti che violino i termini delle piattaforme, la normativa svizzera sulla protezione dei dati o il buon nome dell’iniziativa.`,
    ],
    rulesLinkBefore: 'Valgono tutti i termini del ',
    rulesLink: 'regolamento ufficiale del concorso',
    rulesLinkAfter: '.',
    support: {
      title: 'Assistenza commercianti',
      text: 'Un dubbio sul POS, sull’adesione o sui premi? Il team NAKA risponde direttamente.',
      emailLabel: 'Email assistenza',
      phoneLabel: 'Telefono assistenza',
      whatsappLabel: 'WhatsApp assistenza',
      reviewTitle: 'Sei soddisfatto del servizio NAKA?',
      reviewText: 'Una recensione aiuta altri commercianti della zona a decidere se accettare crypto.',
      reviewCta: 'Lascia una recensione su Google',
    },
    announcement: {
      text: 'L’annuncio ufficiale dell’iniziativa è sulla pagina LinkedIn di NAKA: seguila per aggiornamenti, vincitori e ricondivisioni dei contenuti migliori.',
      cta: 'Vai alla pagina LinkedIn di NAKA',
    },
    ctaSubmit: 'Candida il tuo contenuto',
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
    title: 'Regolamento ufficiale',
    subtitle: (contest, event, city) => `${contest} — ${event}, ${city}`,
    draftNotice:
      'Bozza operativa predisposta per il concorso: prima della pubblicazione il testo deve essere validato dal consulente legale di NAKA e, se richiesto, notificato all’autorità cantonale competente in materia di concorsi a premio.',
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
          'Sono ammesse le sole transazioni regolate su POS NAKA in bitcoin sulla rete Lightning, in USD₮ sulle reti Ethereum o Polygon e in Tether Gold sulla rete Ethereum. I pagamenti effettuati in valuta tradizionale o tramite altri circuiti, incluso LVGA, non danno diritto a partecipare.',
          'La partecipazione è gratuita: non è previsto alcun costo aggiuntivo rispetto al normale prezzo di acquisto.',
        ],
      },
      {
        title: '4. Modalità di partecipazione',
        body: [
          'Per ogni transazione il partecipante registra il pagamento sul presente sito indicando la propria email, gli ultimi 6 caratteri del numero della transazione, l’importo, l’esercente e la fotografia della prova d’acquisto. Tutti i campi sono obbligatori: il numero della transazione e l’importo servono a riscontrarla sul terminale, l’esercente a individuare il terminale stesso.',
          'L’indirizzo wallet per la ricezione del premio non è richiesto al momento della registrazione: viene domandato via email ai soli vincitori, dopo la verifica della partecipazione.',
          'Ogni transazione valida e distinta dà diritto a una singola partecipazione. Non sono previsti limiti al numero di transazioni per partecipante.',
          'Il partecipante è tenuto a conservare la prova d’acquisto fino alla comunicazione dei vincitori: lo scontrino cartaceo in originale oppure, se l’esercente emette una ricevuta digitale, il link o il documento ricevuto. In caso di vincita ne è richiesta esibizione prima dell’erogazione del premio.',
        ],
      },
      {
        title: '5. Verifica delle transazioni e prevenzione frodi',
        body: [
          'Ogni numero di transazione può essere registrato una sola volta: eventuali duplicati vengono automaticamente rifiutati dal sistema.',
          'Tutte le partecipazioni sono sottoposte a controllo incrociato con i dati di regolamento del gateway POS NAKA per verificarne autenticità, esercente, importo e collocazione temporale nel periodo di gara.',
          'NAKA si riserva il diritto di annullare, senza preavviso, le partecipazioni riconducibili a transazioni annullate, stornate, non riscontrate, generate con finalità elusive o ottenute mediante sistemi automatizzati, nonché di escludere il partecipante dal concorso.',
          'In caso di sospetta frode NAKA può richiedere l’esibizione della prova d’acquisto e di un documento d’identità valido prima dell’erogazione del premio.',
        ],
      },
      {
        title: '6. Premi',
        body: [
          `Montepremi riservato ai clienti: ${users}, erogati in bitcoin sulla rete Lightning, così ripartito: ${prizeList.users}.`,
          `Montepremi riservato agli esercenti: ${merchants} in Tether Gold (XAUT) sulla rete Ethereum, così ripartito: ${prizeList.merchants}.`,
          'Il premio Top Numero di Transazioni è assegnato all’esercente che, nel periodo di gara, riceve il maggior numero di transazioni di pagamento in criptovaluta sul proprio POS NAKA, secondo i dati registrati dal gateway NAKA; i due premi per i contenuti social — uno riservato ai commercianti, uno ai clienti — sono assegnati da una giuria; tutti gli altri premi sono estratti a sorte.',
          'Per il premio Top Numero di Transazioni conta ogni pagamento in criptovaluta andato a buon fine sul POS NAKA dell’esercente nel periodo di gara, qualunque sia l’importo e anche se il cliente non lo ha registrato sul sito. Non sono conteggiate le transazioni annullate o rimborsate, quelle effettuate dall’esercente stesso, dai suoi titolari o dal suo personale, e quelle suddivise artificialmente o di importo simbolico allo scopo di aumentarne il numero. In caso di parità prevale l’esercente con l’importo complessivo incassato più alto nel periodo.',
          'All’estrazione riservata agli esercenti partecipano gli esercenti aderenti per i quali risulta almeno una partecipazione valida di un cliente, registrata sul presente sito e riferita a un pagamento effettuato presso di loro nel periodo di gara. Ogni esercente vi partecipa con un solo biglietto, qualunque sia il numero delle partecipazioni.',
          'I premi non sono convertibili in denaro contante né sostituibili con altri beni o servizi.',
        ],
      },
      {
        title: '6-bis. Montepremi complessivo e istante di conversione',
        body: [
          `Il montepremi complessivo è dichiarato in satoshi: ${declared}. La cifra è la somma della quota riservata ai clienti, espressa in satoshi, e del controvalore in satoshi della quota riservata agli esercenti, espressa in Tether Gold.`,
          `Il controvalore è fissato a un istante determinato e non viene più ricalcolato: il ${anchor.at} (fonte: ${anchor.source}), quando 1 BTC quotava USD ${anchor.btcUsd} e 1 XAUT quotava USD ${anchor.xautUsd}. A quelle quotazioni 2.00 XAUT valevano ${anchor.merchantsSats} satoshi, arrotondati per difetto a 10'000'000 nella cifra dichiarata: il montepremi complessivo annunciato è quindi pari o inferiore al valore effettivo al momento della conversione, mai superiore.`,
          'I premi sono e restano quantità fisse nei rispettivi asset. Le variazioni di mercato successive all’istante di conversione non modificano né le quantità assegnate, né il numero dei premi, né l’ammissibilità dei partecipanti, e non danno diritto ad alcun conguaglio.',
        ],
      },
      {
        title: '6-ter. Premio riservato all’evento Satoshi Spritz',
        body: [
          `Uno dei premi da 500'000 satoshi è riservato all’evento Satoshi Spritz Speciale della Plan ₿ Week. Concorrono a questo premio le sole partecipazioni la cui transazione è stata effettuata fra il ${spritz.from} e le ore ${spritz.to}, presso gli esercenti aderenti all’iniziativa situati in ${spritz.area}.`,
          `L’elenco puntuale dei locali partecipanti alla serata è pubblicato dagli organizzatori dell’evento e riportato su questo sito prima dell’inizio della finestra oraria indicata. In assenza di tale pubblicazione entro l’inizio della finestra, si considerano ammessi tutti gli esercenti aderenti situati all’indirizzo indicato. L’elenco non può essere modificato dopo l’inizio della finestra. Informazioni sull’evento: ${spritz.url}`,
          'Conta l’orario della transazione registrato dal POS NAKA, non quello della registrazione sul sito: la partecipazione può essere registrata fino alla chiusura del concorso indicata all’articolo 2. Se al momento della pubblicazione degli elenchi l’orario del POS di una partecipazione presso quegli esercenti, registrata dopo l’inizio della serata, non è ancora disponibile, la partecipazione entra nell’elenco e, se estratta, l’orario viene verificato sul POS prima del pagamento. Una transazione fuori dalla finestra fa perdere questo premio, che passa alla prima riserva, ma non esclude la partecipazione dall’estrazione generale.',
          'Il premio è estratto con la stessa procedura verificabile di cui all’articolo 7, applicata all’elenco ristretto delle partecipazioni ammesse a questo premio, impegnato pubblicamente insieme agli altri. Una partecipazione ammessa a questo premio entra anche nell’estrazione generale riservata ai clienti, ma ogni partecipazione può vincere un solo premio: l’estrazione generale si calcola per prima e, nell’estrazione di questo premio, le partecipazioni già vincitrici nell’estrazione generale vengono saltate.',
        ],
      },
      {
        title: '6-quater. Premio per i contenuti social',
        body: [
          'Due premi non sono estratti a sorte ma assegnati da una giuria: uno riservato ai commercianti aderenti, uno ai clienti. Il premio riservato ai clienti è di 500’000 satoshi.',
          `Al premio riservato ai clienti possono concorrere le persone fisiche maggiorenni che abbiano registrato almeno una partecipazione valida nel periodo del concorso. Il contenuto — video, post o immagine — deve essere pubblicato su un profilo pubblico entro il ${social.deadline}, su una delle piattaforme ammesse, e riportare tutti e tre gli hashtag ${social.tags}. Senza tutti e tre gli hashtag il contenuto non è reperibile e non viene valutato.`,
          'Per il premio riservato ai clienti la giuria è nominata da NAKA e valuta la qualità del contenuto: l’idea, la cura, la chiarezza del messaggio. Il numero di visualizzazioni o di reazioni non determina il vincitore e non dà diritto ad alcun premio.',
          `Al premio riservato ai commercianti possono concorrere gli esercenti aderenti, con contenuti — video, post o immagine — pubblicati dal profilo pubblico della propria attività entro il ${social.deadline}, con tutti e tre gli hashtag ${social.tags}, e segnalati a NAKA via email entro la stessa data. Per questo premio la selezione avviene in due fasi: i contenuti con il maggiore riscontro del pubblico (visualizzazioni, reazioni, commenti e condivisioni raccolti entro la chiusura dell’iniziativa) formano la rosa dei finalisti; tra questi la giuria nominata da NAKA sceglie il vincitore, secondo l’idea, la cura e la chiarezza del messaggio.`,
          'Pubblicando il contenuto il partecipante dichiara di esserne l’autore o di averne i diritti, di aver ottenuto il consenso delle persone riprese, e concede a NAKA il diritto non esclusivo di ripubblicarlo sui propri canali citando l’autore, per la durata dell’iniziativa e i sei mesi successivi; per i contenuti dei commercianti il diritto è gratuito, non esclusivo e senza limiti di tempo. Sono esclusi i contenuti offensivi, ingannevoli o che riprendano persone senza il loro consenso.',
        ],
      },
      {
        title: '7. Estrazione verificabile e notifica dei vincitori',
        body: [
          'L’estrazione dei premi sorteggiati è pubblicamente verificabile: chiunque può controllare che i vincitori non siano stati scelti. Si svolge in quattro fasi, sempre in quest’ordine.',
          `(a) Impegno sugli elenchi. Entro le ${commitBy} del ${draw} NAKA pubblica, con una procedura automatica, nella pagina «Vincitori» di questo sito tre elenchi di ID: le partecipazioni ammesse all’estrazione riservata ai clienti, quelle ammesse al premio dell’articolo 6-ter e gli esercenti ammessi all’estrazione a loro riservata. Per ciascun elenco pubblica l’impronta SHA-256. Sono ammesse tutte le partecipazioni registrate entro la chiusura e non respinte in sede di verifica, comprese quelle la cui verifica è ancora in corso. Dopo la pubblicazione gli elenchi non possono essere modificati. Una copia dell’impegno è depositata subito presso un archivio pubblico indipendente (Internet Archive, web.archive.org), che ne attesta data e ora.`,
          `(b) Annuncio del seme. Nella stessa pubblicazione NAKA indica l’altezza dell’ultimo blocco della catena Bitcoin in quel momento e fissa come seme l’hash del blocco che si troverà ${blocks} posizioni più avanti. Quel blocco non esiste ancora al momento della pubblicazione: nessuno, NAKA compresa, può conoscerne o sceglierne l’hash. Fa fede il blocco a quell’altezza nella catena con il maggior lavoro accumulato, letto da almeno due esploratori pubblici indipendenti.`,
          '(c) Calcolo. Quando sopra il blocco del seme è stato minato almeno un altro blocco, per ogni ID si calcola sha256("seme:categoria:ID"), dove la categoria è "users" per l’estrazione riservata ai clienti, "spritz" per il premio dell’articolo 6-ter e "merchants" per quella riservata agli esercenti. Gli ID si ordinano dal valore più basso e i premi si assegnano nell’ordine dell’articolo 6; gli ID che seguono sono le riserve, nello stesso ordine. Ogni partecipazione può vincere un solo premio: l’estrazione riservata ai clienti si calcola per prima, e in quella dell’articolo 6-ter si saltano le partecipazioni che hanno già vinto. Seme, vincitori e riserve sono pubblicati integralmente.',
          '(d) Verifica dei vincitori. Prima del pagamento ogni partecipazione estratta è riscontrata sui dati del POS NAKA e sulla prova d’acquisto. Una partecipazione che non supera la verifica, o il cui titolare non risponde nei termini, è esclusa con la motivazione pubblicata accanto al suo ID, e il premio passa alla prima riserva disponibile. Dopo la pubblicazione degli elenchi non è possibile nessun’altra modifica.',
          `La rete Bitcoin produce in media un blocco ogni dieci minuti, con forte variabilità: l’estrazione avviene di norma tra le ${drawFrom} e le ${drawTo} del ${draw} e mai prima delle ${drawFrom}. Un ritardo della rete non modifica né gli elenchi né il seme. Le partecipazioni sono identificate dal solo ID, senza dati personali.`,
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
          'I premi sono espressi in quantità di criptovaluta — satoshi per i clienti, Tether Gold (XAUT) per gli esercenti — e non in valuta fiat: il relativo controvalore in CHF/EUR può variare sensibilmente in funzione del prezzo del bitcoin e dell’oro e delle condizioni di mercato. NAKA non garantisce alcun valore minimo.',
          'Il partecipante riconosce i rischi connessi alla detenzione di asset digitali, inclusa la volatilità e la responsabilità esclusiva sulla custodia delle proprie chiavi private.',
          'NAKA non risponde di malfunzionamenti di rete, ritardi delle blockchain, indisponibilità dei terminali POS o di eventi di forza maggiore che impediscano la registrazione di una partecipazione.',
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
    subtitle:
      'Nemmeno NAKA. Funziona come un’urna sigillata davanti a tutti, da cui il numero vincente lo tira fuori qualcuno che nessuno controlla: la rete Bitcoin.',
    steps: (blocks) => [
      {
        title: 'Si sigilla l’urna, davanti a tutti',
        text: 'Entro mezz’ora dalla chiusura pubblichiamo l’elenco di tutte le partecipazioni con un sigillo digitale. Da quel momento nessuno, nemmeno noi, può aggiungere o togliere un nome senza che il sigillo si rompa sotto gli occhi di tutti.',
      },
      {
        title: 'Il numero lo sceglie la rete Bitcoin',
        text: `Nello stesso momento diciamo da quale blocco Bitcoin arriverà il numero vincente: uno che verrà creato circa un’ora dopo, ${blocks} blocchi più avanti. Quando l’urna viene sigillata quel blocco non esiste ancora: nessuno può conoscerlo né deciderlo.`,
      },
      {
        title: 'Chiunque può rifare il conto',
        text: 'Una formula pubblica abbina quel numero a ogni partecipazione e mette tutti in fila: i primi vincono, i successivi sono le riserve. Stessi dati, stesso risultato, per chiunque lo ricalcoli.',
      },
    ],
    techTitle: 'Per chi vuole verificarlo da sé',
    tech: (blocks) => [
      'Il sigillo è l’impronta SHA-256 del file degli ID pubblicato su «Vincitori»: un ID per riga, in ordine, senza a capo finale. Il comando shasum -a 256 participants-clienti.txt deve restituire l’impronta pubblicata.',
      `Il seme è l’hash del blocco all’altezza annunciata (l’ultimo blocco al momento della pubblicazione + ${blocks}), letto su due esploratori indipendenti, mempool.space e blockstream.info. Si estrae solo quando sopra quel blocco ce n’è almeno un altro.`,
      'Il biglietto di ogni partecipazione è sha256("SEME:users:ID"); si ordinano i biglietti dal valore più basso. Il premio Satoshi Spritz usa "spritz" al posto di "users", i negozi "merchants". Ogni partecipazione vince al massimo un premio: prima si assegnano i premi dei clienti, poi lo Spritz saltando chi ha già vinto.',
    ],
    techCode: 'while read -r id || [ -n "$id" ]; do printf \'%s %s\\n\' "$(printf \'%s\' "$SEME:users:$id" | shasum -a 256 | cut -d\' \' -f1)" "$id"; done < participants-clienti.txt | sort | head -20',
    techCodeLabel: 'I primi 20 della fila, dal terminale (SEME = hash del blocco):',
    cta: 'Elenchi, seme e risultato: la pagina dei vincitori',
  },

  modal: { close: 'Chiudi' },

  notFound: {
    title: 'Questa pagina non esiste',
    text: (contest) =>
      `Il link potrebbe essere scaduto o digitato male. Torna alla home del concorso «${contest}» per registrare la tua partecipazione o trovare i negozi aderenti.`,
    home: 'Torna alla home',
    map: 'Negozi aderenti',
  },

  error: {
    title: 'Qualcosa è andato storto',
    text: 'La pagina non si è caricata correttamente. Riprova: se il problema persiste scrivici a',
    retry: 'Riprova',
  },
};

export default it;
