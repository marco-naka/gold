import BitcoinLanding from '@/components/BitcoinLanding';
import { formatSats } from '@/lib/bitcoin';
import { TOTAL_SATS } from '@/lib/anchor';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('en').btc;

/** Stessa pagina in inglese. `noindex` per la stessa ragione della versione italiana. */
export const metadata = {
  title: t.metaTitle(formatSats(TOTAL_SATS)),
  description: t.metaDescription,
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/en/bitcoin',
    languages: { it: '/bitcoin', en: '/en/bitcoin' },
  },
};

export default function PageEn() {
  return <BitcoinLanding locale="en" />;
}
