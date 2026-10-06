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
import { cellFor } from './survey-export.js';

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

/**
 * Una risposta salvata, da leggere. In italiano è la cella del CSV; in inglese le scelte
 * passano dalla loro traduzione, i sì/no da CHOICES_EN. Testi, numeri e date restano come
 * sono stati scritti.
 */
export function answerIn(question, value, locale) {
  if (!en(locale)) return cellFor(question, value);
  const map = QUESTIONS_EN[question.id]?.options;
  const one = (v) => (v === true ? CHOICES_EN.si : CHOICES_EN[v] ?? map?.[v] ?? v);
  if (Array.isArray(value)) return value.map(one).join('; ');
  if (question.type === 'date') return cellFor(question, value);
  return String(one(value) ?? '');
}

/** Testi dell'interfaccia. In italiano sono quelli scritti nel componente. */
export const ui = (locale) => (en(locale) ? UI_EN : UI_IT);

export const UI_IT = {
  tabNew: 'Nuova',
  tabMine: 'Le mie',
  tabAgenda: 'Agenda',
  mineLoading: 'Carico le tue rilevazioni…',
  mineSearch: 'Cerca negozio…',
  badgeNoPhotos: 'Senza foto',
  badgeAmended: 'Integrata',
  badgePos: 'POS da sistemare',
  badgeReturn: (d) => `Ritorno ${d}`,
  detailBack: 'Torna all’elenco',
  detailAnswers: 'Risposte',
  detailPhotos: 'Foto',
  detailNoPhotos: 'Nessuna foto.',
  detailHistory: 'Cronologia',
  histCreated: (who) => `Inviata da ${who}`,
  histAmend: (who) => `Integrata da ${who}`,
  histReschedule: (who) => `Ritorno spostato da ${who}`,
  histReason: 'Motivo',
  histNote: 'Nota',
  histPhotos: (n) => (n === 1 ? '1 foto aggiunta' : `${n} foto aggiunte`),
  histOutcome: (from, to) => `Esito: ${from} → ${to}`,
  histEmptyValue: 'vuoto',
  amendOpen: 'Integra',
  amendTitle: 'Integra questa visita',
  amendIntro: 'Quello che aggiungi resta accanto all’invio originale, con data, ora e il tuo nome.',
  amendPhotos: 'Aggiungi foto',
  amendNote: 'Nota di integrazione',
  amendNotePlaceholder: 'Es. la ricevuta è arrivata dopo',
  amendFix: 'Correggi una risposta',
  amendPick: 'Scegli la domanda…',
  amendCancelFix: 'Annulla questa correzione',
  amendReason: 'Motivo della correzione',
  amendReasonPlaceholder: 'Es. il titolare ha richiamato',
  amendReasonHelp: 'Obbligatorio quando cambi quello che hai visto in negozio; per note, foto e ritorno no.',
  amendSave: 'Salva integrazione',
  amendCancel: 'Annulla',
  amendSaving: 'Salvo…',
  amendSaved: 'Integrazione salvata.',
  amendNothing: 'Non c’è niente da salvare.',
  amendReasonMissing: 'Scrivi il motivo della correzione.',
  amendIncomplete: (labels) => `Con questa correzione serve rispondere anche a: ${labels}.`,
  amendClosed: 'Il concorso è chiuso: le integrazioni ora le fa solo l’amministratore.',
  goNow: 'Vado ora',
  goNowConfirm: 'Hai una rilevazione non ancora inviata: sostituirla con questa?',
  directions: 'Indicazioni',
  addCalendar: 'Calendario',
  reschedule: 'Riprogramma',
  rescheduleDate: 'Nuova data',
  rescheduleTime: 'Ora (facoltativa)',
  rescheduleReason: 'Motivo (facoltativo)',
  rescheduleSave: 'Sposta il ritorno',
  rescheduledTimes: (n) => `spostato ${n}×`,
  agendaOverdue: 'Scaduti',
  agendaToday: 'Oggi',
  agendaTomorrow: 'Domani',
  agendaLater: 'Prossimi giorni',
  agendaEmpty: 'Nessun ritorno in programma.',
  agendaHint: 'I ritorni fissati nelle tue visite. Quando salvi una nuova visita allo stesso negozio, il ritorno risulta fatto.',
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
  complete: 'Già rilevato',
  mineTitle: (n, oggi) => `Le tue rilevazioni: ${n}${oggi ? ` · ${oggi} oggi` : ''}`,
  mineEmpty: 'Non hai ancora salvato rilevazioni.',
  mineHint: 'Tocca un negozio per riaprirlo.',
  alreadyDone: (esito, chi, quando) => `Già rilevato da ${chi} il ${quando}: ${esito}.`,
  alreadyDoneHint: 'Non serve rifarlo. Continua solo se devi aggiornare qualcosa: verrà salvata una nuova visita.',
  stillOpen: (esito, chi, quando) => `Da completare. Ultima visita di ${chi} il ${quando}: ${esito}.`,
  returnFixed: (quando) => `Ritorno fissato il ${quando}.`,
  stillOpenHint: 'Qualcosa è rimasto in sospeso. Puoi riprendere le risposte qui sotto e completare.',
  toComplete: 'Da completare',
  returnOn: 'ripasso',
  changeShop: 'Cambia',
  photosTitle: 'Foto',
  photosIntro:
    'Nessuna è obbligatoria: scatta quelle che hanno senso per questo negozio. Le ricevute si possono allegare anche qui.',
  take: 'Scatta',
  upload: 'Dalla galleria',
  addMore: 'Scatta un’altra',
  uploadMore: 'Altre dalla galleria',
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
  savedPhotos: (n) => (n === 0 ? 'Nessuna foto allegata' : n === 1 ? '1 foto salvata' : `${n} foto salvate`),
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
  adminPanel: 'Pannello di tutte le rilevazioni',
  exportCsv: 'Scarica CSV',
  exportJson: 'Backup completo',
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
