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
  Clock,
  Smartphone,
  Lightbulb,
  Ban,
  Mail,
  ScrollText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';
import { NakaLogo, PlanBLogo } from './Brand';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
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
import { formatDate, getDictionary, localePath } from '@/lib/i18n';

const STEP_ICONS = [Video, Hash, AtSign, Mail];

export default function BestSocialContent({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.video;
  const prize = PRIZES.merchants.items.find((i) => i.place === 'Best Social Content');
  const deadline = formatDate(SOCIAL_CONTEST.publishDeadline, locale);
  const specs = SOCIAL_CONTEST.specs;

  const steps = t.steps({
    min: specs.minSeconds,
    max: specs.maxSeconds,
    ratio: specs.ratio,
    platforms: SOCIAL_CONTEST.platforms.slice(0, 3).join(', '),
    email: CONTEST.merchantEmail,
    deadline,
  });

  const mailto = `mailto:${CONTEST.merchantEmail}?subject=${encodeURIComponent(
    t.mailSubject
  )}&body=${encodeURIComponent(t.mailBody.join('\n'))}`;

  return (
    <>
      {/* Header essenziale: questa pagina si raggiunge dalla landing, non è una home */}
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={localePath(locale)} className="flex items-center gap-3" aria-label={dict.nav.home}>
            <NakaLogo />
          </Link>
          <div className="flex items-center gap-3">
            <PlanBLogo className="hidden sm:inline-flex" />
            <LanguageSwitch locale={locale} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href={`${localePath(locale)}#montepremi`}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        {/* Intestazione */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
          <div>
            <span className="chip border-gold/30 bg-gold/10 text-gold">{t.badge}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t.titleLead} <span className="text-gold-gradient">{t.titleGold}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
              {t.intro(
                EVENT.name,
                EVENT.city,
                locale === 'en' ? CONTEST.weekLabelEn : CONTEST.weekLabel,
                formatXaut(prize.amount)
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={mailto}>
                <Mail className="h-4 w-4" />
                {t.ctaSubmit}
              </Button>
              <Button as="a" href="#idee" variant="secondary">
                <Lightbulb className="h-4 w-4" />
                {t.ctaIdeas}
              </Button>
            </div>
          </div>

          <GlassCard hover={false} className="p-7">
            <dl className="space-y-4">
              <Stat icon={Trophy} label={t.statPrize} value={formatXaut(prize.amount)} />
              <Stat icon={Clock} label={t.statDeadline} value={deadline} />
              <Stat
                icon={Smartphone}
                label={t.statFormat}
                value={`${specs.minSeconds}–${specs.maxSeconds}s · ${specs.ratio}`}
              />
            </dl>
          </GlassCard>
        </div>

        {/* Che cosa si può pubblicare: non solo video */}
        <section className="mt-14">
          <SectionTitle align="left" title={t.contentTitle} subtitle={t.contentSubtitle} />
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

          <GlassCard hover={false} className="mt-4 p-6">
            <h3 className="text-sm font-semibold text-white">{t.platformsTitle}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIAL_CONTEST.platforms.map((platform) => (
                <span key={platform} className="chip">
                  {platform}
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <Linkedin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              {t.platformsNote}
            </p>
          </GlassCard>
        </section>

        {/* Hashtag obbligatori */}
        <GlassCard hover={false} className="mt-14 p-7 sm:p-9">
          <h2 className="text-xl font-bold">{t.hashtagsTitle}</h2>
          <p className="mt-2 text-sm text-muted">
            {t.hashtagsText[0]}
            <span className="font-semibold text-white">{t.hashtagsText[1]}</span>
            {t.hashtagsText[2]}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIAL_CONTEST.hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 font-mono text-sm font-semibold text-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold text-white">{t.mentionsTitle}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
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
        </GlassCard>

        {/* Come partecipare */}
        <section className="mt-16">
          <SectionTitle align="left" eyebrow={t.stepsEyebrow} title={t.stepsTitle} />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
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
                    <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                  </GlassCard>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Come si vince: due fasi */}
        <section className="mt-16">
          <SectionTitle align="left" eyebrow={t.selectionEyebrow} title={t.selectionTitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.selection.map((phase, i) => (
              <GlassCard key={phase.phase} className="p-7">
                <div className="flex items-center justify-between">
                  <span className="chip border-gold/30 bg-gold/10 text-gold">{phase.phase}</span>
                  <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{phase.desc}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted/80">{t.selectionNote}</p>
        </section>

        {/* Idee */}
        <section id="idee" className="mt-16 scroll-mt-24">
          <SectionTitle align="left" eyebrow={t.ideasEyebrow} title={t.ideasTitle} subtitle={t.ideasSubtitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.ideas.map((idea, i) => (
              <GlassCard key={idea.title} className="p-6">
                <span className="text-xs font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-bold">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{idea.desc}</p>
                <p className="mt-3 flex items-start gap-2 border-t border-white/5 pt-3 text-xs leading-relaxed text-muted/80">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  {idea.why}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Requisiti e cose da evitare */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 text-gold" />
              {t.requirementsTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {t
                .requirements({
                  min: specs.minSeconds,
                  max: specs.maxSeconds,
                  ratio: specs.ratio,
                  resolution: specs.minResolution,
                  deadline,
                })
                .map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {r}
                  </li>
                ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Ban className="h-5 w-5 text-red-400" />
              {t.avoidTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {t.avoid.map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400/80" />
                  {a}
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* Diritti */}
        <GlassCard hover={false} className="mt-16 p-7 sm:p-9">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ScrollText className="h-5 w-5 text-gold" />
            {t.rightsTitle}
          </h2>
          <div className="mt-5 space-y-3 text-xs leading-relaxed text-muted">
            {t.rights(CONTEST.organizer).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              {t.rightsLinkBefore}
              <Link href={`${localePath(locale)}#faq`} className="text-gold underline underline-offset-2">
                {t.rightsLink}
              </Link>
              {t.rightsLinkAfter}
            </p>
          </div>
        </GlassCard>

        {/* Guida completa per il commerciante: è la pagina a cui punta il QR del materiale */}
        <section id="commercianti" className="mt-16 scroll-mt-24">
          <SectionTitle
            align="left"
            eyebrow={t.merchantGuide.eyebrow}
            title={t.merchantGuide.title}
            subtitle={t.merchantGuide.subtitle}
          />
          <div className="mt-8 space-y-4">
            {t.merchantGuide.steps.map((step) => (
              <GlassCard key={step.title} className="p-6 sm:p-7">
                <h3 className="text-base font-bold text-white sm:text-lg">{step.title}</h3>
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

        {/* Assistenza dedicata + recensione */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Store className="h-5 w-5 text-gold" />
              {t.support.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.support.text}</p>
            <dl className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <div className="min-w-0">
                  <dt className="text-xs text-muted">{t.support.emailLabel}</dt>
                  <dd className="truncate text-sm font-semibold">
                    <a
                      href={`mailto:${CONTEST.merchantSupportEmail}`}
                      className="text-white underline-offset-2 hover:text-gold hover:underline"
                    >
                      {CONTEST.merchantSupportEmail}
                    </a>
                  </dd>
                </div>
              </div>
              {/* La riga compare solo quando il numero è configurato: meglio nessun recapito che uno sbagliato */}
              {CONTEST.merchantSupportPhone && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted">{t.support.phoneLabel}</dt>
                    <dd className="truncate text-sm font-semibold">
                      <a
                        href={`tel:${toInternational(CONTEST.merchantSupportPhone)}`}
                        className="text-white underline-offset-2 hover:text-gold hover:underline"
                      >
                        {CONTEST.merchantSupportPhone}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {CONTEST.merchantSupportWhatsapp && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted">{t.support.whatsappLabel}</dt>
                    <dd className="truncate text-sm font-semibold">
                      <a
                        href={whatsappUrl(CONTEST.merchantSupportWhatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline-offset-2 hover:text-gold hover:underline"
                      >
                        {CONTEST.merchantSupportWhatsapp}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </GlassCard>

          <GlassCard hover={false} className="flex flex-col p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Star className="h-5 w-5 text-gold" />
              {t.support.reviewTitle}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t.support.reviewText}</p>
            <Button
              as="a"
              href={CONTEST.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="mt-5 w-full sm:w-auto"
            >
              <Star className="h-4 w-4" />
              {t.support.reviewCta}
            </Button>
          </GlassCard>
        </section>

        {/* Annuncio ufficiale su LinkedIn */}
        <GlassCard hover={false} className="mt-6 flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
            <Linkedin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            {t.announcement.text}
          </p>
          <Button
            as="a"
            href={OFFICIAL_CHANNELS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className="shrink-0"
          >
            <Linkedin className="h-4 w-4 text-gold" />
            {t.announcement.cta}
          </Button>
        </GlassCard>

        {/* CTA finale */}
        <GlassCard hover={false} className="mt-10 flex flex-col items-center gap-5 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">{t.finalTitle}</h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">{t.finalText}</p>
          <Button as="a" href={mailto} size="lg">
            <Mail className="h-5 w-5" />
            {t.ctaSubmit}
          </Button>
        </GlassCard>
      </main>

      <Footer locale={locale} />
    </>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-base font-bold text-white">{value}</dd>
      </div>
    </div>
  );
}
