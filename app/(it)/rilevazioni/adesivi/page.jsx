import { cookies } from 'next/headers';
import StickerApp, { StickerGate } from '@/components/StickerApp';
import { isAdmin } from '@/lib/server/rilevazioni-auth';
import { isStickerSession } from '@/lib/server/adesivi-auth';

/**
 * Area di chi monta gli adesivi in vetrina. Si entra con il PIN degli adesivi
 * (`RILEVAZIONI_ADESIVI_PIN`) o da admin. Non linkata, non indicizzata.
 */
export const metadata = {
  title: 'Adesivi e materiale',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const request = { cookies: cookies() };
  const allowed = isStickerSession(request) || isAdmin(request);
  return <main className="min-h-screen">{allowed ? <StickerApp /> : <StickerGate />}</main>;
}
