import PrivacyNotice from '@/components/PrivacyNotice';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').privacy;

export const metadata = {
  title: `${t.metaTitle} | NAKA`,
  description: t.metaDescription,
  alternates: { canonical: '/privacy', languages: { it: '/privacy', en: '/en/privacy' } },
};

export default function Page() {
  return <PrivacyNotice locale="it" />;
}
