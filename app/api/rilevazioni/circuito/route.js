import { NextResponse } from 'next/server';
import { ALL_MERCHANTS, MERCHANT_EXCLUSIONS } from '@/lib/merchants';
import { currentOperator, isAdmin, isAuthorized } from '@/lib/server/rilevazioni-auth';
import { exclusionState, excludeMerchant, restoreMerchant } from '@/lib/server/merchant-exclusions';
import { persistentStorage } from '@/lib/server/persistence';
import { HOUR, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PER_IP = { max: 60, windowMs: HOUR };

/**
 * Negozi fuori dal circuito.
 *
 * GET:  per chi rileva. `excluded` sono quelli tolti da qui (si possono rimettere), `fixed`
 *       quelli tolti con un aggiornamento del sito (`merchants.overrides.json`), `history` lo
 *       storico dei cambi.
 * POST: `{ action: 'exclude', merchantId, reason }` lo toglie dall'elenco pubblico, per ogni
 *       rilevatore; `{ action: 'restore', merchantId }` lo rimette, solo per l'admin.
 */
export async function GET(request) {
  if (!isAuthorized(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });
  const { excluded, history } = await exclusionState();
  const fixed = Object.fromEntries(Object.entries(MERCHANT_EXCLUSIONS).map(([id, e]) => [id, { name: e.name, reason: e.reason, at: e.at ?? null }]));
  return NextResponse.json(
    { excluded, fixed, history: isAdmin(request) ? history.slice(-200).reverse() : [] },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request) {
  if (!isAuthorized(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });
  if (hit(`circuito:${clientIp(request)}`, PER_IP)) return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  if (!persistentStorage()) return NextResponse.json({ code: 'storage_unavailable' }, { status: 503 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  }
  const merchant = ALL_MERCHANTS.find((m) => m.id === body?.merchantId);
  if (!merchant) return NextResponse.json({ code: 'unknown_merchant' }, { status: 404 });
  if (MERCHANT_EXCLUSIONS[merchant.id]) return NextResponse.json({ code: 'fixed' }, { status: 409 });
  const by = currentOperator(request) || 'codice condiviso';

  if (body.action === 'exclude') {
    const result = await excludeMerchant({ id: merchant.id, name: merchant.name, reason: body.reason, by });
    if (!result.ok) return NextResponse.json({ code: result.code }, { status: result.code === 'already_excluded' ? 409 : 422 });
    console.info(`[circuito] ${merchant.name} tolto dall'elenco da ${by}: ${result.exclusion.reason}`);
    return NextResponse.json({ ok: true, exclusion: result.exclusion });
  }

  if (body.action === 'restore') {
    if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
    const result = await restoreMerchant({ id: merchant.id, by });
    if (!result.ok) return NextResponse.json({ code: result.code }, { status: 409 });
    console.info(`[circuito] ${merchant.name} rimesso in elenco da ${by}`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ code: 'bad_request' }, { status: 400 });
}
