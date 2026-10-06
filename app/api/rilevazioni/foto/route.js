import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { currentOperator, isAdmin } from '@/lib/server/rilevazioni-auth';
import { findVisit } from '@/lib/server/visits';
import { validPhotoSignature } from '@/lib/server/photo-links';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

// La chiave è quella salvata con la visita (`rilevazioni/2026/RV-2026-AB12CD-vetrina.jpg`).
// Si accetta solo quella forma: niente `..`, niente percorsi arbitrari sul disco.
const KEY = /^rilevazioni\/\d{4}\/RV-\d{4}-[A-Z0-9]{6}-[a-z0-9-]+\.(jpg|png|webp|heic|bin)$/;
const TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', bin: 'application/octet-stream' };

/**
 * Le foto delle rilevazioni: dentro ci sono vetrine, terminali e ricevute.
 * Le vede l'admin collegato, chi ha fatto la visita, oppure chi ha un link firmato e non scaduto
 * preso dal CSV.
 */
export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const key = params.get('key') || '';
  // Chi ha fatto la visita vede le proprie foto nella sua scheda; le altre restano dell'admin.
  const own = async () => {
    const me = currentOperator(request);
    const visitId = /RV-\d{4}-[A-Z0-9]{6}/.exec(key)?.[0];
    return Boolean(me && visitId && (await findVisit(visitId))?.surveyor === me);
  };
  const allowed = isAdmin(request) || validPhotoSignature(key, params.get('exp'), params.get('sig')) || (await own());
  if (!allowed) {
    // Chi apre un link dal foglio lo legge nel browser: una frase, non un JSON.
    return new NextResponse(
      'Link scaduto o non valido. Riesporta il CSV dal pannello delle rilevazioni, oppure apri la foto dal pannello.',
      { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

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
