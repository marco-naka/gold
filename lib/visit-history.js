/**
 * Integrazioni e riprogrammazioni di una rilevazione già inviata.
 *
 * Regola unica: **una rilevazione inviata non si sovrascrive, si integra.** Ogni modifica
 * è una voce in `history` con ora del server, autore, campo, valore prima e valore dopo; la
 * prima volta che si cambia una risposta si conserva anche una copia dell'invio originale in
 * `original`. Lo stato corrente (`answers`, `photos`, `outcome`) resta dove è sempre stato,
 * così pannello, CSV e agenda non devono sapere nulla della cronologia per funzionare.
 *
 * Il modulo è puro: niente disco e niente rete, lo usano il server e i test.
 */
import { CONTEST } from './constants.js';
import { ALL_QUESTIONS, OUTCOMES, PHOTOS, outcomeOf } from './survey.js';
import { pickAnswers, validateVisit } from './survey-validation.js';

/**
 * Risposte che si integrano senza dover dire perché: sono note, o il ritorno, che per natura
 * cambia. Le altre — quello che si è visto in negozio — si correggono solo con un motivo.
 */
export const FREE_FIELDS = [
  'note',
  'transazione_note',
  'cassa_note',
  'problema_note',
  'naka_problemi',
  'ritorno',
  'ritorno_motivo',
  'ritorno_quando',
  'ritorno_ora',
];

/** Fino alla chiusura del concorso il rilevatore integra le sue visite; dopo, solo l'admin. */
export const editDeadline = () => new Date(CONTEST.validTo);

export function canEdit(visit, { operator, admin, now = new Date() }) {
  if (admin) return true;
  if (!operator || visit.surveyor !== operator) return false;
  return now < editDeadline();
}

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const isBlank = (v) => v === null || v === undefined || v === '' || v === false || (Array.isArray(v) && v.length === 0);

/** Che cosa è cambiato fra due insiemi di risposte, domanda per domanda. */
export function diffAnswers(before = {}, after = {}) {
  return ALL_QUESTIONS.filter((q) => !same(before[q.id], after[q.id])).map((q) => ({
    id: q.id,
    from: before[q.id] ?? null,
    to: after[q.id] ?? null,
  }));
}

const slotOf = (id) => PHOTOS.find((p) => p.id === id);

function mergePhotos(current = {}, added = []) {
  const photos = { ...current };
  for (const photo of added) {
    const { slot, ...file } = photo;
    if (slotOf(slot)?.multiple) photos[slot] = [...[].concat(photos[slot] ?? []), file];
    else photos[slot] = file;
  }
  return photos;
}

/**
 * Applica un'integrazione.
 *
 * @param visit   la rilevazione com'è adesso
 * @param input   { changes, note, reason, photosAdded, by, at }
 *                `changes` sono le sole risposte toccate: un valore vuoto toglie la risposta
 * @returns { visit, event } oppure { errors }
 */
export function applyAmend(visit, { changes = {}, note = '', reason = '', photosAdded = [], by, at }) {
  const merged = { ...visit.answers };
  for (const [id, value] of Object.entries(changes)) {
    if (isBlank(value)) delete merged[id];
    else merged[id] = value;
  }
  // Come all'invio: restano solo le risposte a domande visibili, ripulite e tipizzate.
  const answers = pickAnswers(merged);
  const errors = validateVisit({ merchantName: visit.merchantName, surveyor: visit.surveyor, answers });
  if (Object.keys(errors).length) return { errors };

  const diff = diffAnswers(visit.answers, answers);
  const why = String(reason ?? '').trim();
  const text = String(note ?? '').trim();
  if (diff.some((d) => !FREE_FIELDS.includes(d.id)) && !why) return { errors: { reason: 'required' } };
  if (!diff.length && !text && !photosAdded.length) return { errors: { _: 'nothing' } };

  const outcome = outcomeOf(answers);
  const event = {
    type: 'amend',
    at,
    by,
    reason: why || null,
    note: text || null,
    changes: diff,
    photosAdded: photosAdded.map(({ slot, key }) => ({ slot, key })),
    ...(outcome !== visit.outcome ? { outcomeFrom: visit.outcome, outcomeTo: outcome } : {}),
  };

  return {
    event,
    visit: {
      ...visit,
      answers,
      photos: mergePhotos(visit.photos, photosAdded),
      outcome,
      excludes: Boolean(OUTCOMES.find((o) => o.id === outcome)?.excludes),
      updatedAt: at,
      // L'invio originale si copia una volta sola, al primo cambio di una risposta.
      original: visit.original ?? (diff.length ? { answers: visit.answers, outcome: visit.outcome } : undefined),
      history: [...(visit.history ?? []), event],
    },
  };
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

/** Sposta il ritorno fissato. Il motivo è facoltativo, ma la data vecchia resta in cronologia. */
export function applyReschedule(visit, { date, time = '', reason = '', by, at }) {
  if (!visit.answers?.ritorno_quando) return { errors: { _: 'no_return' } };
  if (!DATE.test(date || '')) return { errors: { date: 'invalid' } };
  if (time && !TIME.test(time)) return { errors: { time: 'invalid' } };

  const from = { date: visit.answers.ritorno_quando, time: visit.answers.ritorno_ora ?? null };
  const to = { date, time: time || null };
  if (same(from, to)) return { errors: { _: 'nothing' } };

  const answers = { ...visit.answers, ritorno_quando: date };
  if (time) answers.ritorno_ora = time;
  else delete answers.ritorno_ora;

  const event = { type: 'reschedule', at, by, reason: String(reason ?? '').trim() || null, from, to };
  return {
    event,
    visit: { ...visit, answers, updatedAt: at, history: [...(visit.history ?? []), event] },
  };
}

/** Quante volte un ritorno è stato spostato: un negozio rinviato tre volte va guardato. */
export const reschedules = (visit) => (visit.history ?? []).filter((e) => e.type === 'reschedule').length;

/** Visite modificate dopo l'invio. */
export const wasAmended = (visit) => (visit.history ?? []).some((e) => e.type === 'amend');
