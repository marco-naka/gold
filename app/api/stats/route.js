import { NextResponse } from 'next/server';
import { MERCHANTS } from '@/lib/merchants';
import { PRIZES, TOTAL_WINNERS } from '@/lib/constants';
import { IS_DEMO } from '@/lib/deploy';
import { publicStats } from '@/lib/server/stats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Numeri pubblici per il contatore in pagina. In anteprima non si contano giocate. */
export async function GET() {
  const merchants = MERCHANTS.filter((m) => m.posActive).length;

  if (IS_DEMO) {
    return NextResponse.json({ collecting: false, merchants, prizes: TOTAL_WINNERS });
  }

  const { entries, validated } = await publicStats();
  return NextResponse.json(
    { collecting: true, entries, validated, merchants, prizes: TOTAL_WINNERS, userPrizes: PRIZES.users.winners },
    { headers: { 'Cache-Control': 'public, max-age=30' } }
  );
}
