import { NextResponse } from 'next/server';
import { BTC_FALLBACK } from '@/lib/bitcoin';

export const runtime = 'nodejs';
export const revalidate = 300;

const SOURCE = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,chf';

let cache = null;
// Cinque minuti invece del quarto d'ora dell'oro: bitcoin si muove parecchio di più,
// e un montepremi dichiarato con un prezzo di mezz'ora prima si nota.
const TTL = 5 * 60 * 1000;

/**
 * Quotazione di Bitcoin, con la stessa forma di `/api/xaut`: la richiesta parte dal nostro
 * server, il browser del visitatore non contatta CoinGecko e il suo IP non raggiunge terzi.
 * Se la fonte non risponde si restituisce l'ultimo valore noto, dichiarando la sua data.
 */
export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data, { headers: { 'Cache-Control': 'public, max-age=120' } });
  }

  try {
    const res = await fetch(SOURCE, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const price = json.bitcoin;
    if (!price?.usd) throw new Error('risposta senza prezzo');

    const data = { usd: price.usd, chf: price.chf ?? null, at: new Date().toISOString(), live: true };
    cache = { data, at: Date.now() };
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=120' } });
  } catch {
    return NextResponse.json({ ...BTC_FALLBACK, live: false }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  }
}
