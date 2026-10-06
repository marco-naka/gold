import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
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

      {/* Il dettaglio per chi sa cos'è un hash: chiuso, perché gli altri non ne hanno bisogno. */}
      <details className="group mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] open:border-btc/30">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-white">
          {t.techTitle}
          <ChevronDown className="h-4 w-4 shrink-0 text-btc transition group-open:rotate-180" />
        </summary>
        <div className="space-y-3 border-t border-white/10 p-5 text-sm leading-relaxed text-muted">
          {t.tech(DRAW.blocksAhead).map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="pt-2 text-xs font-semibold text-white">{t.techCodeLabel}</p>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-ink-deep p-4 text-[11px] leading-relaxed text-btc">
            <code>{t.techCode}</code>
          </pre>
        </div>
      </details>

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
