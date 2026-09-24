import ConsentBanner from './ConsentBanner';
import { getDictionary, localePath } from '@/lib/i18n';

/**
 * Scheletro del documento, condiviso dai due root layout.
 * Esistono due layout separati (route group per lingua) perché l'attributo `lang` sta su <html>
 * e un layout annidato non può modificarlo.
 */
export default function LocaleHtml({ locale, skipLink, children }) {
  const t = getDictionary(locale);
  return (
    <html lang={locale}>
      <body>
        <a
          href="#partecipa"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink-deep"
        >
          {skipLink}
        </a>
        {children}
        <ConsentBanner t={t.consent} privacyHref={localePath(locale, '/privacy')} />
      </body>
    </html>
  );
}
