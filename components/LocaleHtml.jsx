/**
 * Scheletro del documento, condiviso dai due root layout.
 * Esistono due layout separati (route group per lingua) perché l'attributo `lang` sta su <html>
 * e un layout annidato non può modificarlo.
 */
export default function LocaleHtml({ locale, skipLink, children }) {
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#partecipa"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink-deep"
        >
          {skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
