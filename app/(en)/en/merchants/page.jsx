import BestSocialContent from '@/components/BestSocialContent';
import { PRIZES, formatXaut } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en').video;

export const metadata = {
  title: t.metaTitle(formatXaut(PRIZES.merchants.pool)),
  description: t.metaDescription,
  alternates: {
    canonical: '/en/merchants',
    languages: { it: '/commercianti', en: '/en/merchants' },
  },
};

export default function PageEn() {
  return <BestSocialContent locale="en" />;
}
