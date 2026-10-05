import MerchantMap from '@/components/MerchantMap';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en').mapPage;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/en/map', languages: { it: '/mappa', en: '/en/map' } },
};

export default function PageEn() {
  return <MerchantMap locale="en" />;
}
