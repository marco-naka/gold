import QuickEntry from '@/components/QuickEntry';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en');

export const metadata = {
  title: `${t.quick.title} | NAKA`,
  description: t.quick.intro,
  alternates: { canonical: '/en/p', languages: { it: '/p', en: '/en/p' } },
  robots: { index: false, follow: true },
};

export default function PageEn() {
  return <QuickEntry locale="en" />;
}
