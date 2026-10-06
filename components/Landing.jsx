'use client';

import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Prizes from './Prizes';
import ProvableDraw from './ProvableDraw';
import EntryForm from './EntryForm';
import MerchantDirectory from './MerchantDirectory';
import Faq from './Faq';
import RulesModal from './RulesModal';
import Footer from './Footer';
import { getDictionary } from '@/lib/i18n';

/**
 * Composizione della landing, condivisa tra le due lingue.
 *
 * La home parla ai clienti. Dei commercianti resta solo il riferimento al montepremi
 * complessivo, con il rimando: premi in oro, adesione e guida stanno su /commercianti.
 *
 * Il dizionario contiene funzioni (interpolazioni), che non sono serializzabili attraverso il
 * confine server→client: per questo si passa il `locale` come stringa e il dizionario viene
 * risolto qui dentro, nel bundle client.
 */
export default function Landing({ locale }) {
  const t = getDictionary(locale);
  const [rulesOpen, setRulesOpen] = useState(false);
  const openRules = () => setRulesOpen(true);

  // Il regolamento vive qui, in una modale: le altre pagine ci arrivano con ?regolamento.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('regolamento')) setRulesOpen(true);
  }, []);

  return (
    <>
      <Navbar t={t} locale={locale} onOpenRules={openRules} />
      <main>
        <Hero t={t} locale={locale} />
        <HowItWorks t={t.how} locale={locale} />
        <Prizes t={t.prizes} locale={locale} />
        <ProvableDraw t={t.draw} locale={locale} />
        <EntryForm t={t.form} locale={locale} onOpenRules={openRules} />
        <MerchantDirectory t={t.map} locale={locale} />
        <Faq t={t.faq} />
      </main>
      <Footer locale={locale} onOpenRules={openRules} />
      <RulesModal t={t} locale={locale} open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  );
}
