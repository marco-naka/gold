import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyAmend, applyReschedule, canEdit, editDeadline, reschedules, wasAmended } from '../lib/visit-history.js';

const base = {
  id: 'RV-2026-AAAAAA',
  createdAt: '2026-10-06T08:00:00Z',
  surveyor: 'Sabrina',
  merchantName: 'Bar Corallo',
  outcome: 'aderisce',
  answers: {
    con_chi: 'Titolare',
    pos_presenza: 'Visibile al cliente',
    pos_stato: 'Già aggiornato alla 3.1.5',
    pos_test: 'Solo generato i QR',
    qr_provati: ['BTC · Lightning'],
    qr_esito: 'si',
    tempo_qr: 'Meno di 5 s',
    adesione: 'Aderisce',
    personale_informato: 'Sì',
    naka_carte: 'Sì',
    cassa_sistema: 'no',
    naka_esperienza: 4,
  },
  photos: { vetrina: { key: 'rilevazioni/2026/RV-2026-AAAAAA-vetrina.jpg' } },
};
const at = '2026-10-06T10:00:00Z';

test('una nota o una foto si aggiungono senza motivo, e l’invio originale non si tocca', () => {
  const { visit, event, errors } = applyAmend(base, {
    note: 'Ricevuta arrivata dopo',
    photosAdded: [{ slot: 'ricevuta', key: 'rilevazioni/2026/RV-2026-AAAAAA-ricevuta-1.jpg' }],
    by: 'Sabrina',
    at,
  });
  assert.equal(errors, undefined);
  assert.equal(visit.photos.ricevuta.length, 1);
  assert.equal(visit.photos.vetrina.key, base.photos.vetrina.key);
  assert.equal(event.note, 'Ricevuta arrivata dopo');
  assert.equal(visit.original, undefined, 'nessuna risposta cambiata: niente copia dell’originale');
  assert.equal(base.history, undefined, 'la visita di partenza resta com’era');
  assert.ok(wasAmended(visit));
});

test('correggere una risposta chiede il motivo, registra prima e dopo e ricalcola l’esito', () => {
  assert.deepEqual(applyAmend(base, { changes: { adesione: 'Non aderisce' }, by: 'Sabrina', at }).errors, { reason: 'required' });

  const { visit, event } = applyAmend(base, { changes: { adesione: 'Non aderisce' }, reason: 'Il titolare ha richiamato', by: 'Sabrina', at });
  assert.deepEqual(event.changes, [{ id: 'adesione', from: 'Aderisce', to: 'Non aderisce' }]);
  assert.equal(event.outcomeFrom, 'aderisce');
  assert.equal(event.outcomeTo, 'rifiuta');
  assert.equal(visit.outcome, 'rifiuta');
  assert.equal(visit.excludes, true);
  assert.equal(visit.original.answers.adesione, 'Aderisce');
  assert.equal(visit.updatedAt, at);
});

test('una correzione che rende la visita incompleta non passa', () => {
  const { errors } = applyAmend(base, { changes: { adesione: '' }, reason: 'prova', by: 'Sabrina', at });
  assert.equal(errors.adesione, 'required');
});

test('il ritorno si sposta tenendo traccia della data di prima', () => {
  const withReturn = { ...base, answers: { ...base.answers, ritorno: true, ritorno_motivo: ['Titolare assente'], ritorno_quando: '2026-10-08', ritorno_ora: '10:00' } };
  assert.deepEqual(applyReschedule(base, { date: '2026-10-09', by: 'Sabrina', at }).errors, { _: 'no_return' });
  const { visit, event } = applyReschedule(withReturn, { date: '2026-10-12', reason: 'Titolare in ferie', by: 'Sabrina', at });
  assert.deepEqual(event.from, { date: '2026-10-08', time: '10:00' });
  assert.deepEqual(event.to, { date: '2026-10-12', time: null });
  assert.equal(visit.answers.ritorno_quando, '2026-10-12');
  assert.equal(visit.answers.ritorno_ora, undefined);
  assert.equal(reschedules(visit), 1);
});

test('integra chi ha fatto la visita fino alla chiusura, l’admin sempre', () => {
  const before = new Date(editDeadline().getTime() - 1000);
  const after = new Date(editDeadline().getTime() + 1000);
  assert.equal(canEdit(base, { operator: 'Sabrina', now: before }), true);
  assert.equal(canEdit(base, { operator: 'Giulia', now: before }), false);
  assert.equal(canEdit(base, { operator: 'Sabrina', now: after }), false);
  assert.equal(canEdit(base, { operator: 'Marco', admin: true, now: after }), true);
});

test('il ritorno diventa un appuntamento di calendario, con o senza ora', async () => {
  const { visitIcs } = await import('../lib/server/visit-ics.js');
  const v = { ...base, mapSnapshot: { address: 'Via Mons. Angelo Jelmini 4, 6900 Lugano' }, answers: { ...base.answers, ritorno_motivo: ['Titolare assente'], ritorno_quando: '2026-10-08', ritorno_ora: '10:00' } };
  const ics = visitIcs(v, new Date('2026-10-06T10:00:00Z'));
  assert.match(ics, /DTSTART:20261008T080000Z/, '10:00 a Lugano in ottobre sono le 08:00 UTC');
  assert.match(ics, /DTEND:20261008T083000Z/);
  assert.match(ics, /UID:RV-2026-AAAAAA-ritorno@naka/);
  assert.match(ics, /LOCATION:Via Mons\. Angelo Jelmini 4\\, 6900 Lugano/);
  const allDay = visitIcs({ ...v, answers: { ...v.answers, ritorno_ora: undefined } });
  assert.match(allDay, /DTSTART;VALUE=DATE:20261008/);
  assert.match(allDay, /DTEND;VALUE=DATE:20261009/);
  assert.equal(visitIcs(base), null);
});
