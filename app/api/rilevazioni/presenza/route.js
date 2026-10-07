import { NextResponse } from 'next/server';
import { currentOperator, isAdmin } from '@/lib/server/rilevazioni-auth';
import { allDrafts, presenceNow, syncDrafts, touch } from '@/lib/server/presence';
import { persistentStorage } from '@/lib/server/persistence';
import { HOUR, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Il segnale del modulo rilevazioni (POST, ogni 30 secondi mentre è aperto) e la vista
 * dell'admin (GET). Sta su un indirizzo suo perché ha un limite suo: con quello generale delle
 * rilevazioni, 60 richieste l'ora, i segnali avrebbero bloccato gli invii veri.
 */
const PER_IP = { max: 400, windowMs: HOUR };
const MAX_BODY = 512 * 1024;

export async function POST(request) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) {
    return NextResponse.json({ code: 'bad_request' }, { status: 413 });
  }
  if (hit(`presenza:${clientIp(request)}`, PER_IP)) return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  const operator = currentOperator(request);
  if (!operator) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  }
  touch(operator, { activity: body?.activity ?? null, visible: body?.visible, closing: body?.closing === true });
  if (Array.isArray(body?.drafts) && persistentStorage()) await syncDrafts(operator, body.drafts);
  return NextResponse.json({ ok: true });
}

export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  return NextResponse.json(
    { presence: presenceNow(), drafts: await allDrafts() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
