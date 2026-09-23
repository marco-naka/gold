import BestSocialVideo from '@/components/BestSocialVideo';
import { PRIZES, formatXaut } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en').video;
const prize = PRIZES.merchants.items.find((i) => i.place === 'Best Social Video');

export const metadata = {
  title: t.metaTitle(formatXaut(prize.amount)),
  description: t.metaDescription,
  alternates: {
    canonical: '/en/best-social-video',
    languages: { it: '/best-social-video', en: '/en/best-social-video' },
  },
};

export default function PageEn() {
  return <BestSocialVideo locale="en" />;
}
