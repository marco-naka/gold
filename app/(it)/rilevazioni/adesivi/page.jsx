import { cookies } from 'next/headers';
import StickerApp, { StickerGate } from '@/components/StickerApp';
import { canUseStickers } from '@/lib/server/adesivi-auth';
import { currentOperator } from '@/lib/server/rilevazioni-auth';

/**
 * Area adesivi e materiale. Si entra con il PIN degli adesivi (`RILEVAZIONI_ADESIVI_PIN`),
 * con quello di un rilevatore o da admin. Non linkata, non indicizzata.
 */
export const metadata = {
  title: 'Adesivi e materiale',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const request = { cookies: cookies() };
  const allowed = canUseStickers(request);
  // Chi entra col suo PIN da rilevatore firma i passaggi con il suo nome, senza scriverlo.
  const operator = currentOperator(request) || null;
  return <main className="min-h-screen">{allowed ? <StickerApp operator={operator} /> : <StickerGate />}</main>;
}
