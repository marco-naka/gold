// Validazione condivisa client/server: la stessa funzione gira nel form e nella route API,
// così le regole non possono essere aggirate disabilitando il JS del browser.
//
// Restituisce CODICI, non messaggi: il testo dipende dalla lingua di chi guarda la pagina,
// e il server non deve indovinarla. La traduzione avviene nel client (lib/i18n).

export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024; // 8 MB
export const ACCEPTED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
export const MAX_MERCHANT_LENGTH = 120;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Il numero di transazione è volutamente permissivo: sul POS può essere un hash blockchain,
// una invoice Lightning o il numero di riferimento stampato sulla ricevuta.
const TX_RE = /^[A-Za-z0-9][A-Za-z0-9:_\-./]{5,199}$/;

const TXID_HASH_RE = /^(0x)?[0-9a-f]{64}$/i;
const BOLT11_RE = /^ln(bc|tb)[0-9a-z]{50,}$/i;

export const normalizeTx = (value) => (value || '').trim().toLowerCase();
export const isValidEmail = (value) => EMAIL_RE.test((value || '').trim());
export const isValidTxId = (value) => TX_RE.test((value || '').trim());

/** Etichetta il tipo di riferimento fornito, per la verifica manuale a valle. */
export function txKind(value) {
  const v = (value || '').trim();
  if (!v) return null;
  if (TXID_HASH_RE.test(v)) return 'blockchain';
  if (BOLT11_RE.test(v)) return 'lightning';
  return 'receipt';
}

/**
 * Valida i dati di una giocata.
 * Campi richiesti: email, numero transazione, foto dello scontrino e consensi.
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

  if (!receipt) errors.receipt = 'receipt_missing';
  else if (!ACCEPTED_RECEIPT_TYPES.includes(receipt.type)) errors.receipt = 'receipt_type';
  else if (receipt.size > MAX_RECEIPT_BYTES) errors.receipt = 'receipt_size';

  if ((data.merchant || '').trim().length > MAX_MERCHANT_LENGTH) errors.merchant = 'merchant_too_long';
  if (!data.confirmAge) errors.confirmAge = 'age_required';
  if (!data.acceptRules) errors.acceptRules = 'rules_required';

  return errors;
}
