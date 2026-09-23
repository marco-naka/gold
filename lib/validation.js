// Validazione condivisa client/server: la stessa funzione gira nel form e nella route API,
// cosi' le regole non possono essere aggirate disabilitando il JS del browser.

export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024; // 8 MB
export const ACCEPTED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
export const MAX_MERCHANT_LENGTH = 120;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Il numero di transazione è volutamente permissivo: sul POS può essere un hash blockchain,
// una invoice Lightning o il numero di riferimento stampato sulla ricevuta. Si controlla solo
// che sia un identificativo plausibile; l'autenticità la stabilisce il riscontro sul backend NAKA.
const TX_RE = /^[A-Za-z0-9][A-Za-z0-9:_\-./]{5,199}$/;

// Formati riconosciuti automaticamente (usati solo per etichettare la giocata, non per scartarla).
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
  return 'ricevuta';
}

/**
 * Valida i dati di una giocata.
 * Campi richiesti: email, numero transazione, foto dello scontrino e consensi.
 * Il merchant è facoltativo: se indicato serve solo a velocizzare il riscontro.
 *
 * @param {object} data campi del form (senza il File, descritto da `receipt`)
 * @param {{name:string,size:number,type:string}|null} receipt metadati dello scontrino caricato
 * @returns {Record<string,string>} mappa campo -> messaggio di errore (vuota se tutto ok)
 */
export function validateEntry(data, receipt) {
  const errors = {};
  const tx = (data.txId || '').trim();

  if (!isValidEmail(data.email)) {
    errors.email = 'Inserisci un indirizzo email valido (es. nome@dominio.ch).';
  }

  // Entrambe le prove sono obbligatorie: il numero consente il riscontro automatico sul backend
  // POS NAKA, lo scontrino la verifica documentale in caso di contestazione o vincita.
  if (!tx) {
    errors.txId = 'Inserisci il numero della transazione: lo trovi sulla ricevuta del POS o nel tuo wallet.';
  } else if (!isValidTxId(tx)) {
    errors.txId = 'Numero transazione non valido: copialo dalla ricevuta o dal wallet (min. 6 caratteri).';
  }

  if (!receipt) {
    errors.receipt = 'Carica la foto dello scontrino o della ricevuta POS.';
  }

  if (receipt) {
    if (!ACCEPTED_RECEIPT_TYPES.includes(receipt.type)) {
      errors.receipt = 'Formato non supportato: carica JPG, PNG, WEBP, HEIC o PDF.';
    } else if (receipt.size > MAX_RECEIPT_BYTES) {
      errors.receipt = 'File troppo pesante: massimo 8 MB.';
    }
  }

  if ((data.merchant || '').trim().length > MAX_MERCHANT_LENGTH) {
    errors.merchant = `Nome negozio troppo lungo (max ${MAX_MERCHANT_LENGTH} caratteri).`;
  }

  if (!data.confirmAge) {
    errors.confirmAge = 'Devi dichiarare la maggiore età e la conservazione dello scontrino.';
  }

  if (!data.acceptRules) {
    errors.acceptRules = 'Devi accettare Regolamento e Informativa Privacy per partecipare.';
  }

  return errors;
}
