'use client';

import { useEffect, useState } from 'react';
import { XAUT_FALLBACK } from '@/lib/constants';
import { BTC_FALLBACK, SATS_PER_BTC } from '@/lib/bitcoin';
import { intlLocale } from '@/lib/i18n';

/**
 * Il controvalore in dollari di un premio, accanto alla quantità.
 *
 * «11'000'000 sat» non è una cifra per chi non vive di bitcoin: è una parola straniera. La
 * quantità resta il dato che fa fede — è quella che il vincitore riceve — ma da sola non
 * permette di decidere se vale la pena partecipare, ed è la decisione che il sito chiede.
 *
 * Le quotazioni arrivano dal nostro server, non da CoinGecko: il browser di chi legge non
 * contatta terzi e nessun IP esce. Le due chiamate si fanno UNA volta per pagina anche se in
 * pagina ci sono dieci importi: la promessa è memorizzata qui a livello di modulo, e chi arriva
 * dopo si aggancia a quella già in volo invece di aprirne un'altra.
 */

let ratesPromise = null;

function loadRates() {
  if (ratesPromise) return ratesPromise;
  const one = (url, fallback) =>
    fetch(url)
      .then((r) => r.json())
      .catch(() => ({ ...fallback, live: false }));

  ratesPromise = Promise.all([one('/api/btc', BTC_FALLBACK), one('/api/xaut', XAUT_FALLBACK)]).then(
    ([btc, xaut]) => ({ btc, xaut }),
  );
  return ratesPromise;
}

/** Quanti dollari vale `amount` dell'asset indicato, ai cambi passati. */
export const usdOf = (asset, amount, rates) => {
  if (asset === 'XAUT') return rates?.xaut?.usd ? amount * rates.xaut.usd : null;
  return rates?.btc?.usd ? (amount / SATS_PER_BTC) * rates.btc.usd : null;
};

export function useRates() {
  const [rates, setRates] = useState(null);
  useEffect(() => {
    let alive = true;
    loadRates().then((r) => alive && setRates(r));
    return () => {
      alive = false;
    };
  }, []);
  return rates;
}

/**
 * Finché le quotazioni non sono arrivate non si mostra un segnaposto: comparirebbe uno scatto
 * di layout su ogni riga dei premi. L'importo in asset è già lì e basta a sé.
 */
export default function FiatValue({ asset, amount, locale = 'it', className = '', suffix = null }) {
  const rates = useRates();
  const usd = usdOf(asset, amount, rates);
  if (!usd) return null;

  const money = new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd);

  return (
    <span className={className}>
      ≈ {money}
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
}
