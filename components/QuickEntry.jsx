'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import EntryForm from './EntryForm';
import RulesModal from './RulesModal';
import LiveStats from './LiveStats';
import SourceTracker from './SourceTracker';
import LanguageSwitch from './LanguageSwitch';
import { NakaLogo } from './Brand';
import { CONTEST } from '@/lib/constants';
import { formatDate, getDictionary, localePath } from '@/lib/i18n';

/**
 * Pagina di atterraggio del QR stampato: solo il form.
 *
 * Esiste separata dalla landing perché chi inquadra il codice è in piedi alla cassa con
 * trenta secondi: la home completa gli farebbe scaricare mappa, premi e FAQ prima di
 * mostrargli il primo campo. Qui non si importa nulla di pesante, nemmeno l'elenco merchant.
 */
export default function QuickEntry({ locale }) {
  const t = getDictionary(locale);
  // Il modulo chiede di accettare il regolamento: deve potersi aprire anche qui, non solo in home.
  // Chi arriva dal QR stampato non passa mai dalla home.
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <SourceTracker />
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
          <Link href={localePath(locale)} aria-label={t.nav.home}>
            <NakaLogo id="quick" locale={locale} />
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.quick.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{t.quick.intro}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-btc/30 bg-btc/10 px-4 py-1.5 text-xs font-semibold text-btc">
            <Clock className="h-3.5 w-3.5" />
            {t.quick.deadline(formatDate(CONTEST.validTo, locale))}
          </p>
          <LiveStats t={t.stats} locale={locale} className="mt-5" />
        </div>

        <EntryForm t={t.form} locale={locale} compact onOpenRules={() => setRulesOpen(true)} />

        <div className="mt-10 text-center">
          <Link
            href={localePath(locale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-btc underline-offset-4 hover:underline"
          >
            {t.quick.backToSite}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <RulesModal t={t} locale={locale} open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
