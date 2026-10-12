import { NextResponse } from 'next/server';
import { ALL_MERCHANTS } from '@/lib/merchants';
import { publicMerchants } from '@/lib/server/public-merchants';

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

  // `near=1`: tutti i negozi con le coordinate, per il tasto «Vicino a me» delle rilevazioni.
  // La distanza la calcola il telefono: la posizione di chi è in giro non arriva al server.
  if (full && params.get('near') === '1') {
    const merchants = ALL_MERCHANTS.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng)).map(
      ({ id, name, address, assets, phone, category, lat, lng }) => ({ id, name, address, assets, phone, category, lat, lng }),
    );
    return NextResponse.json({ merchants }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
  }

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
      (await publicMerchants()).filter((m) => m.posActive && m.name.toLowerCase().includes(q)).map((m) => m.name)
    ),
  ]
    .sort((a, b) => a.localeCompare(b, 'it'))
    .slice(0, 8);

  return NextResponse.json({ names }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
