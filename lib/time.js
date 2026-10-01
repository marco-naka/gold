/**
 * Fuso orario del concorso.
 *
 * Tutte le date e gli orari mostrati — sul sito, nelle email, negli script di back-office —
 * sono quelli di Lugano, chiunque li legga e ovunque giri il codice. Senza un fuso esplicito
 * `toLocaleString` usa quello della macchina: il server di Render è in UTC e scriveva la
 * chiusura alle 14:00 invece che alle 16:00; un visitatore di New York vedeva le 10:00.
 *
 * Gli istanti (ISO con offset in `lib/constants.js`) restano assoluti: qui si decide solo
 * come scriverli.
 */
export const TIME_ZONE = 'Europe/Zurich';

/** Anno solare a Lugano: serve agli identificativi e alle cartelle per anno. */
export const yearInZurich = (date = new Date()) =>
  Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: TIME_ZONE }).format(date));

/** Scarto in minuti tra l'ora di Lugano e UTC in un dato istante (+120 d'estate, +60 d'inverno). */
const zurichOffsetMinutes = (date) => {
  const name = new Intl.DateTimeFormat('en', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName').value; // "GMT+02:00"
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
};

/**
 * Da un'ora scritta come la legge chi sta a Lugano ("2026-10-22 19:30") all'istante ISO.
 * Serve al back-office: l'orario di una transazione si copia dal POS, che lo stampa in ora
 * locale. Una stringa con il fuso già indicato passa così com'è.
 */
export function zurichLocalToIso(value) {
  const text = String(value ?? '').trim();
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(text)) return new Date(text).toISOString();
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text);
  if (!m) throw new Error(`Orario non riconosciuto: "${text}" (atteso AAAA-MM-GG HH:MM, ora di Lugano)`);
  const [, y, mo, d, h, mi, s = '0'] = m;
  const asUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
  // Due passaggi: l'ora legale si decide sull'istante vero, non su quello provvisorio.
  const first = asUtc - zurichOffsetMinutes(new Date(asUtc)) * 60_000;
  return new Date(asUtc - zurichOffsetMinutes(new Date(first)) * 60_000).toISOString();
}
