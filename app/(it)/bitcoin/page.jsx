import BitcoinLanding from '@/components/BitcoinLanding';
import { formatSats } from '@/lib/bitcoin';
import { TOTAL_SATS } from '@/lib/anchor';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').btc;

/**
 * Variante Bitcoin del concorso, alternativa a quella in oro.
 *
 * `noindex` di proposito: finché le due campagne convivono, lasciarle indicizzare entrambe
 * significa due pagine quasi identiche in concorrenza fra loro sugli stessi termini, e un
 * visitatore che non capisce quale sia il concorso vero. Quando si sceglie quale mandare
 * in produzione, si toglie `robots` da qui e si aggiunge la pagina alla sitemap.
 */
export const metadata = {
  title: t.metaTitle(formatSats(TOTAL_SATS)),
  description: t.metaDescription,
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/bitcoin',
    languages: { it: '/bitcoin', en: '/en/bitcoin' },
  },
};

export default function Page() {
  return <BitcoinLanding locale="it" />;
}
