import { NextResponse } from 'next/server';
import { ALL_MERCHANTS, MERCHANTS } from '@/lib/merchants';

export const runtime = 'nodejs';

/**
 * Solo i nomi dei negozi, per i suggerimenti del form.
 * Sta in una route apposta perché la pagina leggera di partecipazione non deve scaricare
 * i 123 KB dello snapshot merchant per completare un campo facoltativo.
 */
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const q = (params.get('q') ?? '').trim().toLowerCase();
  // `full=1` serve all'area rilevazioni, che dei negozi ha bisogno anche di id e indirizzo
  // per agganciare la visita allo snapshot. Il form dei clienti continua a ricevere i soli nomi.
  const full = params.get('full') === '1';
  if (q.length < 2) return NextResponse.json(full ? { merchants: [] } : { names: [] });

  if (full) {
    // Qui si cerca nell'elenco completo: un negozio escluso va comunque ritrovato
    // dal rilevatore che ci torna, altrimenti la seconda visita non si può registrare.
    const merchants = ALL_MERCHANTS.filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(({ id, name, address, assets, phone, category }) => ({ id, name, address, assets, phone, category }));
    return NextResponse.json({ merchants });
  }

  const names = [
    ...new Set(
      MERCHANTS.filter((m) => m.posActive && m.name.toLowerCase().includes(q)).map((m) => m.name)
    ),
  ]
    .sort((a, b) => a.localeCompare(b, 'it'))
    .slice(0, 8);

  return NextResponse.json({ names }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
