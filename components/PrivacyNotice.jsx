import Link from 'next/link';
import { ArrowLeft, CookieIcon, ShieldCheck } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
import { NakaLogo } from './Brand';
import { CONTEST } from '@/lib/constants';
import { GRACE_MS } from '@/lib/contest';
import { formatDate, getDictionary, localePath } from '@/lib/i18n';

/** Informativa privacy e cookie: pagina autonoma, non una modale sepolta nel regolamento. */
export default function PrivacyNotice({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.privacy;

  const sections = t.sections({
    organizer: CONTEST.organizer,
    support: CONTEST.supportEmail,
    merchantSupport: CONTEST.merchantSupportEmail,
    collectedUntil: formatDate(new Date(new Date(CONTEST.validTo).getTime() + GRACE_MS), locale),
    drawDate: formatDate(CONTEST.drawDate, locale),
    onlineUntil: formatDate(CONTEST.onlineUntil, locale),
  });

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link href={localePath(locale)} aria-label={dict.nav.home}>
            <NakaLogo />
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>
        <p className="mt-3 text-xs text-muted">{t.updated(formatDate(CONTEST.onlineUntil, locale, { day: 'numeric', month: 'long', year: 'numeric' }))}</p>

        <GlassCard hover={false} className="mt-8 flex items-start gap-4 border-gold/30 bg-gold/[0.06] p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
            <CookieIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-gold">{t.cookieBadge}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.cookieLead}</p>
          </div>
        </GlassCard>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ShieldCheck className="h-4 w-4 shrink-0 text-gold" />
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-3 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
