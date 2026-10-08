import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import EntriesAdmin from '@/components/admin/EntriesAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';

/** Le giocate dei clienti: elenco, scontrini, convalida. Stesso accesso del pannello rilevazioni. */
export const metadata = {
  title: 'Giocate · pannello',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const request = { cookies: cookies() };
  return (
    <main className="min-h-screen">
      {isAdmin(request) ? <EntriesAdmin /> : <AdminGate signedInAs={currentOperator(request)} pinHint={placeholderPin()} />}
    </main>
  );
}
