import { CONTEST, EVENT } from '@/lib/constants';
import { OG_SIZE, ogCard } from '@/lib/og-card';

export const runtime = 'nodejs';
export const alt = `${CONTEST.organizer} × ${EVENT.name} — ${EVENT.city}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

/** Stessa grafica, testo inglese: i link /en condivisi in chat si presentavano in italiano. */
export default function Image() {
  return ogCard('en');
}
