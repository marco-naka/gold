import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { STICKER_PHOTO_KEY, stickerPhotoPath } from '@/lib/server/stickers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic' };

/** Le foto delle vetrine con l'adesivo: le apre l'admin dal pannello. */
export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });
  const key = request.nextUrl.searchParams.get('key') || '';
  const m = STICKER_PHOTO_KEY.exec(key);
  if (!m) return NextResponse.json({ code: 'bad_request' }, { status: 400 });
  try {
    const body = await readFile(stickerPhotoPath(key));
    return new NextResponse(body, { headers: { 'Content-Type': TYPES[m[1]], 'Cache-Control': 'private, max-age=3600' } });
  } catch {
    return NextResponse.json({ code: 'not_found' }, { status: 404 });
  }
}
