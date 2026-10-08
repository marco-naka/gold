import { NextResponse } from 'next/server';
import { currentOperator, isAdmin } from '@/lib/server/rilevazioni-auth';
import { adminEntries, entriesCsv, setEntryStatus } from '@/lib/server/entries-admin';
import { hasCommitment } from '@/lib/server/draw';
import { sourceReport } from '@/lib/server/stats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const forbidden = () => NextResponse.json({ code: 'forbidden' }, { status: 403 });

/**
 * GET              → tutte le giocate, la conversione per sorgente e se l'impegno c'è già
 * GET ?export=csv  → le stesse giocate in CSV
 * Solo admin: qui ci sono email e numeri di transazione.
 */
export async function GET(request) {
  if (!isAdmin(request)) return forbidden();
  const entries = await adminEntries();
  if (new URL(request.url).searchParams.get('export') === 'csv') {
    const day = new Date().toISOString().slice(0, 10);
    return new NextResponse(entriesCsv(entries), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="giocate-${day}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }
  const [sources, committed] = await Promise.all([sourceReport(), hasCommitment()]);
  return NextResponse.json({ entries, sources, committed }, { headers: { 'Cache-Control': 'no-store' } });
}

/** { id, status, reason?, note?, paidAt? }: convalida, respinge o rimette in verifica. */
export async function POST(request) {
  if (!isAdmin(request)) return forbidden();
  const body = await request.json().catch(() => ({}));
  const res = await setEntryStatus(String(body.id ?? ''), String(body.status ?? ''), {
    by: currentOperator(request) || 'admin',
    reason: String(body.reason ?? ''),
    note: String(body.note ?? ''),
    paidAt: String(body.paidAt ?? ''),
  });
  if (!res.ok) return NextResponse.json({ code: res.error }, { status: res.error === 'not_found' ? 404 : 422 });
  return NextResponse.json({ ok: true });
}
