import Winners from '@/components/Winners';
import { getDictionary } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const t = getDictionary('en').winners;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/en/winners', languages: { it: '/vincitori', en: '/en/winners' } },
};

export default function PageEn() {
  return <Winners locale="en" />;
}
