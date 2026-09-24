// Validazione condivisa client/server: la stessa funzione gira nel form e nella route API,
// così le regole non possono essere aggirate disabilitando il JS del browser.
//
// Restituisce CODICI, non messaggi: il testo dipende dalla lingua di chi guarda la pagina,
// e il server non deve indovinarla. La traduzione avviene nel client (lib/i18n).

export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024; // 8 MB
export const ACCEPTED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
export const MAX_MERCHANT_LENGTH = 120;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Si chiedono le ULTIME 6 CIFRE del numero di transazione: sulla ricevuta NAKA il numero è
// lungo 32 caratteri, spezzato su due righe, e copiarlo per intero da uno scontrino termico
// arrotolato è il modo più veloce per far abbandonare il form. Chi preferisce incollarlo
// tutto può farlo: si accettano da 6 a 64 caratteri e il confronto usa comunque il suffisso.
const TX_RE = /^[A-Za-z0-9]{6,64}$/;

/** Ultime 6 cifre, normalizzate: è la chiave con cui si confrontano due giocate. */
export const txSuffix = (value) => {
  const clean = (value || '').replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return clean.length >= 6 ? clean.slice(-6) : '';
};

/**
 * Importo in centesimi. Le sei cifre da sole collidono troppo spesso (su 2.000 giocate,
 * una probabilità dell'11% che due finiscano uguali, e un cliente onesto si vedrebbe
 * rifiutare la giocata come duplicata): l'importo è già stampato sulla ricevuta, si copia
 * in un attimo e porta quella probabilità sotto lo 0,1%.
 */
export function parseAmount(value) {
  const clean = (value || '').toString().trim().toLowerCase().replace(/chf|fr\.?|\s/g, '').replace(',', '.');
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(clean)) return null;
  const cents = Math.round(Number(clean) * 100);
  return cents > 0 ? cents : null;
}

const TXID_HASH_RE = /^(0x)?[0-9a-f]{64}$/i;
// Formato stampato dalle ricevute POS NAKA: 32 esadecimali sotto la voce "N° TRANSAZIONE".
const NAKA_TX_RE = /^[0-9a-f]{32}$/i;
const BOLT11_RE = /^ln(bc|tb)[0-9a-z]{50,}$/i;

export const normalizeTx = (value) => (value || '').trim().toLowerCase();
export const isValidEmail = (value) => EMAIL_RE.test((value || '').trim());
export const isValidTxId = (value) => TX_RE.test((value || '').trim());

/** Etichetta il tipo di riferimento fornito, per la verifica manuale a valle. */
export function txKind(value) {
  const v = (value || '').trim();
  if (!v) return null;
  if (NAKA_TX_RE.test(v)) return 'naka';
  if (TXID_HASH_RE.test(v)) return 'blockchain';
  if (BOLT11_RE.test(v)) return 'lightning';
  return 'receipt';
}

/**
 * Valida i dati di una giocata.
 * Campi richiesti: email, ultime 6 cifre della transazione, importo, foto dello scontrino e consensi.
 *
 * @returns {Record<string,string>} mappa campo -> codice errore (vuota se tutto ok)
 */
export function validateEntry(data, receipt) {
  const errors = {};
  const tx = (data.txId || '').trim();

  if (!isValidEmail(data.email)) errors.email = 'email_invalid';

  // Entrambe le prove sono obbligatorie: il numero consente il riscontro automatico sul backend
  // POS NAKA, lo scontrino la verifica documentale in caso di contestazione o vincita.
  if (!tx) errors.txId = 'tx_missing';
  else if (!isValidTxId(tx)) errors.txId = 'tx_invalid';

  if (!(data.amount || '').trim()) errors.amount = 'amount_missing';
  else if (parseAmount(data.amount) === null) errors.amount = 'amount_invalid';

  if (!receipt) errors.receipt = 'receipt_missing';
  else if (!ACCEPTED_RECEIPT_TYPES.includes(receipt.type)) errors.receipt = 'receipt_type';
  else if (receipt.size > MAX_RECEIPT_BYTES) errors.receipt = 'receipt_size';

  if ((data.merchant || '').trim().length > MAX_MERCHANT_LENGTH) errors.merchant = 'merchant_too_long';
  if (!data.confirmAge) errors.confirmAge = 'age_required';
  if (!data.acceptRules) errors.acceptRules = 'rules_required';

  return errors;
}
