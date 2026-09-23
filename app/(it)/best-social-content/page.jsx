import BestSocialContent from '@/components/BestSocialContent';
import { PRIZES, formatXaut } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').video;
const prize = PRIZES.merchants.items.find((i) => i.place === 'Best Social Content');

export const metadata = {
  title: t.metaTitle(formatXaut(prize.amount)),
  description: t.metaDescription,
  alternates: {
    canonical: '/best-social-content',
    languages: { it: '/best-social-content', en: '/en/best-social-content' },
  },
};

export default function Page() {
  return <BestSocialContent locale="it" />;
}
