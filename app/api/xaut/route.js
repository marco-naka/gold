import { NextResponse } from 'next/server';
import { XAUT_FALLBACK } from '@/lib/constants';

export const runtime = 'nodejs';
export const revalidate = 900;

const SOURCE = 'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd,chf';

let cache = null; // { data, at }
const TTL = 15 * 60 * 1000;

/**
 * Quotazione di Tether Gold.
 *
 * La richiesta parte dal nostro server, non dal browser: l'utente non contatta CoinGecko e
 * il suo indirizzo IP non raggiunge nessun terzo. Il valore è in cache per un quarto d'ora —
 * l'oro non si muove abbastanza in fretta da giustificare di più — e se la fonte non risponde
 * si restituisce l'ultimo valore noto, dichiarando la data a cui si riferisce.
 */
export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache.data, { headers: { 'Cache-Control': 'public, max-age=300' } });
  }

  try {
    const res = await fetch(SOURCE, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const price = json['tether-gold'];
    if (!price?.usd) throw new Error('risposta senza prezzo');

    const data = { usd: price.usd, chf: price.chf ?? null, at: new Date().toISOString(), live: true };
    cache = { data, at: Date.now() };
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=300' } });
  } catch {
    return NextResponse.json({ ...XAUT_FALLBACK, live: false }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  }
}
