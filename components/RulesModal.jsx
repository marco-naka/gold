'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CONTEST, EVENT, PRIZES, formatXaut } from '@/lib/constants';

const fmt = (iso) =>
  new Date(iso).toLocaleString('it-CH', { dateStyle: 'long', timeStyle: 'short' });

const ARTICLES = [
  {
    title: '1. Promotore e oggetto',
    body: [
      `Il concorso "${CONTEST.title}" è promosso da ${CONTEST.organizer} in occasione del ${EVENT.name} di ${EVENT.city}.`,
      'L’iniziativa ha lo scopo di promuovere l’utilizzo dei pagamenti in criptovaluta tramite terminali POS NAKA presso gli esercenti aderenti del territorio di Lugano.',
    ],
  },
  {
    title: '2. Periodo di validità',
    body: [
      `Sono ammesse le transazioni effettuate dal ${fmt(CONTEST.validFrom)} al ${fmt(CONTEST.validTo)} (fuso orario Europe/Zurich).`,
      `L’estrazione dei premi è prevista il ${fmt(CONTEST.drawDate)}. Le registrazioni pervenute oltre il termine di chiusura non sono ammesse.`,
    ],
  },
  {
    title: '3. Eleggibilità dei partecipanti',
    body: [
      'Possono partecipare tutte le persone fisiche maggiorenni (18 anni compiuti) che effettuino un acquisto regolato in criptovaluta su POS NAKA presso un esercente aderente.',
      'Sono esclusi dipendenti e collaboratori di NAKA, degli esercenti aderenti e dei partner dell’iniziativa, nonché i loro familiari diretti.',
      'La partecipazione è gratuita: non è previsto alcun costo aggiuntivo rispetto al normale prezzo di acquisto.',
    ],
  },
  {
    title: '4. Modalità di partecipazione',
    body: [
      'Per ogni transazione il partecipante registra la giocata sul presente sito indicando la propria email, il numero della transazione e la fotografia dello scontrino/ricevuta POS: entrambe le prove d’acquisto sono obbligatorie. L’indicazione dell’esercente è facoltativa e serve unicamente a velocizzare la verifica.',
      'L’indirizzo wallet per la ricezione del premio non è richiesto al momento della giocata: viene domandato via email ai soli vincitori, dopo la validazione della partecipazione.',
      'Ogni transazione valida e distinta dà diritto a una singola partecipazione. Non sono previsti limiti al numero di transazioni per partecipante.',
      'Il partecipante è tenuto a conservare lo scontrino o la ricevuta POS originale fino alla comunicazione ufficiale dei vincitori.',
    ],
  },
  {
    title: '5. Verifica delle transazioni e prevenzione frodi',
    body: [
      'Ogni numero di transazione può essere registrato una sola volta: eventuali duplicati vengono automaticamente rifiutati dal sistema.',
      'Tutte le giocate sono sottoposte a controllo incrociato con i dati di regolamento del gateway POS NAKA per verificarne autenticità, esercente, importo e collocazione temporale nel periodo di gara.',
      'NAKA si riserva il diritto di annullare, senza preavviso, le giocate riconducibili a transazioni annullate, stornate, non riscontrate, generate con finalità elusive o ottenute mediante sistemi automatizzati, nonché di escludere il partecipante dal concorso.',
      'In caso di sospetta frode NAKA può richiedere la prova originale d’acquisto e un documento d’identità valido prima dell’erogazione del premio.',
    ],
  },
  {
    title: '6. Premi',
    body: [
      `Montepremi riservato ai clienti: ${formatXaut(PRIZES.users.pool)} in Tether Gold (XAUT), così ripartito: ${PRIZES.users.items
        .map((i) => `${i.place} — ${formatXaut(i.amount)}${i.count > 1 ? ` ciascuno` : ''}`)
        .join('; ')}.`,
      `Montepremi riservato ai merchant: ${formatXaut(PRIZES.merchants.pool)} in Tether Gold (XAUT), così ripartito: ${PRIZES.merchants.items
        .map((i) => `${i.place} — ${formatXaut(i.amount)}${i.count > 1 ? ` ciascuno` : ''}`)
        .join('; ')}.`,
      'I premi non sono convertibili in denaro contante né sostituibili con altri beni o servizi.',
    ],
  },
  {
    title: '7. Estrazione e notifica dei vincitori',
    body: [
      'L’estrazione avviene tra tutte le giocate validate mediante procedura deterministica e pubblicamente verificabile, articolata in tre fasi: (a) a registrazioni chiuse NAKA pubblica l’impronta SHA-256 dell’elenco ordinato delle giocate ammesse, che da quel momento non è più modificabile; (b) viene annunciata in anticipo l’altezza del blocco Bitcoin il cui hash farà da seme casuale, valore che nessuno può conoscere né influenzare prima della sua creazione; (c) i vincitori sono determinati ordinando, per ciascuna giocata, il valore sha256("seme:ID giocata").',
      'Elenco impegnato, seme e risultato sono pubblicati integralmente: chiunque può rieseguire il calcolo e ottenere gli stessi vincitori. Le giocate sono identificate dal solo ID, senza dati personali.',
      'I vincitori sono notificati via email all’indirizzo indicato in fase di registrazione entro 7 giorni dall’estrazione e devono confermare l’accettazione entro 14 giorni.',
      'In assenza di riscontro, o in caso di dati non verificabili, il premio viene riassegnato mediante nuova estrazione tra le giocate valide residue.',
      'Con la comunicazione di vincita viene richiesto al vincitore l’indirizzo wallet (o container NAKA) su cui accreditare il premio. Il trasferimento in XAUT avviene entro 30 giorni dalla ricezione dell’indirizzo. NAKA non risponde di indirizzi errati, incompatibili con il token XAUT o non più accessibili.',
    ],
  },
  {
    title: '8. Trattamento dei dati personali (LPD / GDPR)',
    body: [
      'Titolare del trattamento è NAKA. I dati raccolti (email, dati della transazione, eventuale immagine dello scontrino e, per i soli vincitori, l’indirizzo wallet) sono trattati esclusivamente per la gestione del concorso, la verifica antifrode e l’erogazione dei premi.',
      'La base giuridica del trattamento è l’esecuzione del rapporto contrattuale derivante dalla partecipazione al concorso e l’adempimento di obblighi legali.',
      'I dati sono conservati per il tempo necessario alla gestione dell’iniziativa e ai successivi obblighi di legge, quindi cancellati o anonimizzati.',
      `Il partecipante può esercitare in ogni momento i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità scrivendo a ${CONTEST.supportEmail}, ai sensi della Legge federale svizzera sulla protezione dei dati (LPD) e del Regolamento (UE) 2016/679 (GDPR).`,
    ],
  },
  {
    title: '9. Manleva e fluttuazione del mercato crypto',
    body: [
      'Il premio è espresso in quantità di Tether Gold (XAUT) e non in valuta fiat: il relativo controvalore in CHF/EUR può variare sensibilmente in funzione del prezzo dell’oro e delle condizioni di mercato. NAKA non garantisce alcun valore minimo.',
      'Il partecipante riconosce i rischi connessi alla detenzione di asset digitali, inclusa la volatilità e la responsabilità esclusiva sulla custodia delle proprie chiavi private.',
      'NAKA non risponde di malfunzionamenti di rete, ritardi delle blockchain, indisponibilità dei terminali POS o di eventi di forza maggiore che impediscano la registrazione di una giocata.',
      'La partecipazione al concorso implica l’accettazione integrale del presente regolamento.',
    ],
  },
  {
    title: '10. Legge applicabile e foro competente',
    body: [
      'Il presente regolamento è disciplinato dal diritto svizzero. Per ogni controversia è competente il foro di Lugano, Canton Ticino, fatte salve le disposizioni imperative a tutela dei consumatori.',
    ],
  },
];

export default function RulesModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Regolamento Ufficiale"
      subtitle={`${CONTEST.title} — ${EVENT.name}, ${EVENT.city}`}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Chiudi
          </Button>
          <Button as="a" href="#partecipa" size="sm" onClick={onClose}>
            Accetto e partecipo
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-muted">
          Bozza operativa predisposta per la campagna: prima della pubblicazione il testo deve essere
          validato dal consulente legale di NAKA e, se richiesto, notificato all&apos;autorità cantonale
          competente in materia di concorsi a premio.
        </p>
      </div>

      <div className="mt-6 space-y-7">
        {ARTICLES.map((article) => (
          <article key={article.title}>
            <h4 className="text-sm font-bold text-gold">{article.title}</h4>
            <div className="mt-2 space-y-2">
              {article.body.map((p) => (
                <p key={p} className="text-xs leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 border-t border-white/10 pt-5 text-[11px] text-muted/80">
        Ultimo aggiornamento del regolamento: {new Date().toLocaleDateString('it-CH')} · NAKA © 2026
      </p>
    </Modal>
  );
}
