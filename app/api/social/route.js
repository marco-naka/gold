import { NextResponse } from 'next/server';
import { MERCHANTS } from '@/lib/merchants';
import { socialOpen, validateSocialLink } from '@/lib/social-links';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { listSocialLinks, saveSocialLink } from '@/lib/server/social';
import { persistentStorage } from '@/lib/server/persistence';
import { HOUR, globalLimit, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';
import { TIME_ZONE, todayInZurich } from '@/lib/time';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Link ai contenuti social dei commercianti.
 *
 * POST, pubblico: dal modulo dell'area commercianti, un negozio dell'elenco e il link al
 *                 contenuto. È la segnalazione che il regolamento chiede (art. 6-quater).
 * GET,  admin:    l'elenco per il pannello; ?export=csv per scaricarlo.
 */

const MERCHANT_IDS = new Set(MERCHANTS.map((m) => m.id));
const byId = new Map(MERCHANTS.map((m) => [m.id, m]));
const PER_IP = { max: 30, windowMs: HOUR };

const withShop = (l) => ({ ...l, merchantName: byId.get(l.merchantId)?.name ?? l.merchantId, address: byId.get(l.merchantId)?.address ?? '' });

export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  const links = (await listSocialLinks()).map(withShop).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (request.nextUrl.searchParams.get('export') === 'csv') {
    // Le celle che iniziano con = + - @ diventerebbero formule in Excel: si neutralizzano.
    const esc = (v) => {
      const s = String(v ?? '');
      const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
      return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
    };
    const when = (iso) =>
      new Date(iso).toLocaleString('it-CH', { timeZone: TIME_ZONE, dateStyle: 'short', timeStyle: 'short' });
    const rows = [
      ['Data', 'Negozio', 'Indirizzo', 'Piattaforma', 'Link', 'Email', 'ID negozio', 'ID'],
      ...links.map((l) => [when(l.createdAt), l.merchantName, l.address, l.platform, l.url, l.email ?? '', l.merchantId, l.id]),
    ];
    return new NextResponse(`﻿${rows.map((r) => r.map(esc).join(',')).join('\r\n')}\r\n`, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="link-social-${todayInZurich()}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }
  return NextResponse.json({ links }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  if (!persistentStorage()) return NextResponse.json({ code: 'storage_unavailable' }, { status: 503 });
  if (!socialOpen()) return NextResponse.json({ code: 'closed' }, { status: 403 });
  if (hit(`social:${clientIp(request)}`, PER_IP) || globalLimit('social', 120)) {
    return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 'invalid' }, { status: 400 });
  }
  // Campo nascosto: lo compilano solo i bot.
  if (String(body?.company ?? '').trim()) return NextResponse.json({ ok: true }, { status: 201 });

  const { errors, value } = validateSocialLink(body ?? {}, MERCHANT_IDS);
  if (errors) return NextResponse.json({ code: 'invalid', errors }, { status: 422 });

  const saved = await saveSocialLink({
    ...value,
    locale: body.locale === 'en' ? 'en' : 'it',
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json(
    { ok: true, duplicate: saved.duplicate, merchantName: byId.get(value.merchantId)?.name ?? '', platform: value.platform },
    { status: saved.duplicate ? 200 : 201 },
  );
}
