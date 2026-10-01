import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import { localePath } from '@/lib/i18n';
import { DRAW } from '@/lib/constants';

/**
 * Come si estrae, in tre passi.
 *
 * L'estrazione verificabile è l'argomento più forte dell'iniziativa con questo pubblico: nella
 * settimana del forum Lugano è piena di gente che sa cos'è un hash, e «fidatevi» non basta.
 * Nel regolamento la procedura c'è, all'articolo 7, ma lì non la legge nessuno: qui sta in tre
 * schede e si capisce in mezzo minuto.
 */
export default function ProvableDraw({ t, locale }) {
  return (
    <section id="estrazione" className="section-pad scroll-mt-24">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {t.steps(DRAW.blocksAhead).map((step, i) => (
          <li key={step.title}>
            <GlassCard className="h-full p-7">
              <span className="text-xs font-bold text-btc">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </GlassCard>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center">
        <Link
          href={localePath(locale, '/vincitori')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-btc underline underline-offset-4 hover:text-btc-warm"
        >
          {t.cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </p>
    </section>
  );
}
