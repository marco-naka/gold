import { CONTEST, PAYMENT_ASSETS } from './constants.js';

/**
 * Questionario della rilevazione in negozio.
 *
 * Questo file è l'unico da toccare per cambiare le domande: la pagina, la validazione e
 * l'esportazione CSV si ridisegnano da qui. Aggiungere, togliere o riordinare una voce non
 * richiede modifiche al resto del codice.
 *
 * Regole per chi modifica:
 * - `id` è la chiave con cui la risposta viene salvata e finisce nell'intestazione del CSV.
 *   Non va più cambiato una volta che sono state raccolte delle rilevazioni, altrimenti le
 *   vecchie risposte restano orfane: meglio aggiungere un id nuovo.
 * - `required: true` blocca l'invio. Usarlo solo dove la risposta è sempre ottenibile:
 *   il rilevatore è in negozio, non deve restare bloccato da una domanda che non può porre.
 * - `showIf` mostra la domanda solo se un'altra ha un certo valore, così il modulo resta corto.
 *
 * Tipi disponibili:
 *   check    casella singola, si spunta se vero → true (assente se non spuntata)
 *   yesno    sì / no                        → 'si' | 'no'
 *   yesnona  sì / no / non applicabile      → 'si' | 'no' | 'na'
 *   single   una sola opzione               → string
 *            con `optionsFrom: '<id>'` le opzioni sono le risposte di quella domanda
 *   multi    più opzioni                    → string[]
 *   scale    valutazione 1–5                → 1..5
 *   number   numero intero                  → number
 *   text     testo libero                   → string
 *            con `short: true` diventa una riga sola invece di un riquadro
 *   date     data nel calendario            → 'AAAA-MM-GG'
 *   time     ora                            → 'HH:MM'
 *   photo    scatto legato a uno slot        → il file finisce in `photos[slot]`
 *   qr       QR da mostrare al commerciante  → nessuna risposta, è uno strumento
 */

/**
 * Versione attesa del firmware POS. Sta qui da sola perché cambia: aggiornarla è una riga,
 * e la domanda nel questionario la riprende senza doverla riscrivere.
 */
export const POS_VERSION = '3.1.5';

/**
 * I QR che il terminale può mostrare, uno per rail: sono le combinazioni asset+rete che
 * il sito dichiara accettate. Derivano da PAYMENT_ASSETS, così se domani cambia un rail
 * cambia anche il questionario e non restiamo a testare un QR che non esiste più.
 */
export const RAILS = PAYMENT_ASSETS.flatMap((a) => a.networks.map((n) => `${a.short} · ${n}`));

/**
 * Fasce di tempo, uguali per la generazione del QR e per la conferma.
 *
 * Tre e non due: con un solo taglio a pochi secondi ogni pagamento su Ethereum finisce
 * fra i «lenti» — lì un blocco esce ogni dodici secondi — e la conclusione sarebbe che il
 * terminale non funziona mentre sta facendo il suo lavoro. La terza fascia separa il
 * normale dal patologico.
 */
export const TEMPI = ['Meno di 5 s', 'Da 5 a 15 s', 'Oltre 15 s'];

export const SCALE_MAX = 5;
export const MAX_TEXT_LENGTH = 1000;

export const SECTIONS = [
  {
    id: 'in_negozio',
    title: 'In negozio',
    intro: 'Con chi hai parlato e che cosa hai trovato entrando.',
    questions: [
      {
        id: 'con_chi',
        type: 'single',
        label: 'Chi hai trovato in negozio?',
        options: ['Titolare', 'Dipendente', 'Era chiuso'],
        required: true,
      },
      {
        // Facoltativo di proposito: il nome serve a chi ripassa, ma chiederlo può
        // irrigidire una conversazione appena iniziata.
        id: 'con_chi_nome',
        type: 'text',
        short: true,
        label: 'Nome della persona',
        help: 'Facoltativo. Utile a chi ripassa per chiedere della stessa persona.',
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        // Multipla e non obbligatoria: adesivo e plex sono indipendenti, e non spuntare
        // niente è già la risposta «non c'è nulla». Una terza opzione «nessun materiale»
        // sarebbe un tocco in più per dire quello che il vuoto dice da sé.
        id: 'materiale_esposto',
        type: 'multi',
        label: 'Materiale già esposto',
        help: 'Non spuntare niente se il negozio è senza materiale.',
        options: ['Adesivo in vetrina', 'Plex da banco'],
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        id: 'materiale_consegnato',
        type: 'multi',
        // Sempre visibile: anche dove adesivo e plex ci sono già si lascia il materiale
        // dell'evento, e capita di sostituire quello rovinato.
        label: 'Materiale lasciato oggi',
        help: 'Non spuntare niente se non hai lasciato nulla.',
        options: [
          'Adesivo vetrina',
          'Plex da banco',
          'Rollup A3',
          'Locandina',
          'Flyer evento',
          'Vetrofania evento',
        ],
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        // Tre domande separate invece di una lista di combinazioni: enumerare
        // POS+adesivo+plex+aggiornamento porta a una ventina di opzioni, e a righe
        // che si contraddicono fra loro. Così ogni domanda è un tocco, le risposte
        // non possono essere incoerenti e i conteggi si fanno per colonna.
        id: 'pos_presenza',
        type: 'single',
        label: 'Il POS NAKA',
        options: ['Visibile al cliente', 'Presente ma nascosto', 'Non presente'],
        required: true,
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        id: 'pos_stato',
        type: 'single',
        label: 'Aggiornamento del terminale',
        options: [
          `Già aggiornato alla ${POS_VERSION}`,
          'Aggiornato da me',
          'Non è stato possibile aggiornarlo',
          'Terminale non funzionante — chiamare subito l’assistenza',
        ],
        showIf: { id: 'pos_presenza', not: 'Non presente' },
        required: true,
      },
      {
        // La segnalazione si apre in due modi: spuntando la casella, oppure da sé quando
        // il terminale è già stato dichiarato non funzionante — lì il problema c'è per
        // definizione e chiedere «vuoi segnalare?» sarebbe una domanda di troppo.
        id: 'problema_flag',
        type: 'check',
        label: 'Segnala un problema sul terminale',
        help: 'Anche se funziona: qualcosa che l’assistenza deve sapere.',
        showIf: {
          allOf: [
            { id: 'pos_presenza', not: 'Non presente' },
            { id: 'pos_stato', not: 'Terminale non funzionante — chiamare subito l’assistenza' },
          ],
        },
      },
      {
        id: 'problema_tipo',
        type: 'multi',
        label: 'Che problema?',
        // Niente «Altro»: la casella di testo qui sotto è già il posto dove scrivere
        // quello che non rientra nelle quattro voci.
        options: ['Batteria scarica', 'Cavo non collegato', 'Non si accende', 'Connessione assente'],
        showIf: {
          anyOf: [
            { id: 'pos_stato', value: 'Terminale non funzionante — chiamare subito l’assistenza' },
            { id: 'problema_flag', value: true },
          ],
        },
        required: true,
      },
      {
        id: 'problema_note',
        type: 'text',
        label: 'Descrivi il problema',
        help: 'Quello che leggerà l’assistenza: cosa hai visto, cosa hai provato.',
        showIf: {
          anyOf: [
            { id: 'pos_stato', value: 'Terminale non funzionante — chiamare subito l’assistenza' },
            { id: 'problema_flag', value: true },
          ],
        },
      },
      {
        id: 'sim_sunrise',
        type: 'check',
        label: 'È stato necessario aggiornare la SIM da Swisscom a Sunrise?',
        showIf: { id: 'pos_presenza', not: 'Non presente' },
      },
    ],
  },
  {
    id: 'transazione',
    title: 'La transazione di prova',
    intro: 'Va provata in ogni negozio che ha il POS.',
    questions: [
      {
        // La prova di pagamento va fatta in ogni negozio che ha il POS: non c'è un "non
        // applicabile". O si fa adesso, o si fissa il ritorno — e in quel caso serve la data,
        // altrimenti "da fare" resta un buon proposito che nessuno ritrova.
        id: 'pos_test',
        type: 'single',
        label: 'Che cosa avete fatto sul terminale?',
        // Generare i QR prova che il terminale funziona; pagare davvero prova anche che
        // l'incasso arriva. Sono due livelli di verifica diversi e vanno distinti: su una
        // relazione finale «abbiamo provato» non dice quale dei due.
        options: [
          'Solo generato i QR',
          'Generato i QR + transazione di acquisto',
          'Da fare: ripasso fissato',
        ],
        help: 'Le foto si allegano qui sotto.',
        showIf: { id: 'pos_presenza', not: 'Non presente' },
        required: true,
      },
      {
        // Il POS mostra un QR per rail e non è raro che uno solo sia rotto: chiedere
        // «funziona?» in blocco nasconderebbe proprio il caso che interessa.
        id: 'qr_provati',
        type: 'multi',
        label: 'Su quali rail avete generato il QR?',
        help: 'Vanno provati tutti: è l’unico modo di sapere quale non funziona.',
        options: RAILS,
        required: true,
        showIf: {
          anyOf: [
            { id: 'pos_test', value: 'Solo generato i QR' },
            { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
          ],
        },
      },
      {
        // Prima l'esito, poi l'eventuale dettaglio: «lascia vuoto se è andato tutto bene»
        // non distingue il caso andato bene da quello in cui nessuno ha risposto, e
        // costringeva a leggere quattro righe anche quando non c'era niente da segnalare.
        id: 'qr_esito',
        type: 'yesno',
        label: 'Hanno funzionato tutti?',
        showIf: {
          anyOf: RAILS.map((rail) => ({ id: 'qr_provati', value: rail })),
        },
        required: true,
      },
      {
        id: 'qr_rotti',
        type: 'multi',
        label: 'Quali non hanno funzionato?',
        options: RAILS,
        showIf: { id: 'qr_esito', value: 'no' },
        required: true,
      },
      {
        id: 'tempo_qr',
        type: 'single',
        label: 'Quanto ci ha messo a generare il QR?',
        options: TEMPI,
        showIf: {
          anyOf: [
            { id: 'pos_test', value: 'Solo generato i QR' },
            { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
          ],
        },
      },
      {
        // Il rail non serve solo alla statistica: senza, «conferma oltre 15 secondi» non
        // si può leggere — su Lightning è un guasto, su Ethereum è la norma.
        id: 'acquisto_rail',
        type: 'single',
        label: 'Su quale rail avete fatto la transazione?',
        // Le opzioni sono i QR generati poco sopra: non si paga su un rail che non si è provato.
        optionsFrom: 'qr_provati',
        showIf: { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
        required: true,
      },
      {
        id: 'acquisto_esito',
        type: 'single',
        label: 'Com’è andato il pagamento?',
        options: ['Riuscito al primo tentativo', 'Riuscito al secondo', 'Fallito'],
        showIf: { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
        required: true,
      },
      {
        // Solo cause tecniche del pagamento: i guasti del terminale hanno già il loro
        // blocco di segnalazione, e il rifiuto del personale qui non esiste — paghiamo noi.
        id: 'acquisto_causa',
        type: 'single',
        label: 'Che cosa è andato storto?',
        options: ['Errore di rete', 'Timeout', 'Errore del terminale', 'Wallet del cliente', 'Altro'],
        showIf: {
          anyOf: [
            { id: 'acquisto_esito', value: 'Riuscito al secondo' },
            { id: 'acquisto_esito', value: 'Fallito' },
          ],
        },
        required: true,
      },
      {
        id: 'acquisto_causa_altro',
        type: 'text',
        short: true,
        label: 'Che cosa è successo?',
        showIf: { id: 'acquisto_causa', value: 'Altro' },
        required: true,
      },
      {
        id: 'tempo_conferma',
        type: 'single',
        label: 'Quanto ci ha messo a confermare?',
        options: TEMPI,
        showIf: { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
      },
      {
        id: 'acquisto_importo',
        type: 'number',
        label: 'Importo pagato (CHF)',
        help: 'Quello che compare sulla ricevuta.',
        showIf: { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
        required: true,
      },
      {
        // Le ricevute si scattano qui, non tre schermate dopo: è il momento in cui si ha
        // il foglietto in mano. Più di una perché si prova più di un rail.
        id: 'foto_ricevuta',
        type: 'photo',
        slot: 'ricevuta',
        label: 'Foto delle ricevute o dei QR',
        showIf: {
          anyOf: [
            { id: 'pos_test', value: 'Solo generato i QR' },
            { id: 'pos_test', value: 'Generato i QR + transazione di acquisto' },
          ],
        },
      },
      {
        // In fondo alla pagina in ogni caso, qualunque cosa si sia fatta sul terminale:
        // anche «da fare in un secondo momento» ha spesso un perché da annotare.
        id: 'transazione_note',
        type: 'text',
        label: 'Note sulla prova',
        help: 'Facoltativo. Quello che le risposte sopra non dicono.',
        showIf: { id: 'pos_presenza', not: 'Non presente' },
      },
    ],
  },
  {
    id: 'naka',
    title: 'Adesione e rapporto con NAKA',
    intro: 'La parte da parlare con chi decide.',
    questions: [
      {
        // È la domanda da cui si ricava l'esito della visita: senza, «non aderisce» non
        // sarebbe chiesto da nessuna parte e nessun negozio uscirebbe mai dall'elenco.
        id: 'adesione',
        type: 'single',
        label: 'Aderisce al concorso?',
        options: [
          'Aderisce',
          'Aderisce e creerà un contenuto social',
          'Non è stato possibile ottenere una risposta',
          'Non aderisce',
        ],
        showIf: { id: 'con_chi', not: 'Era chiuso' },
        required: true,
      },
      {
        // Tre stati e non una casella: quello che conta è se la cassa è pronta, non se il
        // rilevatore ha parlato. «Già informato» dice che il negozio si è mosso da solo,
        // «non c'era nessuno» dice che va rifatto un passaggio: sono tre azioni diverse.
        id: 'personale_informato',
        type: 'single',
        label: 'Il personale di cassa è formato sul funzionamento di NAKA?',
        help: 'Chi incassa è quello che incontra il cliente che vuole pagare in crypto.',
        options: ['Sì', 'Adesso sì, abbiamo fatto un refresh', 'No, e non è stato possibile fare refresh'],
        required: true,
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        // Tre stati: «non accetta carte» è un negozio, non un rifiuto di NAKA, e
        // mandarci un commerciale sarebbe una visita sprecata.
        id: 'naka_carte',
        type: 'single',
        label: 'Usa NAKA anche per i pagamenti con carta?',
        options: ['Sì', 'No', 'Non accetta carte'],
        required: true,
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        // Bottoni invece del testo libero: scrivere col pollice in negozio è lento, e
        // cinque nomi coprono quasi tutto il mercato ticinese. Chi resta fuori passa
        // da «Altro», così i dati restano confrontabili senza perdere i casi rari.
        id: 'fornitore_carte',
        type: 'single',
        label: 'Quale fornitore usa attualmente?',
        options: ['Worldline', 'Nexi', 'SumUp', 'Paytech', 'Lightspeed', 'Altro'],
        showIf: { id: 'naka_carte', value: 'No' },
      },
      {
        id: 'fornitore_carte_altro',
        type: 'text',
        short: true,
        label: 'Quale?',
        showIf: { id: 'fornitore_carte', value: 'Altro' },
        required: true,
      },
      {
        id: 'naka_valutato',
        type: 'yesno',
        label: 'Ha mai pensato di utilizzare NAKA anche per i pagamenti con carta?',
        showIf: { id: 'naka_carte', value: 'No' },
      },
      {
        // Sta qui, subito sotto il fornitore attuale: è il momento della conversazione in
        // cui l'offerta ha senso. Chi NAKA la usa già per le carte non la vede.
        id: 'appuntamento_commerciale',
        type: 'check',
        label: 'Vuole un appuntamento con un commerciale dopo l’evento',
        help: 'Lo richiamiamo noi: il recapito lo prendiamo dalla scheda del negozio.',
        showIf: { id: 'naka_carte', value: 'No' },
      },
      {
        id: 'cassa_sistema',
        type: 'yesno',
        label: 'Usa un sistema di cassa?',
        required: true,
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        id: 'cassa_quale',
        type: 'text',
        short: true,
        label: 'Quale?',
        help: 'Il nome del gestionale o del registratore, come lo chiama lui.',
        showIf: { id: 'cassa_sistema', value: 'si' },
      },
      {
        // Con il sì e con il no: chi non ha una cassa spesso dice perché, ed è proprio
        // quello che serve a chi lo segue dopo.
        id: 'cassa_note',
        type: 'text',
        short: true,
        label: 'Nota sul sistema di cassa',
        help: 'Facoltativo. Per chi segue il negozio dopo di te: contratto, soddisfazione, interesse a collegarla al POS NAKA.',
        showIf: { anyOf: [{ id: 'cassa_sistema', value: 'si' }, { id: 'cassa_sistema', value: 'no' }] },
      },
      {
        // Chi il POS non l'ha mai usato non ha un'esperienza da valutare: con il voto
        // obbligatorio il rilevatore ne inventava uno, e la media ne usciva falsata.
        id: 'naka_mai_usato',
        type: 'check',
        label: 'Non ha mai usato il POS NAKA: nessuna valutazione',
        help: 'Spunta invece di dare un voto, così non registriamo un dato sbagliato.',
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        id: 'naka_esperienza',
        type: 'scale',
        label: 'Come valuta la sua esperienza con NAKA?',
        help: '1 = pessima · 5 = ottima',
        required: true,
        showIf: {
          allOf: [
            { id: 'con_chi', not: 'Era chiuso' },
            { id: 'naka_mai_usato', isnt: true },
          ],
        },
      },
      {
        id: 'naka_problemi',
        type: 'text',
        label: 'Problemi o richieste da girare all’assistenza',
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        // Il cashback della Città passa dall'app MyLugano, e quando non funziona il negozio se
        // ne lamenta con chi passa a trovarlo. Casella da sola, così le lamentele si contano;
        // il dettaglio, se c'è, va nella nota subito sotto.
        id: 'mylugano_lamentela',
        type: 'check',
        label: 'Si lamenta del funzionamento dell’app MyLugano',
        showIf: { id: 'con_chi', not: 'Era chiuso' },
      },
      {
        id: 'mylugano_note',
        type: 'text',
        short: true,
        label: 'Che cosa non funziona?',
        help: 'Facoltativo: pagamenti, cashback, accesso, lentezza, quello che racconta.',
        showIf: { id: 'mylugano_lamentela', value: true },
      },
      {
        // Non è una domanda: è il QR da girare verso il commerciante. Compare dove ha senso
        // chiederlo — dopo una valutazione alta — e non registra nulla da sé.
        id: 'qr_recensione',
        type: 'qr',
        label: 'Mostra il QR della recensione',
        help: 'Gira lo schermo verso di lui: lo inquadra e scrive la recensione dal suo telefono.',
        url: CONTEST.googleReviewUrl,
        image: '/img/qr-recensione-google.svg',
        showIf: { id: 'naka_esperienza', min: 4 },
      },
      {
        // Casella e non tre scelte: la recensione o la scrive o no, e lo si scopre su Google.
        // Qui serve sapere solo a chi è stata chiesta con esito promettente.
        id: 'naka_recensione',
        type: 'check',
        label: 'Ha detto che farà la recensione',
        showIf: { id: 'naka_esperienza', min: 4 },
      },
      {
        // Il ritorno non è più legato alla sola transazione rimandata: si torna anche per
        // un titolare assente, per consegnare materiale o per rifare la formazione alla
        // cassa. Senza questo, l'agenda del secondo giro era una lista parziale che però
        // sembrava completa — peggio di non averla.
        //
        // La casella non compare quando il ritorno è già implicito: prova rimandata,
        // nessuna risposta sull'adesione, o negozio chiuso.
        id: 'ritorno',
        type: 'check',
        label: 'Serve tornare in questo negozio',
        showIf: {
          allOf: [
            { id: 'pos_test', isnt: 'Da fare: ripasso fissato' },
            { id: 'adesione', isnt: 'Non è stato possibile ottenere una risposta' },
            { id: 'con_chi', isnt: 'Era chiuso' },
          ],
        },
      },
      {
        id: 'ritorno_motivo',
        type: 'multi',
        label: 'Perché si torna?',
        options: [
          'Transazione di prova da fare',
          'Titolare assente',
          'Materiale da consegnare',
          'Formazione cassa',
          'Problema da risolvere',
        ],
        showIf: {
          anyOf: [
            { id: 'ritorno', value: true },
            { id: 'pos_test', value: 'Da fare: ripasso fissato' },
            { id: 'adesione', value: 'Non è stato possibile ottenere una risposta' },
            { id: 'con_chi', value: 'Era chiuso' },
          ],
        },
        required: true,
      },
      {
        id: 'ritorno_quando',
        type: 'date',
        label: 'Quando si torna?',
        showIf: {
          anyOf: [
            { id: 'ritorno', value: true },
            { id: 'pos_test', value: 'Da fare: ripasso fissato' },
            { id: 'adesione', value: 'Non è stato possibile ottenere una risposta' },
            { id: 'con_chi', value: 'Era chiuso' },
          ],
        },
        required: true,
      },
      {
        id: 'ritorno_ora',
        type: 'time',
        label: 'A che ora?',
        help: 'Facoltativa: mettila se avete concordato un orario.',
        showIf: {
          anyOf: [
            { id: 'ritorno', value: true },
            { id: 'pos_test', value: 'Da fare: ripasso fissato' },
            { id: 'adesione', value: 'Non è stato possibile ottenere una risposta' },
            { id: 'con_chi', value: 'Era chiuso' },
          ],
        },
      },
      {
        id: 'note',
        type: 'text',
        label: 'Note libere',
        help: 'Quello che non entra nelle domande e servirà a chi legge fra un mese.',
      },
    ],
  },
];

/**
 * Esiti possibili della visita. `excludes` toglie il negozio dall'elenco pubblico.
 *
 * Non si chiedono: si ricavano dalle risposte con `outcomeOf`. Erano una schermata in più
 * che ripeteva cose già dette — «era chiuso» e «non aderisce» stavano già nel questionario.
 */
export const OUTCOMES = [
  { id: 'aderisce', label: 'Aderisce', hint: 'Confermata l’adesione al concorso', tone: 'ok' },
  { id: 'da_ricontattare', label: 'Da ricontattare', hint: 'Titolare assente o decisione rinviata', tone: 'wait' },
  { id: 'rifiuta', label: 'Non aderisce', hint: 'Esce dall’elenco pubblico dei negozi', tone: 'no', excludes: true },
  { id: 'chiuso', label: 'Chiuso o non trovato', hint: 'Attività cessata, trasferita o irreperibile', tone: 'no', excludes: true },
];

/**
 * L'esito della visita, dedotto dalle risposte. Lo calcola il server: è l'unico modo di
 * essere sicuri che corrisponda a quello che il rilevatore ha davvero risposto.
 */
export function outcomeOf(answers = {}) {
  if (answers.con_chi === 'Era chiuso') return 'chiuso';
  if (answers.adesione === 'Non aderisce') return 'rifiuta';
  if (answers.adesione === 'Non è stato possibile ottenere una risposta') return 'da_ricontattare';
  // Chi si impegna anche sul contenuto social aderisce comunque: cambia il seguito
  // commerciale, non l'esito della visita.
  if (answers.adesione?.startsWith('Aderisce')) return 'aderisce';
  // Nessuna adesione dichiarata e negozio aperto: resta da chiudere, non da escludere.
  return 'da_ricontattare';
}

/** Foto richieste. Nessuna è obbligatoria: decide il rilevatore in base alla situazione. */
export const PHOTOS = [
  { id: 'vetrina', label: 'Vetrina', hint: 'Scattata da fuori, prima di entrare' },
  // Le ricevute si chiedono dentro la sezione della transazione, quando si ha il foglietto
  // in mano, e ricompaiono qui in fondo per chi deve aggiungerne una dopo.
  { id: 'ricevuta', label: 'Ricevute e QR', hint: 'Una per ogni prova o acquisto', multiple: true },
  { id: 'altro', label: 'Altre foto', hint: 'QR che non funziona, insegna, quel che serve', multiple: true },
];

/**
 * Opzioni di una domanda. Con `optionsFrom` non sono scritte nello schema ma sono quello
 * che il rilevatore ha già risposto altrove: il rail del pagamento si sceglie fra i QR
 * che ha davvero generato, non da un elenco che li contiene tutti e quattro.
 */
export function optionsFor(question, answers = {}) {
  if (question.optionsFrom) {
    const given = answers[question.optionsFrom];
    return Array.isArray(given) ? given : given ? [given] : [];
  }
  return question.options ?? [];
}

/** Tutte le domande in fila, per validazione ed esportazione. */
export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);

/**
 * Una domanda condizionata va mostrata (e quindi validata) solo se la condizione è vera.
 * `value` confronta, `not` esclude, `min` vale sulle scale numeriche.
 * `lacks` è vera quando una scelta multipla NON contiene un valore, vuoto compreso.
 * `isnt` è come `not` ma vale anche se la domanda non ha risposta.
 * `anyOf` raccoglie più condizioni ed è vera se lo è almeno una; `allOf` chiede che valgano
 * tutte. Servono alle domande che si aprono quando *una qualsiasi* fra due risposte è
 * negativa, o solo quando due cose sono vere insieme.
 */
export function isVisible(question, answers) {
  const cond = question.showIf;
  if (!cond) return true;
  if (Array.isArray(cond.anyOf)) {
    return cond.anyOf.some((c) => isVisible({ showIf: c }, answers));
  }
  // `allOf` chiede che valgano tutte: serve a «il POS c'è E non è già dichiarato guasto».
  if (Array.isArray(cond.allOf)) {
    return cond.allOf.every((c) => isVisible({ showIf: c }, answers));
  }
  const given = answers?.[cond.id];
  if (cond.value !== undefined) {
    return Array.isArray(given) ? given.includes(cond.value) : given === cond.value;
  }
  if (cond.not !== undefined) {
    if (given === undefined || given === null || given === '') return false;
    return Array.isArray(given) ? !given.includes(cond.not) : given !== cond.not;
  }
  if (cond.isnt !== undefined) {
    // Come `not`, ma una domanda senza risposta conta come diversa: serve a mostrare
    // qualcosa quando una condizione NON è già soddisfatta altrove — compreso il caso
    // in cui quella domanda non è nemmeno comparsa.
    if (given === undefined || given === null || given === '') return true;
    return Array.isArray(given) ? !given.includes(cond.isnt) : given !== cond.isnt;
  }
  if (cond.lacks !== undefined) {
    // Vero anche quando non è stato spuntato niente: «manca» include «non c'è nulla».
    return Array.isArray(given) ? !given.includes(cond.lacks) : given !== cond.lacks;
  }
  if (cond.min !== undefined) return Number(given) >= cond.min;
  return true;
}
