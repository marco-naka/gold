import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import CircuitAdmin from '@/components/admin/CircuitAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';

/** I negozi tolti dal circuito, da rimettere se serve. Stesso accesso del pannello rilevazioni. */
export const metadata = {
  title: 'Negozi fuori circuito · pannello',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function Page() {
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
      <CircuitAdmin />
    </main>
  );
}
