import { CreditCard, FileCheck2, Trophy, Wallet, ExternalLink, BookOpen } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { OFFICIAL_GUIDE, WALLETS } from '@/lib/wallets';
import { assetSentence } from '@/lib/constants';

const STEPS = [
  {
    icon: CreditCard,
    title: 'Paga in Crypto',
    text: `Effettua un acquisto su POS NAKA presso un merchant aderente all’iniziativa, in ${assetSentence()}.`,
  },
  {
    icon: FileCheck2,
    title: 'Registra la Transazione',
    text: 'Inserisci l’ID transazione (TX ID) e carica la foto dello scontrino/ricevuta POS nel modulo qui sotto. Il negozio è facoltativo.',
  },
  {
    icon: Trophy,
    title: 'Vinci Tether Gold (XAUT)',
    text: 'Ricevi la conferma con il tuo ID giocata e partecipa all’estrazione dei premi in Oro Digitale.',
  },
];

export default function HowItWorks() {
  return (
    <section id="come-funziona" className="section-pad">
      <SectionTitle
        eyebrow="Come funziona"
        title="Tre step, meno di un minuto"
        subtitle="Dal pagamento alla giocata valida senza registrazioni complesse né app da scaricare."
      />

      <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* Linea di collegamento tra gli step (solo desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent md:block"
        />
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative">
            <GlassCard className="h-full p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-ink-deep shadow-gold-sm">
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span className="text-5xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            </GlassCard>
          </li>
        ))}
      </ol>

      {/* Come si paga sui POS: si rimanda alla guida ufficiale del circuito invece di duplicarla. */}
      <GlassCard hover={false} className="mt-8 p-7 sm:p-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-lg">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <BookOpen className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Non hai mai pagato in crypto sui POS?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Il circuito Plan ₿ di Lugano ha già una guida ufficiale che spiega come funziona il
              pagamento in negozio, quali asset sono accettati e come procurarsi BTC e USD₮ in città.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <Wallet className="h-3.5 w-3.5 text-gold" />
              Wallet Lightning consigliati:
              {WALLETS.map((w, i) => (
                <span key={w.name}>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold/90 underline underline-offset-2 hover:text-gold"
                  >
                    {w.name}
                  </a>
                  {i < WALLETS.length - 1 && <span aria-hidden="true"> ·</span>}
                </span>
              ))}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Button as="a" href={OFFICIAL_GUIDE.it} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Guida ufficiale Plan ₿
            </Button>
            <Button
              as="a"
              href={OFFICIAL_GUIDE.en}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="justify-center"
            >
              Read it in English
            </Button>
          </div>
        </div>
      </GlassCard>

    </section>
  );
}
