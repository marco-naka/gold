'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, LOCALES, getDictionary } from '@/lib/i18n';
import { cn } from './ui/cn';

// Bandierine: più immediate di una sigla per un pubblico internazionale.
const FLAGS = { it: '🇮🇹', en: '🇬🇧' };

/**
 * Selettore di lingua sempre visibile con entrambe le opzioni: si resta sulla stessa pagina
 * (/ ↔ /en, /best-social-video ↔ /en/best-social-video) e si vede subito quale è attiva.
 */
export default function LanguageSwitch({ locale, className }) {
  const pathname = usePathname() || '/';
  const basePath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';

  const hrefFor = (target) =>
    target === DEFAULT_LOCALE ? basePath : basePath === '/' ? '/en' : `/en${basePath}`;

  return (
    <div
      className={cn('inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5', className)}
      role="group"
      aria-label={getDictionary(locale).meta.languageLabel}
    >
      {LOCALES.map((target) => {
        const active = target === locale;
        return (
          <Link
            key={target}
            href={hrefFor(target)}
            hrefLang={target}
            aria-current={active ? 'true' : undefined}
            aria-label={getDictionary(target).meta.languageName}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition',
              active ? 'bg-gold/15 text-gold' : 'text-muted hover:bg-white/5 hover:text-white'
            )}
          >
            <span aria-hidden="true" className="text-sm leading-none">
              {FLAGS[target]}
            </span>
            {target.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
