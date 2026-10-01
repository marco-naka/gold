'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Store,
  Trophy,
  Upload,
} from 'lucide-react';
import AssetMark from './AssetMark';
import Countdown from './Countdown';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { PoweredBadge } from './Brand';
import { CONTEST, EVENT, PAYMENT_ASSETS, PRIZES, formatXaut } from '@/lib/constants';
import {
  BTC_FALLBACK,
  BTC_PRICE_URL,
  BTC_PRIZES,
  BTC_USERS_SATS,
  BTC_USERS_WINNERS,
  SATOSHI_SPRITZ,
  formatSats,
} from '@/lib/bitcoin';
import { ANCHOR, PRIZE_POOL, SATS_PER_BTC, TOTAL_SATS } from '@/lib/anchor';
import { XAUT_FALLBACK } from '@/lib/constants';
import { formatDate, formatDateTime, getDictionary, intlLocale, localePath } from '@/lib/i18n';

/**
 * Pagina clienti della campagna «Paga in Crypto e Vinci Bitcoin».
 *
 * Qui si parla a una persona che pagherà e basta: il premio è in satoshi, il verbo è pagare,
 * e dei commercianti c'è solo un rimando. Il loro montepremi è in Tether Gold e vive su
 * /commercianti, dove il verbo è offrire — un negoziante non paga, mette a disposizione il
 * modo di pagare, ed è la ragione per cui le due campagne hanno nomi diversi.
 *
 * Il totale dichiarato è 21'000'000 di satoshi: 11 milioni qui, e l'equivalente di 10 milioni
 * pagato in oro di là. L'equivalenza è calcolata dal vivo dalle due quotazioni, così la cifra
 * in pagina non diventa mai una bugia quando il mercato si muove.
 */
export default function BitcoinLanding({ locale = 'it' }) {
  const dict = getDictionary(locale);
  const d = dict.btc;
  const week = locale === 'en' ? CONTEST.weekLabelEn : CONTEST.weekLabel;
  const drawDate = formatDateTime(CONTEST.drawDate, locale);
  // Le icone restano nel componente: sono grafica, non testo da tradurre.
  const ICONS = [CreditCard, FileCheck2, Trophy];
  const steps = d.steps(BTC_USERS_WINNERS, formatDate(CONTEST.drawDate, locale));
  // I livelli in satoshi hanno le stesse chiavi di quelli in oro ('1° Premio', …), quindi la
  // traduzione delle voci è già in `prizes.items` e non va scritta due volte.
  const label = (item) => dict.prizes.items[item.place] ?? { place: item.place, desc: item.desc };
  // Quanti premi finiscono davvero nell'estrazione fra le giocate: uno dei dodici è assegnato
  // alla serata del Satoshi Spritz, e dirlo «dodici estratti» sarebbe falso.
  // La finestra dell'evento, nel formato della lingua corrente.
  const spritz = {
    day: formatDate(SATOSHI_SPRITZ.from, locale),
    from: new Date(SATOSHI_SPRITZ.from).toLocaleTimeString(intlLocale(locale), {
      hour: '2-digit',
      minute: '2-digit',
    }),
    to: new Date(SATOSHI_SPRITZ.to).toLocaleTimeString(intlLocale(locale), {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
  const drawnPrizes = BTC_PRIZES.users.items
    .filter((item) => item.assignment === 'draw')
    .reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <span className="inline-flex items-center gap-3">
            <AssetMark code="BTC" className="h-10 w-10 shrink-0" />
            <span className="flex flex-col gap-1 leading-none">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-sm">
                {d.brandLine1}
              </span>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#F7931A] sm:text-sm">
                {d.brandLine2}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-3">
            <PoweredBadge className="hidden sm:inline-flex" />
            <LanguageSwitch locale={locale} />
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:px-8">
        <section className="grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {d.area}
              </span>
              <span className="chip">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {week}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {d.titleLead} <span className="text-[#F7931A]">{d.titleAccent}</span>
            </h1>

            <div className="mt-7 max-w-xl space-y-4 text-base leading-relaxed text-muted">
              <p>{d.lead(EVENT.name, week)}</p>
              <p>{d.leadPrize(formatSats(BTC_USERS_SATS), BTC_USERS_WINNERS, drawDate)}</p>
            </div>

            {/* I metodi di pagamento accettati, subito sotto il titolo: è la prima domanda
                di chi arriva, e tre loghi la risolvono senza farla leggere. */}
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              {PAYMENT_ASSETS.map((asset) => (
                <li key={asset.code} className="flex items-center gap-2.5">
                  <AssetMark code={asset.code} className="h-8 w-8 shrink-0" />
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-white">{asset.label}</span>
                    <span className="block text-xs text-muted">{asset.networks.join(' · ')}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Countdown startsAt={CONTEST.validFrom} endsAt={CONTEST.validTo} t={dict.countdown} />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} href={localePath(locale, '/p')} size="lg">
                <Upload className="h-5 w-5" />
                {d.ctaUpload}
              </Button>
              <Button as={Link} href={`${localePath(locale)}#mappa`} variant="secondary" size="lg">
                <Store className="h-5 w-5" />
                {d.ctaMap}
              </Button>
            </div>
          </div>

          <PrizeCard d={d} locale={locale} />
        </section>

        <section className="mt-24">
          <SectionTitle eyebrow={d.howEyebrow} title={d.howTitle} subtitle={d.howSubtitle} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ title, text }, i) => {
              const Icon = ICONS[i] ?? Trophy;
              return (
                <li key={title}>
                  <GlassCard className="h-full p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F7931A] text-white">
                        <Icon className="h-6 w-6" strokeWidth={2.2} />
                      </span>
                      <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>

                    {/* Le reti stanno dentro il passo che le riguarda: chi legge «paga in
                      crypto» si sta chiedendo proprio con cosa, e la risposta è lì sotto. */}
                    {i === 0 && (
                      <ul className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                        {PAYMENT_ASSETS.map((asset) => (
                          <li key={asset.code}>
                            <AssetMark code={asset.code} className="h-10 w-10" />
                            <span className="sr-only">
                              {asset.label} — {asset.networks.join(', ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="montepremi" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow={d.prizesEyebrow}
            title={d.prizesTitle(formatSats(BTC_USERS_SATS))}
            subtitle={d.prizesSubtitle(BTC_USERS_WINNERS, drawnPrizes)}
          />

          <GlassCard hover={false} className="mt-12 p-7 sm:p-9">
            <ul className="space-y-3">
              {BTC_PRIZES.users.items.map((item) => (
                <li
                  key={item.place}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-white">{label(item).place}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{label(item).desc}</span>
                    {item.assignment === 'event' && (
                      <>
                        <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          {d.spritzWhen(spritz.day, spritz.from, spritz.to, SATOSHI_SPRITZ.area)}
                        </span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-muted">
                          {d.spritzNote}
                        </span>
                        <a
                          href={SATOSHI_SPRITZ.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold underline underline-offset-2 hover:text-gold-warm"
                        >
                          {d.spritzLink}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    )}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-[#F7931A]">{formatSats(item.sats)}</span>
                    {item.count > 1 && <span className="block text-[11px] text-muted">× {item.count}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted/80">{d.prizesNote}</p>
          </GlassCard>
        </section>

        {/* L'estrazione verificabile è l'argomento più forte con questo pubblico: in quella
            settimana Lugano è piena di gente che sa cos'è un hash. */}
        <section className="mt-24">
          <SectionTitle eyebrow={d.drawEyebrow} title={d.drawTitle} subtitle={d.drawSubtitle} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {d.drawSteps.map((s, i) => (
              <li key={s.title}>
                <GlassCard className="h-full p-7">
                  <span className="text-xs font-bold text-[#F7931A]">0{i + 1}</span>
                  <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </GlassCard>
              </li>
            ))}
          </ol>
        </section>

        <MerchantBand d={d} locale={locale} />
      </main>

      <Footer locale={locale} />
    </>
  );
}

/**
 * Scheda del montepremi complessivo, con l'equivalenza calcolata dal vivo.
 *
 * I 21 milioni dichiarati valgono al rapporto di ancoraggio — 1 BTC = 20 XAUT, dove due XAUT
 * fanno esattamente dieci milioni di satoshi. Il mercato si muove, quindi accanto alla cifra
 * dichiarata si mostra sempre quella vera di oggi: così la pagina non mente mai.
 */
function PrizeCard({ d, locale }) {
  const [btc, setBtc] = useState({ ...BTC_FALLBACK, live: false });
  const [xaut, setXaut] = useState({ ...XAUT_FALLBACK, live: false });

  useEffect(() => {
    let alive = true;
    const load = (url, set, fallback) =>
      fetch(url)
        .then((r) => r.json())
        .then((d) => alive && set(d))
        .catch(() => alive && set({ ...fallback, live: false }));

    load('/api/btc', setBtc, BTC_FALLBACK);
    load('/api/xaut', setXaut, XAUT_FALLBACK);
    return () => {
      alive = false;
    };
  }, []);

  // Il controvalore in dollari si calcola su quello che viene davvero pagato — satoshi in
  // bitcoin più 2.00 XAUT in oro — non convertendo i 21 milioni dichiarati: quelli sono
  // un'equivalenza fissata al momento della conversione, non una quantità di bitcoin.
  const usd =
    btc?.usd && xaut?.usd
      ? (PRIZE_POOL.usersSats / SATS_PER_BTC) * btc.usd + PRIZE_POOL.merchantsXaut * xaut.usd
      : null;

  const conversione = new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ANCHOR.at));

  const money = (v) =>
    new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="glass relative overflow-hidden p-8 sm:p-10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F7931A]/60 to-transparent" />
      <div className="mx-auto flex h-36 w-36 animate-floaty items-center justify-center sm:h-44 sm:w-44">
        <AssetMark code="BTC" className="h-full w-full drop-shadow-[0_10px_40px_rgba(247,147,26,0.45)]" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/[0.08] px-4 py-3">
          <span className="text-xs font-semibold text-white">{d.cardPool}</span>
          <span className="text-right">
            <span className="block text-base font-bold text-[#F7931A]">{formatSats(TOTAL_SATS)}</span>
            {usd && <span className="block text-xs text-muted">≈ {money(usd)}</span>}
          </span>
        </div>

        <Row label={d.cardUsers} value={formatSats(PRIZE_POOL.usersSats)} accent />
        <Row
          label={d.cardMerchants}
          value={formatXaut(PRIZES.merchants.pool)}
          hint={formatSats(PRIZE_POOL.merchantsSatsEquivalent)}
        />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted/80">
        {d.cardNote(
          formatXaut(PRIZES.merchants.pool),
          formatSats(PRIZE_POOL.merchantsSatsEquivalent),
          conversione,
        )}{' '}
        <a
          href={BTC_PRICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gold/90 underline underline-offset-2 hover:text-gold"
        >
          {d.cardRates}
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}

/** La riga d'ombrello: due campagne, una sola iniziativa. */
function MerchantBand({ d, locale }) {
  return (
    <GlassCard
      hover={false}
      className="mt-16 flex flex-col gap-5 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold">{d.bandTitle}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
            {d.bandText(formatXaut(PRIZES.merchants.pool))}
          </p>
        </div>
      </div>
      <Button as={Link} href={localePath(locale, '/commercianti')} variant="secondary" className="shrink-0">
        {d.bandCta}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </GlassCard>
  );
}

function Row({ label, value, hint, accent = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right">
        <span className={`block text-sm font-bold ${accent ? 'text-[#F7931A]' : 'text-gold'}`}>{value}</span>
        {hint && <span className="block text-[11px] text-muted">{hint}</span>}
      </span>
    </div>
  );
}
