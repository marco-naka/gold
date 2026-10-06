'use client';

import { formatSats } from '@/lib/bitcoin';
import { DECLARED, POOLS } from '@/lib/campaigns';
import { useRates, usdOf } from './FiatValue';
import { formatNumber } from '@/lib/number-format';

/**
 * Montepremi complessivo con il controvalore in dollari.
 *
 * La cifra dichiarata — 21'000'000 di satoshi — è un'equivalenza fissata a un istante preciso
 * (vedi `lib/anchor.js`) e non si muove. Il controvalore sì: si calcola su quello che viene
 * davvero pagato, satoshi in bitcoin più Tether Gold in oro, ciascuno alla propria quotazione.
 * Convertire i 21 milioni come se fossero tutti bitcoin darebbe un numero che non esiste.
 *
 * Le quotazioni le prende da `FiatValue`, che le scarica una volta sola per pagina.
 */
export default function PrizeValue({ t, locale }) {
  const rates = useRates();
  const btc = usdOf('BTC', POOLS.users.total, rates);
  const xaut = usdOf('XAUT', POOLS.merchants.total, rates);

  const usd =
    btc && xaut
      ? formatNumber(btc + xaut, locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : null;

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-btc/30 bg-btc/[0.08] px-4 py-3">
        <span className="text-xs font-semibold text-white">{t.rowTotal}</span>
        <span className="text-right">
          <span className="block text-base font-bold text-btc">{formatSats(DECLARED.sats, locale)}</span>
          {usd && <span className="block text-xs text-muted">≈ {usd}</span>}
        </span>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-muted/80">{t.valueNote}</p>
    </>
  );
}
