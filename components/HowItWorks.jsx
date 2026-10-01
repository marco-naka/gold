import {
  CreditCard,
  FileCheck2,
  Trophy,
  Wallet,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import AssetMark from './AssetMark';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { OFFICIAL_GUIDE, WALLETS } from '@/lib/wallets';
import { PAYMENT_ASSETS } from '@/lib/constants';

const ICONS = [CreditCard, FileCheck2, Trophy];

/**
 * Segnaposto grafico dei wallet: l'iniziale in una tessera.
 *
 * Non sono i marchi ufficiali — quelli non li abbiamo, e una riproduzione a memoria di un logo
 * altrui si riconosce e fa un pessimo effetto. La tessera dà alle tre voci lo stesso peso
 * visivo che darebbe un logo, e il giorno in cui arrivano gli SVG ufficiali si sostituisce qui.
 */
function WalletMark({ name }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-btc/25 bg-btc/10 text-sm font-black text-btc"
    >
      {name.charAt(0)}
    </span>
  );
}

export default function HowItWorks({ t, locale = 'it' }) {
  // La guida ufficiale esiste in IT e EN: si offre prima quella della lingua corrente.
  const other = locale === 'en' ? 'it' : 'en';
  const steps = t.steps();

  return (
    <section id="come-funziona" className="section-pad">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* Linea di collegamento tra gli step (solo desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-btc/30 to-transparent md:block"
        />
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? Trophy;
          return (
            <li key={step.title} className="relative">
              <GlassCard className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-btc-gradient text-ink-deep shadow-btc-sm">
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-5xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>

                {/*
                  I tre asset stanno qui, dentro il passo che li riguarda: chi legge «paga in
                  crypto» si sta chiedendo proprio con cosa. I marchi dicono in un colpo d'occhio
                  quello che l'elenco scritto diceva in una riga di testo; i nomi e le reti
                  restano per chi legge con uno screen reader.
                */}
                {i === 0 && (
                  <ul className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                    {PAYMENT_ASSETS.map((asset) => (
                      <li key={asset.code}>
                        <AssetMark code={asset.code} className="h-10 w-10" />
                        <span className="sr-only">
                          {asset.label} — {asset.networks.join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Lightning: la procedura non la riscriviamo, è già nella guida del circuito cittadino. */}
          <GlassCard hover={false} className="flex flex-col p-7 sm:p-8">
            {/*
              Il marchio dell'asset al posto dell'icona generica: le due schede si distinguono
              a colpo d'occhio prima ancora di leggerne il titolo, perché la differenza fra loro
              è proprio con cosa si paga.
            */}
            <AssetMark code="BTC" className="h-11 w-11" />
            <h3 className="mt-4 text-lg font-bold">{t.guideTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.guideText}</p>

            {/*
              I tre wallet erano una riga di link in fondo, dopo la spiegazione. Ma chi legge
              questa scheda ha una domanda operativa — «con cosa pago?» — e la risposta sono
              questi tre nomi: stanno in alto e hanno la loro riga ciascuno. Non è un consiglio
              nostro: è l'elenco del circuito cittadino, e il link sotto lo conferma.
            */}
            <div className="mt-5 rounded-xl border border-btc/20 bg-btc/[0.05] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-btc">
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                {t.guideWallets}
              </p>
              <ul className="mt-3 space-y-2.5">
                {WALLETS.map((w) => (
                  <li key={w.name}>
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-lg p-1.5 transition hover:bg-white/[0.04]"
                    >
                      <WalletMark name={w.name} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-sm font-semibold text-white">
                          {w.name}
                          <ExternalLink className="h-3 w-3 shrink-0 text-muted transition group-hover:text-btc" />
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{w.desc}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
              <Button
                as="a"
                href={OFFICIAL_GUIDE[locale] ?? OFFICIAL_GUIDE.it}
                target="_blank"
                rel="noopener noreferrer"
              >
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
            {/* Due marchi perché la scheda copre due asset con la stessa procedura. */}
            <div className="flex items-center gap-2">
              <AssetMark code="USDT" className="h-11 w-11" />
              <AssetMark code="XAUT" className="h-11 w-11" />
            </div>
            <h3 className="mt-4 text-lg font-bold">{t.guideOnchainTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.guideOnchainText}</p>

            <ol className="mt-5 space-y-3">
              {t.guideOnchainSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-btc/30 bg-btc/10 text-[11px] font-bold text-btc">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-white">{step.title}.</span> {step.text}
                  </p>
                </li>
              ))}
            </ol>

            {/*
              L'avvertenza è chiusa di default: riguarda il caso raro — il wallet che fa storie —
              e aperta rubava a colpo d'occhio più spazio dei tre passi che la gente deve leggere
              davvero. Un <details> la tiene a una riga e non ha bisogno di JavaScript.
            */}
            <details className="group mt-auto rounded-xl border border-btc/20 bg-btc/[0.06]">
              <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-xs font-semibold text-btc [&::-webkit-details-marker]:hidden">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {t.guideOnchainWarningLabel}
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-4 pb-4 text-xs leading-relaxed text-muted">{t.guideOnchainWarning}</p>
            </details>
          </GlassCard>
        </div>
      </section>
    </section>
  );
}
