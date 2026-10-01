import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_QUESTIONS,
  OUTCOMES,
  PHOTOS,
  POS_VERSION,
  RAILS,
  SECTIONS,
  TEMPI,
  isVisible,
  optionsFor,
  outcomeOf,
} from '../lib/survey.js';
import { MAX_PHOTO_BYTES, pickAnswers, validatePhoto, validateVisit } from '../lib/survey-validation.js';

/** Risposte minime a tutte le domande obbligatorie visibili. */
const answers = {
  con_chi: 'Titolare',
  personale_informato: 'Sì',
  adesione: 'Aderisce',
  naka_carte: 'Sì',
  cassa_sistema: 'no',
  pos_presenza: 'Visibile al cliente',
  pos_stato: 'Già aggiornato alla 3.1.5',
  materiale_esposto: ['Adesivo in vetrina'],
  pos_test: 'Solo generato i QR',
  qr_provati: ['BTC · Lightning'],
  qr_esito: 'si',
  naka_esperienza: 4,
};

const valid = { merchantName: 'Caffè Roma', surveyor: 'Anna', answers };

test('accetta una rilevazione completa', () => {
  assert.deepEqual(validateVisit(valid), {});
});

test('negozio e rilevatore sono obbligatori', () => {
  assert.equal(validateVisit({ ...valid, merchantName: '  ' }).merchantName, 'required');
  assert.equal(validateVisit({ ...valid, surveyor: '' }).surveyor, 'required');
});

test('l’esito si deduce dalle risposte, non si chiede', () => {
  assert.equal(outcomeOf({ ...answers, adesione: 'Aderisce' }), 'aderisce');
  // Anche chi si impegna sul contenuto social ha aderito.
  assert.equal(outcomeOf({ ...answers, adesione: 'Aderisce e creerà un contenuto social' }), 'aderisce');
  assert.equal(outcomeOf({ ...answers, adesione: 'Non è stato possibile ottenere una risposta' }), 'da_ricontattare');
  assert.equal(outcomeOf({ ...answers, adesione: 'Non aderisce' }), 'rifiuta');
  // Negozio chiuso: l'adesione non è stata nemmeno chiesta, e vince comunque.
  assert.equal(outcomeOf({ con_chi: 'Era chiuso', adesione: 'Aderisce' }), 'chiuso');
  // Nessuna risposta: si resta in sospeso, non si esclude nessuno per sbaglio.
  assert.equal(outcomeOf({}), 'da_ricontattare');
});

test('escono dall’elenco solo rifiuto e chiusura', () => {
  const esclude = (id) => Boolean(OUTCOMES.find((o) => o.id === id)?.excludes);
  assert.equal(esclude(outcomeOf({ ...answers, adesione: 'Non aderisce' })), true);
  assert.equal(esclude(outcomeOf({ con_chi: 'Era chiuso' })), true);
  assert.equal(esclude(outcomeOf({ ...answers, adesione: 'Non è stato possibile ottenere una risposta' })), false);
  assert.equal(esclude(outcomeOf({ ...answers, adesione: 'Aderisce' })), false);
});

test('a serranda abbassata la visita si chiude in due tocchi', () => {
  // Il caso che bloccava tutto: con il negozio chiuso restavano obbligatorie domande a
  // cui nessuno poteva rispondere, e la rilevazione non era inviabile.
  const chiuso = { con_chi: 'Era chiuso' };
  assert.deepEqual(validateVisit({ merchantName: 'Bar X', surveyor: 'Anna', answers: chiuso }), {});
  assert.equal(outcomeOf(chiuso), 'chiuso');

  // Resta solo chi hai trovato e le note: della vetrina parla la foto, scattata
  // nella prima schermata mentre si cerca il negozio.
  const visibili = ALL_QUESTIONS.filter((q) => isVisible(q, chiuso)).map((q) => q.id);
  assert.deepEqual(visibili, ['con_chi', 'note']);
});

test('l’adesione non si chiede a un negozio chiuso', () => {
  const adesione = ALL_QUESTIONS.find((q) => q.id === 'adesione');
  assert.equal(isVisible(adesione, { con_chi: 'Era chiuso' }), false);
  assert.equal(isVisible(adesione, { con_chi: 'Titolare' }), true);
  // Ed è obbligatoria quando compare: senza, l'esito resterebbe indovinato.
  const { adesione: _, ...senza } = answers;
  assert.equal(validateVisit({ ...valid, answers: senza }).adesione, 'required');
});

test('le domande obbligatorie visibili vanno risposte', () => {
  const { naka_esperienza, ...senza } = answers;
  assert.equal(validateVisit({ ...valid, answers: senza }).naka_esperienza, 'required');
});

test('una domanda nascosta non viene richiesta', () => {
  // Senza POS in negozio cadono aggiornamento, SIM e transazione di prova: sono
  // obbligatorie, ma non devono bloccare l'invio di una visita a un negozio senza POS.
  const { pos_stato, pos_test, ...senza } = answers;
  const errors = validateVisit({ ...valid, answers: { ...senza, pos_presenza: 'Non presente' } });
  assert.deepEqual(errors, {});
});

test('la condizione min funziona sulle scale', () => {
  const recensione = ALL_QUESTIONS.find((q) => q.id === 'naka_recensione');
  assert.equal(isVisible(recensione, { naka_esperienza: 3 }), false);
  assert.equal(isVisible(recensione, { naka_esperienza: 4 }), true);
});

test('il materiale lasciato si chiede in ogni negozio aperto', () => {
  // Anche dove adesivo e plex ci sono già: si consegna il materiale dell'evento, e
  // capita di sostituire quello rovinato. A serranda abbassata invece non si chiede.
  const lasciato = ALL_QUESTIONS.find((q) => q.id === 'materiale_consegnato');
  const aperto = { con_chi: 'Titolare' };
  assert.equal(isVisible(lasciato, { ...aperto, materiale_esposto: ['Adesivo in vetrina', 'Plex da banco'] }), true);
  assert.equal(isVisible(lasciato, aperto), true);
  assert.equal(isVisible(lasciato, { con_chi: 'Era chiuso' }), false);
});

test('il nome dell’interlocutore si chiede solo se il negozio era aperto', () => {
  const nome = ALL_QUESTIONS.find((q) => q.id === 'con_chi_nome');
  assert.equal(isVisible(nome, { con_chi: 'Titolare' }), true);
  assert.equal(isVisible(nome, { con_chi: 'Era chiuso' }), false);
  assert.equal(nome.required, undefined, 'il nome deve restare facoltativo');
});

test('i QR: prima l’esito, la lista solo se qualcosa è rotto', () => {
  const esito = ALL_QUESTIONS.find((q) => q.id === 'qr_esito');
  const rotti = ALL_QUESTIONS.find((q) => q.id === 'qr_rotti');

  // Nessun rail provato: non si chiede nulla.
  assert.equal(isVisible(esito, { qr_provati: [] }), false);
  assert.equal(isVisible(esito, { qr_provati: ['BTC · Lightning'] }), true);

  // Tutto a posto: la lista non compare.
  assert.equal(isVisible(rotti, { qr_provati: ['BTC · Lightning'], qr_esito: 'si' }), false);
  assert.equal(isVisible(rotti, { qr_provati: ['BTC · Lightning'], qr_esito: 'no' }), true);

  // E se compare, va compilata: «no» senza dire quale non serve a nessuno.
  const rotto = { ...answers, qr_provati: ['BTC · Lightning'], qr_esito: 'no' };
  assert.equal(validateVisit({ ...valid, answers: rotto }).qr_rotti, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...rotto, qr_rotti: ['BTC · Lightning'] } }), {});
});

test('il ramo «non usa NAKA per le carte» apre le domande commerciali', () => {
  const fornitore = ALL_QUESTIONS.find((q) => q.id === 'fornitore_carte');
  const pensato = ALL_QUESTIONS.find((q) => q.id === 'naka_valutato');
  assert.equal(isVisible(fornitore, { naka_carte: 'No' }), true);
  assert.equal(isVisible(pensato, { naka_carte: 'No' }), true);
  // Chi le carte non le accetta proprio non è un potenziale cliente da qualificare.
  assert.equal(isVisible(fornitore, { naka_carte: 'Non accetta carte' }), false);
  assert.equal(isVisible(fornitore, { naka_carte: 'Sì' }), false);
});

test('il fornitore è a bottoni, con «Altro» che apre il testo libero', () => {
  const fornitore = ALL_QUESTIONS.find((q) => q.id === 'fornitore_carte');
  const altro = ALL_QUESTIONS.find((q) => q.id === 'fornitore_carte_altro');
  assert.equal(fornitore.type, 'single');
  assert.ok(fornitore.options.includes('Altro'), 'senza «Altro» i casi rari si perdono');
  assert.equal(isVisible(altro, { fornitore_carte: 'Worldline' }), false);
  assert.equal(isVisible(altro, { fornitore_carte: 'Altro' }), true);
  // Scegliere «Altro» e non dire quale non serve a niente.
  const conAltro = { ...answers, naka_carte: 'No', fornitore_carte: 'Altro' };
  assert.equal(validateVisit({ ...valid, answers: conAltro }).fornitore_carte_altro, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...conAltro, fornitore_carte_altro: 'Viseca' } }), {});
});

test('il sistema di cassa chiede solo quale, e non è obbligatorio', () => {
  const quale = ALL_QUESTIONS.find((q) => q.id === 'cassa_quale');
  assert.equal(isVisible(quale, { cassa_sistema: 'si' }), true);
  assert.equal(isVisible(quale, { cassa_sistema: 'no' }), false);
  assert.equal(quale.required, undefined);
});

test('l’appuntamento commerciale si propone a chi le carte non le fa con NAKA', () => {
  const appuntamento = ALL_QUESTIONS.find((q) => q.id === 'appuntamento_commerciale');
  assert.equal(appuntamento.type, 'check');
  assert.equal(isVisible(appuntamento, { naka_carte: 'No' }), true);
  assert.equal(isVisible(appuntamento, { naka_carte: 'Sì' }), false);
  assert.equal(isVisible(appuntamento, { naka_carte: 'Non accetta carte' }), false);
});

test('l’ora del ripasso è facoltativa, la data no', () => {
  const daFare = { ...answers, pos_test: 'Da fare: ripasso fissato', pos_test_quando: '2026-10-14' };
  assert.deepEqual(validateVisit({ ...valid, answers: daFare }), {});
  assert.deepEqual(validateVisit({ ...valid, answers: { ...daFare, pos_test_ora: '09:30' } }), {});
  assert.equal(validateVisit({ ...valid, answers: { ...daFare, pos_test_ora: '25:00' } }).pos_test_ora, 'invalid');
});

test('le foto dichiarate nel questionario non sono risposte', () => {
  // Hanno un id come le altre, ma il file viaggia a parte: non devono finire nella
  // validazione delle risposte né nei dati salvati.
  const foto = ALL_QUESTIONS.find((q) => q.type === 'photo');
  assert.ok(foto, 'nessuna domanda di tipo photo');
  assert.equal(validateVisit({ ...valid, answers: { ...answers, [foto.id]: 'qualunque cosa' } })[foto.id], undefined);
  assert.equal(pickAnswers({ ...answers, [foto.id]: 'qualunque cosa' })[foto.id], undefined);
});

test('i valori fuori dominio vengono rifiutati', () => {
  assert.equal(validateVisit({ ...valid, answers: { ...answers, pos_presenza: 'forse' } }).pos_presenza, 'invalid');
  assert.equal(validateVisit({ ...valid, answers: { ...answers, pos_stato: 'Acceso' } }).pos_stato, 'invalid');
  assert.equal(validateVisit({ ...valid, answers: { ...answers, naka_esperienza: 9 } }).naka_esperienza, 'invalid');
  assert.equal(
    validateVisit({ ...valid, answers: { ...answers, materiale_consegnato: ['Cartellone abusivo'] } })
      .materiale_consegnato,
    'invalid'
  );
  assert.equal(validateVisit({ ...valid, answers: { ...answers, note: 'x'.repeat(2000) } }).note, 'too_long');
});

test('pickAnswers scarta chiavi sconosciute e risposte non più visibili', () => {
  const clean = pickAnswers({ ...answers, pos_presenza: 'Non presente', chiave_inventata: 'x' });
  assert.equal(clean.chiave_inventata, undefined);
  // pos_stato era stato risposto, ma senza POS in negozio non è più pertinente
  assert.equal(clean.pos_stato, undefined);
  assert.equal(typeof clean.naka_esperienza, 'number');
});

test('la versione compare dove serve e non viene chiesta due volte', () => {
  assert.equal(ALL_QUESTIONS.some((q) => q.id === 'pos_aggiornato'), false);
  const stato = ALL_QUESTIONS.find((q) => q.id === 'pos_stato');
  assert.ok(stato.options.some((o) => o.includes(POS_VERSION)), 'la versione attesa non compare fra le opzioni');
});

test('prova e acquisto sono due cose diverse', () => {
  const qr = ALL_QUESTIONS.find((q) => q.id === 'qr_provati');
  const importo = ALL_QUESTIONS.find((q) => q.id === 'acquisto_importo');

  // I QR si provano in entrambi i casi…
  assert.equal(isVisible(qr, { pos_test: 'Solo generato i QR' }), true);
  assert.equal(isVisible(qr, { pos_test: 'Generato i QR + transazione di acquisto' }), true);
  assert.equal(isVisible(qr, { pos_test: 'Da fare: ripasso fissato' }), false);

  // …ma l'importo esiste solo se si è pagato davvero, ed è obbligatorio.
  assert.equal(isVisible(importo, { pos_test: 'Solo generato i QR' }), false);
  assert.equal(isVisible(importo, { pos_test: 'Generato i QR + transazione di acquisto' }), true);
  // Pagare apre anche rail ed esito, che sono obbligatori quanto l'importo.
  const acquisto = {
    ...answers,
    pos_test: 'Generato i QR + transazione di acquisto',
    acquisto_rail: RAILS[0],
    acquisto_esito: 'Riuscito al primo tentativo',
  };
  assert.equal(validateVisit({ ...valid, answers: acquisto }).acquisto_importo, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...acquisto, acquisto_importo: 4.5 } }), {});
});

test('le misure del pagamento si chiedono solo dove esiste un pagamento', () => {
  const q = (id) => ALL_QUESTIONS.find((x) => x.id === id);
  const soloQr = { pos_test: 'Solo generato i QR' };
  const acquisto = { pos_test: 'Generato i QR + transazione di acquisto' };

  // Il QR lo genera il terminale in entrambi i casi: il tempo si misura sempre.
  assert.equal(isVisible(q('tempo_qr'), soloQr), true);
  assert.equal(isVisible(q('tempo_qr'), acquisto), true);

  // Conferma, rail ed esito esistono solo se si è pagato davvero.
  for (const id of ['acquisto_rail', 'acquisto_esito', 'tempo_conferma']) {
    assert.equal(isVisible(q(id), soloQr), false, id);
    assert.equal(isVisible(q(id), acquisto), true, id);
  }

  // La causa si chiede solo quando qualcosa è andato storto, e allora è obbligatoria.
  assert.equal(isVisible(q('acquisto_causa'), { ...acquisto, acquisto_esito: 'Riuscito al primo tentativo' }), false);
  assert.equal(isVisible(q('acquisto_causa'), { ...acquisto, acquisto_esito: 'Fallito' }), true);

  const fallito = { ...answers, ...acquisto, acquisto_rail: RAILS[0], acquisto_esito: 'Fallito', acquisto_importo: 5 };
  assert.equal(validateVisit({ ...valid, answers: fallito }).acquisto_causa, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...fallito, acquisto_causa: 'Timeout' } }), {});
});

test('il rail del pagamento si sceglie fra i QR davvero generati', () => {
  const rail = ALL_QUESTIONS.find((q) => q.id === 'acquisto_rail');
  const provati = ['BTC · Lightning', 'USDt · Polygon'];
  assert.deepEqual(optionsFor(rail, { qr_provati: provati }), provati);

  // Dichiarare di aver pagato su un rail che non si è nemmeno provato è un errore.
  const base = {
    ...answers,
    pos_test: 'Generato i QR + transazione di acquisto',
    qr_provati: provati,
    acquisto_esito: 'Riuscito al primo tentativo',
    acquisto_importo: 5,
  };
  assert.equal(
    validateVisit({ ...valid, answers: { ...base, acquisto_rail: 'XAUT · Ethereum' } }).acquisto_rail,
    'invalid'
  );
  assert.deepEqual(validateVisit({ ...valid, answers: { ...base, acquisto_rail: 'USDt · Polygon' } }), {});
});

test('«Altro» sulla causa apre il testo libero, e va compilato', () => {
  const altro = ALL_QUESTIONS.find((q) => q.id === 'acquisto_causa_altro');
  assert.equal(isVisible(altro, { acquisto_causa: 'Timeout' }), false);
  assert.equal(isVisible(altro, { acquisto_causa: 'Altro' }), true);

  const base = {
    ...answers,
    pos_test: 'Generato i QR + transazione di acquisto',
    acquisto_rail: 'BTC · Lightning',
    acquisto_esito: 'Fallito',
    acquisto_importo: 5,
    acquisto_causa: 'Altro',
  };
  assert.equal(validateVisit({ ...valid, answers: base }).acquisto_causa_altro, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...base, acquisto_causa_altro: 'Il POS si è riavviato' } }), {});
});

test('le fasce di tempo sono tre, non due', () => {
  // Con un solo taglio ogni pagamento su Ethereum finirebbe fra i lenti: lì un blocco
  // esce ogni dodici secondi, e la lentezza sarebbe della rete, non del terminale.
  assert.equal(TEMPI.length, 3);
  for (const id of ['tempo_qr', 'tempo_conferma']) {
    assert.deepEqual(ALL_QUESTIONS.find((q) => q.id === id).options, TEMPI);
  }
});

test('il ripasso vuole una data', () => {
  const daFare = { ...answers, pos_test: 'Da fare: ripasso fissato' };
  assert.equal(validateVisit({ ...valid, answers: daFare }).pos_test_quando, 'required');
  assert.deepEqual(validateVisit({ ...valid, answers: { ...daFare, pos_test_quando: '2026-10-14' } }), {});
  assert.equal(
    validateVisit({ ...valid, answers: { ...daFare, pos_test_quando: '14/10/2026' } }).pos_test_quando,
    'invalid'
  );
  // Fatta adesso: la data non si chiede.
  assert.equal(validateVisit({ ...valid, answers }).pos_test_quando, undefined);
});

test('la segnalazione di un problema si apre in due modi', () => {
  const GUASTO = 'Terminale non funzionante — chiamare subito l’assistenza';
  const flag = ALL_QUESTIONS.find((q) => q.id === 'problema_flag');
  const tipo = ALL_QUESTIONS.find((q) => q.id === 'problema_tipo');
  const base = { con_chi: 'Titolare', pos_presenza: 'Visibile al cliente' };

  // A mano, spuntando la casella…
  assert.equal(isVisible(tipo, { ...base, pos_stato: 'Aggiornato da me', problema_flag: true }), true);
  // …oppure da sé, quando il terminale è già dichiarato guasto.
  assert.equal(isVisible(tipo, { ...base, pos_stato: GUASTO }), true);
  assert.equal(isVisible(tipo, { ...base, pos_stato: 'Aggiornato da me' }), false);

  // E lì la casella non serve: il problema c'è per definizione.
  assert.equal(isVisible(flag, { ...base, pos_stato: GUASTO }), false);
  assert.equal(isVisible(flag, { ...base, pos_stato: 'Aggiornato da me' }), true);
  // Senza POS in negozio non c'è terminale da segnalare.
  assert.equal(isVisible(flag, { ...base, pos_presenza: 'Non presente' }), false);

  // Dire «c'è un problema» senza dire quale non serve all'assistenza.
  const conProblema = { ...answers, problema_flag: true };
  assert.equal(validateVisit({ ...valid, answers: conProblema }).problema_tipo, 'required');
});

test('la casella singola vale solo se spuntata', () => {
  // Non spuntata non è un errore: la domanda semplicemente non si applica.
  assert.deepEqual(validateVisit({ ...valid, answers: { ...answers, sim_sunrise: false } }), {});
  assert.deepEqual(validateVisit({ ...valid, answers: { ...answers, sim_sunrise: true } }), {});
  assert.equal(validateVisit({ ...valid, answers: { ...answers, sim_sunrise: 'si' } }).sim_sunrise, 'invalid');
  // E una casella non spuntata non finisce nei dati salvati.
  assert.equal(pickAnswers({ ...answers, sim_sunrise: false }).sim_sunrise, undefined);
  assert.equal(pickAnswers({ ...answers, sim_sunrise: true }).sim_sunrise, true);
});

test('le foto sono facoltative ma limitate per tipo e peso', () => {
  assert.equal(validatePhoto(null), null);
  assert.equal(validatePhoto({ type: 'image/jpeg', size: 1000 }), null);
  assert.equal(validatePhoto({ type: 'application/pdf', size: 1000 }), 'photo_type');
  assert.equal(validatePhoto({ type: 'image/jpeg', size: MAX_PHOTO_BYTES + 1 }), 'photo_size');
});

test('il questionario sta in tre schermate', () => {
  // Ogni sezione è una schermata: tenerle poche è il motivo per cui una visita
  // si chiude in meno di un minuto.
  assert.ok(SECTIONS.length <= 3, `sezioni: ${SECTIONS.length}`);
});

test('lo schema è coerente: id unici, opzioni dove servono, condizioni risolvibili', () => {
  const ids = ALL_QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, 'due domande con lo stesso id');

  for (const q of ALL_QUESTIONS) {
    if (q.type === 'single' || q.type === 'multi') {
      assert.ok(
        q.options?.length || ids.includes(q.optionsFrom),
        `${q.id} è a scelta ma non ha né opzioni né un optionsFrom valido`
      );
    }
    const conditions = q.showIf ? (q.showIf.anyOf ?? q.showIf.allOf ?? [q.showIf]) : [];
    for (const c of conditions) {
      assert.ok(ids.includes(c.id), `${q.id} dipende da ${c.id}, che non esiste`);
    }
  }

  const sectionIds = SECTIONS.map((s) => s.id);
  assert.equal(new Set(sectionIds).size, sectionIds.length, 'due sezioni con lo stesso id');
  assert.equal(new Set(PHOTOS.map((p) => p.id)).size, PHOTOS.length);
  assert.ok(OUTCOMES.some((o) => o.excludes), 'nessun esito toglie il negozio dall’elenco');
});
