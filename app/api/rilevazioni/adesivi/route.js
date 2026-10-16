import { NextResponse } from 'next/server';
import { ALL_MERCHANTS, MERCHANT_EXCLUSIONS } from '@/lib/merchants';
import { NAME_MAX, NAME_MIN, stickerShops, stickerStatus } from '@/lib/stickers';
import { MAX_PHOTO_BYTES } from '@/lib/survey-validation';
import { sniffImage } from '@/lib/server/image-sniff';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { isStickerSession } from '@/lib/server/adesivi-auth';
import { excludedIds } from '@/lib/server/merchant-exclusions';
import { listVisits } from '@/lib/server/visits';
import { listStickers, newStickerId, saveSticker, storeStickerPhoto } from '@/lib/server/stickers';
import { persistentStorage } from '@/lib/server/persistence';
import { HOUR, globalLimit, hit } from '@/lib/server/rate-limit';
import { clientIp } from '@/lib/server/client-ip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Area adesivi: chi monta gli adesivi (PIN `RILEVAZIONI_ADESIVI_PIN`) e l'admin.
 *
 * GET           → i negozi da mostrare, con l'ultimo passaggio di ciascuno
 * GET ?all=1    → (solo admin) anche tutti i passaggi, per il pannello
 * POST          → un passaggio: foto della vetrina con l'adesivo, «non l'ha voluto» o «chiuso»
 */
const allowed = (request) => isStickerSession(request) || isAdmin(request);

async function currentShops() {
  const excluded = new Set([...Object.keys(MERCHANT_EXCLUSIONS), ...(await excludedIds())]);
  const [visits, stickers] = await Promise.all([listVisits(), listStickers()]);
  return { shops: stickerShops({ merchants: ALL_MERCHANTS, excluded, visits, stickers }), stickers };
}

export async function GET(request) {
  if (!allowed(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });
  const { shops, stickers } = await currentShops();
  const all = request.nextUrl.searchParams.get('all') === '1';
  if (all && !isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  // Chi monta vede il proprio elenco; le foto restano dell'admin, che le apre dal pannello.
  const visible = all ? shops : shops.map((s) => (s.sticker ? { ...s, sticker: { ...s.sticker, photo: null } } : s));
  return NextResponse.json(
    { shops: visible, ...(all ? { stickers: [...stickers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) } : {}) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

const MAX_BODY_BYTES = 12 * 1024 * 1024;
const PER_IP = { max: 120, windowMs: HOUR };

export async function POST(request) {
  if (!allowed(request)) return NextResponse.json({ code: 'unauthorized' }, { status: 401 });
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ code: 'too_large' }, { status: 413 });
  }
  if (hit(`adesivi:${clientIp(request)}`, PER_IP) || globalLimit('adesivi', 60)) {
    return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
  }
  // Meglio rifiutare che salvare su un disco che il prossimo deploy cancella.
  if (!persistentStorage()) return NextResponse.json({ code: 'storage_unavailable' }, { status: 503 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  }

  const merchantId = String(form.get('merchantId') || '').trim();
  const status = String(form.get('status') || '').trim();
  const by = String(form.get('by') || '').trim().replace(/\s+/g, ' ');

  const errors = {};
  if (!stickerStatus(status)) errors.status = 'invalid';
  if (by.length < NAME_MIN || by.length > NAME_MAX) errors.by = 'invalid';

  // Solo un negozio dell'elenco degli adesivi: niente id inventati, niente negozi fuori circuito.
  const { shops } = await currentShops();
  const shop = shops.find((s) => s.id === merchantId);
  if (!shop) errors.merchantId = 'unknown';

  // La foto serve solo per «montato», e lì è obbligatoria: è la prova dell'adesivo in vetrina.
  let image = null;
  const file = form.get('photo');
  const hasFile = file && typeof file !== 'string' && file.size > 0;
  if (status === 'montato') {
    if (!hasFile) errors.photo = 'required';
    else if (file.size > MAX_PHOTO_BYTES) errors.photo = 'too_large';
    else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const kind = sniffImage(buffer);
      if (!kind) errors.photo = 'not_image';
      else image = { buffer, kind };
    }
  }

  if (Object.keys(errors).length) return NextResponse.json({ code: 'invalid_fields', errors }, { status: 422 });

  const id = newStickerId();
  const photo = image ? await storeStickerPhoto(image, id) : null;
  if (status === 'montato' && !photo) return NextResponse.json({ code: 'photo_not_saved' }, { status: 500 });

  const record = {
    id,
    createdAt: new Date().toISOString(),
    merchantId: shop.id,
    merchantName: shop.name,
    group: shop.group,
    status,
    by,
    ...(photo ? { photo } : {}),
  };
  await saveSticker(record);
  console.info(`[adesivi] ${shop.name}: ${status} (${by}, ${id})`);

  return NextResponse.json({ ok: true, id, sticker: { id, status, at: record.createdAt, by, photo: null } });
}
