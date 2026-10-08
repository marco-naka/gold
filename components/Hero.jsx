import Link from 'next/link';
import { Upload, MapPin, CalendarDays, Ticket, ArrowDown } from 'lucide-react';
import AssetMark from './AssetMark';
import FiatValue from './FiatValue';
import Countdown from './Countdown';
import LiveStats from './LiveStats';
import PrizeValue from './PrizeValue';
import Button from './ui/Button';
import { PoweredBadge } from './Brand';
import { CONTEST, EVENT } from '@/lib/constants';
import { POOLS } from '@/lib/campaigns';
import { formatSats } from '@/lib/bitcoin';
import { formatDate, formatTime, localePath } from '@/lib/i18n';

export default function Hero({ t, locale }) {
  const d = t.hero;
  // "23–24 ottobre 2026": le due date del forum, distinte dalla settimana dell'iniziativa.
  const forumDates = `${formatDate(EVENT.startsAt, locale, { day: 'numeric' })}–${formatDate(EVENT.endsAt, locale)}`;
  // Nella prima schermata ci va la spiegazione, non il titolo riscritto in prosa: quando,
  // dove, con cosa si paga, cosa si vince e quando si estrae.
  // Il numero dei negozi non compare: "328" si legge come un tetto massimo, mentre l'elenco
  // cresce con le adesioni. Il conteggio vero sta nel contatore qui sotto.
  // La settimana dell'iniziativa si scrive dalle date di gara: se cambiano, il testo le segue.
  const weekday = { weekday: 'long', day: 'numeric', month: 'long' };
  const week = d.week(
    formatDate(CONTEST.validFrom, locale, weekday),
    formatTime(CONTEST.validFrom, locale),
    formatDate(CONTEST.validTo, locale, weekday),
    formatTime(CONTEST.validTo, locale),
  );
  // Solo il giorno: l'ora la decide la rete Bitcoin, nella finestra dichiarata nel regolamento.
  const drawDate = formatDate(CONTEST.drawDate, locale);
  // Il premio più alto della quota clienti: la lista è ordinata per importo decrescente.
  const topPrize = POOLS.users.items[0];

  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      {/* Bagliori decorativi di sfondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-btc/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-96 w-96 rounded-full bg-btc-warm/5 blur-[100px]"
      />

      <div className="section-pad relative !pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <PoweredBadge />
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-btc" />
                {d.area}
              </span>
              <span className="chip">
                <CalendarDays className="h-3.5 w-3.5 text-btc" />
                {week}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {d.titleLead} <span className="text-btc-gradient">{d.titleGold}</span>
            </h1>

            <div className="mt-7 max-w-xl space-y-4 text-base leading-relaxed text-muted">
              <p>{d.lead(EVENT.name, week)}</p>
              <p>
                {d.leadPrize(POOLS.users.format(POOLS.users.total, locale), POOLS.users.winners, drawDate)}
              </p>
            </div>

            {/*
              Il premio più alto con accanto quanto vale in dollari. «5'000'000 sat» non dice
              niente a chi non vive di bitcoin, ed è la cifra su cui si decide se partecipare.
            */}
            <p className="mt-5 inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl border border-btc/25 bg-btc/[0.07] px-4 py-2.5 text-sm">
              <span className="text-muted">{d.topPrize}</span>
              <strong className="font-bold text-btc">{POOLS.users.format(topPrize.amount, locale)}</strong>
              <FiatValue
                asset={topPrize.asset}
                amount={topPrize.amount}
                locale={locale}
                className="text-muted"
              />
            </p>

            <div className="mt-9">
              <Countdown
                startsAt={CONTEST.validFrom}
                endsAt={CONTEST.validTo}
                t={t.countdown}
                demo={CONTEST.isDemoWindow}
                testUntil={CONTEST.testEntriesFrom ? CONTEST.testEntriesUntil : null}
                testLabel={t.countdown.test(
                  `${formatDate(CONTEST.testEntriesUntil, locale, { day: 'numeric', month: 'long' })}, ${formatTime(CONTEST.testEntriesUntil, locale)}`,
                )}
              />
            </div>

            <LiveStats t={t.stats} locale={locale} className="mt-6 justify-start" />

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="btc" as="a" href="#partecipa" size="lg" className="animate-pulse-btc">
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
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-btc/40 bg-btc/10 px-3 py-2 text-xs font-semibold text-btc transition hover:bg-btc/15"
              >
                <Ticket className="h-3.5 w-3.5" />
                {d.forumTickets}
              </a>
            </div>
          </div>

          {/* Visual: logo ufficiale Tether Gold, non più una riproduzione testuale */}
          <div className="relative mx-auto w-full max-w-sm animate-fade-up lg:max-w-none">
            <div className="glass relative overflow-hidden p-8 sm:p-10">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-btc/60 to-transparent" />
              {/*
                Il visual della prima schermata è il ₿: è il premio di chi sta leggendo. Il
                lingotto di Tether Gold è il premio dei negozianti e vive sulla loro pagina —
                metterlo qui faceva credere ai clienti che si vincesse oro.
              */}
              <div className="mx-auto flex h-44 w-44 animate-floaty items-center justify-center sm:h-52 sm:w-52">
                <AssetMark
                  code="BTC"
                  className="h-full w-full drop-shadow-[0_10px_40px_rgba(247,147,26,0.45)]"
                />
              </div>

              <div className="mt-8 space-y-3">
                <PrizeValue t={d} locale={locale} />
                <Row
                  label={d.rowUsers}
                  value={POOLS.users.format(POOLS.users.total, locale)}
                  accent="btc"
                  fiat={<FiatValue asset="BTC" amount={POOLS.users.total} locale={locale} />}
                />
                {/* Dei negozi qui basta la quota: l'oro e come si vince stanno su /commercianti. */}
                <Row
                  label={d.rowMerchants}
                  value={formatSats(POOLS.merchants.satsEquivalent, locale)}
                  fiat={
                    <Link href={localePath(locale, '/commercianti')} className="text-gold underline underline-offset-2 hover:text-gold-warm">
                      {d.merchantsLink}
                    </Link>
                  }
                />
                <Row label={d.rowAsset} value={d.rowAssetValue} accent="neutral" />
              </div>

              <p className="mt-5 text-center text-[11px] leading-relaxed text-muted/80">{d.disclaimer}</p>
            </div>

            {/*
              Sotto la scheda del montepremi, la scorciatoia per chi ha già pagato: chi arriva
              dal negozio con lo scontrino in mano non deve cercare il modulo, e il riquadro
              intero è cliccabile, non solo la riga finale.
            */}
            <a
              href="#partecipa"
              className="group mt-4 flex items-center gap-4 rounded-2xl border border-btc/30 bg-btc/[0.07] p-5 transition hover:border-btc/60 hover:bg-btc/[0.12]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-btc-gradient text-ink-deep shadow-btc-sm">
                <Upload className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">{d.entryBoxTitle}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{d.entryBoxText}</span>
              </span>
              <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-btc">
                {d.entryBoxCta}
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** `accent` dice di quale montepremi è la riga: arancio per i satoshi, oro per lo XAUT. */
function Row({ label, value, accent = 'gold', fiat = null }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right">
        <span
          className={`block text-sm font-bold ${
            accent === 'btc' ? 'text-btc' : accent === 'neutral' ? 'text-white' : 'text-gold'
          }`}
        >
          {value}
        </span>
        {fiat && <span className="block text-[11px] text-muted">{fiat}</span>}
      </span>
    </div>
  );
}
