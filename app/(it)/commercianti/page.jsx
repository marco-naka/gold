import BestSocialContent from '@/components/BestSocialContent';
import { PRIZES, formatXaut } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').video;

export const metadata = {
  title: t.metaTitle(formatXaut(PRIZES.merchants.pool)),
  description: t.metaDescription,
  alternates: {
    canonical: '/commercianti',
    languages: { it: '/commercianti', en: '/en/merchants' },
  },
};

export default function Page() {
  return <BestSocialContent locale="it" />;
}
