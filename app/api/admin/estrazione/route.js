import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { drawAdminState } from '@/lib/server/draw-admin';
import { ALL_MERCHANTS } from '@/lib/merchants';
import { disqualifyWinner, verifyDraw } from '@/lib/server/draw';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const forbidden = () => NextResponse.json({ code: 'forbidden' }, { status: 403 });

/** Lo stato dell'estrazione, con vincitori e riserve: solo admin, ci sono le email. */
export async function GET(request) {
  if (!isAdmin(request)) return forbidden();
  return NextResponse.json(await drawAdminState({ merchants: ALL_MERCHANTS }), { headers: { 'Cache-Control': 'no-store' } });
}

/**
 * { action: 'disqualify', id, reason, only? } → esclude un vincitore, sale la riserva
 * { action: 'verify' }                        → ricalcola tutto e confronta
 * Il motivo dell'esclusione finisce nel risultato pubblico: niente dati personali.
 */
export async function POST(request) {
  if (!isAdmin(request)) return forbidden();
  const body = await request.json().catch(() => ({}));
  try {
    if (body.action === 'disqualify') {
      await disqualifyWinner(String(body.id ?? ''), String(body.reason ?? '').trim(), { only: body.only || null });
      return NextResponse.json({ ok: true });
    }
    if (body.action === 'verify') return NextResponse.json({ ok: true, checks: await verifyDraw() });
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ code: 'failed', message: err.message }, { status: 422 });
  }
}
