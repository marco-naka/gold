import { ShoppingBag, Store, Check, ArrowRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';
import { assetSentence } from '@/lib/constants';

export default function DualInitiative({ t }) {
  const cards = [
    { ...t.users, icon: ShoppingBag, points: t.users.points(assetSentence()), href: '#partecipa', variant: 'primary' },
    { ...t.merchants, icon: Store, points: t.merchants.points(), href: '#merchant', variant: 'secondary' },
  ];

  return (
    <section className="section-pad">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {cards.map(({ icon: Icon, kicker, title, points, cta, href, variant }) => (
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

            <Button as="a" href={href} variant={variant} className="mt-8 w-full sm:w-auto">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
