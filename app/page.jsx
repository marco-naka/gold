'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DualInitiative from '@/components/DualInitiative';
import HowItWorks from '@/components/HowItWorks';
import Prizes from '@/components/Prizes';
import EntryForm from '@/components/EntryForm';
import MerchantMap from '@/components/MerchantMap';
import MerchantB2B from '@/components/MerchantB2B';
import Faq from '@/components/Faq';
import RulesModal from '@/components/RulesModal';
import Footer from '@/components/Footer';

export default function Page() {
  // Il regolamento è raggiungibile da navbar, form e footer: lo stato vive qui.
  const [rulesOpen, setRulesOpen] = useState(false);
  const openRules = () => setRulesOpen(true);

  return (
    <>
      <Navbar onOpenRules={openRules} />
      <main>
        <Hero />
        <DualInitiative />
        <HowItWorks />
        <Prizes />
        <EntryForm onOpenRules={openRules} />
        <MerchantMap />
        <MerchantB2B />
        <Faq />
      </main>
      <Footer onOpenRules={openRules} />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  );
}
