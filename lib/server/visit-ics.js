/**
 * Il ritorno fissato come appuntamento per il calendario del telefono (.ics, RFC 5545).
 *
 * Con l'ora si crea un appuntamento di mezz'ora, scritto in UTC: niente fusi da spiegare al
 * calendario, che lo mostra nell'ora di Lugano da sé. Senza ora è un evento di tutto il giorno.
 */
import { zurichLocalToIso } from '../time.js';

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');
const utc = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const ymd = (d) => d.replace(/-/g, '');

export function visitIcs(visit, now = new Date()) {
  const date = visit.answers?.ritorno_quando;
  if (!date) return null;
  const time = visit.answers?.ritorno_ora;
  const reasons = [].concat(visit.answers?.ritorno_motivo ?? []).join(', ');

  let when;
  if (time) {
    const start = new Date(zurichLocalToIso(`${date} ${time}`));
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    when = [`DTSTART:${utc(start.toISOString())}`, `DTEND:${utc(end.toISOString())}`];
  } else {
    const next = new Date(`${date}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    when = [`DTSTART;VALUE=DATE:${ymd(date)}`, `DTEND;VALUE=DATE:${ymd(next.toISOString().slice(0, 10))}`];
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NAKA//Rilevazioni//IT',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    // Lo stesso UID a ogni riprogrammazione: il calendario aggiorna l'appuntamento invece di duplicarlo.
    `UID:${visit.id}-ritorno@naka`,
    `DTSTAMP:${utc(now.toISOString())}`,
    ...when,
    `SUMMARY:${esc(`Ritorno: ${visit.merchantName}`)}`,
    ...(visit.mapSnapshot?.address ? [`LOCATION:${esc(visit.mapSnapshot.address)}`] : []),
    `DESCRIPTION:${esc(`${reasons ? `Motivo: ${reasons}\n` : ''}Rilevazione ${visit.id}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
