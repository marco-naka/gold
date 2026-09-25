'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { TOTAL_POOL, XAUT_FALLBACK, XAUT_PRICE_URL, formatXaut } from '@/lib/constants';
import { formatDate, intlLocale } from '@/lib/i18n';

/**
 * Montepremi totale con il controvalore in dollari.
 *
 * Serve a chi non ragiona in once d'oro: "6.20 XAUT" non dice niente, "circa 26'000 dollari" sì.
 * Il cambio arriva da /api/xaut, cioè dal nostro server: il browser dell'utente non contatta
 * CoinGecko e il suo IP non raggiunge nessun terzo. Finché non risponde si mostra comunque la
 * quantità in XAUT, che è il dato che fa fede.
 */
export default function PrizeValue({ t, locale }) {
  // Si parte dall'ultimo valore noto, così la cifra è già nell'HTML e non compare a scatto;
  // appena arriva la quotazione aggiornata prende il suo posto.
  const [price, setPrice] = useState({ ...XAUT_FALLBACK, live: false });

  useEffect(() => {
    let alive = true;
    fetch('/api/xaut')
      .then((r) => r.json())
      .then((d) => alive && setPrice(d))
      .catch(() => alive && setPrice({ ...XAUT_FALLBACK, live: false }));
    return () => {
      alive = false;
    };
  }, []);

  const usd = price?.usd
    ? new Intl.NumberFormat(intlLocale(locale), {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(TOTAL_POOL * price.usd)
    : null;

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gold/25 bg-gold/[0.07] px-4 py-3">
        <span className="text-xs font-semibold text-white">{t.rowTotal}</span>
        <span className="text-right">
          <span className="block text-base font-bold text-gold">{formatXaut(TOTAL_POOL)}</span>
          {usd && <span className="block text-xs text-muted">≈ {usd}</span>}
        </span>
      </div>

      {price && (
        <p className="text-center text-[11px] leading-relaxed text-muted/80">
          {t.valueNote(formatDate(price.at, locale))}{' '}
          <a
            href={XAUT_PRICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gold/90 underline underline-offset-2 hover:text-gold"
          >
            {t.valueLink}
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      )}
    </>
  );
}
