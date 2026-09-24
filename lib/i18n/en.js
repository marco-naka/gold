/** English copy. Keys must mirror it.js (checked by a test). */
const en = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Pay in Crypto and Win Digital Gold',
    /** Congiunzione per l'elenco degli asset: "Bitcoin (Lightning) or USDt". */
    assetsConjunction: 'or',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Pay with crypto at participating Lugano merchants and win Digital Gold in Tether Gold (XAUT).',
    ogDescription: 'Pay with crypto on NAKA POS terminals and enter the Tether Gold (XAUT) prize draw.',
    skipLink: 'Skip to the entry form',
    languageLabel: 'Language selection',
    languageName: 'English',
    switchTo: 'Italiano',
  },

  nav: {
    howItWorks: 'How It Works',
    prizes: 'Prize Pool',
    map: 'Merchant Map',
    upload: 'Submit Receipt',
    rules: 'Terms',
    cta: 'Enter Now',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'NAKA - Home',
  },

  hero: {
    titleLead: 'Pay with Crypto in Lugano and win',
    titleGold: 'Digital GOLD!',
    subtitle: (event) =>
      `Pay with crypto at Lugano shops running a NAKA POS during ${event} and enter the prize draw for Tether Gold (XAUT).`,
    ctaUpload: 'Submit Receipt & TX ID',
    ctaMap: 'Find Participating Shops',
    statMerchants: 'Merchants on the NAKA network in Lugano',
    statAssets: (assets) => `Accepted assets: ${assets}`,
    statPool: 'Total prize pool in Digital Gold',
    rowUsers: 'Customer prize pool',
    rowMerchants: 'Merchant prize pool',
    rowAsset: 'Prize asset',
    rowAssetValue: 'Tether Gold · 1 XAUT = 1 oz of gold',
    disclaimer:
      'XAUT is a token backed by physical gold held in Switzerland. Its value in CHF moves with the market.',
  },

  countdown: {
    loading: 'Loading countdown…',
    toStart: 'Campaign starts in',
    running: 'Campaign running — time left to enter',
    ended: 'Entries closed — draw being prepared',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
  },

  dual: {
    eyebrow: 'Two initiatives',
    title: 'One campaign, two ways to win gold',
    subtitle: 'Customers and merchants compete for two separate prize pools in Tether Gold (XAUT).',
    users: {
      kicker: 'For customers',
      title: 'If You Shop',
      points: (assets) => [
        `Pay with ${assets} on a NAKA POS`,
        'Submit the transaction number and a photo of your receipt',
        'You are automatically entered into the Digital Gold draw',
        'No limits: every valid transaction is one entry',
        'Stacks with the MyLugano city cashback',
      ],
      cta: 'Submit your entry',
    },
    merchants: {
      kicker: 'For merchants',
      title: 'If You Sell',
      points: () => [
        'Boost sales during Plan ₿ Forum week',
        'Top Volume prize for crypto transactions',
        'Prize for the best promotional social video',
        'Dedicated draw for every merchant with at least one transaction',
      ],
      cta: 'See how to join',
    },
  },

  how: {
    eyebrow: 'How it works',
    title: 'Three steps, under a minute',
    subtitle: 'From payment to valid entry — no sign-up, no app to download.',
    steps: (assets) => [
      {
        title: 'Pay with Crypto',
        text: `Make a purchase on a NAKA POS at any participating merchant, using ${assets}.`,
      },
      {
        title: 'Submit the Transaction',
        text: 'Enter the transaction ID (TX ID) and upload a photo of the POS receipt in the form below. The shop name is optional.',
      },
      {
        title: 'Win Tether Gold (XAUT)',
        text: 'Get your entry ID by email and join the draw for prizes in Digital Gold.',
      },
    ],
    guideTitle: 'Never paid with crypto at a shop?',
    guideText:
      'Lugano’s Plan ₿ network already publishes an official guide covering how in-store payment works, which assets are accepted and how to get BTC and USD₮ in the city.',
    guideWallets: 'Recommended Lightning wallets:',
    guideCta: 'Official Plan ₿ guide',
    guideCtaOther: 'Leggila in italiano',
  },

  prizes: {
    eyebrow: 'Prize pool',
    title: (pool) => `${pool} of Digital Gold up for grabs`,
    subtitle: (winners) =>
      `${winners} prizes across two separate pools: one for customers paying with crypto, one for participating merchants.`,
    usersKicker: 'Customers',
    merchantsKicker: 'Merchants',
    usersNote: 'Total prize pool reserved for customers',
    merchantsNote: 'Total prize pool reserved for participating merchants',
    poolLabel: 'prize pool',
    videoLink: 'Rules, hashtags and video ideas',
    note: (date) =>
      `Public draw scheduled for ${date}. Prizes are paid in Tether Gold (XAUT) to the address provided by the winner. The CHF value varies with the price of gold.`,
    items: {
      '1° Premio': { place: '1st Prize', desc: 'Main draw among all valid entries' },
      '2° Premio': { place: '2nd Prize', desc: 'Second draw among valid entries' },
      '3°–14° Premio': { place: '3rd–14th Prize', desc: '12 runner-up prizes drawn at random' },
      'Top Volume Transazioni': {
        place: 'Top Transaction Volume',
        desc: 'To the merchant with the highest crypto takings on a NAKA POS during the campaign',
      },
      'Best Social Content': {
        place: 'Best Social Content',
        desc: 'To the best promotional video published with the official hashtags',
      },
      'Estrazione Riservata Merchant': {
        place: 'Merchant-Only Draw',
        desc: 'Draw among all merchants with at least one recorded crypto transaction',
      },
    },
  },

  form: {
    eyebrow: 'Submit your entry',
    title: 'Upload Receipt & TX ID',
    subtitle: 'Enter the transaction number and upload your receipt: both are required to validate the entry.',
    email: 'Your email',
    emailHint: 'We contact you here if you win — it is the only detail we need to reach you.',
    emailPlaceholder: 'name@domain.ch',
    proofLegend: 'Proof of purchase',
    proofIntro: ['We need', 'both', ': the transaction number for the automatic POS check, and the receipt photo for documentary verification.'],
    txLabel: 'Last 6 characters of the transaction no.',
    txHint: 'Just the last 6: they are at the end of the “N° TRANSAZIONE” line on the receipt.',
    txPlaceholder: 'e.g. 0adca2',
    amountLabel: 'Amount',
    amountHint: 'The total you paid, as printed on the receipt.',
    amountPlaceholder: 'e.g. 0.10',
    receiptLabel: 'Receipt photo',
    receiptCta: 'Tap to take a photo or upload',
    receiptFormats: (mb) => `JPG, PNG, WEBP, HEIC or PDF — max ${mb} MB`,
    receiptRemove: 'Remove attachment',
    merchantLabel: 'Shop',
    merchantOptional: '(optional)',
    merchantHint:
      'Adding it speeds up verification. Type freely: suggestions come from the network map.',
    merchantPlaceholder: 'Start typing the shop name…',
    confirmAge: 'I confirm I am 18 or older and will keep the original receipt.',
    acceptRulesBefore: 'I accept the ',
    acceptRulesLink: 'Official Terms and the Privacy Notice (FADP/GDPR)',
    submit: 'Submit and Enter',
    submitting: 'Checking…',
    footnote:
      'Each transaction number can be submitted only once. Entries are cross-checked against NAKA POS records. We will only ask for your XAUT payout address by email if you win.',
    networkError: 'No connection. Check your network and try again.',
    genericError: 'Submission failed. Please try again in a moment.',
    errors: {
      email_invalid: 'Enter a valid email address (e.g. name@domain.ch).',
      tx_missing: 'Enter the transaction number: you will find it on the POS receipt or in your wallet.',
      tx_invalid: 'Invalid transaction number: copy it from the receipt or your wallet (min. 6 characters).',
      tx_duplicate: 'These characters and this amount are already registered. If it was not you, write to us: the entry is then checked by hand.',
      amount_missing: 'Enter the total amount you paid.',
      amount_invalid: 'Invalid amount: write it as on the receipt, for example 0.10 or 84.50.',
      receipt_missing: 'Upload a photo of the POS receipt.',
      receipt_type: 'Unsupported format: upload JPG, PNG, WEBP, HEIC or PDF.',
      receipt_size: 'File too large: 8 MB maximum.',
      merchant_too_long: 'Shop name too long (120 characters max).',
      age_required: 'You must confirm you are 18 or older and will keep the receipt.',
      rules_required: 'You must accept the Terms and Privacy Notice to enter.',
    },
    apiErrors: {
      invalid_fields: 'Some fields are not valid: please check the form.',
      duplicate_tx: 'This transaction has already been submitted.',
      rate_limited: 'Too many submissions in a short time. Please try again in a few minutes.',
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
        `${organizer} runs the payment network behind the crypto POS terminals in Lugano shops. The campaign is promoted and the prizes are paid directly by ${organizer}: your data is not passed on to anyone else.`,
      link: 'naka.com',
    },

    txHelp: {
      toggle: 'Where do I find this number?',
      text: 'On the NAKA receipt look for “N° TRANSAZIONE”, printed across two lines above the terminal. You only need the last 6 characters, i.e. the end of the second line: in the example b72134bf088d4df88eaf5 5c3b90adca2 that is 0adca2. If you prefer to paste the whole number, that works too.',
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
      subtitle: 'Keep the original receipt until winners are announced.',
      idLabel: 'Your entry ID is',
      copied: 'Copied to clipboard',
      rowEmail: 'Email',
      rowProof: 'Proof of purchase',
      rowTx: 'Transaction number',
      rowMerchant: 'Shop',
      rowDate: 'Submitted on',
      rowStatus: 'Status',
      statusValue: 'Being checked against NAKA POS records',
      emailSent: (email) => `We sent a confirmation to ${email} with a summary of your entry. If you cannot find it, check your spam folder.`,
      nextSteps:
        'You will get a second email once the entry is validated. If you win, we will ask for the wallet address to receive your XAUT prize: NAKA never asks for private keys or recovery phrases.',
      close: 'Got it',
    },
  },

  map: {
    eyebrow: 'Merchant map',
    title: 'Where to pay with crypto in Lugano',
    subtitle: (event) => `Merchants on the NAKA network in Lugano, open during ${event} week.`,
    searchPlaceholder: 'Search by name or street…',
    searchLabel: 'Search merchants',
    clearSearch: 'Clear search',
    resultsOne: 'merchant found',
    resultsMany: 'merchants found',
    inCategory: (category) => ` in "${category}"`,
    showMore: (n) => `Show ${n} more merchants`,
    emptyTitle: 'No merchants found',
    emptyText: 'Try a different name, street or category.',
    directions: 'Directions',
    website: 'Website',
    badgeVerified: 'NAKA POS Active',
    badgeCircuit: 'NAKA network',
    badgePending: 'Activation in progress',
    badgeVerifiedTitle: 'Participation confirmed by NAKA',
    badgeCircuitTitle:
      'Accepts crypto on the NAKA network according to the City map; campaign participation to be confirmed',
    center: 'Central Lugano',
    closeCard: 'Close merchant card',
    sourcePrefix: 'List derived from the ',
    sourceSuffix: (date) => ` · updated ${date}. NAKA POS activation for the campaign is confirmed by the NAKA team.`,
    categories: {
      all: 'All',
      food: 'Restaurants & Bars',
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
      'Visibility on the official campaign map',
      `${pool} in prizes reserved for participating merchants`,
    ],
    cta: 'Send your confirmation email',
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
    eyebrow: 'FAQ & Support',
    title: 'Frequently asked questions',
    helpTitle: 'Didn’t find your answer?',
    helpText: 'The support team replies within 24 working hours.',
    helpCta: 'Contact support',
    items: [
      {
        q: 'Which cryptocurrencies can I use on a NAKA POS?',
        a: 'Merchants on Lugano’s Plan ₿ network accept Bitcoin over the Lightning Network (BTC) and Tether (USD₮); many also accept LVGA, which however does not qualify for this campaign. Each merchant can enable one or more assets: availability is shown on the shop card in the map.',
      },
      {
        q: 'I don’t have a wallet yet — how do I pay?',
        a: 'You need a wallet that supports the Lightning Network. The Plan ₿ network recommends Bitkit, Breez and Wallet of Satoshi: the official tutorials are linked in the "How it works" section of this page. Setup takes a few minutes and needs no bank account.',
      },
      {
        q: 'Does this stack with MyLugano cashback?',
        a: 'Yes. The cashback offered by the city network through the MyLugano app is unaffected: the NAKA campaign is an additional benefit and does not replace or reduce the City of Lugano’s promotions.',
      },
      {
        q: 'How are Tether Gold prizes paid out?',
        a: 'You do not need to provide a wallet to enter. If you win, we email the address you used for the entry and ask at that point for the address (an XAUT-compatible wallet or your NAKA container) to receive the prize, transferred within 30 days. An incorrect address means the funds cannot be recovered.',
      },
      {
        q: 'Do I have to keep the paper receipt?',
        a: 'Yes. A photo of the receipt is required at entry, and the original must be kept until winners are announced: if you win, you will be asked to present it before the prize is paid. Without the original receipt the entry is void and a new draw is held.',
      },
      {
        q: 'Who can take part?',
        a: 'Any customer aged 18 or over who makes a crypto purchase on a NAKA POS at a participating Lugano merchant during the campaign period. NAKA employees and their immediate family are excluded.',
      },
      {
        q: 'How do I know the draw is honest?',
        a: 'Because it does not depend on us. When entries close we publish the list of eligible entries, which can no longer be changed. The number that decides the winners arrives afterwards, from the Bitcoin network, and nobody can predict or choose it. With those two public pieces anyone can redo the computation and get the same winners: the procedure and the result are both on the winners page.',
      },
      {
        q: 'How many times can I enter?',
        a: 'There is no limit: every valid, distinct crypto transaction creates a new entry. The same transaction number, however, can only be submitted once.',
      },
      {
        q: 'What if the gold price changes?',
        a: 'The prize is denominated in XAUT, not in francs. Its CHF value can therefore rise or fall with the price of gold and crypto market conditions: NAKA guarantees no minimum fiat value.',
      },
    ],
  },

  footer: {
    tagline: (contest, organizer, event, city) =>
      `${contest} — the ${organizer} campaign for ${event} in ${city}. Pay with crypto on NAKA POS terminals and win Digital Gold.`,
    contestHeading: 'Campaign',
    legalHeading: 'Legal',
    faq: 'FAQ & Support',
    payGuide: 'How to pay at the POS',
    winners: 'Winners and draw',
    linkedin: 'NAKA on LinkedIn',
    bestVideo: 'Best Social Content',
    rules: 'Full Terms',
    privacy: 'Privacy Policy (FADP/GDPR)',
    support: 'Support contacts',
    copyright: (organizer) =>
      `© 2026 ${organizer}. All rights reserved. Prizes are paid in Tether Gold (XAUT); their value varies with the market.`,
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
    rowTx: 'Transaction number',
    rowMerchant: 'Shop',
    rowReceipt: 'Receipt attached',
    rowDate: 'Submitted on',
    rowStatus: 'Status',
    statusValue: 'Being checked against NAKA POS records',
    nextTitle: 'What happens next',
    next: (drawDate) => [
      'We check the transaction against the records on the NAKA POS.',
      'You get a second email once your entry is validated.',
      `The public draw takes place on ${drawDate}.`,
    ],
    pool: (pool, winners) => `${pool} in Tether Gold is up for grabs, across ${winners} prizes.`,
    warningLead: 'Keep the original receipt',
    warning: (organizer) =>
      ` until winners are announced. If you win, we will ask for the wallet to receive your prize: ${organizer} never asks for private keys or recovery phrases.`,
    support: (email) => `Support: ${email}`,
    footer: (organizer) =>
      `© 2026 ${organizer}. Prizes paid in Tether Gold (XAUT); their value may vary.`,
    yes: 'yes',
  },

  quick: {
    title: 'Submit your entry',
    intro: 'Paid with crypto on a NAKA POS? All you need is your email, the transaction number and a photo of the receipt.',
    backToSite: 'Go to the campaign site',
    deadline: (date) => `Entries open until ${date}`,
  },

  stats: {
    entries: 'entries submitted',
    prizes: 'prizes to win',
    merchants: 'participating shops',
    odds: (entries, prizes) => `${entries} entries so far for ${prizes} prizes: the earlier you enter, the better.`,
  },

  consent: {
    title: 'Traffic measurement',
    text: 'We would like to use an analytics tool that sets cookies, to understand how the site is used. No data is used for advertising.',
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
          'The shop name, if you choose to add it: optional, and only used to speed up verification.',
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
    pendingText: (date) =>
      `Winners are published here after the draw on ${date}, together with the data that lets anyone redo the computation.`,
    simpleTitle: 'In plain words',
    simple: [
      'Imagine tossing a coin and having to call heads or tails while it is still in the air. You cannot cheat: the call is out of your mouth before the coin lands.',
      'The draw works the same way. At 16:00 we close entries and publish the list: that is our call, and from then on it cannot be touched. Then we wait for the number that decides, and we do not pick that number — the Bitcoin network produces it in the following half hour, as it has every ten minutes for fifteen years, knowing nothing about us or the campaign.',
      'At that point there is nothing left to decide: a formula matches the number to the entries and sets the order. Anyone with the list and the number redoes the same computation and gets the same winners — including us, who could not produce a different result even if we wanted to.',
    ],
    howTitle: 'How the draw works',
    howIntro:
      'The hard part of any prize draw is not picking a random number: it is proving to a stranger that the number was not picked after seeing the entrants. It is solved by making two public commitments, in this order.',
    steps: [
      {
        title: '1. The list is frozen',
        text: 'Once entries close we publish the SHA-256 digest of the ordered list of valid entries. From then on, adding, removing or reordering a single entry changes the digest, and anyone can tell.',
      },
      {
        title: '2. The seed is announced before it exists',
        text: 'We state in advance that the randomness will come from the first Bitcoin block mined after entries close. Nobody knows its hash before that block exists — us included — and nobody can choose it.',
      },
      {
        title: '3. The rest is arithmetic',
        text: 'For each entry we compute sha256("seed:entry ID") and sort the results. The top ones win. With the list and the seed public, anyone can redo the computation and get the same names.',
      },
    ],
    resultTitle: 'Draw result',
    drawnAt: 'Draw held on',
    seedLabel: 'Seed (Bitcoin block hash)',
    listHashLabel: 'List digest',
    participantsLabel: 'Eligible entries',
    usersSection: 'Customer prizes',
    merchantsSection: 'Merchant prizes',
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
    metaTitle: (prize) => `Best Social Content — ${prize} up for grabs | NAKA`,
    metaDescription:
      'How to enter NAKA’s Best Social Content prize: hashtags, requirements, selection criteria and ideas for your entry.',
    back: 'Back to the prize pool',
    badge: 'Merchants only',
    titleLead: 'Best',
    titleGold: 'Social Content',
    intro: (event, city, week, prize) =>
      `Tell the story of the campaign with a video, a post or an image and promote it during ${event} in ${city}: ${week}. Among the most successful entries, the one people like best wins ${prize} in Tether Gold.`,
    ctaSubmit: 'Submit your entry',
    ctaIdeas: 'See the ideas',
    statPrize: 'Prize',
    statDeadline: 'Publish by',
    statFormat: 'Format',

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
    merchantGuide: {
      eyebrow: 'Merchant guide',
      title: 'How it works for you, step by step',
      subtitle:
        'Everything you need to know about the campaign from the merchant side: what to do before, during and after forum week.',
      steps: [
        {
          title: '1. Join by replying to one email',
          text: 'There is no form to fill in and no contract to sign: reply to the invitation email you received from NAKA confirming your business name, address and contact person. From that moment your shop is on the official list and appears on the public map customers browse.',
        },
        {
          title: '2. Keep your NAKA POS switched on',
          text: 'That is the only technical requirement. The terminal you already use to take Bitcoin Lightning and USDt payments is the same one that records the transactions eligible for the campaign: nothing to install, no change to your checkout routine, no extra cost.',
        },
        {
          title: '3. Take crypto payments during the week',
          text: 'The campaign runs from Monday morning to Saturday afternoon. Every crypto payment you take in those days counts twice: towards your Top Volume prize, and as the customer’s ticket into the draw. The more you take in crypto, the higher you climb.',
        },
        {
          title: '4. Tell customers to submit their receipt',
          text: 'This is the step most people forget: the transaction alone is not enough — the customer has to submit it on the website with the transaction number and a photo of the receipt. Display the material we provide and point to the QR code at the till: ten seconds and your customer is in the draw.',
        },
        {
          title: '5. Publish something and go for the social prize',
          text: 'A video, a post or an image carrying the three official hashtags puts you in the running for the Best Social prize. It is a chance to be seen by forum visitors and by the local audience, not just to win: the best content also gets reshared by NAKA’s own channels.',
        },
        {
          title: '6. Receive your prize in Tether Gold',
          text: 'Once entries close we check the volumes recorded by the POS, the jury picks the winning content, and the merchant-only draw is held through a publicly verifiable procedure. If you win we contact you by email and ask for the address to receive your XAUT prize.',
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
      reviewText: 'Leaving a review helps other Lugano merchants decide whether to accept crypto.',
      reviewCta: 'Leave a Google review',
    },
    announcement: {
      text: 'The official campaign announcement is published on NAKA’s LinkedIn page: follow it for updates, winners and reshares of the best content.',
      cta: 'Go to NAKA’s LinkedIn page',
    },
    hashtagsTitle: 'Required hashtags',
    hashtagsText: ['All three must appear ', 'together', ' in the caption: that is how we find the videos in the running. Without them, the content is not counted.'],
    mentionsTitle: 'Profiles to tag',
    stepsEyebrow: 'How to enter',
    stepsTitle: 'Four steps',
    steps: ({ min, max, ratio, platforms, email, deadline }) => [
      {
        title: 'Film the video',
        text: `${min} to ${max} seconds, ${ratio} format. It must show a crypto payment on the NAKA POS in your shop.`,
      },
      {
        title: 'Publish with the hashtags',
        text: `On ${platforms} or Facebook Reels, from your business’s public profile, with every required hashtag in the caption.`,
      },
      {
        title: 'Tag the profiles',
        text: 'Mention NAKA and Lugano Plan ₿ in the caption or in the video: it helps us find the content and amplify its reach.',
      },
      {
        title: 'Send it to us',
        text: `Email us the link at ${email} by ${deadline}: this is the step that officially puts your video in the running.`,
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
        desc: 'From the shortlist, the NAKA jury picks the entry that tells the story best: the idea, the charm, how clear the message is, and how much it makes you want to try it.'
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
      `${ratio} format, at least ${resolution}`,
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
      `By submitting the video, the merchant declares to be its author or to hold full rights to it, and grants ${organizer} a free, non-exclusive licence, limited to the campaign period, to republish it on its own channels while crediting the business.`,
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
    articles: ({ contest, organizer, event, city, from, to, draw, support, users, merchants, prizeList }) => [
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
          `The prize draw is scheduled for ${draw}. Entries received after the closing deadline are not accepted.`,
        ],
      },
      {
        title: '3. Eligibility',
        body: [
          'Open to any natural person aged 18 or over who makes a purchase settled in cryptocurrency on a NAKA POS at a participating merchant.',
          'Employees and contractors of NAKA, of participating merchants and of campaign partners, together with their immediate family members, are excluded.',
          'Participation is free of charge: no cost is added to the normal purchase price.',
        ],
      },
      {
        title: '4. How to enter',
        body: [
          'For each transaction the participant submits an entry on this website providing their email address, the transaction number and a photograph of the POS receipt: both proofs of purchase are mandatory. Naming the merchant is optional and only serves to speed up verification.',
          'No wallet address is requested at entry: it is requested by email from winners only, after their entry has been validated.',
          'Each valid and distinct transaction grants a single entry. There is no limit to the number of transactions per participant.',
          'Participants must keep the original receipt until winners are announced.',
        ],
      },
      {
        title: '5. Transaction verification and fraud prevention',
        body: [
          'Each transaction number may be submitted only once: duplicates are automatically rejected by the system.',
          'All entries are cross-checked against settlement data from the NAKA POS gateway to verify authenticity, merchant, amount and placement within the campaign period.',
          'NAKA reserves the right to void, without notice, entries linked to cancelled, reversed or unmatched transactions, entries created to circumvent these Terms or generated by automated means, and to exclude the participant from the campaign.',
          'Where fraud is suspected, NAKA may request the original proof of purchase and valid photo identification before paying out a prize.',
        ],
      },
      {
        title: '6. Prizes',
        body: [
          `Customer prize pool: ${users} in Tether Gold (XAUT), allocated as follows: ${prizeList.users}.`,
          `Merchant prize pool: ${merchants} in Tether Gold (XAUT), allocated as follows: ${prizeList.merchants}.`,
          'The Top Volume prize is awarded on the basis of volumes recorded by the NAKA POS; the Best Social Video prize is awarded by a jury among the most successful videos; all other prizes are drawn at random.',
          'Prizes cannot be exchanged for cash or replaced with other goods or services.',
        ],
      },
      {
        title: '7. Draw and winner notification',
        body: [
          'The draw is held among all validated entries through a deterministic, publicly verifiable procedure in three stages: (a) once entries close, NAKA publishes the SHA-256 digest of the ordered list of eligible entries, which can no longer be modified thereafter; (b) it is announced in advance that the random seed will be the hash of the first Bitcoin block mined after entries close — a value nobody can know or influence before that block exists; (c) winners are determined by ranking, for each entry, the value sha256("seed:entry ID").',
          'The committed list, the seed and the result are published in full: anyone can re-run the computation and obtain the same winners. Entries are identified by ID only, with no personal data.',
          'Winners are notified by email at the address given at entry within 7 days of the draw and must confirm acceptance within 14 days.',
          'If there is no response, or if the details cannot be verified, the prize is reassigned through a further draw among the remaining valid entries.',
          'The winning notification asks the winner for the wallet address (or NAKA container) to receive the prize. Transfer in XAUT takes place within 30 days of receiving the address. NAKA is not liable for addresses that are incorrect, incompatible with the XAUT token or no longer accessible.',
        ],
      },
      {
        title: '8. Personal data (FADP / GDPR)',
        body: [
          'NAKA is the data controller. The data collected (email address, transaction details, the receipt image where applicable and, for winners only, the wallet address) is processed solely to run the campaign, carry out fraud checks and pay out prizes.',
          'The legal basis is performance of the contractual relationship arising from entry into the campaign, together with compliance with legal obligations.',
          'Data is retained for as long as needed to run the campaign and to meet subsequent legal obligations, after which it is deleted or anonymised.',
          `Participants may at any time exercise their rights of access, rectification, erasure, restriction, objection and portability by writing to ${support}, under the Swiss Federal Act on Data Protection (FADP) and Regulation (EU) 2016/679 (GDPR).`,
        ],
      },
      {
        title: '9. Liability and crypto market fluctuation',
        body: [
          'The prize is denominated in Tether Gold (XAUT), not in fiat currency: its value in CHF/EUR may vary significantly with the price of gold and market conditions. NAKA guarantees no minimum value.',
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

  modal: { close: 'Close' },

  notFound: {
    title: 'This page does not exist',
    text: (contest) =>
      `The link may have expired or been mistyped. Go back to the “${contest}” home page to submit an entry or find participating shops.`,
    home: 'Back to home',
    map: 'Merchant map',
  },

  error: {
    title: 'Something went wrong',
    text: 'The page failed to load. Please try again — if the problem persists, write to us at',
    retry: 'Try again',
  },
};

export default en;
