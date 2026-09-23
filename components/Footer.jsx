'use client';

import Link from 'next/link';
import { Mail, ArrowUp, ExternalLink } from 'lucide-react';
import { NakaLogo, PlanBLogo, XautBadge } from './Brand';
import { CONTEST, EVENT, NAV_LINKS } from '@/lib/constants';
import { OFFICIAL_GUIDE } from '@/lib/wallets';

/**
 * Il regolamento è una modale che vive nella home: fuori dalla home il link ci riporta,
 * così la voce non resta un pulsante inerte.
 */
function RulesLink({ onOpenRules, children }) {
  const className = 'text-sm text-muted transition hover:text-gold';
  if (onOpenRules) {
    return (
      <button type="button" onClick={onOpenRules} className={className}>
        {children}
      </button>
    );
  }
  return (
    <Link href="/#faq" className={className}>
      {children}
    </Link>
  );
}

export default function Footer({ onOpenRules }) {
  return (
    <footer className="border-t border-white/10 bg-ink-deep/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <NakaLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {CONTEST.title} — l&apos;iniziativa {CONTEST.organizer} per il {EVENT.name} di {EVENT.city}.
              Paga in crypto sui POS NAKA e vinci Oro Digitale.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <XautBadge />
              <PlanBLogo />
            </div>
          </div>

          <nav aria-label="Navigazione sezioni">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Concorso</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={onOpenRules ? link.href : `/${link.href}`} className="text-sm text-muted transition hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={onOpenRules ? '#faq' : '/#faq'} className="text-sm text-muted transition hover:text-gold">
                  FAQ & Assistenza
                </a>
              </li>
              <li>
                <Link href="/best-social-video" className="text-sm text-muted transition hover:text-gold">
                  Best Social Video
                </Link>
              </li>
              <li>
                <a
                  href={OFFICIAL_GUIDE.it}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold"
                >
                  Come pagare sui POS
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informazioni legali">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Legale</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <RulesLink onOpenRules={onOpenRules}>Regolamento Completo</RulesLink>
              </li>
              <li>
                <RulesLink onOpenRules={onOpenRules}>Privacy Policy (LPD/GDPR)</RulesLink>
              </li>
              <li>
                <a
                  href={`mailto:${CONTEST.supportEmail}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contatti Assistenza
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted/80 sm:text-left">
            © 2026 {CONTEST.organizer}. Tutti i diritti riservati. I premi sono erogati in Tether Gold (XAUT);
            il controvalore può variare con il mercato.
          </p>
          <a
            href={onOpenRules ? '#top' : '/'}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-muted transition hover:border-gold/40 hover:text-gold"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Torna su
          </a>
        </div>
      </div>
    </footer>
  );
}
