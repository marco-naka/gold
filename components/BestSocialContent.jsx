import Link from 'next/link';
import {
  ArrowLeft,
  Linkedin,
  Phone,
  Star,
  QrCode,
  Store,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Hash,
  AtSign,
  Trophy,
  Medal,
  Dices,
  Gavel,
  Clock,
  CalendarClock,
  Lightbulb,
  Repeat,
  Ban,
  Mail,
  ScrollText,
  CheckCircle2,
  Send,
  ChevronDown,
  Scale,
  Lock,
  Wallet,
  Coins,
} from 'lucide-react';
import FiatValue from './FiatValue';
import SourceTracker from './SourceTracker';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';
import { NakaLogo, PlanBLogo } from './Brand';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
import SocialSubmit from './SocialSubmit';
import {
  CONTEST,
  EVENT,
  OFFICIAL_CHANNELS,
  PRIZES,
  SOCIAL_CONTEST,
  formatXaut,
  toInternational,
  whatsappUrl,
} from '@/lib/constants';
import { formatDate, formatDateTime, getDictionary, localePath } from '@/lib/i18n';
import { ANCHOR } from '@/lib/anchor';
import { POOLS } from '@/lib/campaigns';
import { formatSats } from '@/lib/bitcoin';
import { formatNumber } from '@/lib/number-format';
import { MERCHANTS, MERCHANT_BOUNDS } from '@/lib/merchants';

/** I 2.00 XAUT dei negozi in satoshi, all'equivalenza dichiarata (lib/anchor.js). */
const PRIZES_SATS = POOLS.merchants.satsEquivalent;

const STEP_ICONS = [Video, Hash, Send];

/** Un'icona per modo di assegnazione: classifica, giuria, sorteggio. */
const ASSIGNMENT_ICONS = { transactions: Medal, jury: Gavel, draw: Dices };

export default function BestSocialContent({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.video;
  const deadline = formatDate(SOCIAL_CONTEST.publishDeadline, locale);
  const specs = SOCIAL_CONTEST.specs;
  const pool = formatXaut(PRIZES.merchants.pool, locale);

  const steps = t.steps({
    min: specs.minSeconds,
    max: specs.maxSeconds,
    ratio: specs.ratio,
    platforms: SOCIAL_CONTEST.platforms.join(', '),
    email: CONTEST.merchantSupportEmail,
    deadline,
  });

  const mail = (subject, body) =>
    `mailto:${CONTEST.merchantSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`;
  const submitMailto = mail(t.mailSubject, t.mailBody);
  const joinMailto = mail(t.join.subject, t.join.body);
  const askMailto = mail(t.join.missingSubject, t.join.missingBody);
  // Per il modulo dei link social: solo quello che serve a cercare e mostrare il negozio.
  const shops = MERCHANTS.map(({ id, name, address, lat, lng }) => ({ id, name, address, lat, lng }));

  const period = `${formatDateTime(CONTEST.validFrom, locale)} – ${formatDateTime(CONTEST.validTo, locale)}`;
  const value = t.value.items({
    at: formatDateTime(ANCHOR.at, locale),
    btcUsd: formatNumber(ANCHOR.btcUsd, locale),
    xautUsd: formatNumber(ANCHOR.xautUsd, locale),
    source: locale === 'en' ? ANCHOR.sourceEn : ANCHOR.source,
  });

  return (
    <>
      <SourceTracker />
      {/* Header essenziale: questa pagina si raggiunge dalla landing, non è una home */}
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={localePath(locale)} className="flex items-center gap-3" aria-label={dict.nav.home}>
            <NakaLogo id="social" locale={locale} />
          </Link>
          <div className="flex items-center gap-3">
            <PlanBLogo className="hidden sm:inline-flex" />
            <LanguageSwitch locale={locale} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        {/*
          Intestazione: chi arriva dal volantino o dalla mail ha tre domande — che cosa devo
          fare, quanto vale, chi chiamo. Le risposte stanno qui, prima di qualsiasi dettaglio.
        */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <span className="chip border-gold/30 bg-gold/10 text-gold">{t.badge}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t.titleLead} <span className="text-gold-gradient">{t.titleGold}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
              {t.intro(EVENT.name, EVENT.city, formatXaut(PRIZES.merchants.pool))}
            </p>

            <GlassCard hover={false} className="mt-6 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{t.todoTitle}</h2>
              <ol className="mt-3 space-y-2 text-sm text-white">
                {t.todo.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </GlassCard>

            {/* L'adesione è un'email: il pulsante la apre già compilata, senza passare da altre sezioni */}
            <div id="adesione" className="mt-6 flex scroll-mt-24 flex-col gap-3 sm:flex-row">
              <Button as="a" href={joinMailto}>
                <Mail className="h-4 w-4" />
                {t.join.cta}
              </Button>
              <Button as="a" href="#premi" variant="secondary-gold">
                <Trophy className="h-4 w-4" />
                {t.ctaPrizes}
              </Button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {t.join.note} {t.join.missingQuestion}{' '}
              <a href={askMailto} className="font-semibold text-gold underline underline-offset-2 hover:text-gold-warm">
                {t.join.missingCta}
              </a>
            </p>
          </div>

          <GlassCard hover={false} className="h-fit p-7">
            {/*
              Le due scadenze stanno una sotto l'altra apposta: il concorso chiude sabato ma i
              contenuti social vanno pubblicati entro venerdì, ed è la domanda più frequente.
            */}
            <dl className="space-y-4">
              <Stat
                icon={Trophy}
                label={t.statPrize}
                value={pool}
                extra={t.statSats(formatSats(PRIZES_SATS, locale))}
              />
              <Stat icon={CalendarClock} label={t.statPeriod} value={period} small />
              <Stat icon={Clock} label={t.statDeadline} value={deadline} />
              <Stat
                icon={Phone}
                label={t.statSupport}
                value={
                  <span className="flex flex-col gap-0.5 text-sm">
                    {CONTEST.merchantSupportPhone && (
                      <a href={`tel:${toInternational(CONTEST.merchantSupportPhone)}`} className="hover:text-gold">
                        {CONTEST.merchantSupportPhone}
                      </a>
                    )}
                    {CONTEST.merchantSupportWhatsapp && (
                      <a href={whatsappUrl(CONTEST.merchantSupportWhatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                        WhatsApp {CONTEST.merchantSupportWhatsapp}
                      </a>
                    )}
                  </span>
                }
              />
            </dl>
          </GlassCard>
        </div>

        {/* I premi */}
        <section id="premi" className="mt-16 scroll-mt-24">
          <SectionTitle
            accent="gold"
            align="left"
            eyebrow={t.merchantPrizes.eyebrow}
            title={t.merchantPrizes.title(formatXaut(PRIZES.merchants.pool))}
            subtitle={t.merchantPrizes.subtitle}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PRIZES.merchants.items.map((item) => {
              const copy = t.merchantPrizes.items[item.place];
              const Icon = ASSIGNMENT_ICONS[item.assignment] ?? Trophy;
              return (
                <GlassCard key={item.place} className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-right">
                      <span className="block text-lg font-bold text-gold">
                        {formatXaut(item.amount, locale)}
                        {/* «0.25 XAUT» da solo fa pensare a un premio unico più piccolo:
                            il moltiplicatore dice che le occasioni di vincere sono due. */}
                        {item.count > 1 && <span className="font-semibold text-muted"> × {item.count}</span>}
                      </span>
                      <FiatValue
                        asset={item.asset}
                        amount={item.amount}
                        locale={locale}
                        className="block text-[11px] font-normal text-muted"
                        suffix={item.count > 1 ? t.merchantPrizes.each : null}
                      />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{copy.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{copy.text}</p>
                  <dl className="mt-4 space-y-3 border-t border-white/5 pt-4 text-xs leading-relaxed">
                    <div>
                      <dt className="font-semibold uppercase tracking-[0.14em] text-gold/90">{t.merchantPrizes.howLabel}</dt>
                      <dd className="mt-1 text-muted">{t.merchantPrizes.how[item.assignment]}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold uppercase tracking-[0.14em] text-gold/90">{t.merchantPrizes.actionLabel}</dt>
                      <dd className="mt-1 text-muted">{copy.action}</dd>
                    </div>
                  </dl>
                </GlassCard>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted/80">
            {t.merchantPrizes.note(formatDate(CONTEST.drawDate, locale))}
          </p>
        </section>

        {/* Quanto vale e come si riceve: l'equivalenza dei 10 milioni vive solo qui */}
        <section id="valore" className="mt-16 scroll-mt-24">
          <SectionTitle accent="gold" align="left" eyebrow={t.value.eyebrow} title={t.value.title} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Prima di dire quanto vale, che cos'è: la sigla XAUT da sola non dice niente a nessuno */}
            <GlassCard className="border-gold/30 p-6 sm:col-span-2">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <Coins className="h-4 w-4 text-gold" />
                {t.value.what.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.value.what.text}</p>
            </GlassCard>
            {value.map((item, i) => {
              const Icon = [Scale, Lock, Wallet, Clock][i] ?? Coins;
              return (
                <GlassCard key={item.title} className="p-6">
                  <h3 className="flex items-center gap-2 text-base font-bold">
                    <Icon className="h-4 w-4 text-gold" />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Guida completa per il commerciante */}
        <section id="commercianti" className="mt-16 scroll-mt-24">
          <SectionTitle
            accent="gold"
            align="left"
            eyebrow={t.merchantGuide.eyebrow}
            title={t.merchantGuide.title}
            subtitle={t.merchantGuide.subtitle}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.merchantGuide.steps.map((step) => (
              <GlassCard key={step.title} className="p-6">
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard hover={false} className="mt-4 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <QrCode className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.merchantGuide.qrTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t.merchantGuide.qrText}</p>
            </div>
          </GlassCard>
        </section>

        {/* Domande dei negozi */}
        <section id="faq-negozi" className="mt-16 scroll-mt-24">
          <SectionTitle accent="gold" align="left" eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className="mt-8 space-y-3">
            {t.faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-gold transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Il premio social: l'essenziale in vista, il resto apribile */}
        <section id="social" className="mt-16 scroll-mt-24">
          <SectionTitle
            accent="gold"
            align="left"
            eyebrow={t.socialEyebrow}
            title={t.socialTitle}
            subtitle={t.socialSubtitle(
              formatDate(SOCIAL_CONTEST.publishDeadline, locale, { weekday: 'long', day: 'numeric', month: 'long' }),
              formatDateTime(CONTEST.validTo, locale, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
            )}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.contentTypes.map((type, i) => {
              const Icon = [Video, FileText, ImageIcon][i] ?? Video;
              return (
                <GlassCard key={type.title} className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{type.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{type.desc}</p>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard hover={false} className="mt-4 grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white">{t.hashtagsTitle}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {t.hashtagsText[0]}
                <span className="font-semibold text-white">{t.hashtagsText[1]}</span>
                {t.hashtagsText[2]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL_CONTEST.hashtags.map((tag) => (
                  <span key={tag} className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 font-mono text-sm font-semibold text-gold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.platformsTitle}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOCIAL_CONTEST.platforms.map((platform) => (
                  <span key={platform} className="chip">
                    {platform}
                  </span>
                ))}
              </div>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Linkedin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                {t.platformsNote}
              </p>
              <h3 className="mt-4 text-sm font-semibold text-white">{t.mentionsTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{t.mentionsNote}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOCIAL_CONTEST.mentions.map((m) => (
                  <a
                    key={`${m.platform}-${m.handle}`}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip transition hover:border-gold/40 hover:text-gold"
                  >
                    <AtSign className="h-3.5 w-3.5" />
                    {m.handle}
                    <span className="text-muted/80">· {m.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </GlassCard>

          <h3 className="mt-10 text-lg font-bold">{t.stepsTitle}</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Video;
              return (
                <li key={step.title}>
                  <GlassCard className="h-full p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-ink-deep">
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                    </div>
                    <h4 className="mt-5 text-base font-bold">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                  </GlassCard>
                </li>
              );
            })}
          </ol>

          <h3 className="mt-10 text-lg font-bold">{t.selectionTitle}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {t.selection.map((phase) => (
              <GlassCard key={phase.phase} className="p-6">
                <span className="chip border-gold/30 bg-gold/10 text-gold">{phase.phase}</span>
                <h4 className="mt-4 text-base font-bold">{phase.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{phase.desc}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted/80">{t.selectionNote}</p>
          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Repeat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            <span>
              <span className="font-semibold text-white">{t.noLimitTitle}.</span> {t.noLimitText}
            </span>
          </p>

          {/* Idee, requisiti e diritti: servono a chi prepara il contenuto, non a tutti */}
          <details className="group mt-8 rounded-2xl border border-white/10 bg-white/[0.03] open:border-gold/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-white sm:p-6">
              {t.moreTitle}
              <ChevronDown className="h-4 w-4 shrink-0 text-gold transition group-open:rotate-180" />
            </summary>
            <div className="space-y-10 border-t border-white/10 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold">{t.ideasTitle}</h3>
                <p className="mt-1 text-sm text-muted">{t.ideasSubtitle}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {t.ideas.map((idea, i) => (
                    <div key={idea.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                      <span className="text-xs font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="mt-1 text-base font-bold">{idea.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{idea.desc}</p>
                      <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-muted/80">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        {idea.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <CheckCircle2 className="h-5 w-5 text-gold" />
                    {t.requirementsTitle}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted">
                    {t.requirementsAll(deadline).map((r) => (
                      <li key={r} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold/90">{t.requirementsVideoTitle}</p>
                  <ul className="mt-2 space-y-2.5 text-sm text-muted">
                    {t
                      .requirementsVideo({ min: specs.minSeconds, max: specs.maxSeconds, ratio: specs.ratio, resolution: specs.minResolution })
                      .map((r) => (
                        <li key={r} className="flex items-start gap-2.5">
                          <Video className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          {r}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Ban className="h-5 w-5 text-red-400" />
                    {t.avoidTitle}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted">
                    {t.avoid.map((a) => (
                      <li key={a} className="flex items-start gap-2.5">
                        <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400/80" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <ScrollText className="h-5 w-5 text-gold" />
                  {t.rightsTitle}
                </h3>
                <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
                  {t.rights(CONTEST.organizer).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* La segnalazione: negozio dalla mappa e link, salvati per l'admin */}
          <GlassCard hover={false} id="segnala" className="mt-8 scroll-mt-24 p-6 sm:p-8">
            <h3 className="text-xl font-bold">{t.form.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t.form.text}</p>
            <div className="mt-6">
              <SocialSubmit
                shops={shops}
                bounds={MERCHANT_BOUNDS}
                locale={locale}
                fallbackHref={submitMailto}
                fallbackEmail={CONTEST.merchantSupportEmail}
              />
            </div>
          </GlassCard>
        </section>

        {/* Assistenza, regolamento, LinkedIn, recensione */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Store className="h-5 w-5 text-gold" />
              {t.support.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.support.text}</p>
            <dl className="mt-5 space-y-3">
              <ContactRow icon={Mail} label={t.support.emailLabel} href={`mailto:${CONTEST.merchantSupportEmail}`} value={CONTEST.merchantSupportEmail} />
              {/* La riga compare solo quando il numero è configurato: meglio nessun recapito che uno sbagliato */}
              {CONTEST.merchantSupportPhone && (
                <ContactRow icon={Phone} label={t.support.phoneLabel} href={`tel:${toInternational(CONTEST.merchantSupportPhone)}`} value={CONTEST.merchantSupportPhone} />
              )}
              {CONTEST.merchantSupportWhatsapp && (
                <ContactRow icon={MessageCircle} label={t.support.whatsappLabel} href={whatsappUrl(CONTEST.merchantSupportWhatsapp)} value={CONTEST.merchantSupportWhatsapp} external />
              )}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              {t.rulesLinkBefore}
              <Link href={`${localePath(locale)}?regolamento`} className="text-gold underline underline-offset-2">
                {t.rulesLink}
              </Link>
              {t.rulesLinkAfter}
            </p>
          </GlassCard>

          <div className="flex flex-col gap-6">
            <GlassCard hover={false} className="flex flex-col gap-4 p-7">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                <Linkedin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                {t.announcement.text}
              </p>
              <Button as="a" href={OFFICIAL_CHANNELS.linkedin.url} target="_blank" rel="noopener noreferrer" variant="ghost" className="sm:self-start">
                <Linkedin className="h-4 w-4 text-gold" />
                {t.announcement.cta}
              </Button>
            </GlassCard>
            <GlassCard hover={false} className="flex flex-col p-7">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Star className="h-5 w-5 text-gold" />
                {t.support.reviewTitle}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t.support.reviewText}</p>
              <Button as="a" href={CONTEST.googleReviewUrl} target="_blank" rel="noopener noreferrer" variant="secondary-gold" className="mt-4 sm:self-start">
                <Star className="h-4 w-4" />
                {t.support.reviewCta}
              </Button>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}

function ContactRow({ icon: Icon, label, href, value, external = false }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-gold" />
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="truncate text-sm font-semibold">
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="text-white underline-offset-2 hover:text-gold hover:underline"
          >
            {value}
          </a>
        </dd>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, extra = null, small = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className={small ? 'text-sm font-semibold text-white' : 'text-base font-bold text-white'}>
          {value}
          {extra && <span className="ml-2 text-xs font-normal text-muted">{extra}</span>}
        </dd>
      </div>
    </div>
  );
}
