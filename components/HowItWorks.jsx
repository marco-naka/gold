import { CreditCard, FileCheck2, Trophy, Wallet, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react';
import PaymentNetworks from './PaymentNetworks';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { OFFICIAL_GUIDE, WALLETS } from '@/lib/wallets';
import { PAYMENT_ASSETS, assetSentence } from '@/lib/constants';

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

      {/*
        Una sezione sola con due colonne: il POS accetta due mondi diversi — Lightning, dove si
        scansiona e basta, e USD₮ on-chain, dove la rete e il gas li scegli tu. Erano due schede
        staccate e sembravano due argomenti, mentre la domanda del lettore è una: "come pago?".
      */}
      <section className="mt-16">
        <SectionTitle eyebrow={t.payEyebrow} title={t.payTitle} subtitle={t.paySubtitle} />

        <PaymentNetworks title={t.networksTitle} on={t.networkOn} note={t.networksNote} />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Lightning: la procedura non la riscriviamo, è già nella guida del circuito cittadino. */}
          <GlassCard hover={false} className="flex flex-col p-7 sm:p-8">
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

            <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
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
          </GlassCard>

          {/* USD₮ on-chain: qui la procedura la spieghiamo noi, perché non esiste altrove. */}
          <GlassCard hover={false} className="flex flex-col p-7 sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <Wallet className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{t.guideOnchainTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.guideOnchainText}</p>

            <ol className="mt-5 space-y-3">
              {t.guideOnchainSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-[11px] font-bold text-gold">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-white">{step.title}.</span> {step.text}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-auto flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/[0.06] p-4 text-xs leading-relaxed text-muted">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              {t.guideOnchainWarning}
            </p>

          </GlassCard>
        </div>
      </section>

    </section>
  );
}
