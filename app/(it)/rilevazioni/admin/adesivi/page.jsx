import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import StickerAdmin from '@/components/admin/StickerAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';

/** Adesivi in vetrina: stato di ogni negozio e foto. Stesso accesso del pannello rilevazioni. */
export const metadata = {
  title: 'Adesivi in vetrina · pannello',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const request = { cookies: cookies() };
  if (!isAdmin(request)) {
    return (
      <main className="min-h-screen">
        <AdminGate signedInAs={currentOperator(request)} pinHint={placeholderPin()} />
      </main>
    );
  }
  return (
    <main className="min-h-screen">
      <StickerAdmin />
    </main>
  );
}
