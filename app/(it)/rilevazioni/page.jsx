import { cookies } from 'next/headers';
import SurveyForm from '@/components/SurveyForm';
import { isAuthorized, placeholderPin } from '@/lib/server/rilevazioni-auth';

/**
 * Area interna per i rilevatori sul campo. Non è linkata da nessuna parte del sito, è esclusa
 * dalla sitemap e chiede ai motori di non indicizzarla: ci si arriva solo con l'indirizzo.
 * Davanti c'è comunque un codice, perché un URL nascosto smette di esserlo appena finisce
 * in una cronologia o in una chat.
 */
export const metadata = {
  title: 'Area rilevazioni',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  // Il cookie dura trenta giorni: chi l'ha già, entra senza ridigitare il PIN. Prima la
  // pagina chiedeva il codice a ogni apertura anche con il cookie valido.
  const locked = !isAuthorized({ cookies: cookies() });
  return (
    <main className="min-h-screen">
      <SurveyForm locked={locked} pinHint={locked ? placeholderPin() : null} />
    </main>
  );
}
