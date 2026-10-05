/**
 * Strato di traduzione del questionario di rilevazione.
 *
 * Regola unica: **l'italiano è il dato, l'inglese è la vista**. Qualunque lingua usi il
 * rilevatore, nel file della rilevazione finisce sempre la stringa italiana — altrimenti
 * un export di trecento visite sarebbe mezzo in una lingua e mezzo nell'altra, e non si
 * potrebbe contare nulla.
 *
 * Perciò qui non si traduce mai un valore: si traduce solo quello che si legge.
 */
import { CHOICES_EN, OUTCOMES_EN, PHOTOS_EN, QUESTIONS_EN, SECTIONS_EN, UI_EN } from './survey.en.js';
import { optionsFor } from './survey.js';

export const SURVEY_LOCALES = ['it', 'en'];

const en = (locale) => locale === 'en';

/** Etichetta e aiuto di una domanda, nella lingua scelta. */
export function askedIn(question, locale) {
  const t = en(locale) ? QUESTIONS_EN[question.id] : null;
  return { label: t?.label ?? question.label, help: t?.help ?? (en(locale) ? undefined : question.help) };
}

/** Titolo e introduzione di una sezione. */
export function sectionIn(section, locale) {
  const t = en(locale) ? SECTIONS_EN[section.id] : null;
  return { title: t?.title ?? section.title, intro: t?.intro ?? (en(locale) ? undefined : section.intro) };
}

/**
 * Opzioni da mostrare: il `value` resta italiano e finisce nei dati, il `label` è
 * quello che il rilevatore legge.
 */
export function choicesIn(question, answers, locale) {
  const map = en(locale) ? QUESTIONS_EN[question.id]?.options : null;
  return optionsFor(question, answers).map((value) => ({ value, label: map?.[value] ?? value }));
}

/** Sì / No / N-A, uguali in tutte le domande che li usano. */
export const yesNoIn = (value, locale) => (en(locale) ? CHOICES_EN[value] : null);

export const outcomeIn = (id, fallback, locale) => (en(locale) ? OUTCOMES_EN[id] ?? fallback : fallback);

export function photoIn(photo, locale) {
  const t = en(locale) ? PHOTOS_EN[photo.id] : null;
  return { label: t?.label ?? photo.label, hint: t?.hint ?? (en(locale) ? undefined : photo.hint) };
}

/** Testi dell'interfaccia. In italiano sono quelli scritti nel componente. */
export const ui = (locale) => (en(locale) ? UI_EN : UI_IT);

export const UI_IT = {
  gateTitle: 'Area rilevazioni',
  gateIntro: 'Inserisci il codice ricevuto dal team.',
  gateCode: 'Codice',
  gateSubmit: 'Entra',
  gateChecking: 'Verifico…',
  gateWrong: 'Codice non valido.',
  stepMerchant: 'Chi rileva, e dove',
  yourName: 'Il tuo nome',
  yourNamePlaceholder: 'Nome e cognome',
  yourNameHint: 'Resta memorizzato su questo telefono per i giri successivi.',
  shop: 'Negozio',
  searchShop: 'Cerca il negozio…',
  notListed: (q) => `Non è in elenco: usa «${q}»`,
  newShop: 'Non è nell’elenco: verrà segnato come nuovo.',
  fromMap: 'Dalla mappa:',
  visitedTimes: (n) => `Già visitato ${n}×`,
  complete: 'Completo',
  toComplete: 'Da completare',
  returnOn: 'ripasso',
  changeShop: 'Cambia',
  photosTitle: 'Foto',
  photosIntro:
    'Nessuna è obbligatoria: scatta quelle che hanno senso per questo negozio. Le ricevute si possono allegare anche qui.',
  take: 'Scatta o carica',
  addMore: 'Aggiungi',
  preparing: 'Preparo…',
  remove: 'Rimuovi',
  next: 'Avanti',
  back: 'Sezione precedente',
  restart: 'Altro negozio',
  restartConfirm: 'Cancello questa rilevazione e ne apro una nuova?',
  restartYes: 'Sì, ricomincia',
  restartNo: 'No, continuo',
  save: 'Salva rilevazione',
  saving: 'Invio…',
  savedTitle: 'Rilevazione salvata',
  nextShop: 'Prossimo negozio',
  required: 'Risposta richiesta.',
  tooLong: 'Testo troppo lungo.',
  pickShop: 'Scegli il negozio e scrivi il tuo nome.',
  offline: 'Rete assente: riprova, la bozza è salvata.',
  genericError: 'Qualcosa non ha funzionato.',
  storageOff: 'Archivio non attivo: la rilevazione non è stata inviata, la bozza resta sul telefono. Avvisa il team.',
  photoSize: (mb) => `Immagine troppo pesante: massimo ${mb} MB.`,
  photoType: 'Formato non supportato: JPG, PNG, WEBP o HEIC.',
  signedInAs: 'Stai rilevando come',
  exportCsv: 'Scarica CSV',
  exportJson: 'Backup completo',
  exportHint: 'Una copia di tutte le rilevazioni, da tenere fuori da Render.',
  resumeFrom: (chi, quando) => `Riprendi la rilevazione di ${chi} del ${quando}`,
  resumed: 'Risposte precedenti caricate',
  resumeHint: 'Le risposte si possono correggere una per una. Le foto vanno riscattate.',
  pinHint: 'PIN di prova, da cambiare prima del go-live:',
  selectAll: 'Spunta tutti',
  deselectAll: 'Togli tutti',
  showQr: 'Mostra il QR',
  openLink: 'Apri il link',
  close: 'Chiudi',
};
