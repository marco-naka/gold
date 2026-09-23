'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { DEFAULT_LOCALE, getDictionary } from '@/lib/i18n';
import { cn } from './ui/cn';

/**
 * Passa all'altra lingua restando sulla stessa pagina:
 * / ↔ /en e /best-social-video ↔ /en/best-social-video.
 */
export default function LanguageSwitch({ locale, className }) {
  const pathname = usePathname() || '/';
  const target = locale === 'en' ? DEFAULT_LOCALE : 'en';

  const basePath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const href = target === DEFAULT_LOCALE ? basePath : basePath === '/' ? '/en' : `/en${basePath}`;

  return (
    <Link
      href={href}
      hrefLang={target}
      aria-label={getDictionary(target).meta.languageName}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2',
        'text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold',
        className
      )}
    >
      <Languages className="h-4 w-4" />
      {target.toUpperCase()}
    </Link>
  );
}
