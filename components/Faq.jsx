'use client';

import { useState } from 'react';
import { ChevronDown, LifeBuoy } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { CONTEST } from '@/lib/constants';

const FAQS = [
  {
    q: 'Quali criptovalute posso usare su POS NAKA?',
    a: 'Gli esercenti del circuito Plan ₿ di Lugano accettano Bitcoin su rete Lightning (BTC) e Tether (USD₮); molti accettano anche LVGA, che però non dà diritto alla partecipazione al concorso. Ogni merchant può abilitare uno o più asset: la disponibilità è indicata sulla scheda del negozio nella mappa.',
  },
  {
    q: 'Non ho ancora un wallet: come faccio a pagare?',
    a: 'Ti serve un wallet che supporti la rete Lightning. Il circuito Plan ₿ consiglia Bitkit, Breez e Wallet of Satoshi: trovi i tutorial ufficiali nella sezione "Come funziona" di questa pagina. La configurazione richiede pochi minuti e non serve alcun conto bancario.',
  },
  {
    q: 'Il concorso si somma al cashback MyLugano?',
    a: 'Sì. Il cashback riconosciuto dal circuito cittadino tramite l\u2019app MyLugano resta invariato: la partecipazione al concorso NAKA è un vantaggio aggiuntivo che non sostituisce né riduce le promozioni della Città di Lugano.',
  },
  {
    q: 'Come vengono accreditati i premi in Tether Gold?',
    a: 'Non serve indicare alcun wallet per partecipare. Se risulti vincitore ti scriviamo all’email della giocata e ti chiediamo in quel momento l’indirizzo (wallet compatibile con XAUT o container NAKA) su cui accreditare il premio, trasferito entro 30 giorni. Un indirizzo errato non consente il recupero dei fondi.',
  },
  {
    q: 'Devo conservare lo scontrino cartaceo?',
    a: 'Sì. La fotografia dello scontrino è obbligatoria già in fase di giocata, e l’originale va conservato fino alla comunicazione dei vincitori: in caso di vincita ne viene richiesta esibizione prima dell’erogazione del premio. Senza scontrino originale la giocata viene annullata e si procede a una nuova estrazione.',
  },
  {
    q: 'Chi può partecipare?',
    a: 'Tutti i clienti maggiorenni che effettuano un acquisto in crypto su POS NAKA presso un merchant aderente di Lugano nel periodo di validità del concorso. Sono esclusi i dipendenti di NAKA e i loro familiari diretti.',
  },
  {
    q: 'Quante volte posso partecipare?',
    a: 'Non ci sono limiti al numero di giocate: ogni transazione crypto valida e distinta genera una nuova partecipazione. Lo stesso numero di transazione però può essere registrato una sola volta.',
  },
  {
    q: 'Cosa succede se il prezzo dell’oro cambia?',
    a: 'Il premio è espresso in quantità di XAUT, non in franchi. Il controvalore in CHF può quindi aumentare o diminuire in funzione dell’andamento del prezzo dell’oro e del mercato crypto: NAKA non garantisce alcun valore fiat minimo.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section-pad">
      <SectionTitle eyebrow="FAQ & Assistenza" title="Domande frequenti" />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <GlassCard key={item.q} hover={false} className={cn('overflow-hidden', isOpen && 'border-gold/40')}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={cn('text-sm font-semibold sm:text-base', isOpen ? 'text-gold' : 'text-white')}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition-transform duration-300',
                      isOpen && 'rotate-180 text-gold'
                    )}
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                className={cn(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard hover={false} className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 p-7 text-center sm:flex-row sm:text-left">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <LifeBuoy className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Non hai trovato la risposta?</p>
          <p className="mt-1 text-xs text-muted">Il team assistenza risponde entro 24 ore lavorative.</p>
        </div>
        <Button as="a" href={`mailto:${CONTEST.supportEmail}`} variant="secondary" size="sm">
          Contatta l&apos;assistenza
        </Button>
      </GlassCard>
    </section>
  );
}
