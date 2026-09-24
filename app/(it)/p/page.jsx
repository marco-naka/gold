import QuickEntry from '@/components/QuickEntry';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it');

export const metadata = {
  title: `${t.quick.title} | NAKA`,
  description: t.quick.intro,
  alternates: { canonical: '/p', languages: { it: '/p', en: '/en/p' } },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <QuickEntry locale="it" />;
}
