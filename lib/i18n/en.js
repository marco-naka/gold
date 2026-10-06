/** English copy. Keys must mirror it.js (checked by a test). */
const en = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Pay with Crypto and Win Bitcoin',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning), USD₮ or XAUT". */
    assetsConjunction: 'or',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Pay with crypto at participating Lugano shops and win bitcoin: 11 million satoshi across 12 prizes, drawn verifiably.',
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
      'The total prize pool is 21 million satoshi: 11 million to customers, in bitcoin, and the equivalent of 10 million to participating shops.',
    rowUsers: 'To customers, in bitcoin',
    rowMerchants: 'To merchants',
    merchantsLink: 'Run a shop? Your prizes',
    rowAsset: 'How you receive them',
    rowAssetValue: 'In bitcoin, over Lightning',
    disclaimer:
      'Prizes are fixed amounts of satoshi: their value in francs or dollars may change, the amount you receive does not.',
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
      `${winners} prizes in bitcoin, paid over Lightning. The 21 million also include 10 million satoshi reserved for participating shops, with their own prizes and rules.`,
    usersKicker: 'Customers · in bitcoin',
    usersNote: 'Total prize pool reserved for customers',
    poolLabel: 'prize pool',
    each: 'each',
    spritzDetails: 'Prize conditions',
    merchantsRefTitle: 'Run a participating shop?',
    merchantsRefText: 'Another 10 million satoshi are reserved for merchants, with their own prizes and rules: see the merchant area.',
    spritzWhen: (day, from, to, area) => `${day}, from ${from} to ${to} · ${area}`,
    spritzNote:
      'The same verifiable draw as the other prizes, run on a smaller list: entries whose transaction falls inside that window, at participating shops on Piazza Cioccaro. The same entries also take part in the general draw, but each one can win only one prize: if it wins the general draw, the Spritz prize goes to the next one. The organisers announce the evening’s venues shortly before the event: from then on, only those venues count.',
    spritzLink: 'The event on the Plan ₿ Week site',
    socialWhen: (deadline) => `Publish by ${deadline}`,
    socialHow: (tags) =>
      `Show your crypto payment in Lugano — video, post or photo — and publish it with all three hashtags ${tags}. Open to anyone with at least one registered entry: the content is how you win, the entry is the ticket in. The NAKA jury decides, not the like count.`,
    socialDetails: 'How to take part',
    note: (date) =>
      `Public draw scheduled for ${date}. Prizes are paid in bitcoin over Lightning, to the address the winner provides after the draw.`,
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
      'Top Numero Transazioni': {
        place: 'Most Transactions',
        desc: 'To the shop that receives the highest number of crypto transactions on its NAKA POS during the campaign',
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
    openMap: 'Open the shop map',
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

  mapPage: {
    metaTitle: 'Map of shops accepting crypto in Lugano',
    metaDescription:
      'The map of participating shops in Lugano where you can pay in bitcoin, USD₮ and Tether Gold on the NAKA POS: find the ones near you.',
    eyebrow: 'Map',
    title: 'Where to pay with crypto, near you',
    intro: (n) =>
      `${n} shops in Lugano with the NAKA POS. Turn on your location to see the nearest, or search by name, street or category.`,
    backToSite: 'Back to the campaign',
    locate: 'Find shops near me',
    locateAgain: 'Update my location',
    locating: 'Finding your location…',
    denied: 'We cannot access your location: you can allow it in your browser settings, or search by street.',
    unsupported: 'This browser does not share your location: search for the shop by name or street.',
    far: 'You are far from Lugano: here are the shops nearest to you anyway.',
    nearest: (name, distance) => `Nearest: ${name}, ${distance}`,
    privacy: 'Your location stays on your phone: it only sorts the shops and is never sent to anyone.',
    youAreHere: 'You are here',
    listNear: 'Nearest to you',
    listAll: 'All shops',
    showOnMap: 'Show on the map',
    resetView: 'All of Lugano',
    showMore: (n) => `Show ${n} more`,
    attribution: 'Map © OpenStreetMap contributors',
    howToPay: 'Pay on the NAKA POS, then register your payment to enter the draw.',
    enter: 'Register your payment',
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
        a: 'You do not need to provide a wallet to enter. If you win, we email you at the address you used to enter and ask at that point for the address to receive the prize: a Lightning address, where the satoshi will arrive. Transfer takes place within 30 days. An incorrect address means the funds cannot be recovered.',
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
        q: 'What if the price of bitcoin changes?',
        a: 'Prizes are fixed amounts of satoshi, not amounts in francs. Their CHF value can therefore rise or fall with the market: NAKA guarantees no minimum fiat value. The declared 21 million satoshi is likewise an equivalence fixed at a specific instant, set out in article 6-bis of the Terms: later movements change neither the quantities nor the number of prizes.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — the ${organizer} campaign for ${event} in ${city}. Pay with crypto on NAKA POS terminals and win bitcoin.`,
    contestHeading: 'Campaign',
    legalHeading: 'Legal',
    faq: 'FAQ and support',
    mapPage: 'Map of the shops',
    winners: 'Winners and draw',
    linkedin: 'NAKA on LinkedIn',
    bestVideo: 'For merchants',
    rules: 'Full terms',
    privacy: 'Privacy notice (FADP/GDPR)',
    support: 'Support contacts',
    copyright: (organizer) =>
      `© 2026 ${organizer}. All rights reserved. Prizes are fixed amounts of cryptocurrency: their value may vary with the market.`,
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
      'Most Transactions is a ranking on the number of payments recorded by the POS and Best Social Content is decided by the jury: neither goes through the draw.',
    publishedUntil: (date) => `This list stays published until ${date}. After that date the campaign is archived and participants’ personal data is deleted.`,
    contacted: 'Winners are contacted by email at the address used for the entry. Entries are identified by ID only: no personal data is published.',
  },

  video: {
    metaTitle: (pool) => `Merchant area — ${pool} reserved for participating shops | NAKA`,
    metaDescription:
      'Everything a Lugano shop needs: how to join, the Tether Gold prizes reserved for merchants, what they are worth, how they are paid and the rules of the social prize.',
    back: 'Back to the campaign site',
    badge: 'Merchant area',
    titleLead: 'Accept crypto payments and win',
    titleGold: 'GOLD',
    intro: (event, city, pool) =>
      `Customers who pay in crypto win bitcoin; you, who take the payment, win gold. During ${event} in ${city} participating shops share ${pool} in Tether Gold across four stackable prizes: one for the shop with the most crypto payments, one for the best social content and two drawn at random. Here is what to do, how to win and who to call.`,
    ctaJoin: 'Confirm you are joining',
    ctaPrizes: 'See the prizes',
    statPrize: 'Shop prize pool',
    statSats: (sats) => `equal to ${sats}`,
    statPeriod: 'Campaign period',
    statDeadline: 'Social content by',
    statSupport: 'Support',
    todoTitle: 'What you need to do',
    todo: [
      'Confirm you are joining by replying to the invitation email, or with the button below.',
      'Keep the NAKA POS on and take crypto payments from 19 to 24 October.',
      'Remind every customer to register their receipt from the QR code.',
    ],

    join: {
      eyebrow: 'Joining',
      title: 'Joining takes two minutes',
      text: 'No form and no contract: reply to NAKA’s invitation email confirming your business details, or use the button below, which opens a ready-made email. Without confirmation the shop does not appear in the official list customers look at.',
      cta: 'Send the joining email',
      subject: 'Joining the "Pay with Crypto and Win Bitcoin" campaign - Plan ₿ Forum 2026',
      body: [
        'Hello NAKA team,',
        '',
        'I confirm that my business is joining the "Pay with Crypto and Win Bitcoin" campaign during Plan ₿ Forum 2026 in Lugano.',
        '',
        'Business name: ',
        'Address in Lugano: ',
        'Category (Food & drink / Shopping / Hotel / Services): ',
        'Contact person and phone: ',
        'NAKA POS terminal ID (if available): ',
        '',
        'The NAKA POS stays on and working for the whole campaign.',
        '',
        'Kind regards,',
      ],
      missingQuestion: 'Didn’t get the invitation email?',
      missingCta: 'Ask to join',
      missingSubject: 'Request to join the campaign',
      missingBody: [
        'Hello NAKA team,',
        '',
        'I did not receive the invitation email but I would like my business to join the campaign.',
        '',
        'Business name: ',
        'Address in Lugano: ',
        'Contact person and phone: ',
        'I already have a NAKA POS (yes / no): ',
        '',
        'Kind regards,',
      ],
    },

    merchantPrizes: {
      eyebrow: 'Shop prizes',
      title: (pool) => `${pool} reserved for merchants`,
      subtitle:
        'Three categories, four prizes, all stackable: one shop can win them all. Only the social prize asks you to publish something; for the others, taking crypto payments is enough.',
      each: 'each',
      howLabel: 'How it is awarded',
      actionLabel: 'What you need to do',
      how: {
        transactions: 'Ranking on the number of transactions recorded by the NAKA POS',
        jury: 'The public takes the most-followed content to the final, the NAKA jury picks the winner',
        draw: 'Random draw, verifiable by anyone',
      },
      items: {
        'Top Numero Transazioni': {
          title: 'Most Transactions',
          text: 'Goes to the shop that receives the most crypto transactions on its NAKA POS during the campaign. What counts is how many times you get paid, not how much: an espresso counts as much as a watch. Every successful payment counts, even if the customer does not register it on the site.',
          action: 'Accept crypto whenever you can. Cancelled or refunded payments, payments by you or your staff, and amounts split on purpose or token amounts do not count. In a tie, the shop with the highest total takings wins. We compute the ranking from POS data.',
        },
        'Best Social Content': {
          title: 'Best Social Content',
          text: 'Goes to the best content published from your business profile: a video, a post or an image about the campaign. The rules are further down, in their own section.',
          action: 'Publish with the three hashtags by the deadline and send us the link.',
        },
        'Estrazione Riservata Merchant': {
          title: 'Shop draw',
          text: 'Two prizes of 0.25 XAUT drawn at random among shops with at least one crypto payment registered on the site by a customer. One ticket per shop: a hundred payments do not improve your odds.',
          action: 'Take at least one crypto payment and ask the customer to register it.',
        },
      },
      note: (date) =>
        `Most Transactions is settled from POS data once the campaign closes; the shop draws take place on ${date} with the same verifiable procedure as the customer draw.`,
    },

    value: {
      eyebrow: 'What it is worth and how you receive it',
      title: 'Gold prizes, in fixed amounts',
      items: ({ at, btcUsd, xautUsd, source }) => [
        {
          title: 'What it is worth',
          text: `The 2.00 XAUT shop prize pool was worth 10,000,000 satoshi at the rate of ${at} (1 XAUT = USD ${xautUsd}, 1 BTC = USD ${btcUsd}, source ${source}). That is why the campaign declares 21 million satoshi in total: 11 to customers and 10 to shops.`,
        },
        {
          title: 'Fixed amounts',
          text: 'You win XAUT, not francs: the value follows the price of gold and may rise or fall, the amount you win does not. NAKA guarantees no minimum value.',
        },
        {
          title: 'Where it arrives',
          text: 'In Tether Gold on the Ethereum network. You need an Ethereum address that accepts XAUT, for example from MetaMask or Trust Wallet: we only ask for it if you win. A wrong address means the funds cannot be recovered.',
        },
        {
          title: 'When',
          text: 'We email you within 7 days of the draw; you have 14 days to accept and give us your address, and the prize arrives within 30 days.',
        },
      ],
    },

    merchantGuide: {
      eyebrow: 'Merchant guide',
      title: 'How it works for you, step by step',
      subtitle: 'What to do before, during and after forum week.',
      steps: [
        {
          title: '1. Confirm you are joining',
          text: 'Reply to the invitation email confirming your business name, address and contact person, or use the «Send the joining email» button above. From then on your shop is in the official list and on the map customers look at.',
        },
        {
          title: '2. Keep the NAKA POS on',
          text: 'That is the only technical requirement. The terminal you already use for bitcoin over Lightning, USD₮ and Tether Gold records eligible transactions on its own: nothing to install, no change at the till, no extra cost.',
        },
        {
          title: '3. Take crypto payments during the week',
          text: 'The campaign runs from Monday 19 October at 08:00 to Saturday 24 October at 16:00. Every crypto payment from a customer counts twice: towards your Most Transactions count, and as the customer’s entry into the draw.',
        },
        {
          title: '4. Remind customers to register their receipt',
          text: 'Paying is not enough for the customer: they have to register the payment on the site with the transaction number and a photo of the receipt. The line that works at the till is a single one: «register your receipt and you enter the draw for 11 million satoshi». A registration matters to you too: without one, the shop does not enter the draw reserved for shops.',
        },
        {
          title: '5. If you like, go for the social prize',
          text: 'A video, a post or an image with the three hashtags puts you in the running for Best Social Content, and gets you seen by forum visitors and the local public. NAKA reshares the best content too.',
        },
        {
          title: '6. Receive your prizes in Tether Gold',
          text: 'Once the campaign closes we count POS transactions, the jury picks the winning content and the shop draws are held. If you win we get in touch: timing and address are explained in «What it is worth and how you receive it».',
        },
      ],
      qrTitle: 'The materials and their QR codes',
      qrText:
        'The poster, counter card and window sticker carry the customer QR code: it opens the registration form and is the one to have scanned at the till. The merchant flyer carries the QR code that opens this page, for you and your staff.',
    },

    faqEyebrow: 'Questions from shops',
    faqTitle: 'Merchant FAQ',
    faq: [
      {
        q: 'Does a payment count if the customer does not register it?',
        a: 'For Most Transactions, yes: every successful crypto transaction on your POS counts. For the shop draw, however, you need at least one payment registered on the site by a customer: that is why it pays to remind everyone.',
      },
      {
        q: 'Do payments by me or my staff count?',
        a: 'No. Transactions by the owner or staff, cancelled or refunded ones, and those split on purpose or made for a token amount to inflate the count do not count.',
      },
      {
        q: 'Can I win more than one prize?',
        a: 'Yes: the prizes stack, one shop can win them all.',
      },
      {
        q: 'Do I need to install or pay for anything?',
        a: 'No. The NAKA POS you already use is enough, switched on and up to date: there are no extra costs.',
      },
      {
        q: 'What if the price of gold changes?',
        a: 'Prizes are fixed amounts of XAUT: their value in francs may rise or fall, the amount you receive does not.',
      },
      {
        q: 'My shop is not on the list: can I join?',
        a: 'Yes: use «Ask to join» in the Joining section, or write to merchant support.',
      },
    ],

    socialEyebrow: 'Best Social Content prize',
    socialTitle: 'The social prize, in short',
    socialSubtitle: (deadline, close) =>
      `Mind the two dates: content must be published by ${deadline}, while transactions and customer entries count until ${close}.`,
    contentTitle: 'What you can publish',
    contentSubtitle: 'A video, a post or an image: any content about the campaign that genuinely catches attention.',
    contentTypes: [
      { title: 'A video', desc: 'Reel, TikTok or short clip: show the crypto payment on the POS or tell the story of the campaign.' },
      { title: 'A post', desc: 'A text explaining why you accept crypto and inviting customers to take part in the campaign.' },
      { title: 'An image', desc: 'A well-shot photo of the shop, the window or the campaign materials, with a caption that tells the story.' },
    ],
    platformsTitle: 'Where to publish',
    platformsNote: 'On LinkedIn you can also tag the NAKA page directly.',
    hashtagsTitle: 'Required hashtags',
    hashtagsText: ['', 'All three', ' must appear in the caption: that is how we find the content in the running. Without them, the content is not counted.'],
    mentionsTitle: 'Profiles you can mention',
    mentionsNote: 'Mentions are optional: they only help us find the content.',
    stepsTitle: 'Three steps',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Create your content',
        text: `A video, a post or an image about the campaign. For video: ${min}–${max} seconds, ${ratio} portrait.`,
      },
      {
        title: 'Publish with the three hashtags',
        text: `On ${platforms}, from your business’s public profile.`,
      },
      {
        title: 'Send us the link',
        text: `To ${email}, by ${deadline}: this is the step that officially enters your content.`,
      },
    ],
    selectionTitle: 'The public first, then the jury',
    selection: [
      {
        phase: 'Phase 1 — The public',
        title: 'The most-followed content reaches the final',
        desc: 'Views, likes, comments and shares collected by the end of the campaign count, on any eligible platform. The content with the strongest response forms the shortlist.',
      },
      {
        phase: 'Phase 2 — The jury',
        title: 'Among the finalists, the most convincing wins',
        desc: 'Among the finalists, the NAKA jury rewards the content that best tells the story of the campaign: idea, care, clarity of message and the ability to make people want to try.',
      },
    ],
    selectionNote:
      'In practice: the more your content travels, the easier it is to reach the final; but in the final the most-viewed does not win, the best-made does.',
    noLimitTitle: 'As much content as you like',
    noLimitText:
      'There is no maximum: content reaches the final, not the shop, so publishing more raises your chances. Each piece must carry the three hashtags and be sent to us.',
    moreTitle: 'More: ideas, requirements and usage rights',
    ideasTitle: 'Eight ideas that work',
    ideasSubtitle:
      'You do not need a videographer: a smartphone, decent light and a clear idea are enough. Take one of these formats and adapt it to your business.',
    ideas: [
      { title: 'The 10-second payment', desc: 'Close-up of the POS: QR, scan, confirmation. No talking, just the confirmation sound and a closing caption.', why: 'The most shared format: it shows that paying in crypto is faster than a card.' },
      { title: 'First time', desc: 'A customer who has never paid in crypto does it on camera, with their reaction at the end of the transaction.', why: 'The face of someone discovering something new is worth more than any explanation.' },
      { title: 'Crypto vs cash', desc: 'Split screen: two customers pay the same bill, one in cash and one over Lightning. Stopwatch on screen.', why: 'A race format: it keeps viewers until the end to see who wins.' },
      { title: 'Your product, in gold', desc: 'The dish, the haircut or the shop’s product told with a "gold" feel: warm light, details, ending on the payment.', why: 'It ties your product to the campaign theme without looking like an ad.' },
      { title: 'Behind the counter', desc: 'The owner explains in person why they chose to accept crypto and what has changed in the shop.', why: 'Authenticity: it works well with the local public and the media.' },
      { title: 'Neighbourhood tour', desc: 'A walk through several participating shops on the same street, one payment per stop.', why: 'Team up with your neighbours: each posts their own version and you reshare each other.' },
      { title: 'A visitor at the forum', desc: 'A Plan ₿ Forum attendee walks in and pays over Lightning without a franc in their pocket.', why: 'It tells the story of why the campaign exists, in the week the city is full of visitors.' },
      { title: 'Mistakes to avoid', desc: 'Ironic tone: all the wrong ways to pay, and then the right one on the NAKA POS.', why: 'Humour is the content people save and send to friends.' },
    ],
    requirementsTitle: 'Requirements',
    requirementsAll: (deadline) => [
      'Published from your business’s public profile',
      `Published by ${deadline}, with the three hashtags`,
      'Original and made for this campaign',
    ],
    requirementsVideoTitle: 'Video only',
    requirementsVideo: ({ min, max, ratio, resolution }) => [
      `Between ${min} and ${max} seconds long`,
      `${ratio} portrait format, at least ${resolution}`,
    ],
    avoidTitle: 'Avoid',
    avoid: [
      'Copyrighted music: it gets the content taken down and excludes you from the prize',
      'Filming customers or staff without their consent',
      'Showing QR codes, amounts or details of other customers’ real transactions',
      'Promises of winning or messages that make the campaign look like a guaranteed lottery',
      'Content copied or reposted from others',
    ],
    rightsTitle: 'Usage rights and responsibility',
    rights: (organizer) => [
      `By submitting the content, the merchant declares to be its author or to hold full rights to it, and grants ${organizer} a free, non-exclusive licence with no time limit to republish it on its own channels, crediting the business.`,
      `The merchant is responsible for obtaining the consent of anyone filmed and for using only royalty-free music. ${organizer} may exclude at any time content that breaches platform terms, Swiss data protection law or the reputation of the campaign.`,
    ],
    rulesLinkBefore: 'All terms of the ',
    rulesLink: 'official campaign rules',
    rulesLinkAfter: ' apply.',
    support: {
      title: 'Merchant support',
      text: 'A question about the POS, joining or the prizes? The NAKA team answers directly.',
      emailLabel: 'Support email',
      phoneLabel: 'Support phone',
      whatsappLabel: 'Support WhatsApp',
      reviewTitle: 'Happy with NAKA?',
      reviewText: 'A review helps other shops in the area decide whether to accept crypto.',
      reviewCta: 'Leave a Google review',
    },
    announcement: {
      text: 'The official announcement of the campaign is on NAKA’s LinkedIn page: follow it for updates, winners and reshares of the best content.',
      cta: 'Go to NAKA on LinkedIn',
    },
    ctaSubmit: 'Submit your content',
    finalTitle: 'Published your content?',
    finalText:
      'Send us the link: without the email the content is not officially in the running, even if you used all the hashtags.',
    mailSubject: 'Best Social Content — submission',
    mailBody: [
      'Hello NAKA team,',
      '',
      'I am submitting my content for the Best Social Content prize.',
      '',
      'Business name: ',
      'Link to the content: ',
      'Platform: ',
      'Publication date: ',
      'Contact person and phone: ',
      '',
      'I confirm I published the content with the required hashtags and have the consent of anyone filmed.',
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
          'The Most Transactions prize is awarded to the merchant that receives the highest number of cryptocurrency payment transactions on its NAKA POS during the campaign period, according to the data recorded by the NAKA gateway; the two social content prizes — one for merchants, one for customers — are awarded by a jury; all other prizes are drawn at random.',
          'For the Most Transactions prize, every successful cryptocurrency payment on the merchant’s NAKA POS during the campaign period counts, whatever the amount and even if the customer did not register it on the website. Transactions that were cancelled or refunded, made by the merchant itself, its owners or its staff, or split artificially or made for a token amount in order to inflate the count are not counted. In the event of a tie, the merchant with the highest total amount taken during the period prevails.',
          'The draw reserved for merchants is open to participating merchants with at least one valid customer entry, registered on this website and relating to a payment made at their shop during the campaign period. Each merchant takes part with a single ticket, whatever the number of entries.',
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
          `The customer prize is open to individuals aged 18 or over who have registered at least one valid entry during the campaign period. The content — video, post or image — must be published on a public profile by ${social.deadline}, on one of the accepted platforms, carrying all three hashtags ${social.tags}. Without all three hashtags the content cannot be found and is not judged.`,
          'For the customer prize, the jury is appointed by NAKA and judges the quality of the content: the idea, the care taken, how clear the message is. View counts and reactions do not decide the winner and give no entitlement to a prize.',
          `The merchant prize is open to participating merchants, with content — video, post or image — published from their business’s public profile by ${social.deadline}, carrying all three hashtags ${social.tags}, and reported to NAKA by email by the same date. For this prize selection takes place in two phases: the content with the strongest public response (views, reactions, comments and shares collected by the end of the campaign) forms the shortlist; among the finalists, the jury appointed by NAKA picks the winner on the idea, the care taken and the clarity of the message.`,
          'By publishing, the participant declares that they are the author or hold the rights to the content, that they have the consent of anyone filmed, and grants NAKA a non-exclusive right to republish it on its own channels with attribution, for the duration of the campaign and the six months following; for merchant content the right is free, non-exclusive and without time limit. Offensive or misleading content, and content showing people without their consent, is excluded.',
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
