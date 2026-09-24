import Winners from '@/components/Winners';
import { getDictionary } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const t = getDictionary('it').winners;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/vincitori', languages: { it: '/vincitori', en: '/en/winners' } },
};

export default function Page() {
  return <Winners locale="it" />;
}
