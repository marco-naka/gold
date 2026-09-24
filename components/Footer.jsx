'use client';

import Link from 'next/link';
import { Mail, ArrowUp, ExternalLink } from 'lucide-react';
import { NakaLogo, PlanBLogo, XautBadge } from './Brand';
import { CONTEST, EVENT, OFFICIAL_CHANNELS } from '@/lib/constants';
import { OFFICIAL_GUIDE } from '@/lib/wallets';
import { getDictionary, localePath } from '@/lib/i18n';

/**
 * Il regolamento è una modale che vive nella home: fuori dalla home il link ci riporta,
 * così la voce non resta un pulsante inerte.
 */
function RulesLink({ onOpenRules, locale = 'it', children }) {
  const className = 'text-sm text-muted transition hover:text-gold';
  if (onOpenRules) {
    return (
      <button type="button" onClick={onOpenRules} className={className}>
        {children}
      </button>
    );
  }
  return (
    <Link href={`${localePath(locale)}#faq`} className={className}>
      {children}
    </Link>
  );
}

/**
 * Il dizionario contiene funzioni, che non attraversano il confine server→client: il Footer
 * lo risolve da sé a partire dal `locale`, così può essere usato anche da una pagina server.
 */
export default function Footer({ locale = 'it', onOpenRules }) {
  const t = getDictionary(locale);
  const d = t.footer;
  const links = [
    { label: t.nav.howItWorks, href: '#come-funziona' },
    { label: t.nav.prizes, href: '#montepremi' },
    { label: t.nav.map, href: '#mappa' },
    { label: t.nav.upload, href: '#partecipa' },
  ];

  return (
    <footer className="border-t border-white/10 bg-ink-deep/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <NakaLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {d.tagline(t.meta.contestTitle, CONTEST.organizer, EVENT.name, EVENT.city)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <XautBadge />
              <PlanBLogo />
            </div>
          </div>

          <nav aria-label={d.navLabel}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{d.contestHeading}</h2>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={onOpenRules ? link.href : `${localePath(locale)}${link.href}`} className="text-sm text-muted transition hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={onOpenRules ? '#faq' : `${localePath(locale)}#faq`} className="text-sm text-muted transition hover:text-gold">
                  {d.faq}
                </a>
              </li>
              <li>
                <Link
                  href={localePath(locale, locale === 'en' ? '/winners' : '/vincitori')}
                  className="text-sm text-muted transition hover:text-gold"
                >
                  {d.winners}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/best-social-content")} className="text-sm text-muted transition hover:text-gold">
                  {d.bestVideo}
                </Link>
              </li>
              <li>
                <a
                  href={OFFICIAL_CHANNELS.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold"
                >
                  {d.linkedin}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={OFFICIAL_GUIDE[locale] ?? OFFICIAL_GUIDE.it}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold"
                >
                  {d.payGuide}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label={d.legalLabel}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{d.legalHeading}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <RulesLink onOpenRules={onOpenRules} locale={locale}>{d.rules}</RulesLink>
              </li>
              <li>
                <RulesLink onOpenRules={onOpenRules} locale={locale}>{d.privacy}</RulesLink>
              </li>
              <li>
                <a
                  href={`mailto:${CONTEST.supportEmail}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {d.support}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted/80 sm:text-left">{d.copyright(CONTEST.organizer)}</p>
          <a
            href={onOpenRules ? '#top' : localePath(locale)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-muted transition hover:border-gold/40 hover:text-gold"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            {d.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
