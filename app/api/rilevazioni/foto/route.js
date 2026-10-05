import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isAdmin } from '@/lib/server/rilevazioni-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

// La chiave è quella salvata con la visita (`rilevazioni/2026/RV-2026-AB12CD-vetrina.jpg`).
// Si accetta solo quella forma: niente `..`, niente percorsi arbitrari sul disco.
const KEY = /^rilevazioni\/\d{4}\/RV-\d{4}-[A-Z0-9]{6}-[a-z0-9-]+\.(jpg|png|webp|heic|bin)$/;
const TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', bin: 'application/octet-stream' };

/** Le foto delle rilevazioni, solo per l'admin: dentro ci sono vetrine, terminali e ricevute. */
export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ code: 'forbidden' }, { status: 403 });

  const key = request.nextUrl.searchParams.get('key') || '';
  const m = KEY.exec(key);
  if (!m) return NextResponse.json({ code: 'bad_request' }, { status: 400 });

  try {
    const body = await readFile(join(DATA_DIR, key));
    return new NextResponse(body, {
      headers: { 'Content-Type': TYPES[m[1]], 'Cache-Control': 'private, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ code: 'not_found' }, { status: 404 });
  }
}
