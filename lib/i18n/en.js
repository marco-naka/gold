/** English copy. Keys must mirror it.js (checked by a test). */
const en = {
  meta: {
    /** Nome del concorso nella lingua della pagina. Il nome legale resta CONTEST.title. */
    contestTitle: 'Pay in Crypto and Win Digital Gold',
    /** Congiunzione per l'elenco degli asset: "BTC, USDt or XAUT". */
    assetsConjunction: 'or',
    title: (contest, event) => `${contest} | NAKA × ${event}`,
    description:
      'Pay with crypto at participating Lugano merchants and win Digital Gold in Tether Gold (XAUT).',
    ogDescription: 'Pay with crypto on NAKA POS terminals and enter the Tether Gold (XAUT) prize draw.',
    skipLink: 'Skip to the entry form',
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
      'Best Social Video': {
        place: 'Best Social Video',
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
    txLabel: 'Transaction number',
    txHint: 'You will find it on the POS receipt or in your wallet.',
    txPlaceholder: 'e.g. 0x4f2a… · lnbc… · receipt ref.',
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
      tx_duplicate: 'This transaction number has already been used for a previous entry.',
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
    ctaVideo: 'Best Social Video prize',
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
    bestVideo: 'Best Social Video',
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

  video: {
    metaTitle: (prize) => `Best Social Video — ${prize} up for grabs | NAKA`,
    metaDescription:
      'How to enter NAKA’s Best Social Video prize: hashtags, requirements, selection criteria and ideas for your video.',
    back: 'Back to the prize pool',
    badge: 'Merchants only',
    titleLead: 'Best',
    titleGold: 'Social Video',
    intro: (event, city, week, prize) =>
      `Show in a video how crypto payments work in your shop and promote the campaign, which runs all through ${event} week in ${city}: ${week}. Among the most successful videos, the one people like best wins ${prize} in Tether Gold.`,
    ctaSubmit: 'Submit your video',
    ctaIdeas: 'See the ideas',
    statPrize: 'Prize',
    statDeadline: 'Publish by',
    statFormat: 'Format',
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
        title: 'The most successful videos reach the final',
        desc: 'Views, likes, comments and shares collected by the close of the campaign all count. The content with the strongest response makes up the shortlist.',
      },
      {
        phase: 'Stage 2 — The jury',
        title: 'Among the finalists, the best-liked one wins',
        desc: 'From the shortlist, the NAKA jury picks the video that tells the story best: the idea, the charm, how clearly the crypto payment comes across, and how much it makes you want to try it.',
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
    finalTitle: 'Filmed your video?',
    finalText:
      'Send us the link: without the email submission the video is not officially in the running, even if you used every hashtag.',
    mailSubject: 'Best Social Video — submission',
    mailBody: [
      'Hello NAKA Team,',
      '',
      'I am submitting my video for the Best Social Video prize.',
      '',
      'Business name: ',
      'Video link: ',
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
          'The draw is held among all validated entries through a deterministic, publicly verifiable procedure in three stages: (a) once entries close, NAKA publishes the SHA-256 digest of the ordered list of eligible entries, which can no longer be modified thereafter; (b) the height of the Bitcoin block whose hash will serve as the random seed is announced in advance — a value nobody can know or influence before it exists; (c) winners are determined by ranking, for each entry, the value sha256("seed:entry ID").',
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
