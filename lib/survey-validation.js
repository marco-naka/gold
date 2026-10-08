/**
 * Validazione della rilevazione, condivisa tra il modulo e la route API.
 *
 * Come per le giocate, restituisce codici e non messaggi: il testo sta nella pagina.
 * La stessa funzione gira nel browser e sul server, così le regole non si aggirano
 * disattivando il JavaScript.
 */
import { ALL_QUESTIONS, MAX_TEXT_LENGTH, PHOTOS, SCALE_MAX, isVisible, optionsFor } from './survey.js';

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB, come gli scontrini
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
export const MAX_MERCHANT_NAME = 120;

const isEmpty = (v) =>
  v === undefined || v === null || v === '' || v === false || (Array.isArray(v) && v.length === 0);

/** Una singola risposta rispetta il tipo dichiarato? Torna un codice o null. */
function checkAnswer(question, value, answers) {
  const options = optionsFor(question, answers);
  switch (question.type) {
    case 'check':
      // Una casella non spuntata non arriva proprio: se arriva, può valere solo true.
      return value === true ? null : 'invalid';
    case 'yesno':
      return ['si', 'no'].includes(value) ? null : 'invalid';
    case 'yesnona':
      return ['si', 'no', 'na'].includes(value) ? null : 'invalid';
    case 'single':
      return options.includes(value) ? null : 'invalid';
    case 'multi':
      if (!Array.isArray(value)) return 'invalid';
      return value.every((v) => options.includes(v)) ? null : 'invalid';
    case 'scale': {
      const n = Number(value);
      return Number.isInteger(n) && n >= 1 && n <= SCALE_MAX ? null : 'invalid';
    }
    case 'number': {
      const n = Number(value);
      return Number.isFinite(n) && n >= 0 ? null : 'invalid';
    }
    case 'date':
      // Formato del campo nativo del browser: nessuna conversione, nessuna ambiguità
      // fra giorno e mese.
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'invalid';
      return Number.isNaN(Date.parse(value)) ? 'invalid' : null;
    case 'time':
      return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? null : 'invalid';
    case 'text':
      if (typeof value !== 'string') return 'invalid';
      return value.length > MAX_TEXT_LENGTH ? 'too_long' : null;
    default:
      return 'invalid';
  }
}

/**
 * Non tutto quello che sta nel questionario è una risposta: le foto viaggiano a parte e il
 * QR è uno strumento da mostrare. Entrambi si saltano in validazione e nei dati salvati.
 */
const isAnswerable = (q) => q.type !== 'photo' && q.type !== 'qr';

/**
 * Valida una rilevazione completa.
 * @returns {Record<string,string>} campo -> codice errore (vuota se tutto ok)
 */
export function validateVisit(data) {
  const errors = {};
  const answers = data.answers ?? {};

  const merchant = (data.merchantName || '').trim();
  if (!merchant) errors.merchantName = 'required';
  else if (merchant.length > MAX_MERCHANT_NAME) errors.merchantName = 'too_long';

  if (!(data.surveyor || '').trim()) errors.surveyor = 'required';


  for (const q of ALL_QUESTIONS.filter(isAnswerable)) {
    // Una domanda nascosta non si valida: la sua condizione non è soddisfatta, quindi
    // il rilevatore non l'ha nemmeno vista.
    if (!isVisible(q, answers)) continue;
    const value = answers[q.id];
    if (isEmpty(value)) {
      if (q.required) errors[q.id] = 'required';
      // Basta una delle due: questa risposta o quella indicata (es. le voci del problema o la
      // sua descrizione a parole).
      else if (q.requiredUnless && isEmpty(answers[q.requiredUnless])) errors[q.id] = 'pick_or_describe';
      continue;
    }
    const code = checkAnswer(q, value, answers);
    if (code) errors[q.id] = code;
  }

  return errors;
}

/** Le foto sono tutte facoltative: si controlla solo tipo e peso di quelle allegate. */
export function validatePhoto(file) {
  if (!file) return null;
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return 'photo_type';
  if (file.size > MAX_PHOTO_BYTES) return 'photo_size';
  return null;
}

/** Ripulisce le risposte da chiavi sconosciute e da quelle rese invisibili da una condizione. */
export function pickAnswers(raw = {}) {
  const clean = {};
  for (const q of ALL_QUESTIONS.filter(isAnswerable)) {
    if (!isVisible(q, raw)) continue;
    const value = raw[q.id];
    if (isEmpty(value)) continue;
    clean[q.id] = q.type === 'scale' || q.type === 'number' ? Number(value) : value;
  }
  return clean;
}

export const PHOTO_IDS = PHOTOS.map((p) => p.id);
