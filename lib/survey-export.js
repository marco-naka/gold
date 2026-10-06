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

// Un testo che comincia con = + - @ un foglio di calcolo lo esegue come formula: le note
// le scrive chi rileva, e «=…» in una cella non deve diventare un comando. L'apostrofo
// davanti lo lascia testo.
const neutral = (s) => (/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
const esc = (s) => `"${neutral(String(s ?? '')).replace(/"/g, '""')}"`;

const parts = (iso) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('it-CH', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.day}.${p.month}.${p.year}`, time: `${p.hour}:${p.minute}:${p.second}` };
};

const photoList = (got) => (got ? (Array.isArray(got) ? got : [got]) : []);

/**
 * @param visits    le rilevazioni salvate
 * @param photoUrl  da chiave della foto a link apribile (firmato, lato server); senza, la chiave
 */
export function visitsCsv(visits, { photoUrl = (key) => key } = {}) {
  // Una colonna per foto, non una cella con tre link: un link per cella è quello che un
  // foglio di calcolo sa rendere cliccabile. Gli slot multipli hanno tante colonne quante
  // ne servono alla visita con più foto.
  const photoCols = PHOTOS.flatMap((p) => {
    if (!p.multiple) return [{ slot: p.id, index: 0, title: `Foto: ${p.label}` }];
    const most = Math.max(1, ...visits.map((v) => photoList(v.photos?.[p.id]).length));
    return Array.from({ length: most }, (_, i) => ({ slot: p.id, index: i, title: `Foto: ${p.label} ${i + 1}` }));
  });

  const cols = [
    'ID rilevazione',
    'Data (Lugano)',
    'Ora (Lugano)',
    'Timestamp UTC (ISO 8601)',
    'Rilevatore',
    'Negozio',
    'ID negozio',
    'In elenco NAKA',
    'Indirizzo',
    'Categoria',
    'Esito',
    'Tolto dall’elenco pubblico',
    ...ANSWERED.map(header),
    'Numero di foto',
    ...photoCols.map((c) => c.title),
  ];
  const rows = visits.map((v) => {
    const when = v.createdAt ? parts(v.createdAt) : { date: '', time: '' };
    const all = PHOTOS.flatMap((p) => photoList(v.photos?.[p.id]));
    return [
      v.id,
      when.date,
      when.time,
      v.createdAt ?? '',
      v.surveyor,
      v.merchantName,
      v.merchantId ?? '',
      v.merchantKnown ? 'sì' : 'no',
      v.mapSnapshot?.address ?? '',
      v.mapSnapshot?.category ?? '',
      outcomeLabel(v.outcome),
      v.excludes ? 'sì' : 'no',
      ...ANSWERED.map((q) => cellFor(q, v.answers?.[q.id])),
      all.length,
      ...photoCols.map((c) => {
        const photo = photoList(v.photos?.[c.slot])[c.index];
        return photo ? photoUrl(photo.key) : '';
      }),
    ]
      .map(esc)
      .join(',');
  });
  // CRLF: è il separatore di riga che Excel si aspetta da un CSV.
  return [cols.map(esc).join(','), ...rows].join('\r\n') + '\r\n';
}
