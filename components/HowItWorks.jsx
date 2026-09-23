import { CreditCard, FileCheck2, Trophy, Wallet, ExternalLink, BookOpen } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { OFFICIAL_GUIDE, WALLETS } from '@/lib/wallets';
import { assetSentence } from '@/lib/constants';

const ICONS = [CreditCard, FileCheck2, Trophy];

export default function HowItWorks({ t, conj, locale = 'it' }) {
  // La guida ufficiale esiste in IT e EN: si offre prima quella della lingua corrente.
  const other = locale === 'en' ? 'it' : 'en';
  const steps = t.steps(assetSentence(conj));

  return (
    <section id="come-funziona" className="section-pad">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* Linea di collegamento tra gli step (solo desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent md:block"
        />
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? Trophy;
          return (
            <li key={step.title} className="relative">
              <GlassCard className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-ink-deep shadow-gold-sm">
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-5xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </GlassCard>
            </li>
          );
        })}
      </ol>

      {/* Come si paga sui POS: si rimanda alla guida ufficiale del circuito invece di duplicarla. */}
      <GlassCard hover={false} className="mt-8 p-7 sm:p-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-lg">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <BookOpen className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{t.guideTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.guideText}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <Wallet className="h-3.5 w-3.5 text-gold" />
              {t.guideWallets}
              {WALLETS.map((w, i) => (
                <span key={w.name}>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold/90 underline underline-offset-2 hover:text-gold"
                  >
                    {w.name}
                  </a>
                  {i < WALLETS.length - 1 && <span aria-hidden="true"> ·</span>}
                </span>
              ))}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Button as="a" href={OFFICIAL_GUIDE[locale] ?? OFFICIAL_GUIDE.it} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.guideCta}
            </Button>
            <Button
              as="a"
              href={OFFICIAL_GUIDE[other]}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="justify-center"
            >
              {t.guideCtaOther}
            </Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
