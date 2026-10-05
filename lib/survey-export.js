/**
 * Le rilevazioni in CSV: una riga per visita, una colonna per domanda.
 *
 * Sta qui e non nello script perché serve in due posti: `npm run visits export` dalla Shell
 * e il pulsante di esportazione nell'area rilevazioni, che è il modo di tenere una copia
 * fuori da Render senza aprire un terminale.
 *
 * Il file lo apre una persona, in Excel: intestazioni con il testo della domanda, date
 * nell'ora di Lugano, sì/no in parole. Il backup JSON resta la copia completa e ricaricabile.
 */
import { ALL_QUESTIONS, OUTCOMES, PHOTOS } from './survey.js';
import { TIME_ZONE } from './time.js';

/** Risposta leggibile: gli array diventano una lista, i sì/no restano parole. */
export function answerText(value) {
  if (value === true) return 'sì';
  if (value === false) return 'no';
  if (Array.isArray(value)) return value.join('; ');
  if (value === 'si') return 'sì';
  if (value === 'na') return 'n/a';
  return String(value ?? '');
}

// Foto e QR da mostrare non sono risposte: le foto hanno le loro colonne in fondo.
const ANSWERED = ALL_QUESTIONS.filter((q) => q.type !== 'photo' && q.type !== 'qr');

// Il testo della domanda come intestazione; dove due domande si chiamano uguale («Quale?»)
// si aggiunge l'identificativo, altrimenti in Excel le colonne non si distinguono.
const labelCount = ANSWERED.reduce((m, q) => m.set(q.label, (m.get(q.label) ?? 0) + 1), new Map());
const header = (q) => (labelCount.get(q.label) > 1 ? `${q.label} [${q.id}]` : q.label);

/** La cella di una domanda: come `answerText`, ma le date nel formato svizzero. */
export function cellFor(question, value) {
  if (question.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
    const [y, m, d] = value.split('-');
    return `${d}.${m}.${y}`;
  }
  return answerText(value);
}

const outcomeLabel = (id) => OUTCOMES.find((o) => o.id === id)?.label ?? id;
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const local = (iso) =>
  iso
    ? new Date(iso).toLocaleString('it-CH', {
        timeZone: TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

/** Le foto di uno slot, come elenco di file sul disco: si ritrovano senza aprire il JSON. */
const photoFiles = (got) => (got ? (Array.isArray(got) ? got : [got]).map((p) => p.key).join('; ') : '');

export function visitsCsv(visits) {
  const cols = [
    'ID rilevazione',
    'Data e ora (Lugano)',
    'Rilevatore',
    'Negozio',
    'ID negozio',
    'In elenco NAKA',
    'Indirizzo',
    'Categoria',
    'Esito',
    'Tolto dall’elenco pubblico',
    ...ANSWERED.map(header),
    ...PHOTOS.map((p) => `Foto: ${p.label}`),
  ];
  const rows = visits.map((v) =>
    [
      v.id,
      local(v.createdAt),
      v.surveyor,
      v.merchantName,
      v.merchantId ?? '',
      v.merchantKnown ? 'sì' : 'no',
      v.mapSnapshot?.address ?? '',
      v.mapSnapshot?.category ?? '',
      outcomeLabel(v.outcome),
      v.excludes ? 'sì' : 'no',
      ...ANSWERED.map((q) => cellFor(q, v.answers?.[q.id])),
      ...PHOTOS.map((p) => photoFiles(v.photos?.[p.id])),
    ]
      .map(esc)
      .join(',')
  );
  // CRLF: è il separatore di riga che Excel si aspetta da un CSV.
  return [cols.map(esc).join(','), ...rows].join('\r\n') + '\r\n';
}
