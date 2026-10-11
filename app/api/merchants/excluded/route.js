import { NextResponse } from 'next/server';
import { excludedIds } from '@/lib/server/merchant-exclusions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Gli id dei negozi tolti dal circuito dall'area rilevazioni, per le pagine pubbliche che li
 * nascondono (elenco, mappa, link social). Solo gli id: motivi e nomi di chi li ha tolti
 * restano nell'area rilevazioni.
 */
export async function GET() {
  const ids = [...(await excludedIds())].sort();
  return NextResponse.json({ ids }, { headers: { 'Cache-Control': 'public, max-age=15' } });
}
