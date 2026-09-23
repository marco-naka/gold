'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import DualInitiative from './DualInitiative';
import HowItWorks from './HowItWorks';
import Prizes from './Prizes';
import EntryForm from './EntryForm';
import MerchantMap from './MerchantMap';
import MerchantB2B from './MerchantB2B';
import Faq from './Faq';
import RulesModal from './RulesModal';
import Footer from './Footer';
import { getDictionary } from '@/lib/i18n';

/**
 * Composizione della landing, condivisa tra le due lingue.
 *
 * Il dizionario contiene funzioni (interpolazioni), che non sono serializzabili attraverso il
 * confine server→client: per questo si passa il `locale` come stringa e il dizionario viene
 * risolto qui dentro, nel bundle client.
 */
export default function Landing({ locale }) {
  const t = getDictionary(locale);
  const [rulesOpen, setRulesOpen] = useState(false);
  const openRules = () => setRulesOpen(true);

  return (
    <>
      <Navbar t={t} locale={locale} onOpenRules={openRules} />
      <main>
        <Hero t={t} locale={locale} />
        <DualInitiative t={t.dual} conj={t.meta.assetsConjunction} />
        <HowItWorks t={t.how} conj={t.meta.assetsConjunction} locale={locale} />
        <Prizes t={t.prizes} locale={locale} />
        <EntryForm t={t.form} locale={locale} onOpenRules={openRules} />
        <MerchantMap t={t.map} locale={locale} />
        <MerchantB2B t={t.b2b} locale={locale} />
        <Faq t={t.faq} />
      </main>
      <Footer locale={locale} onOpenRules={openRules} />
      <RulesModal t={t} locale={locale} open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  );
}
