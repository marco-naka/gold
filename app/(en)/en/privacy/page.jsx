import PrivacyNotice from '@/components/PrivacyNotice';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en').privacy;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/en/privacy', languages: { it: '/privacy', en: '/en/privacy' } },
};

export default function PageEn() {
  return <PrivacyNotice locale="en" />;
}
