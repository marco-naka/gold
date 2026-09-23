import { ShoppingBag, Store, Check, ArrowRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';
import { assetSentence } from '@/lib/constants';

const CARDS = [
  {
    icon: ShoppingBag,
    kicker: 'Iniziativa Clienti',
    title: 'Per chi Acquista',
    points: [
      `Paga in ${assetSentence()} sul POS NAKA`,
      'Registra la transazione con TX ID o foto dello scontrino',
      'Partecipi automaticamente all’estrazione in Oro Digitale',
      'Nessun limite: ogni transazione valida = 1 giocata',
      'Si somma al cashback del circuito cittadino MyLugano',
    ],
    cta: { label: 'Registra la tua giocata', href: '#partecipa' },
    variant: 'primary',
  },
  {
    icon: Store,
    kicker: 'Iniziativa Merchant',
    title: 'Per i Commercianti',
    points: [
      'Aumenta le vendite durante la settimana del Plan ₿ Forum',
      'Premio Top Volume di transazioni crypto',
      'Premio per il miglior video social promozionale',
      'Estrazione riservata a tutti i merchant con almeno 1 transazione',
    ],
    cta: { label: 'Scopri come aderire', href: '#merchant' },
    variant: 'secondary',
  },
];

export default function DualInitiative() {
  return (
    <section className="section-pad">
      <SectionTitle
        eyebrow="Doppia iniziativa"
        title="Un concorso, due modi per vincere oro"
        subtitle="Clienti e commercianti partecipano a due montepremi distinti in Tether Gold (XAUT)."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {CARDS.map(({ icon: Icon, kicker, title, points, cta, variant }) => (
          <GlassCard key={title} className="flex flex-col p-7 sm:p-9">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h3>

            <ul className="mt-6 flex-1 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Button as="a" href={cta.href} variant={variant} className="mt-8 w-full sm:w-auto">
              {cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
