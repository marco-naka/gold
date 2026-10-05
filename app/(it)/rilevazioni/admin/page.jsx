import { cookies } from 'next/headers';
import RilevazioniAdmin, { AdminGate } from '@/components/RilevazioniAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';
import { listVisits } from '@/lib/server/visits';

/**
 * Pannello dell'admin: tutte le rilevazioni, con filtri, agenda dei ritorni e foto.
 * Come l'area rilevazioni non è linkato dal sito e non si indicizza; in più chiede che il
 * PIN sia di un nome elencato in `RILEVAZIONI_ADMIN`.
 */
export const metadata = {
  title: 'Rilevazioni · pannello',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  // `currentOperator` e `isAdmin` leggono il cookie da `request.cookies`: qui la richiesta
  // è implicita, e `cookies()` espone la stessa `get(name)`.
  const request = { cookies: cookies() };

  if (!isAdmin(request)) {
    return (
      <main className="min-h-screen">
        <AdminGate signedInAs={currentOperator(request)} pinHint={placeholderPin()} />
      </main>
    );
  }

  const visits = await listVisits();
  return (
    <main className="min-h-screen">
      <RilevazioniAdmin visits={visits} operator={currentOperator(request) || ''} />
    </main>
  );
}
