import { CONTEST, EVENT } from './constants';
import { getDictionary } from './i18n';

/** Metadata comuni ai due root layout, differenziati per lingua. */
export function localeMetadata(locale) {
  const t = getDictionary(locale);
  const path = locale === 'en' ? '/en' : '/';
  return {
    title: t.meta.title(t.meta.contestTitle, `${EVENT.name} ${EVENT.city}`),
    description: t.meta.description,
    keywords: ['NAKA', 'Bitcoin', 'satoshi', 'Lightning', 'Tether Gold', 'XAUT', 'Plan B Forum', 'Lugano', 'USD₮', 'USDt'],
    alternates: { canonical: path, languages: { it: '/', en: '/en', 'x-default': '/' } },
    openGraph: {
      // Senza siteName le app di messaggistica mostrano il dominio dell'host («Onrender»).
      siteName: CONTEST.organizer,
      title: `${t.meta.contestTitle} | NAKA`,
      description: t.meta.ogDescription,
      locale: locale === 'en' ? 'en_CH' : 'it_CH',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}
