import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import DrawAdmin from '@/components/admin/DrawAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';

/** Estrazione clienti, Satoshi Spritz e commercianti: stato, vincitori, riserve, esclusioni. */
export const metadata = {
  title: 'Estrazione · pannello',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page({ searchParams }) {
  const request = { cookies: cookies() };
  return (
    <main className="min-h-screen">
      {isAdmin(request) ? (
        <DrawAdmin scope={searchParams?.scope ?? 'users'} />
      ) : (
        <AdminGate signedInAs={currentOperator(request)} pinHint={placeholderPin()} />
      )}
    </main>
  );
}
