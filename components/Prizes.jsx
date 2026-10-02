import Link from 'next/link';
import { Trophy, Users, Store, Video, TrendingUp, Gift, ArrowUpRight, ChevronDown } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import FiatValue from './FiatValue';
import { CONTEST, SOCIAL_CONTEST } from '@/lib/constants';
import { DECLARED, POOLS, TOTAL_WINNERS, formatPrize } from '@/lib/campaigns';
import { SATOSHI_SPRITZ, formatSats } from '@/lib/bitcoin';
import { formatDate, formatTime, localePath } from '@/lib/i18n';

const MERCHANT_ICONS = [TrendingUp, Video, Gift];

/**
 * L'importo di un premio: quanto vale una vincita, per quante se ne estraggono, e quanto fa in
 * dollari. Il «×2» è l'informazione che mancava: «0.25 XAUT» da solo faceva pensare a un premio
 * unico più piccolo, invece che a due possibilità di vincere.
 */
function Amount({ item, locale, t, accent }) {
  return (
    <p className={`text-right text-sm font-bold ${accent}`}>
      {formatPrize(item, locale)}
      {item.count > 1 && <span className="font-semibold text-muted"> × {item.count}</span>}
      <FiatValue
        asset={item.asset}
        amount={item.amount}
        locale={locale}
        className="block text-[11px] font-normal text-muted"
        suffix={item.count > 1 ? t.each : null}
      />
    </p>
  );
}

export default function Prizes({ t, locale }) {
  // I testi dei premi vivono nel dizionario; importi e conteggi restano nei moduli dei premi.
  const label = (item) => t.items[item.place] ?? { place: item.place, desc: item.desc };

  // Finestra dell'evento Satoshi Spritz, nel formato della lingua corrente.
  const ora = (iso) => formatTime(iso, locale);
  const spritz = {
    day: formatDate(SATOSHI_SPRITZ.from, locale),
    from: ora(SATOSHI_SPRITZ.from),
    to: ora(SATOSHI_SPRITZ.to),
  };

  return (
    <section id="montepremi" className="section-pad">
      <SectionTitle
        eyebrow={t.eyebrow}
        title={t.title(formatSats(DECLARED.sats, locale))}
        subtitle={t.subtitle(TOTAL_WINNERS)}
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Montepremi clienti */}
        <GlassCard className="p-7 sm:p-9">
          <Header
            icon={Users}
            kicker={t.usersKicker}
            pool={POOLS.users.format(POOLS.users.total, locale)}
            poolLabel={t.poolLabel}
            note={t.usersNote}
            accent="btc"
            asset={POOLS.users.asset}
            poolAmount={POOLS.users.total}
            locale={locale}
          />
          <ul className="mt-8 space-y-3">
            {POOLS.users.items.map((item, i) => (
              <li
                key={item.place}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-btc/40"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-btc/30 bg-btc/10 text-sm font-bold text-btc">
                  {i === 0 ? <Trophy className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{label(item).place}</p>
                    <Amount item={item} locale={locale} t={t} accent="text-btc" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{label(item).desc}</p>

                  {/*
                    Quando e dove restano in chiaro: sono la condizione del premio, e senza
                    quelle due righe non si capisce come parteciparvi. Il resto — perché
                    l'estrazione è la stessa, cosa succede quando escono i nomi dei locali — si
                    apre solo se interessa: aperto, questa voce era alta il doppio delle altre
                    tre e sbilanciava l'elenco.
                  */}
                  {/* Il premio della giuria non si estrae: va detto come si partecipa. */}
                  {item.assignment === 'jury' && (
                    <>
                      <p className="mt-2 text-xs font-semibold text-btc">
                        {t.socialWhen(formatDate(SOCIAL_CONTEST.publishDeadline, locale))}
                      </p>
                      <details className="group mt-2">
                        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-btc [&::-webkit-details-marker]:hidden">
                          {t.socialDetails}
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">
                          {t.socialHow(SOCIAL_CONTEST.hashtags.join(' '))}
                        </p>
                      </details>
                    </>
                  )}

                  {item.pool === 'spritz' && (
                    <>
                      <p className="mt-2 text-xs font-semibold text-btc">
                        {t.spritzWhen(spritz.day, spritz.from, spritz.to, SATOSHI_SPRITZ.area)}
                      </p>
                      <details className="group mt-2">
                        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-btc [&::-webkit-details-marker]:hidden">
                          {t.spritzDetails}
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.spritzNote}</p>
                        <a
                          href={SATOSHI_SPRITZ.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-btc underline underline-offset-2 hover:text-btc-warm"
                        >
                          {t.spritzLink}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </details>
                    </>
                  )}
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
            pool={POOLS.merchants.format(POOLS.merchants.total, locale)}
            poolLabel={t.poolLabel}
            note={t.merchantsNote}
            asset={POOLS.merchants.asset}
            poolAmount={POOLS.merchants.total}
            locale={locale}
          />
          <ul className="mt-8 space-y-3">
            {POOLS.merchants.items.map((item, i) => {
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
                      <Amount item={item} locale={locale} t={t} accent="text-gold" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{label(item).desc}</p>
                    {item.place === 'Best Social Content' && (
                      <Link
                        href={localePath(locale, '/commercianti')}
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

/**
 * Intestazione di una delle due colonne.
 *
 * `accent` non è decorazione: l'arancio è il montepremi in satoshi, l'oro quello in Tether
 * Gold. Due colonne identiche di colore costringerebbero a leggere l'unità di misura per
 * capire di quale dei due si sta parlando.
 */
function Header({ icon: Icon, kicker, pool, note, poolLabel, accent = 'gold', asset, poolAmount, locale }) {
  const btc = accent === 'btc';
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl border ${
            btc ? 'border-btc/30 bg-btc/10 text-btc' : 'border-gold/25 bg-gold/10 text-gold'
          }`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <p
          className={`mt-5 text-xs font-semibold uppercase tracking-[0.18em] ${btc ? 'text-btc' : 'text-gold'}`}
        >
          {kicker}
        </p>
        <p className="mt-1 text-sm text-muted">{note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-3xl font-extrabold sm:text-4xl ${btc ? 'text-btc-gradient' : 'text-gold-gradient'}`}
        >
          {pool}
        </p>
        <FiatValue asset={asset} amount={poolAmount} locale={locale} className="block text-xs text-muted" />
        <p className="text-[11px] uppercase tracking-wider text-muted">{poolLabel}</p>
      </div>
    </div>
  );
}
