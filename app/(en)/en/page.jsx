import Landing from '@/components/Landing';
import { CONTEST, EVENT } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en');

export const metadata = {
  title: t.meta.title(CONTEST.title, `${EVENT.name} ${EVENT.city}`),
  description: t.meta.description,
  alternates: { canonical: '/en', languages: { it: '/', en: '/en' } },
  openGraph: { title: `${CONTEST.title} | NAKA`, description: t.meta.ogDescription, locale: 'en_CH' },
};

export default function PageEn() {
  return <Landing locale="en" />;
}
