import { NextResponse } from 'next/server';
import { MERCHANTS } from '@/lib/merchants';

export const runtime = 'nodejs';

/**
 * Solo i nomi dei negozi, per i suggerimenti del form.
 * Sta in una route apposta perché la pagina leggera di partecipazione non deve scaricare
 * i 123 KB dello snapshot merchant per completare un campo facoltativo.
 */
export async function GET(request) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ names: [] });

  const names = [
    ...new Set(
      MERCHANTS.filter((m) => m.posActive && m.name.toLowerCase().includes(q)).map((m) => m.name)
    ),
  ]
    .sort((a, b) => a.localeCompare(b, 'it'))
    .slice(0, 8);

  return NextResponse.json({ names }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
