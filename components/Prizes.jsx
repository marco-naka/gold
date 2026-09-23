import Link from 'next/link';
import { Trophy, Users, Store, Video, TrendingUp, Gift, ArrowUpRight } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import { PRIZES, CONTEST, TOTAL_POOL, TOTAL_WINNERS, formatXaut } from '@/lib/constants';
import { formatDate, localePath } from '@/lib/i18n';

const MERCHANT_ICONS = [TrendingUp, Video, Gift];

export default function Prizes({ t, locale }) {
  // I testi dei premi vivono nel dizionario; importi e conteggi restano in constants.
  const label = (item) => t.items[item.place] ?? { place: item.place, desc: item.desc };

  return (
    <section id="montepremi" className="section-pad">
      <SectionTitle
        eyebrow={t.eyebrow}
        title={t.title(formatXaut(TOTAL_POOL))}
        subtitle={t.subtitle(TOTAL_WINNERS)}
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Montepremi clienti */}
        <GlassCard className="p-7 sm:p-9">
          <Header
            icon={Users}
            kicker={t.usersKicker}
            pool={formatXaut(PRIZES.users.pool)}
            poolLabel={t.poolLabel}
            note={t.usersNote}
          />
          <ul className="mt-8 space-y-3">
            {PRIZES.users.items.map((item, i) => (
              <li
                key={item.place}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-gold/30"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10 text-sm font-bold text-gold">
                  {i === 0 ? <Trophy className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{label(item).place}</p>
                    <p className="text-sm font-bold text-gold">{formatXaut(item.amount)}</p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{label(item).desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Montepremi merchant */}
        <GlassCard className="p-7 sm:p-9">
          <Header
            icon={Store}
            kicker={t.merchantsKicker}
            pool={formatXaut(PRIZES.merchants.pool)}
            poolLabel={t.poolLabel}
            note={t.merchantsNote}
          />
          <ul className="mt-8 space-y-3">
            {PRIZES.merchants.items.map((item, i) => {
              const Icon = MERCHANT_ICONS[i] ?? Gift;
              return (
                <li
                  key={item.place}
                  className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-gold/30"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{label(item).place}</p>
                      <p className="text-sm font-bold text-gold">{formatXaut(item.amount)}</p>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{label(item).desc}</p>
                    {item.place === 'Best Social Video' && (
                      <Link
                        href={localePath(locale, "/best-social-video")}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold underline underline-offset-2 hover:text-gold-warm"
                      >
                        {t.videoLink}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted/80">
        {t.note(formatDate(CONTEST.drawDate, locale))}
      </p>
    </section>
  );
}

function Header({ icon: Icon, kicker, pool, note, poolLabel }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <Icon className="h-6 w-6" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</p>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-3xl font-extrabold text-gold-gradient sm:text-4xl">{pool}</p>
        <p className="text-[11px] uppercase tracking-wider text-muted">{poolLabel}</p>
      </div>
    </div>
  );
}
