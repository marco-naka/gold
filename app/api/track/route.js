import { NextResponse } from 'next/server';
import { IS_DEMO } from '@/lib/deploy';
import { recordVisit } from '@/lib/server/stats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Conteggio anonimo delle aperture per sorgente (parametro `?s=` dei QR).
 * Nessun cookie, nessun IP, nessun identificatore: solo un contatore per etichetta.
 */
export async function POST(request) {
  if (IS_DEMO) return new NextResponse(null, { status: 204 });
  try {
    const { source } = await request.json();
    await recordVisit(source);
  } catch {
    // Un conteggio perso non è un errore da mostrare a nessuno.
  }
  return new NextResponse(null, { status: 204 });
}
