/** English copy. Keys must mirror it.js (checked by a test). */
const en = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Pay with Crypto and Win Bitcoin',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning), USD₮ or XAUT". */
    assetsConjunction: 'or',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Pay with crypto at participating Lugano shops and win bitcoin: 11 million satoshi for customers, 2.00 XAUT for merchants.',
    ogDescription: 'Pay with crypto on NAKA POS terminals and enter the draw for 11 million satoshi.',
    skipLink: 'Skip to the entry form',
    languageLabel: 'Language selection',
    languageName: 'English',
    switchTo: 'Italiano',
  },

  nav: {
    howItWorks: 'How it works',
    prizes: 'Prize pool',
    map: 'Participating shops',
    upload: 'Take part',
    merchants: 'For merchants',
    rules: 'Terms',
    cta: 'Register your payment',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Pay Crypto, Win Bitcoin — Home',
  },

  hero: {
    titleLead: 'Pay with Crypto in Lugano and win',
    titleGold: 'BITCOIN',
    lead: (event, week) =>
      `During ${event} week, pay with crypto on a NAKA POS at a participating Lugano shop and register the receipt on this site: registering takes thirty seconds, no app needed.`,
    leadPrize: (pool, winners, draw) =>
      `${pool} up for grabs across ${winners} prizes, paid in bitcoin over the Lightning Network. The draw takes place on ${draw}, shortly after entries close, on the hash of a Bitcoin block that does not exist yet when the list of entries is made public: anyone can redo the maths and get the same winners.`,
    topPrize: 'Top prize',
    ctaUpload: 'Register your payment',
    ctaMap: 'Find participating shops',
    area: 'Lugano',
    /** «from Monday 19 October at 08:00 to Saturday 24 October at 16:00», from the dates in CONTEST. */
    week: (fromDay, fromTime, toDay, toTime) => `from ${fromDay} at ${fromTime} to ${toDay} at ${toTime}`,
    forumStrip: (event, dates, venue) => `${event} · ${dates} · ${venue}`,
    forumTickets: 'Forum tickets',
    forumNote: 'The forum runs for two days at Palazzo dei Congressi. The campaign runs all week, in shops across the city.',
    statMerchants: 'Shops on the NAKA network in Lugano',
    statAssets: (assets) => `Accepted assets: ${assets}`,
    statPool: 'Total declared prize pool',
    rowTotal: 'Prize pool',
    valueNote:
      'The 21 million figure is an equivalence fixed at the exchange rate of 30 September 2026, 16:35, and never recalculated: at that moment 2.00 XAUT were worth 10,000,000 satoshi. The dollar value moves with both markets; the prize quantities do not.',
    rowUsers: 'To customers, in bitcoin',
    rowMerchants: 'To merchants, in gold',
    rowAsset: 'How you receive them',
    rowAssetValue: 'Lightning for satoshi · Ethereum for XAUT',
    disclaimer:
      'Prizes are fixed quantities: 11,000,000 satoshi and 2.00 XAUT. The market may move; winners receive those quantities.',
    entryBoxTitle: 'Already paid in crypto?',
    entryBoxText: 'Receipt photo, transaction number and amount: that is all you need.',
    entryBoxCta: 'Register your payment',
  },

  countdown: {
    loading: 'Loading countdown…',
    toStart: 'Campaign starts in',
    demo: 'Test window — not the real dates',
    running: 'Campaign running — time left to enter',
    ended: 'Entries closed — draw being prepared',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
  },

  dual: {
    eyebrow: 'Two prize pools',
    title: 'One campaign, two different prizes',
    subtitle:
      'Customers who pay win bitcoin; the shops that take the payment win gold — two separate prize pools, two ways to take part.',
    users: {
      kicker: 'For customers',
      title: 'If you shop',
      points: (assets) => [
        `Pay with ${assets} on a NAKA POS`,
        'Register the payment with the transaction number and a photo of the receipt',
        'You are automatically entered into the bitcoin draw',
        'No limit: every valid transaction is one entry',
        'Stacks with the MyLugano city cashback',
      ],
      cta: 'Register your payment',
    },
    merchants: {
      kicker: 'For merchants',
      title: 'If you sell',
      points: () => [
        'Boost sales during Plan ₿ Forum week',
        'Top Volume prize for crypto transactions, in Tether Gold',
        'Prize for the best social content',
        'Two draws reserved for shops with at least one transaction',
      ],
      cta: 'See how to join',
    },
  },

  how: {
    eyebrow: 'How it works',
    title: 'Three steps, under a minute',
    subtitle: 'From payment to valid entry: no account and no app needed to register.',
    steps: () => [
      {
        title: 'Pay with crypto',
        text: 'Buy something at a participating shop and pay on its NAKA POS with one of these assets.',
      },
      {
        title: 'Register the payment',
        text: 'In the form below, enter the transaction number printed on the receipt, the amount, the shop and a photo of the receipt.',
      },
      {
        title: 'Win bitcoin',
        text: 'Get your entry ID by email: you are then in the draw for the satoshi prizes.',
      },
    ],
    payEyebrow: 'How to pay',
    payTitle: 'Two ways to pay, two things to know',
    paySubtitle:
      'At the POS you pay in bitcoin over Lightning, or in USD₮ or Tether Gold on their own networks: two different procedures. The first needs only a Lightning wallet and the QR on the terminal; the second involves networks and fees, and the guide below walks you through them.',
    guideTitle: 'In bitcoin, over Lightning',
    guideText:
      'You scan the QR on the terminal and confirm: no address to copy, no network to pick. You need a Lightning wallet, and the Plan ₿ Lugano network points to three.',
    guideWallets: 'The Lightning wallets recommended by the Plan ₿ Lugano network',
    /** One line per wallet, by name: names and links live in lib/wallets.js. */
    walletNotes: {
      Bitkit: 'Self-custodial Lightning wallet, easy to set up.',
      Breez: 'Instant Lightning payments, well suited to paying in shops.',
      'Wallet of Satoshi': 'Custodial: the quickest to set up if you are starting today.',
    },
    guideOnchainTitle: 'In USD₮ or Tether Gold, from a wallet',
    guideOnchainText:
      'You need a non-custodial wallet — MetaMask, Trust Wallet or similar — one where the keys are yours and you move the funds yourself. The procedure is the same for both assets; only the networks differ. Three things to know before you reach the till.',
    guideOnchainSteps: [
      {
        title: 'USD₮ on Ethereum or Polygon, Tether Gold on Ethereum',
        text: 'For USD₮ the POS accepts Ethereum and Polygon, either network; Tether Gold exists only on Ethereum, which is the only network you can pay it on. Anything held on other networks — Tron, Solana, BNB Chain — cannot be used at the POS: move it first.',
      },
      {
        title: 'Some gas for the fees',
        text: 'The network fee is not paid in the asset you are spending: you need ETH on Ethereum — so for Tether Gold too — and POL on Polygon. A full balance with no gas means the transaction never leaves.',
      },
      {
        title: 'Scan the QR on the terminal',
        text: 'The POS shows a QR with the amount and the recipient, and your wallet fills both in. Before confirming, check that the network selected in your wallet is the one shown on the terminal.',
      },
    ],
    guideOnchainWarningLabel: 'Warnings',
    guideOnchainWarning:
      'Some less common wallets misread the payment request the terminal shows in the QR. If yours reports an error, or the amount or recipient look wrong, stop and check rather than forcing the transfer: a sent transaction cannot be recalled. The first time you use a wallet to pay in a shop, try a small amount on Polygon, where the fee is a few cents: on Ethereum the fee would exceed the test amount.',
    guideCta: 'Official Plan ₿ site',
    guideCtaOther: 'In italiano',
  },

  brand: {
    line1: 'Pay Crypto',
    line2: 'Win Bitcoin',
    full: 'Pay with Crypto and Win Bitcoin',
  },

  prizes: {
    eyebrow: 'Prize pool',
    title: (pool) => `${pool} in total prizes`,
    subtitle: (winners) =>
      `${winners} prizes across two separate pools: bitcoin for customers, Tether Gold for merchants. The total is declared in satoshi, at the exchange rate fixed on 30 September 2026.`,
    usersKicker: 'Customers · in bitcoin',
    merchantsKicker: 'Merchants · in Tether Gold',
    usersNote: 'Total prize pool reserved for customers',
    merchantsNote: 'Total prize pool reserved for participating shops',
    poolLabel: 'prize pool',
    each: 'each',
    spritzDetails: 'Prize conditions',
    videoLink: 'All merchant prizes and the full guide',
    spritzWhen: (day, from, to, area) => `${day}, from ${from} to ${to} · ${area}`,
    spritzNote:
      'The same verifiable draw as the other prizes, run on a smaller list: entries whose transaction falls inside that window, at participating shops on Piazza Cioccaro. The same entries also take part in the general draw, but each one can win only one prize: if it wins the general draw, the Spritz prize goes to the next one. The organisers announce the evening’s venues shortly before the event: from then on, only those venues count.',
    spritzLink: 'The event on the Plan ₿ Week site',
    socialWhen: (deadline) => `Publish by ${deadline}`,
    socialHow: (tags) =>
      `Show your crypto payment in Lugano — video, post or photo — and publish it with all three hashtags ${tags}. Open to anyone with at least one registered entry: the content is how you win, the entry is the ticket in. The NAKA jury decides, not the like count.`,
    socialDetails: 'How to take part',
    note: (date) =>
      `Public draw scheduled for ${date}. Customer prizes are paid in bitcoin over Lightning, merchant prizes in Tether Gold on Ethereum, to the address provided by the winner.`,
    items: {
      '1° Premio': { place: '1st Prize', desc: 'Main draw among all valid entries' },
      '2° Premio': { place: '2nd Prize', desc: 'Second draw among valid entries' },
      '3°–10° Premio': { place: '3rd–10th Prize', desc: '8 runner-up prizes drawn at random' },
      'Video Social Clienti': {
        place: 'Social Content Prize',
        desc: 'For the best content published by a customer during the week, chosen by the NAKA jury',
      },
      'Satoshi Spritz': {
        place: 'Satoshi Spritz Prize',
        desc: 'Drawn at random among the entries paid during the Satoshi Spritz Special evening, at participating shops on Piazza Cioccaro',
      },
      'Top Volume Transazioni': {
        place: 'Top Transaction Volume',
        desc: 'To the shop with the highest crypto takings on a NAKA POS during the campaign',
      },
      'Best Social Content': {
        place: 'Best Social Content',
        desc: 'To the best content published by a shop with the official hashtags',
      },
      'Estrazione Riservata Merchant': {
        place: 'Draw reserved for shops',
        desc: 'Two draws among all shops with at least one recorded crypto transaction',
      },
    },
  },

  form: {
    eyebrow: 'Take part',
    title: 'Register your payment',
    subtitle: 'Enter the transaction number and upload your receipt: both are required to validate the entry.',
    email: 'Your email',
    emailHint: 'We only use it for the confirmation and to let you know if you win.',
    emailPlaceholder: 'name@domain.ch',
    proofLegend: 'Proof of purchase',
    proofIntro: ['We need', 'both', ': the transaction number for the automatic POS check, and the receipt photo as documentary proof.'],
    txLabel: 'Last 6 characters of the transaction no.',
    txHint: 'Just the last 6, letters included: they are at the end of the “N° TRANSAZIONE” line on the receipt.',
    txPlaceholder: 'e.g. 0adca2',
    amountLabel: 'Amount',
    amountHint: 'The total you paid, as printed on the receipt.',
    amountPlaceholder: 'e.g. 0.10',
    receiptLabel: 'Receipt photo',
    receiptCta: 'Tap to take a photo or upload',
    receiptPreparing: 'Preparing the image…',
    receiptFormats: (mb) => `JPG, PNG, WEBP or HEIC — max ${mb} MB`,
    receiptRemove: 'Remove attachment',
    merchantLabel: 'Shop',
    merchantHint:
      'We need it to find your transaction on the POS. Just start typing — the suggestions come from the network map.',
    merchantPlaceholder: 'Start typing the shop name…',
    confirmAge: 'I confirm I am 18 or older and will keep proof of purchase: the paper receipt or the digital receipt link.',
    acceptRulesBefore: 'I accept the ',
    acceptRulesLink: 'Official terms and the Privacy notice (FADP/GDPR)',
    submit: 'Register your payment',
    submitting: 'Checking…',
    footnote:
      'Each transaction number can be submitted only once. Entries are cross-checked against NAKA POS records. We will only ask for your Lightning payout address by email if you win.',
    networkError: 'No connection. Check your network and try again.',
    genericError: 'Entry failed. Please try again in a moment.',
    errors: {
      email_invalid: 'Enter a valid email address (e.g. name@domain.ch).',
      tx_missing: 'Enter the transaction number: you will find it on the POS receipt.',
      tx_invalid: 'Invalid transaction number: copy it from the receipt (at least 6 characters).',
      tx_duplicate: 'These characters and this amount are already registered. If it was not you, write to us and we will check the entry by hand.',
      amount_missing: 'Enter the total amount you paid.',
      amount_invalid: 'Invalid amount: write it as on the receipt, for example 0.10 or 84.50.',
      receipt_missing: 'Upload a photo of the POS receipt.',
      receipt_type: 'Unsupported format: upload a JPG, PNG, WEBP or HEIC photo.',
      receipt_size: 'File too large: 8 MB maximum.',
      merchant_missing: 'Tell us which shop you paid in.',
      merchant_too_long: 'Shop name too long (120 characters max).',
      age_required: 'You must confirm you are 18 or older and will keep the receipt.',
      rules_required: 'You must accept the Terms and Privacy Notice to enter.',
    },
    apiErrors: {
      invalid_fields: 'Some fields are not valid: please check the form.',
      duplicate_tx: 'This transaction has already been submitted.',
      rate_limited: 'Too many entries in a short time. Please try again in a few minutes.',
      storage_error: 'We could not save your receipt. Please try again in a moment.',
      bad_request: 'Invalid request.',
      demo: 'This is a site preview: entries are not open yet. No data is being saved.',
    },
    proof: {
      tx_and_receipt: 'Transaction number + receipt',
    },
    honeypot: 'Company (do not fill in)',
    trust: {
      title: 'Who pays the prizes',
      text: (organizer) =>
        `${organizer} runs the crypto POS terminals at participating shops. The campaign is promoted and the prizes are paid directly by ${organizer}: your data is not passed on to anyone else.`,
      link: 'naka.com',
    },

    txHelp: {
      toggle: 'Where do I find this number?',
      text: 'On the NAKA receipt look for “N° TRANSAZIONE”, printed over two lines, just above the terminal ID. You only need the last 6 characters, i.e. the end of the second line: in the example b72134bf088d4df88eaf5 5c3b90adca2 that is 0adca2. If you prefer to paste the whole number, that works too.',
      receiptLabel: 'NAKA',
    },

    closed: {
      demoTitle: 'Site preview',
      demoText:
        'This is a preview: the entry form will go live when the campaign opens. No data is being collected.',
      upcomingTitle: 'Entries are not open yet',
      upcomingText: (date) => `You can submit entries from ${date}. In the meantime, explore the participating shops.`,
      closedTitle: 'Entries closed',
      closedText: (date) => `The deadline for submitting entries passed on ${date}. Winners are notified by email.`,
      cta: 'See participating shops',
    },
    modal: {
      title: 'Entry submitted!',
      subtitle: 'Keep your proof of purchase — paper receipt or digital receipt — until winners are announced.',
      idLabel: 'Your entry ID is',
      copied: 'Copied to clipboard',
      rowEmail: 'Email',
      rowProof: 'Proof of purchase',
      rowTx: 'Last 6 characters',
      rowAmount: 'Amount',
      rowMerchant: 'Shop',
      rowDate: 'Submitted on',
      rowStatus: 'Status',
      statusValue: 'Under review',
      emailSent: (email) => `We sent a confirmation to ${email} with a summary of your entry. If you cannot find it, check your spam folder.`,
      nextSteps:
        'You will get a second email once the entry is validated. If you win, we will ask for the Lightning address to receive your bitcoin prize: NAKA never asks for private keys or recovery phrases.',
      close: 'Got it',
    },
  },

  map: {
    eyebrow: 'Shops',
    title: 'Where to pay with crypto in Lugano',
    subtitle: (event) => `Shops on the NAKA network in Lugano, open during ${event} week.`,
    allAccept: 'Every shop listed accepts',
    sortAlpha: 'A-Z',
    sortNear: 'Near you',
    filtersLabel: 'Filter shops',
    nearMe: 'Sort by distance',
    nearMeOn: 'Near you',
    nearMeLoading: 'Finding your location…',
    nearMeDenied: 'Location unavailable: the list stays in alphabetical order.',
    distance: (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m away` : `${(m / 1000).toFixed(1)} km away`),
    openAll: 'Open every shop in Google Maps',
    seeAll: (n) => `See all ${n} shops`,
    standaloneTitle: 'Participating shops',
    searchPlaceholder: 'Search by name or street…',
    searchLabel: 'Search shops',
    clearSearch: 'Clear search',
    resultsOne: 'shop found',
    resultsMany: 'shops found',
    inCategory: (category) => ` in "${category}"`,
    showMore: (n) => `Show ${n} more shops`,
    emptyTitle: 'No shops found',
    emptyText: 'Try a different name, street or category.',
    directions: 'Directions',
    call: 'Call',
    linkKinds: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      website: 'Website',
    },
    website: 'Website',
    badgeVerified: 'NAKA POS',
    badgePending: 'Activation in progress',
    badgeVerifiedTitle: 'Accepts crypto payments on a NAKA terminal',
    zoneTitle: 'Selected area',
    zoneClear: 'Show all',
    zoneCount: (n) => `${n} shops in this area`,
    outsideCore: 'Outside the centre',
    mapLegend: 'Dots group nearby shops: tap one to see which.',
    center: 'Central Lugano',
    closeCard: 'Close shop card',
    categories: {
      all: 'All',
      food: 'Restaurants and bars',
      shopping: 'Shopping',
      hotel: 'Hotels',
      services: 'Services',
    },
  },

  b2b: {
    eyebrow: 'For merchants',
    titleLead: 'Do you run a shop in',
    titleGold: 'Lugano',
    text: 'Joining takes no paperwork: simply reply to the invitation email you received from NAKA and keep your POS switched on.',
    perks: (pool) => [
      'No paperwork: just reply to the NAKA invitation email',
      'You stay on the official list of participating shops — without your confirmation the shop is not listed',
      `${pool} in prizes reserved for participating shops`,
    ],
    cta: 'Send your confirmation email',
    adhesion: {
      subject: 'Joining the "Pay with Crypto and Win Bitcoin" campaign - Plan ₿ Forum 2026',
      body: [
        'Hello NAKA Team,',
        '',
        'I confirm that my business is joining the "Pay with Crypto and Win Bitcoin" campaign during Plan ₿ Forum 2026 in Lugano.',
        '',
        'Business name: ',
        'Address in Lugano: ',
        'Category (Food & drink / Shopping / Hotel / Services): ',
        'Contact person and phone: ',
        'NAKA POS terminal ID (if available): ',
        '',
        'The NAKA POS will stay switched on and working for the whole campaign.',
        '',
        'Kind regards,',
      ],
    },
    ctaGuide: 'Merchant guide',
    ctaVideo: 'Best Social Content prize',
    merchantJoin: {
      question: 'Didn’t get the invitation email?',
      cta: 'Ask to join',
      subject: 'Request to join the campaign',
      body: [
        'Hello NAKA Team,',
        '',
        'I did not receive the invitation email but I would like to take part with my business.',
        '',
        'Business name: ',
        'Address in Lugano: ',
        'Contact person and phone: ',
        'I already have a NAKA POS (yes / no): ',
        '',
        'Kind regards,',
      ],
    },

    checklistTitle: 'Joining checklist',
    checklist: [
      'Reply to the NAKA invitation email confirming your business details.',
      'Make sure your NAKA POS is switched on and up to date.',
      'Display the promotional material the team sends you.',
      'Take crypto payments during forum week: every transaction counts.',
    ],
  },

  faq: {
    eyebrow: 'FAQ and support',
    title: 'Frequently asked questions',
    helpTitle: 'Didn’t find your answer?',
    helpText: 'The support team replies within one working day.',
    helpCta: 'Contact support',
    items: [
      {
        q: 'Which cryptocurrencies can I use on a NAKA POS?',
        a: 'NAKA POS terminals take bitcoin on the Lightning Network, USD₮ on Ethereum and Polygon, and Tether Gold on Ethereum: the terminal supports no other network. Many shops also accept LVGA, but LVGA payments do not qualify for this campaign.',
        cta: { label: 'Find participating shops', href: '#mappa' },
      },
      {
        q: 'I don’t have a wallet yet — how do I pay?',
        a: 'You need a wallet that supports the Lightning Network. The Plan ₿ network recommends Bitkit, Breez and Wallet of Satoshi: the official tutorials are linked in the "How it works" section of this page. Setup takes a few minutes and needs no bank account. To get bitcoin in the first place, the official Plan ₿ guide, linked in the same section, shows where to buy it in town.',
      },
      {
        q: 'Does this stack with MyLugano cashback?',
        a: 'Yes. The cashback offered by the city network through the MyLugano app is unaffected: the NAKA campaign is an additional benefit and does not replace or reduce the City of Lugano’s promotions.',
      },
      {
        q: 'How are prizes paid out?',
        a: 'You do not need to provide a wallet to enter. If you win, we email you at the address you used to enter and ask at that point for the address to receive the prize: a Lightning address for the customers’ bitcoin prizes, an XAUT-compatible Ethereum address for the merchants’ Tether Gold prizes. Transfer takes place within 30 days. An incorrect address means the funds cannot be recovered.',
      },
      {
        q: 'Do I have to keep the receipt?',
        a: 'Yes, if it is a paper one. A photo of the receipt is required at entry, and the paper copy must be kept until winners are announced: if you win, you will be asked to present it before the prize is paid. If the shop issues a digital receipt there is nothing to print: you upload the screen at entry and, if you win, you simply forward the receipt link you were sent. Without verifiable proof of purchase — paper or digital — the entry is void and a new draw is held.',
      },
      {
        q: 'Who can take part?',
        a: 'Any customer aged 18 or over who makes a crypto purchase on a NAKA POS at a participating Lugano shop during the campaign period.',
      },
      {
        q: 'How do I know the draw is honest?',
        a: 'Because it does not depend on us. Within half an hour of closing we publish the list of eligible entries, which from then on cannot be changed, and we name the Bitcoin block that will provide the seed: one that has not been mined yet. The number that decides the winners therefore arrives afterwards, from the Bitcoin network, and nobody can predict or choose it. With those two public facts anyone can redo the computation and get the same winners: the procedure, the files to download and the result are on the winners page.',
      },
      {
        q: 'How many times can I enter?',
        a: 'There is no limit: every valid, distinct crypto transaction creates a new entry. The same transaction number, however, can only be submitted once.',
      },
      {
        q: 'What if the price of bitcoin or gold changes?',
        a: 'Prizes are fixed quantities — satoshi for customers, XAUT for merchants — not amounts in francs. Their CHF value can therefore rise or fall with the market: NAKA guarantees no minimum fiat value. The declared 21 million satoshi is likewise an equivalence fixed at a specific instant, set out in article 6-bis of the Terms: later movements change neither the quantities nor the number of prizes.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — the ${organizer} campaign for ${event} in ${city}. Pay with crypto on NAKA POS terminals and win bitcoin.`,
    contestHeading: 'Campaign',
    legalHeading: 'Legal',
    faq: 'FAQ and support',
    winners: 'Winners and draw',
    linkedin: 'NAKA on LinkedIn',
    bestVideo: 'Best Social Content',
    rules: 'Full terms',
    privacy: 'Privacy notice (FADP/GDPR)',
    support: 'Support contacts',
    copyright: (organizer) =>
      `© 2026 ${organizer}. All rights reserved. Customer prizes are paid in bitcoin, merchant prizes in Tether Gold (XAUT); their value varies with the market.`,
    backToTop: 'Back to top',
    navLabel: 'Section navigation',
    legalLabel: 'Legal information',
  },

  email: {
    subject: (id, contest) => `Entry ${id} received — ${contest}`,
    greeting: 'Hello,',
    intro: (contest, event, city) =>
      `we have received your entry to the "${contest}" campaign — ${event}, ${city}.`,
    heading: 'Entry received',
    rowId: 'Entry ID',
    rowTx: 'Last 6 characters',
    rowAmount: 'Amount',
    rowMerchant: 'Shop',
    rowReceipt: 'Receipt attached',
    rowDate: 'Submitted on',
    rowStatus: 'Status',
    statusValue: 'Under review',
    nextTitle: 'What happens next',
    next: (drawDate) => [
      'We check the transaction against the records on the NAKA POS.',
      'You get a second email once your entry is validated.',
      `The public draw takes place on ${drawDate}.`,
    ],
    pool: (pool, winners) => `There is ${pool} in bitcoin to be won, across ${winners} prizes reserved for customers.`,
    warningLead: 'Keep your proof of purchase',
    warning: (organizer) =>
      ` until winners are announced. If you win, we will ask for the wallet to receive your prize: ${organizer} never asks for private keys or recovery phrases.`,
    support: (email) => `Support: ${email}`,
    footer: (organizer) =>
      `© 2026 ${organizer}. Prizes paid in bitcoin and in Tether Gold (XAUT); their value may vary.`,
    yes: 'yes',
  },

  quick: {
    title: 'Register your payment',
    intro: 'Paid with crypto on a NAKA POS? All you need is your email, the transaction number and a photo of the receipt.',
    backToSite: 'Go to the campaign site',
    deadline: (date) => `Entries open until ${date}`,
  },

  stats: {
    entries: 'entries submitted',
    prizes: 'prizes to win',
    merchants: 'participating shops',
    odds: (entries, prizes) => `${entries} entries so far for ${prizes} prizes.`,
  },

  consent: {
    title: 'Traffic measurement',
    text: 'We would like to use an analytics tool that sets cookies, so we can understand how the site is used. No data is used for advertising.',
    link: 'Read the notice',
    accept: 'Accept',
    reject: 'Decline',
  },




  privacy: {
    metaTitle: 'Privacy and cookie notice',
    metaDescription:
      'What data the NAKA campaign collects, why, for how long, and how to exercise your rights. Notice under the Swiss FADP and the GDPR.',
    title: 'Privacy and cookies',
    updated: (date) => `Last updated: ${date}`,
    back: 'Back to the campaign site',
    cookieBadge: 'This site uses no tracking cookies',
    cookieLead:
      'There are no tracking cookies, no advertising pixels and no third-party analytics. Fonts are served from our own domain: no request leaves for Google or any other provider while you browse.',
    sections: ({ organizer, support, merchantSupport, collectedUntil, drawDate, onlineUntil }) => [
      {
        title: 'Who processes your data',
        body: [
          `${organizer} is the data controller: it runs the campaign and pays out the prizes. For any request about your data, write to ${support}.`,
        ],
      },
      {
        title: 'What we collect, and only when you enter',
        body: [
          'Browsing the site requires no data at all. Data is collected only if you submit an entry, and it is exactly what the form asks you for:',
        ],
        list: [
          'Your email address, to confirm your entry and contact you if you win.',
          'The transaction number, to cross-check against payments recorded on the NAKA POS.',
          'The photo of your receipt, as documentary proof of purchase.',
          'The name of the shop you paid in, used to find the transaction on the POS.',
          'Your chosen language and the label of the material you came from (flyer, poster, window sticker), so we know which material worked. The label is fixed text, not an identifier: it cannot be traced back to you.',
        ],
      },
      {
        title: 'Why we process it',
        body: [
          'To handle your entry: verify the transaction is real, prevent duplicate or fraudulent entries, run the draw and deliver the prize. The legal basis is performance of the relationship created by your entry, together with the legal obligations arising from it.',
          'The wallet address is requested from winners only, by email, after the draw: we do not collect it from everyone who enters.',
        ],
      },
      {
        title: 'For how long',
        body: [
          `Entries are collected until ${collectedUntil}. The draw is held on ${drawDate} and the list of winners stays published until ${onlineUntil}, showing entry IDs only: no names, no email addresses.`,
          'By that date, email addresses, receipt photos and transaction numbers are irreversibly deleted. What remains identifies nobody — entry ID, outcome, date — and is kept to account for the campaign and to leave the published draw verifiable.',
        ],
      },
      {
        title: 'Who else sees it',
        body: [
          'No sharing, no selling, no advertising use. Data is processed on our systems and by two technical providers acting on our behalf: the service hosting the site and the one sending confirmation emails. Transactions are verified against the NAKA POS gateway.',
          'The infrastructure is located in the European Union. Any transfer to providers outside the EU takes place under the safeguards required by law.',
        ],
      },
      {
        title: 'Your rights',
        body: [
          `You may at any time request access to your data, correction, erasure, restriction, object to processing, or receive it in a readable format, by writing to ${support}. Erasure before the draw means exclusion from the campaign, since without the entry data it cannot be verified or awarded a prize.`,
          'If you believe the processing is unlawful you may contact the Swiss Federal Data Protection and Information Commissioner (FDPIC) or the supervisory authority in your country.',
        ],
      },
      {
        title: 'Cookies and similar technologies',
        body: [
          'The site installs no profiling cookies, uses no advertising pixels and runs no third-party analytics. There is nothing to accept or refuse, which is why you see no banner.',
          'We count how many times a page is opened for each promotional material, but the count is aggregate: no cookies, no IP addresses, no identifiers. An opening cannot be traced back to a person.',
          'Typefaces are served from our own domain rather than an external service: while browsing, your IP address is not disclosed to third parties. Should we introduce measurement tools that require cookies, a prior consent request will appear and this page will be updated.',
        ],
      },
      {
        title: 'Merchant support',
        body: [
          `Merchants taking part can write to ${merchantSupport}. Shop contact details are processed to manage participation and campaign communications.`,
        ],
      },
    ],
  },

  winners: {
    metaTitle: 'Winners and verifiable draw',
    metaDescription:
      'Draw result, list of winners and the procedure to check for yourself that the draw was not manipulated.',
    title: 'Winners',
    backToSite: 'Back to the campaign site',
    pendingTitle: 'The draw has not taken place yet',
    pendingText: (date, commitBy) =>
      `By ${commitBy} on ${date} this page shows the lists of eligible entries and the number of the Bitcoin block that will provide the seed. The winners follow as soon as that block is mined, together with the data to redo the computation.`,
    committedTitle: 'Lists published: waiting for the block',
    committedText: (height, time) =>
      `The lists below were published on ${time} and can no longer change. The seed will be the hash of Bitcoin block number ${height}, which had not been mined at that moment. The draw runs as soon as at least one more block has been mined on top of it.`,
    committedAt: 'Lists published on',
    tipLabel: 'Latest block when the lists were published',
    seedHeightLabel: 'Block providing the seed',
    openBlock: 'Open the block',
    listsTitle: 'Files to redo the computation',
    lists: { users: 'Customer entries', spritz: 'Satoshi Spritz entries', merchants: 'Shops', commitment: 'Full commitment', result: 'Full result' },
    listCount: (n) => `${n} IDs`,
    download: 'Download',
    hashLabel: 'SHA-256 digest',
    reservesTitle: 'Reserves, in order',
    reservesNote: 'If a drawn entry fails verification, the prize goes to the first available reserve.',
    disqualifiedTitle: 'Excluded after verification',
    archiveTitle: 'Independent copy',
    archiveText: (time) =>
      `The commitment was also deposited with archive.org, which records its date and time: ${time}. It is proof, independent of us, that the lists existed before the seed block.`,
    archiveLink: 'Open the copy on archive.org',
    archivePending: 'Deposit with archive.org in progress: the link appears here as soon as the archive confirms.',
    timingTitle: 'Why there is no exact time',
    timingText: (blocks, from, to) =>
      `The Bitcoin network produces a block every ten minutes on average, but with wide variation: ${blocks} blocks can arrive in half an hour or in two hours. That is why we announce a window rather than a time: the draw normally takes place between ${from} and ${to}, and never before ${from}. If the network is slow we wait, and nothing changes: not the lists, not the block, not the result.`,
    simpleTitle: 'In plain words',
    simple: [
      'Imagine tossing a coin and having to call heads or tails while it is still in the air. You cannot cheat: the call is out of your mouth before the coin lands.',
      'The draw works the same way. At 16:00 we close entries and within half an hour we publish the list: that is our call, and from then on it cannot be touched. At the same moment we say which number will decide: the hash of a Bitcoin block that will be mined about an hour later. Nobody picks that number: the Bitcoin network produces it, as it has every ten minutes for more than fifteen years, knowing nothing about us or the campaign.',
      'At that point there is nothing left to decide: a formula matches the number to the entries and sets the order. Anyone with the list and the number redoes the same computation and gets the same winners — including us, who could not produce a different result even if we wanted to. All that remains is to check that the winning entries are genuine: if one is not, the prize goes to the next entry in the order already published.',
    ],
    howEyebrow: 'Transparency',
    howTitle: 'How the draw works',
    howIntro:
      'The hard part of any prize draw is not picking a random number: it is proving to a stranger that the number was not picked after seeing the entrants. It is solved by making two public commitments, in this order.',
    steps: (blocks) => [
      {
        title: 'The list is frozen',
        text: 'Within half an hour of closing we publish the IDs of every eligible entry, in three lists (customers, Satoshi Spritz, shops), each with its SHA-256 digest. From then on changing a single line changes the digest, and anyone can tell.',
      },
      {
        title: 'The seed is announced before it exists',
        text: `In the same publication we name the latest Bitcoin block mined at that moment and fix the seed: the hash of the block that will arrive ${blocks} positions later, on average an hour afterwards. Nobody, the organiser included, can predict or choose it.`,
      },
      {
        title: 'The rest is arithmetic',
        text: 'For each entry we compute sha256("seed:category:ID") — the category is "users", "spritz" or "merchants" — and sort the results lowest first. The top ones win, the next ones are reserves; each entry wins at most one prize. With the lists and the seed, anyone can redo the computation and get the same IDs.',
      },
      {
        title: 'The winners are verified',
        text: 'Before paying out we check the drawn entries against NAKA POS records and the receipt. An entry that fails the check is excluded with the reason published here, and the prize goes to the first reserve. Nothing else can change.',
      },
    ],
    resultTitle: 'Draw result',
    drawnAt: 'Draw held on',
    seedLabel: 'Seed (Bitcoin block hash)',
    listHashLabel: 'List digest',
    participantsLabel: 'Eligible entries',
    usersSection: 'Customer prizes',
    spritzSection: 'Satoshi Spritz prize',
    merchantsSection: 'Shop prizes',
    entryId: 'Entry ID',
    prizeCol: 'Prize',
    amountCol: 'Amount',
    notDrawnTitle: 'Prizes not drawn',
    notDrawnText:
      'Top Volume is a ranking based on volumes recorded by the POS and Best Social Content is decided by the jury: neither goes through the draw.',
    publishedUntil: (date) => `This list stays published until ${date}. After that date the campaign is archived and participants’ personal data is deleted.`,
    contacted: 'Winners are contacted by email at the address used for the entry. Entries are identified by ID only: no personal data is published.',
  },

  video: {
    metaTitle: (pool) => `Merchant area — ${pool} reserved for participating shops | NAKA`,
    metaDescription:
      'Everything a Lugano shop needs: the three merchant prize categories, how to join, what to tell customers, and the Best Social Content rules.',
    back: 'Back to the prize pool',
    badge: 'Merchant area',
    titleLead: 'Accept crypto payments and win',
    titleGold: 'GOLD',
    intro: (event, city, pool) =>
      `Customers who pay in crypto win bitcoin; you, who accept the payment, win gold. During ${event} in ${city} participating shops compete for ${pool} in Tether Gold, across three stackable prize categories: crypto takings volume, the best social content and a draw that takes a single transaction. Here are all three, how to join and what to tell customers at the till.`,
    ctaSubmit: 'Send us your content',
    ctaPrizes: 'See all three prizes',
    ctaHow: 'How to join',
    ctaIdeas: 'See the ideas',
    statPrize: 'Shop prize pool',
    statDeadline: 'Social content by',
    statFormat: 'Entries and takings close',

    socialEyebrow: 'Prize 2 of 3',
    socialTitle: 'Best Social Content, in detail',
    socialSubtitle: (deadline, close) =>
      `This part is about the social prize only. Note the two dates: content must be published by ${deadline}, while customer entries and takings counting towards Top Volume run until ${close}.`,
    contentTitle: 'What you can publish',
    contentSubtitle:
      'It does not have to be a video: anything that genuinely catches people’s attention counts, as long as it talks about the campaign and carries the three hashtags.',
    contentTypes: [
      { title: 'A video', desc: 'A reel, a TikTok or a short clip: show the crypto payment on the POS or tell the story of the campaign.' },
      { title: 'A post', desc: 'A written post explaining why you accept crypto and inviting customers to take part.' },
      { title: 'An image', desc: 'A well-shot photo of the shop, the window or the campaign material, with a caption that tells the story.' },
    ],
    platformsTitle: 'Where to publish',
    platformsNote: 'On LinkedIn you can also tag the NAKA page directly.',
    merchantPrizes: {
      eyebrow: 'Every shop prize',
      title: (pool) => `${pool} reserved for merchants`,
      subtitle:
        'The social prize is one of three categories. The other two require nothing to be published: one rewards how much you take in crypto, the other asks for a single transaction. They stack — one shop can win all three.',
      each: 'each',
      howLabel: 'How it is awarded',
      actionLabel: 'What you have to do',
      how: {
        volume: 'Objective ranking on the takings recorded by your NAKA POS',
        jury: 'The public picks the finalists, the NAKA jury picks the winner',
        draw: 'Random draw anyone can verify',
      },
      items: {
        'Top Volume Transazioni': {
          title: 'Top Transaction Volume',
          text: 'Goes to the shop with the highest crypto takings on a NAKA POS during the campaign week. What counts is the total taken, not the number of receipts.',
          action: 'Nothing special: take crypto payments and invite customers to pay that way. We compute the ranking from POS data.',
        },
        'Best Social Content': {
          title: 'Best Social Content',
          text: 'Goes to the best content published from your business profile: a video counts, and so does a post or a single image. Rules, formats and ideas are on this page.',
          action: 'Publish with the three required hashtags before the deadline and let us know by email.',
        },
        'Estrazione Riservata Merchant': {
          title: 'Draw reserved for shops',
          text: 'The easiest prize to win: one crypto transaction taken during the week puts you in the draw. Two prizes are drawn, 0.25 XAUT each. Every shop gets one ticket and one only — taking a hundred payments does not improve your odds.',
          action: 'Join and take at least one crypto payment. That is all.',
        },
      },
      note: (date) =>
        `Volumes and winners are settled once the campaign closes; the draw reserved for shops takes place on ${date} using the same verifiable procedure as the customer draw. Prizes are paid in Tether Gold (XAUT) to the address provided by the winner.`,
    },
    merchantGuide: {
      eyebrow: 'Merchant guide',
      title: 'How it works for you, step by step',
      subtitle:
        'Everything you need to know about the campaign from the merchant side: what to do before, during and after forum week.',
      steps: [
        {
          title: '1. Join by replying to one email',
          text: 'There is no form to fill in and no contract to sign: reply to the invitation email you received from NAKA confirming your business name, address and contact person. From that moment your shop stays on the official list customers browse to decide where to spend: shops that do not confirm are removed before the final list is published.',
        },
        {
          title: '2. Keep your NAKA POS switched on',
          text: 'That is the only technical requirement. The terminal you already use to take bitcoin over Lightning and USD₮ is the same one that records the transactions eligible for the campaign: nothing to install, no change to your checkout routine, no extra cost.',
        },
        {
          title: '3. Take crypto payments during the week',
          text: 'The campaign runs from Monday morning to Saturday afternoon. Every crypto payment you take in those days counts twice: towards your Top Volume prize, and as the customer’s ticket into the draw. The more you take in crypto, the higher you climb.',
        },
        {
          title: '4. Tell customers to submit their receipt',
          text: 'This is the step most people forget: the transaction alone is not enough — the customer has to submit it on the website with the transaction number and a photo of the receipt. One line works at the till: “submit your receipt and you are in the draw for 11 million satoshi”. Display the material we provide and let customers scan the QR code: ten seconds and your customer is in.',
        },
        {
          title: '5. Publish something and go for the social prize',
          text: 'A video, a post or an image carrying the three official hashtags puts you in the running for the Best Social Content prize. It is a chance to be seen by forum visitors and by the local audience, not just to win: the best content also gets reshared by NAKA’s own channels.',
        },
        {
          title: '6. Receive your prize in Tether Gold',
          text: 'Once entries close we check the volumes recorded by the POS, the jury picks the winning content, and the draw reserved for shops is held through a publicly verifiable procedure. If you win we contact you by email and ask for the address to receive your XAUT prize.',
        },
      ],
      qrTitle: 'Printed material with a QR code',
      qrText:
        'The material you display in the shop carries a QR code leading straight to this page: it is made for you and your staff, so whoever is at the till always has the rules, the deadlines and the support contacts to hand.',
    },
    support: {
      title: 'Merchant support',
      text: 'Any doubts about the POS, joining or the prizes? The NAKA team answers directly.',
      emailLabel: 'Support email',
      phoneLabel: 'Support phone',
      whatsappLabel: 'WhatsApp support',
      reviewTitle: 'Happy with the NAKA service?',
      reviewText: 'Leaving a review helps other local merchants decide whether to accept crypto.',
      reviewCta: 'Leave a Google review',
    },
    announcement: {
      text: 'The official campaign announcement is published on NAKA’s LinkedIn page: follow it for updates, winners and reshares of the best content.',
      cta: 'Go to NAKA’s LinkedIn page',
    },
    hashtagsTitle: 'Required hashtags',
    hashtagsText: ['All three must appear ', 'together', ' in the caption: that is how we find the content in the running. Without them, the content is not counted.'],
    mentionsTitle: 'Profiles you can tag',
    mentionsNote: 'Tagging is optional and only helps us find your content: the three hashtags are what count.',
    noLimitTitle: 'As many as you like',
    noLimitText:
      'There is no cap: post one a day or ten in an afternoon. What reaches the final is the content, not the shop, so posting more improves your odds — as long as each one carries the three hashtags.',
    stepsEyebrow: 'How to enter',
    stepsTitle: 'Four steps',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Film the video',
        text: `${min} to ${max} seconds, ${ratio} portrait format. It must show a crypto payment on the NAKA POS in your shop.`,
      },
      {
        title: 'Publish with the hashtags',
        text: `On ${platforms}, from your business’s public profile, with every required hashtag in the caption.`,
      },
      {
        title: 'Tag the profiles',
        text: 'Mention NAKA and Lugano Plan ₿ in the caption or in the video: it helps us find the content and amplify its reach.',
      },
      {
        title: 'Send it to us',
        text: `Email us the link at ${email} by ${deadline}: this is the step that officially puts your content in the running.`,
      },
    ],
    selectionEyebrow: 'How you win',
    selectionTitle: 'The public first, then the jury',
    selection: [
      {
        phase: 'Stage 1 — The public',
        title: 'The most successful entries reach the final',
        desc: 'Views, likes, comments and shares collected by the close of the campaign all count, on any accepted platform. The content with the strongest response makes up the shortlist.',
      },
      {
        phase: 'Stage 2 — The jury',
        title: 'Among the finalists, the best-liked one wins',
        desc: 'From the shortlist, the NAKA jury picks the entry that tells the story best: the idea, how likeable it is, how clear the message is, and how much it makes you want to try it.'
      },
    ],
    selectionNote:
      'In short: the more your video travels, the better your chances of reaching the final — but the final is not won by the most watched, it is won by the best. A well-made, likeable video beats a high view count, and a perfect video nobody watches never even makes the shortlist.',
    ideasEyebrow: 'Inspiration',
    ideasTitle: 'Eight ideas that work',
    ideasSubtitle:
      'You do not need a film crew: a smartphone, decent light and a clear idea are enough. Take one of these formats and adapt it to your business.',
    ideas: [
      { title: 'Payment in 10 seconds', desc: 'Close-up on the POS: QR, scan, confirmation. No voiceover, just the confirmation sound and a closing caption.', why: 'The most shared format: it shows paying in crypto is faster than card.' },
      { title: 'First time', desc: 'A customer who has never paid in crypto does it on camera, with their reaction at the end of the transaction.', why: 'The face of someone discovering something new beats any explanation.' },
      { title: 'Crypto vs cash', desc: 'Split screen: two customers pay the same bill, one in cash and one over Lightning. Timer on screen.', why: 'A race format: it keeps viewers to the end to see who wins.' },
      { title: 'Your product in gold', desc: 'The dish, the haircut or the product shot in a "gold" key: warm light, close details, closing on the payment.', why: 'Ties your product to the campaign theme without looking like an ad.' },
      { title: 'Behind the counter', desc: 'The owner explains first-hand why they chose to accept crypto and what changed in the shop.', why: 'Authenticity: it works well with the local audience and with the press.' },
      { title: 'Neighbourhood tour', desc: 'A walk through several participating shops on the same street, one payment per stop.', why: 'You team up with your neighbours and multiply reach by all posting the same video.' },
      { title: 'A visitor at the forum', desc: 'A Plan ₿ Forum attendee walks in and pays over Lightning without a franc in their pocket.', why: 'It tells the story of why the campaign exists, in the week the city is full of visitors.' },
      { title: 'How not to pay', desc: 'Tongue-in-cheek: every wrong way to pay, then the right one on the NAKA POS.', why: 'Humour is the content people save and send to their friends.' },
    ],
    requirementsTitle: 'Requirements',
    requirements: ({ min, max, ratio, resolution, deadline }) => [
      `Between ${min} and ${max} seconds long`,
      `${ratio} portrait format, at least ${resolution}`,
      'Filmed in your shop, showing a real payment on the NAKA POS',
      'Published from a public profile of your business',
      `Published by ${deadline}`,
      'Original, previously unpublished content made for this campaign',
    ],
    avoidTitle: 'Avoid',
    avoid: [
      'Copyrighted music: it gets the video taken down and disqualifies you',
      'Filming customers or staff without their consent',
      'Showing QR codes, amounts or real transaction data belonging to other customers',
      'Promises of winning, or wording that presents the campaign as a guaranteed lottery',
      'Videos reposted from others, or content with no original footage shot in the shop',
    ],
    rightsTitle: 'Usage rights and responsibility',
    rights: (organizer) => [
      `By submitting the content, the merchant declares that they are its author or hold full rights to it, and grants ${organizer} a free, non-exclusive licence, limited to the campaign period, to republish it on its own channels while crediting the business.`,
      `It is the merchant’s responsibility to obtain consent from the people filmed and to use only royalty-free music. ${organizer} may at any time exclude content that breaches platform terms, Swiss data protection law or the good standing of the campaign.`,
    ],
    rightsLinkBefore: 'All terms of the ',
    rightsLink: 'official campaign Terms',
    rightsLinkAfter: ' remain in force; this page is their practical implementation.',
    finalTitle: 'Published your content?',
    finalText:
      'Send us the link: without the email submission your content is not officially in the running, even if you used every hashtag.',
    mailSubject: 'Best Social Content — submission',
    mailBody: [
      'Hello NAKA Team,',
      '',
      'I am submitting my entry for the Best Social Content prize.',
      '',
      'Business name: ',
      'Content link: ',
      'Platform: ',
      'Publication date: ',
      'Contact person and phone: ',
      '',
      'I confirm the content was published with the required hashtags and that I have the consent of the people filmed.',
      '',
      'Kind regards,',
    ],
  },

  rules: {
    title: 'Official Terms',
    subtitle: (contest, event, city) => `${contest} — ${event}, ${city}`,
    draftNotice:
      'Working draft prepared for the campaign: before publication the text must be reviewed by NAKA’s legal counsel and, where required, notified to the competent cantonal authority for prize competitions.',
    close: 'Close',
    accept: 'I accept and enter',
    updated: (date, organizer) => `Terms last updated: ${date} · ${organizer} © 2026`,
    prevailing:
      'This is a courtesy translation. In case of any discrepancy, the Italian version of these Terms prevails.',
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
        title: '1. Promoter and purpose',
        body: [
          `The "${contest}" campaign is promoted by ${organizer} on the occasion of ${event} in ${city}.`,
          'Its purpose is to promote cryptocurrency payments through NAKA POS terminals at participating merchants in the Lugano area.',
        ],
      },
      {
        title: '2. Campaign period',
        body: [
          `Transactions made between ${from} and ${to} (Europe/Zurich time) are eligible.`,
          `The prize draw takes place on ${draw}, following the procedure and timing set out in article 7. Entries received after the closing deadline are not accepted.`,
        ],
      },
      {
        title: '3. Eligibility',
        body: [
          'Open to any natural person aged 18 or over who makes a purchase settled in cryptocurrency on a NAKA POS at a participating merchant.',
          'Only transactions settled on a NAKA POS in bitcoin over the Lightning Network, in USD₮ on Ethereum or Polygon, or in Tether Gold on Ethereum are eligible. Payments made in traditional currency or through other schemes, LVGA included, do not qualify.',
          'Participation is free of charge: no cost is added to the normal purchase price.',
        ],
      },
      {
        title: '4. How to enter',
        body: [
          'For each transaction the participant submits an entry on this website providing their email address, the last 6 characters of the transaction number, the amount, the merchant and a photograph of their proof of purchase. All fields are mandatory: the transaction number and the amount are used to match the payment on the terminal, the merchant to identify the terminal itself.',
          'No wallet address is requested at entry: it is requested by email from winners only, after their entry has been validated.',
          'Each valid and distinct transaction grants a single entry. There is no limit to the number of transactions per participant.',
          'Participants must keep proof of purchase until winners are announced: the original paper receipt or, where the merchant issues a digital receipt, the link or document received. Winners are asked to produce it before the prize is paid.',
        ],
      },
      {
        title: '5. Transaction verification and fraud prevention',
        body: [
          'Each transaction number may be submitted only once: duplicates are automatically rejected by the system.',
          'All entries are cross-checked against settlement data from the NAKA POS gateway to verify authenticity, merchant, amount and placement within the campaign period.',
          'NAKA reserves the right to void, without notice, entries linked to cancelled, reversed or unmatched transactions, entries created to circumvent these Terms or generated by automated means, and to exclude the participant from the campaign.',
          'Where fraud is suspected, NAKA may require the proof of purchase and valid photo identification to be produced before paying out a prize.',
        ],
      },
      {
        title: '6. Prizes',
        body: [
          `Customer prize pool: ${users}, paid in bitcoin over the Lightning Network, allocated as follows: ${prizeList.users}.`,
          `Merchant prize pool: ${merchants} in Tether Gold (XAUT) on the Ethereum network, allocated as follows: ${prizeList.merchants}.`,
          'The Top Volume prize is awarded on the basis of volumes recorded by the NAKA POS; the two social content prizes — one for merchants, one for customers — are awarded by a jury; all other prizes are drawn at random.',
          'Prizes cannot be exchanged for cash or replaced with other goods or services.',
        ],
      },
      {
        title: '6-bis. Total prize pool and moment of conversion',
        body: [
          `The total prize pool is declared in satoshi: ${declared}. The figure is the sum of the customer pool, expressed in satoshi, and the satoshi value of the merchant pool, expressed in Tether Gold.`,
          `That value is fixed at a specific instant and is never recalculated: on ${anchor.at} (source: ${anchor.source}), when 1 BTC traded at USD ${anchor.btcUsd} and 1 XAUT at USD ${anchor.xautUsd}. At those prices 2.00 XAUT were worth ${anchor.merchantsSats} satoshi, rounded down to 10,000,000 in the declared figure: the announced total prize pool is therefore equal to or lower than the actual value at the moment of conversion, never higher.`,
          'Prizes are and remain fixed quantities in their respective assets. Market movements after the moment of conversion do not change the quantities awarded, the number of prizes or participants’ eligibility, and give no right to any adjustment.',
        ],
      },
      {
        title: '6-ter. Prize reserved for the Satoshi Spritz event',
        body: [
          `One of the 500,000 satoshi prizes is reserved for the Satoshi Spritz Special event of Plan ₿ Week. Only entries whose transaction took place between ${spritz.from} and ${spritz.to}, at participating merchants located in ${spritz.area}, compete for this prize.`,
          `The precise line-up of venues taking part in the evening is published by the event organisers and republished on this site before the stated time window begins. If no such list is published by the start of the window, all participating merchants at the stated address are deemed eligible. The list cannot be changed once the window has started. Event information: ${spritz.url}`,
          'What counts is the transaction time recorded by the NAKA POS, not the time the entry is submitted on the website: entries can be submitted until the campaign closes, as set out in article 2. If, when the lists are published, the POS time of an entry at those merchants submitted after the start of the evening is not yet available, the entry is included and, if drawn, its time is checked on the POS before payout. A transaction outside the window loses this prize, which passes to the first reserve, but does not exclude the entry from the general draw.',
          'The prize is drawn with the same verifiable procedure described in article 7, applied to the restricted list of entries eligible for it, which is publicly committed together with the others. An entry eligible for this prize also takes part in the general customer draw, but each entry can win only one prize: the general draw is computed first, and entries that have already won it are skipped in the draw for this prize.',
        ],
      },
      {
        title: '6-quater. Social content prize',
        body: [
          'Two prizes are not drawn but awarded by a jury: one reserved for participating merchants, one for customers. The customer prize is 500,000 satoshi.',
          `Open to individuals aged 18 or over who have registered at least one valid entry during the campaign period. The content — video, post or image — must be published on a public profile by ${social.deadline}, on one of the accepted platforms, carrying all three hashtags ${social.tags}. Without all three hashtags the content cannot be found and is not judged.`,
          'The jury is appointed by NAKA and judges the quality of the content: the idea, the care taken, how clear the message is. View counts and reactions do not decide the winner and give no entitlement to a prize.',
          'By publishing, the participant declares that they are the author or hold the rights to the content, that they have the consent of anyone filmed, and grants NAKA a non-exclusive right to republish it on its own channels with attribution, for the duration of the campaign and the six months following. Offensive or misleading content, and content showing people without their consent, is excluded.',
        ],
      },
      {
        title: '7. Verifiable draw and winner notification',
        body: [
          'The prize draw is publicly verifiable: anyone can check that the winners were not chosen. It runs in four stages, always in this order.',
          `(a) Commitment to the lists. By ${commitBy} on ${draw} NAKA publishes, through an automated procedure, three lists of IDs on the «Winners» page of this website: the entries eligible for the customer draw, the entries eligible for the prize in article 6-ter, and the merchants eligible for the merchant draw. For each list it publishes the SHA-256 digest. Every entry submitted before closing and not rejected on verification is eligible, including those still being verified. Once published, the lists cannot be modified. A copy of the commitment is immediately deposited with an independent public archive (the Internet Archive, web.archive.org), which records its date and time.`,
          `(b) Announcement of the seed. In the same publication NAKA states the height of the latest block in the Bitcoin chain at that moment and fixes as the seed the hash of the block ${blocks} positions further on. That block does not exist yet when the lists are published: nobody, NAKA included, can know or choose its hash. The block at that height in the chain with the most accumulated work prevails, as read from at least two independent public block explorers.`,
          '(c) Computation. Once at least one further block has been mined on top of the seed block, for each ID the value sha256("seed:category:ID") is computed, where the category is "users" for the customer draw, "spritz" for the prize in article 6-ter and "merchants" for the merchant draw. IDs are ranked from the lowest value and prizes are assigned in the order of article 6; the IDs that follow are the reserves, in the same order. Each entry can win only one prize: the customer draw is computed first, and entries that have already won it are skipped in the draw under article 6-ter. The seed, the winners and the reserves are published in full.',
          '(d) Verification of winners. Before payout, each drawn entry is checked against NAKA POS data and the proof of purchase. An entry that fails verification, or whose holder does not reply within the deadlines, is excluded with the reason published next to its ID, and the prize passes to the first available reserve. No other change is possible once the lists have been published.',
          `The Bitcoin network produces a block every ten minutes on average, with wide variation: the draw normally takes place between ${drawFrom} and ${drawTo} on ${draw}, and never before ${drawFrom}. A network delay changes neither the lists nor the seed. Entries are identified by ID only, with no personal data.`,
          'Winners are notified by email at the address given at entry within 7 days of the draw and must confirm acceptance within 14 days.',
          'The winning notification asks the winner for the address to receive the prize: a Lightning address for bitcoin prizes, an Ethereum address compatible with the XAUT token for Tether Gold prizes. Transfer takes place within 30 days of receiving the address. NAKA is not liable for addresses that are incorrect, incompatible with the prize asset or no longer accessible.',
        ],
      },
      {
        title: '8. Personal data (FADP / GDPR)',
        body: [
          'NAKA is the data controller. The data collected (email address, transaction details, the merchant name, the image of the proof of purchase and, for winners only, the payout address) is processed solely to run the campaign, carry out fraud checks and pay out prizes.',
          'The legal basis is performance of the contractual relationship arising from entry into the campaign, together with compliance with legal obligations.',
          'Data is retained for as long as needed to run the campaign and to meet subsequent legal obligations, after which it is deleted or anonymised. Images of proofs of purchase are deleted no later than when the site is taken down, one month after winners are announced.',
          `Participants may at any time exercise their rights of access, rectification, erasure, restriction, objection and portability by writing to ${support}, under the Swiss Federal Act on Data Protection (FADP) and Regulation (EU) 2016/679 (GDPR).`,
        ],
      },
      {
        title: '9. Liability and crypto market fluctuation',
        body: [
          'Prizes are denominated in crypto quantities — satoshi for customers, Tether Gold (XAUT) for merchants — not in fiat currency: their value in CHF/EUR may vary significantly with the price of bitcoin and gold and with market conditions. NAKA guarantees no minimum value.',
          'Participants acknowledge the risks of holding digital assets, including volatility and sole responsibility for the custody of their own private keys.',
          'NAKA is not liable for network failures, blockchain delays, POS terminal unavailability or force majeure events preventing an entry from being submitted.',
          'Entering the campaign implies full acceptance of these Terms.',
        ],
      },
      {
        title: '10. Governing law and jurisdiction',
        body: [
          'These Terms are governed by Swiss law. Any dispute falls under the jurisdiction of the courts of Lugano, Canton Ticino, without prejudice to mandatory consumer protection provisions.',
        ],
      },
    ],
  },

  /** The «nobody gets to pick the winners» section, on the home page. Mirrors the Italian block. */
  draw: {
    eyebrow: 'The draw',
    title: 'Nobody gets to pick the winners',
    subtitle: 'Not even NAKA. The outcome is a calculation anyone can redo from the published data.',
    steps: (blocks) => [
      {
        title: 'The list is frozen',
        text: 'Within half an hour of closing we publish the list of every eligible entry and its SHA-256 fingerprint. From then on, removing or adding a single entry would change the fingerprint, and anyone would notice.',
      },
      {
        title: 'The Bitcoin network rolls the dice',
        text: `At the same moment we name the Bitcoin block that will provide the seed: the one mined ${blocks} blocks further on, about an hour later. When the list is frozen that block does not exist yet: nobody, us included, can know or choose its hash.`,
      },
      {
        title: 'The rest is arithmetic',
        text: 'Every entry gets sha256("seed:users:ID"), the same formula the draw script runs. Sort them lowest first: the top ones win, the next ones are reserves. Given the list and the seed, there is only one possible result.',
      },
    ],
    cta: 'How the draw works, in detail',
  },

  modal: { close: 'Close' },

  notFound: {
    title: 'This page does not exist',
    text: (contest) =>
      `The link may have expired or been mistyped. Go back to the “${contest}” home page to register a payment or find participating shops.`,
    home: 'Back to home',
    map: 'Participating shops',
  },

  error: {
    title: 'Something went wrong',
    text: 'The page failed to load. Please try again — if the problem persists, write to us at',
    retry: 'Try again',
  },
};

export default en;
