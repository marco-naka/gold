import BitcoinLanding from '@/components/BitcoinLanding';
import { BTC_TOTAL_SATS, formatSats } from '@/lib/bitcoin';

/**
 * Variante Bitcoin del concorso, alternativa a quella in oro.
 *
 * `noindex` di proposito: finché le due campagne convivono, lasciarle indicizzare entrambe
 * significa due pagine quasi identiche in concorrenza fra loro sugli stessi termini, e un
 * visitatore che non capisce quale sia il concorso vero. Quando si sceglie quale mandare
 * in produzione, si toglie `robots` da qui e si aggiunge la pagina alla sitemap.
 */
export const metadata = {
  title: `Pay on NAKA, Win Satoshi — ${formatSats(BTC_TOTAL_SATS)} in palio`,
  description:
    'Paga in crypto nei negozi di Lugano con POS NAKA durante il Plan ₿ Forum 2026 e partecipa all’estrazione di 21 milioni di satoshi.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/bitcoin' },
};

export default function Page() {
  return <BitcoinLanding />;
}
