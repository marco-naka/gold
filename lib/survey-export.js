/**
 * Le rilevazioni in CSV: una riga per visita, una colonna per domanda.
 *
 * Sta qui e non nello script perché serve in due posti: `npm run visits export` dalla Shell
 * e il pulsante di esportazione nell'area rilevazioni, che è il modo di tenere una copia
 * fuori da Render senza aprire un terminale.
 */
import { ALL_QUESTIONS, OUTCOMES, PHOTOS } from './survey.js';

/** Risposta leggibile: gli array diventano una lista, i sì/no restano parole. */
export function answerText(value) {
  if (value === true) return 'sì';
  if (Array.isArray(value)) return value.join('; ');
  if (value === 'si') return 'sì';
  if (value === 'na') return 'n/a';
  return String(value ?? '');
}

const outcomeLabel = (id) => OUTCOMES.find((o) => o.id === id)?.label ?? id;
const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;

export function visitsCsv(visits) {
  const cols = [
    'id',
    'data',
    'rilevatore',
    'negozio',
    'id_negozio',
    'in_snapshot',
    'esito',
    ...ALL_QUESTIONS.map((q) => q.id),
    ...PHOTOS.map((p) => `foto_${p.id}`),
  ];
  const rows = visits.map((v) =>
    [
      v.id,
      v.createdAt,
      v.surveyor,
      v.merchantName,
      v.merchantId ?? '',
      v.merchantKnown ? 'sì' : 'no',
      outcomeLabel(v.outcome),
      ...ALL_QUESTIONS.map((q) => answerText(v.answers?.[q.id])),
      // Per gli slot multipli la colonna porta il numero di scatti, non un sì.
      ...PHOTOS.map((p) => {
        const got = v.photos?.[p.id];
        if (!got) return '';
        return Array.isArray(got) ? String(got.length) : 'sì';
      }),
    ]
      .map(esc)
      .join(',')
  );
  return [cols.map(esc).join(','), ...rows].join('\n') + '\n';
}
