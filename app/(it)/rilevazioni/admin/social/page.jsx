import { cookies } from 'next/headers';
import { AdminGate } from '@/components/RilevazioniAdmin';
import SocialLinksAdmin from '@/components/SocialLinksAdmin';
import { currentOperator, isAdmin, placeholderPin } from '@/lib/server/rilevazioni-auth';
import { adminSocialLinks } from '@/lib/server/social';

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
  const links = await adminSocialLinks();
  return (
    <main className="min-h-screen">
      <SocialLinksAdmin initial={links} />
    </main>
  );
}
