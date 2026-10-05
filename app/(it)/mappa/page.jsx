import MerchantMap from '@/components/MerchantMap';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').mapPage;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/mappa', languages: { it: '/mappa', en: '/en/map' } },
};

export default function Page() {
  return <MerchantMap locale="it" />;
}
