import { Upload, MapPin, ShieldCheck, Zap, Store, CalendarDays, Ticket } from 'lucide-react';
import Countdown from './Countdown';
import LiveStats from './LiveStats';
import PrizeValue from './PrizeValue';
import Button from './ui/Button';
import { PoweredBadge } from './Brand';
import { CONTEST, EVENT, PAYMENT_ASSETS, PRIZES, TOTAL_POOL, formatXaut } from '@/lib/constants';
import { MERCHANTS } from '@/lib/merchants';

export default function Hero({ t, locale }) {
  const d = t.hero;
  // "23–24 ottobre 2026": le due date del forum, distinte dalla settimana dell'iniziativa.
  const forumDates = `${new Date(EVENT.startsAt).getDate()}–${new Date(EVENT.endsAt).toLocaleDateString(
    locale === 'en' ? 'en-CH' : 'it-CH',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )}`;
  const stats = [
    { icon: Store, value: String(MERCHANTS.filter((m) => m.posActive).length), label: d.statMerchants },
    { icon: Zap, value: String(PAYMENT_ASSETS.length), label: d.statAssets(PAYMENT_ASSETS.map((a) => a.short).join(', ')) },
    { icon: ShieldCheck, value: formatXaut(TOTAL_POOL), label: d.statPool },
  ];

  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      {/* Bagliori decorativi di sfondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-96 w-96 rounded-full bg-gold-warm/5 blur-[100px]"
      />

      <div className="section-pad relative !pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <PoweredBadge />
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {d.area}
              </span>
              <span className="chip">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {locale === 'en' ? CONTEST.weekLabelEn : CONTEST.weekLabel}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {d.titleLead} <span className="text-gold-gradient">{d.titleGold}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {d.subtitle(EVENT.name)}
            </p>

            <div className="mt-9">
              <Countdown startsAt={CONTEST.validFrom} endsAt={CONTEST.validTo} t={t.countdown} />
            </div>

            <LiveStats t={t.stats} className="mt-6 justify-start" />

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="#partecipa" size="lg" className="animate-pulse-gold">
                <Upload className="h-5 w-5" />
                {d.ctaUpload}
              </Button>
              <Button as="a" href="#mappa" variant="secondary" size="lg">
                <MapPin className="h-5 w-5" />
                {d.ctaMap}
              </Button>
            </div>

            <div className="mt-9 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {d.forumStrip(EVENT.name, forumDates, EVENT.venue)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{d.forumNote}</p>
              </div>
              <a
                href={EVENT.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/15"
              >
                <Ticket className="h-3.5 w-3.5" />
                {d.forumTickets}
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-lg font-bold leading-none text-white">{value}</dt>
                    <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual: logo ufficiale Tether Gold, non più una riproduzione testuale */}
          <div className="relative mx-auto w-full max-w-sm animate-fade-up lg:max-w-none">
            <div className="glass relative overflow-hidden p-8 sm:p-10">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="mx-auto flex h-44 w-44 animate-floaty items-center justify-center sm:h-52 sm:w-52">
                <img
                  src="/img/tether-gold.png"
                  alt="Tether Gold (XAUT)"
                  width={208}
                  height={208}
                  className="h-full w-full object-contain drop-shadow-[0_10px_40px_rgba(243,186,47,0.45)]"
                />
              </div>

              <div className="mt-8 space-y-3">
                <PrizeValue t={d} locale={locale} />
                <Row label={d.rowUsers} value={formatXaut(PRIZES.users.pool)} />
                <Row label={d.rowMerchants} value={formatXaut(PRIZES.merchants.pool)} />
                <Row label={d.rowAsset} value={d.rowAssetValue} />
              </div>

              <p className="mt-5 text-center text-[11px] leading-relaxed text-muted/80">{d.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-bold text-gold">{value}</span>
    </div>
  );
}
