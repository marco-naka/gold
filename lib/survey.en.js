/**
 * Traduzione inglese del questionario di rilevazione.
 *
 * Qui c'è SOLO quello che si legge a schermo. Le risposte salvate restano in italiano:
 * la stringa italiana è l'identificativo del dato, l'inglese è una maschera. È il motivo
 * per cui `options` è una mappa — chiave italiana, valore inglese — e non un elenco: così
 * un CSV di trecento rilevazioni resta in una lingua sola, qualunque lingua abbia usato
 * chi lo ha compilato.
 *
 * Conseguenza da ricordare: cambiando un'opzione in `survey.js` va cambiata anche la
 * chiave qui. Un test lo verifica, così non si scopre sul campo.
 */

export const SECTIONS_EN = {
  in_negozio: { title: 'In the shop', intro: 'Who you spoke to, and what you found on the way in.' },
  transazione: { title: 'The test transaction', intro: 'To be done in every shop that has the POS.' },
  naka: { title: 'Joining, and the NAKA relationship', intro: 'The part to discuss with whoever decides.' },
};

export const QUESTIONS_EN = {
  con_chi: {
    label: 'Who did you find in the shop?',
    options: { Titolare: 'Owner', Dipendente: 'Member of staff', 'Era chiuso': 'It was closed' },
  },
  con_chi_nome: {
    label: 'Their name',
    help: 'Optional. Useful to whoever comes back and asks for the same person.',
  },
  pos_presenza: {
    label: 'The NAKA POS',
    options: {
      'Visibile al cliente': 'Visible to the customer',
      'Presente ma nascosto': 'There but hidden',
      'Non presente': 'Not there',
    },
  },
  pos_stato: {
    label: 'Terminal software',
    options: {
      'Già aggiornato alla 3.1.5': 'Already on 3.1.5',
      'Aggiornato da me': 'Updated by me',
      'Non è stato possibile aggiornarlo': 'Could not be updated',
      'Terminale non funzionante — chiamare subito l’assistenza': 'Terminal not working — call support now',
    },
  },
  problema_flag: {
    label: 'Report a problem with the terminal',
    help: 'Even if it works: anything support should know.',
  },
  problema_tipo: {
    label: 'What is wrong?',
    options: {
      'Batteria scarica': 'Flat battery',
      'Cavo non collegato': 'Not plugged in',
      'Non si accende': 'Will not turn on',
      'Connessione assente': 'No connection',
    },
  },
  problema_note: {
    label: 'Describe the problem',
    help: 'What support will read: what you saw, what you tried.',
  },
  sim_sunrise: { label: 'The SIM had to be swapped from Swisscom to Sunrise' },
  materiale_esposto: {
    label: 'Material already on display',
    help: 'Tick nothing if the shop has none.',
    options: { 'Adesivo in vetrina': 'Window sticker', 'Plex da banco': 'Counter stand' },
  },
  materiale_consegnato: {
    label: 'Material left today',
    help: 'Tick nothing if you left none.',
    options: {
      'Adesivo vetrina': 'Window sticker',
      'Plex da banco': 'Counter stand',
      'Rollup A3': 'A3 roll-up',
      Locandina: 'Poster',
      'Flyer evento': 'Event flyer',
      'Vetrofania evento': 'Event window decal',
    },
  },

  pos_test: {
    label: 'What did you do on the terminal?',
    help: 'Photos go below.',
    options: {
      'Solo generato i QR': 'Generated the QR codes only',
      'Generato i QR + transazione di acquisto': 'Generated the QR codes + made a purchase',
      'Da fare: ripasso fissato': 'To do: return visit booked',
    },
  },

  // `brandOptions` dice che le opzioni sono nomi propri — rail, marchi — e restano
  // identiche nelle due lingue. Serve a distinguere «non si traduce» da «ci siamo
  // dimenticati di tradurlo», che a occhio si somigliano.
  qr_provati: {
    label: 'Which rails did you generate the QR on?',
    help: 'Try them all: it is the only way to know which one is broken.',
    brandOptions: true,
  },
  qr_esito: { label: 'Did they all work?' },
  qr_rotti: { label: 'Which ones did not work?', brandOptions: true },
  tempo_qr: {
    label: 'How long did the QR take to appear?',
    options: { 'Meno di 5 s': 'Under 5 s', 'Da 5 a 15 s': '5 to 15 s', 'Oltre 15 s': 'Over 15 s' },
  },
  acquisto_rail: { label: 'Which rail did you pay on?' },
  acquisto_esito: {
    label: 'How did the payment go?',
    options: {
      'Riuscito al primo tentativo': 'Worked first time',
      'Riuscito al secondo': 'Worked on the second try',
      Fallito: 'Failed',
    },
  },
  acquisto_causa: {
    label: 'What went wrong?',
    options: {
      'Errore di rete': 'Network error',
      Timeout: 'Timeout',
      'Errore del terminale': 'Terminal error',
      'Wallet del cliente': 'Customer wallet',
      Altro: 'Other',
    },
  },
  acquisto_causa_altro: { label: 'What happened?' },
  tempo_conferma: {
    label: 'How long did confirmation take?',
    options: { 'Meno di 5 s': 'Under 5 s', 'Da 5 a 15 s': '5 to 15 s', 'Oltre 15 s': 'Over 15 s' },
  },
  acquisto_importo: { label: 'Amount paid (CHF)', help: 'As printed on the receipt.' },
  foto_ricevuta: { label: 'Photos of the receipts or QR codes' },

  adesione: {
    label: 'Are they joining the contest?',
    options: {
      Aderisce: 'Joining',
      'Aderisce e creerà un contenuto social': 'Joining, and will post social content',
      'Non è stato possibile ottenere una risposta': 'Could not get an answer',
      'Non aderisce': 'Not joining',
    },
  },
  personale_informato: {
    label: 'Are the till staff trained on how NAKA works?',
    help: 'Whoever takes payment is the one who meets the customer paying in crypto.',
    options: {
      Sì: 'Yes',
      'Adesso sì, abbiamo fatto un refresh': 'They are now — we ran a refresher',
      'No, e non è stato possibile fare refresh': 'No, and a refresher was not possible',
    },
  },
  naka_carte: {
    label: 'Do they use NAKA for card payments too?',
    options: { Sì: 'Yes', No: 'No', 'Non accetta carte': 'Does not take cards' },
  },
  // I marchi restano tali: si traduce solo «Altro».
  fornitore_carte: {
    label: 'Which provider do they use today?',
    options: { Altro: 'Other' },
    brandOptions: true,
  },
  fornitore_carte_altro: { label: 'Which one?' },
  naka_valutato: { label: 'Have they ever considered using NAKA for card payments as well?' },
  appuntamento_commerciale: {
    label: 'They want a meeting with a sales rep after the event',
    help: 'We call them: we take the contact details from the shop record.',
  },
  cassa_sistema: { label: 'Do they use a till system?' },
  cassa_quale: { label: 'Which one?', help: 'The name of the software or register, as they call it.' },
  naka_esperienza: { label: 'How do they rate their experience with NAKA?', help: '1 = poor · 5 = excellent' },
  naka_problemi: { label: 'Problems or requests to pass on to support' },
  qr_recensione: {
    label: 'Show the review QR code',
    help: 'Turn the screen towards them: they scan it and write the review from their own phone.',
  },
  naka_recensione: { label: 'They said they will write the review' },
  ritorno: { label: 'A return visit is needed' },
  ritorno_motivo: {
    label: 'Why are you going back?',
    options: {
      'Transazione di prova da fare': 'Test transaction still to do',
      'Titolare assente': 'Owner was away',
      'Materiale da consegnare': 'Material to deliver',
      'Formazione cassa': 'Till staff training',
      'Problema da risolvere': 'Problem to fix',
    },
  },
  ritorno_quando: { label: 'When are you going back?' },
  ritorno_ora: { label: 'At what time?', help: 'Optional: add it if you agreed on a time.' },
  note: { label: 'Free notes', help: 'Whatever does not fit the questions and will matter in a month.' },
};

/** Risposte sì/no/na: le stesse ovunque, non vale la pena ripeterle domanda per domanda. */
export const CHOICES_EN = { si: 'Yes', no: 'No', na: 'N/A' };

export const OUTCOMES_EN = {
  aderisce: 'Joining',
  da_ricontattare: 'To follow up',
  rifiuta: 'Not joining',
  chiuso: 'Closed or not found',
};

export const PHOTOS_EN = {
  vetrina: { label: 'Shopfront', hint: 'Taken from outside, before going in' },
  ricevuta: { label: 'Receipts and QR codes', hint: 'One for each test or purchase' },
  altro: { label: 'Other photos', hint: 'A QR that fails, the sign, whatever helps' },
};

/** Testi dell'interfaccia che non vengono dal questionario. */
export const UI_EN = {
  gateTitle: 'Field survey area',
  gateIntro: 'Enter the code you received from the team.',
  gateCode: 'Code',
  gateSubmit: 'Enter',
  gateChecking: 'Checking…',
  gateWrong: 'Wrong code.',
  stepMerchant: 'Who is surveying, and where',
  yourName: 'Your name',
  yourNamePlaceholder: 'First and last name',
  yourNameHint: 'Kept on this phone for the next rounds.',
  shop: 'Shop',
  searchShop: 'Search for the shop…',
  notListed: (q) => `Not in the list: use “${q}”`,
  newShop: 'Not in the list: it will be marked as new.',
  fromMap: 'From the map:',
  visitedTimes: (n) => `Already visited ${n}×`,
  complete: 'Complete',
  toComplete: 'To complete',
  returnOn: 'return',
  changeShop: 'Change',
  photosTitle: 'Photos',
  photosIntro:
    'None is required: take the ones that make sense for this shop. Receipts can also be attached here.',
  take: 'Take or upload',
  addMore: 'Add',
  preparing: 'Preparing…',
  remove: 'Remove',
  next: 'Next',
  back: 'Previous section',
  restart: 'Another shop',
  restartConfirm: 'Discard this visit and start a new one?',
  restartYes: 'Yes, start over',
  restartNo: 'No, carry on',
  save: 'Save survey',
  saving: 'Saving…',
  savedTitle: 'Survey saved',
  nextShop: 'Next shop',
  required: 'Answer required.',
  tooLong: 'Text too long.',
  pickShop: 'Choose the shop and type your name.',
  offline: 'No connection: try again, your draft is saved.',
  genericError: 'Something went wrong.',
  photoSize: (mb) => `Image too large: ${mb} MB maximum.`,
  photoType: 'Unsupported format: JPG, PNG, WEBP or HEIC.',
  signedInAs: 'Surveying as',
  resumeFrom: (chi, quando) => `Resume ${chi}'s survey from ${quando}`,
  resumed: 'Previous answers loaded',
  resumeHint: 'Every answer can still be changed. Photos have to be taken again.',
  pinHint: 'Test PIN, to be changed before go-live:',
  selectAll: 'Select all',
  deselectAll: 'Clear all',
  showQr: 'Show the QR code',
  openLink: 'Open the link',
  close: 'Close',
};
