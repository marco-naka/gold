import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import SocialLinksAdmin from '@/components/SocialLinksAdmin';
import { MERCHANTS } from '@/lib/merchants';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';
import { listSocialLinks } from '@/lib/server/social';

/**
 * I link social segnalati dai commercianti. Stesso accesso del pannello rilevazioni: un PIN
 * di un nome elencato in `RILEVAZIONI_ADMIN`. Non linkato dal sito e non indicizzato.
 */
export const metadata = {
  title: 'Link social · pannello',
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
  const byId = new Map(MERCHANTS.map((m) => [m.id, m]));
  const links = (await listSocialLinks())
    .map((l) => ({ ...l, merchantName: byId.get(l.merchantId)?.name ?? l.merchantId, address: byId.get(l.merchantId)?.address ?? '' }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <main className="min-h-screen">
      <SocialLinksAdmin initial={links} />
    </main>
  );
}
