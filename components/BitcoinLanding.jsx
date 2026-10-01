'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Store,
  Trophy,
  Upload,
} from 'lucide-react';
import AssetMark from './AssetMark';
import PaymentNetworks from './PaymentNetworks';
import Countdown from './Countdown';
import Footer from './Footer';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { PoweredBadge } from './Brand';
import { CONTEST, EVENT, PAYMENT_ASSETS, assetSentence } from '@/lib/constants';
import {
  BITCOIN_CONTEST,
  BTC_FALLBACK,
  BTC_PRICE_URL,
  BTC_PRIZES,
  BTC_TOTAL_SATS,
  BTC_TOTAL_WINNERS,
  SATS_PER_BTC,
  formatBtc,
  formatSats,
} from '@/lib/bitcoin';
import { MERCHANTS } from '@/lib/merchants';
import { formatDateTime } from '@/lib/i18n';

/**
 * Variante Bitcoin della landing: stessa iniziativa, stesse date, stessi negozi, premi in
 * satoshi invece che in Tether Gold.
 *
 * È una pagina a sé e non una versione parametrica di quella in oro: le due campagne sono
 * alternative fra cui scegliere, non due cose da mandare avanti insieme, e tenere separati
 * i due testi costa meno che rendere configurabile ogni frase della landing principale.
 * Le date, gli asset accettati e i contatti restano condivisi da `lib/constants.js`.
 */
export default function BitcoinLanding() {
  const posActive = MERCHANTS.filter((m) => m.posActive).length;
  const week = CONTEST.weekLabel;

  const steps = [
    {
      icon: CreditCard,
      title: 'Paga in crypto',
      text: `In uno dei negozi aderenti di Lugano con POS NAKA, in ${assetSentence('o')}.`,
    },
    {
      icon: FileCheck2,
      title: 'Registra lo scontrino',
      text: 'Email, ultime 6 cifre del numero transazione, importo e foto della ricevuta.',
    },
    {
      icon: Trophy,
      title: 'Vinci satoshi',
      text: `${BTC_TOTAL_WINNERS} premi estratti il 24 ottobre con procedura verificabile da chiunque.`,
    },
  ];

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <span className="inline-flex items-center gap-3">
            <AssetMark code="BTC" className="h-10 w-10 shrink-0" />
            <span className="flex flex-col gap-1 leading-none">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-sm">
                Pay on NAKA
              </span>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#F7931A] sm:text-sm">
                Win Satoshi
              </span>
            </span>
          </span>
          <PoweredBadge className="hidden sm:inline-flex" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:px-8">
        {/* Hero */}
        <section className="grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                Lugano
              </span>
              <span className="chip">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {week}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Paga in Crypto a Lugano e vinci{' '}
              <span className="text-[#F7931A]">BITCOIN</span>
            </h1>

            <div className="mt-7 max-w-xl space-y-4 text-base leading-relaxed text-muted">
              <p>
                Nella settimana del {EVENT.name}, {week}, paga in crypto nei negozi aderenti di Lugano con
                POS NAKA — in {assetSentence('o')} — e registra lo scontrino sul sito: trenta secondi,
                nessuna app da scaricare.
              </p>
              <p>
                In palio <strong className="text-white">{formatSats(BTC_TOTAL_SATS)}</strong>, cioè{' '}
                {formatBtc(BTC_TOTAL_SATS)}, divisi in {BTC_TOTAL_WINNERS} premi. L’estrazione è il{' '}
                {formatDateTime(CONTEST.drawDate, 'it')}, sull’hash di un blocco Bitcoin annunciato prima:
                chiunque può rifare il calcolo e ottenere gli stessi vincitori.
              </p>
            </div>

            <div className="mt-9">
              <Countdown
                startsAt={CONTEST.validFrom}
                endsAt={CONTEST.validTo}
                t={{
                  loading: 'Calcolo…',
                  toStart: 'Mancano al via dell’iniziativa',
                  running: 'Iniziativa in corso — tempo residuo per giocare',
                  ended: 'Registrazioni chiuse',
                  days: 'Giorni',
                  hours: 'Ore',
                  minutes: 'Minuti',
                  seconds: 'Secondi',
                }}
              />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} href="/p" size="lg">
                <Upload className="h-5 w-5" />
                Carica Scontrino e TX ID
              </Button>
              <Button as={Link} href="/#mappa" variant="secondary" size="lg">
                <Store className="h-5 w-5" />
                {posActive} negozi aderenti
              </Button>
            </div>
          </div>

          <PrizeCard />
        </section>

        {/* Tre step */}
        <section className="mt-24">
          <SectionTitle
            eyebrow="Come funziona"
            title="Tre step, meno di un minuto"
            subtitle="Dal pagamento alla giocata valida senza registrazioni complesse né app da scaricare."
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <GlassCard className="h-full p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F7931A] text-white">
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </span>
                    <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </GlassCard>
              </li>
            ))}
          </ol>

          <PaymentNetworks
            title="Reti accettate per il concorso"
            note="Un pagamento su una rete diversa non rientra nel concorso."
            className="mt-8"
          />
        </section>

        {/* Montepremi */}
        <section id="montepremi" className="mt-24 scroll-mt-24">
          <SectionTitle
            eyebrow="Montepremi"
            title={`${formatSats(BTC_TOTAL_SATS)} in palio`}
            subtitle={`${BTC_TOTAL_WINNERS} premi divisi in due montepremi separati: uno per i clienti che pagano in crypto, uno per i negozi aderenti.`}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <PrizeTier
              kicker="Sezione Clienti"
              tier={BTC_PRIZES.users}
              note="Montepremi riservato ai clienti finali"
            />
            <PrizeTier
              kicker="Sezione Merchant"
              tier={BTC_PRIZES.merchants}
              note="Montepremi riservato ai negozi aderenti"
            />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted/80">
            I premi sono erogati in bitcoin sulla rete Lightning, sull’indirizzo comunicato dal vincitore.
            Il controvalore in franchi varia con il prezzo di mercato.
          </p>
        </section>

        {/* Rimando alla variante in oro */}
        <GlassCard hover={false} className="mt-16 flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            Stessa iniziativa, stesse date, stessi negozi: esiste anche la variante con i premi in Tether
            Gold, l’oro digitale.
          </p>
          <Button as={Link} href="/" variant="ghost" className="shrink-0">
            Vedi la versione in oro
            <ArrowRight className="h-4 w-4" />
          </Button>
        </GlassCard>
      </main>

      <Footer locale="it" />
    </>
  );
}

/** Scheda del montepremi con il controvalore aggiornato: 0,21 BTC non dice niente da solo. */
function PrizeCard() {
  const [price, setPrice] = useState({ ...BTC_FALLBACK, live: false });

  useEffect(() => {
    let alive = true;
    fetch('/api/btc')
      .then((r) => r.json())
      .then((d) => alive && setPrice(d))
      .catch(() => alive && setPrice({ ...BTC_FALLBACK, live: false }));
    return () => {
      alive = false;
    };
  }, []);

  const usd = price?.usd
    ? new Intl.NumberFormat('it-CH', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
        (BTC_TOTAL_SATS / SATS_PER_BTC) * price.usd
      )
    : null;

  return (
    <div className="glass relative overflow-hidden p-8 sm:p-10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F7931A]/60 to-transparent" />
      <div className="mx-auto flex h-40 w-40 animate-floaty items-center justify-center sm:h-48 sm:w-48">
        <AssetMark code="BTC" className="h-full w-full drop-shadow-[0_10px_40px_rgba(247,147,26,0.45)]" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/[0.08] px-4 py-3">
          <span className="text-xs font-semibold text-white">Montepremi</span>
          <span className="text-right">
            <span className="block text-base font-bold text-[#F7931A]">{formatSats(BTC_TOTAL_SATS)}</span>
            {usd && <span className="block text-xs text-muted">≈ {usd}</span>}
          </span>
        </div>
        <Row label="Montepremi Clienti" value={formatSats(BTC_PRIZES.users.pool)} />
        <Row label="Montepremi Merchant" value={formatSats(BTC_PRIZES.merchants.pool)} />
        <Row label="In bitcoin" value={formatBtc(BTC_TOTAL_SATS)} />
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted/80">
        1 satoshi è un centomilionesimo di bitcoin. Controvalore al{' '}
        {new Date(price.at).toLocaleDateString('it-CH')}: varia con il prezzo di mercato.{' '}
        <a
          href={BTC_PRICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gold/90 underline underline-offset-2 hover:text-gold"
        >
          Vedi il cambio aggiornato
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}

function PrizeTier({ kicker, tier, note }) {
  return (
    <GlassCard hover={false} className="p-7 sm:p-8">
      <span className="chip border-[#F7931A]/30 bg-[#F7931A]/10 text-[#F7931A]">{kicker}</span>
      <p className="mt-5 text-3xl font-extrabold text-white">{formatSats(tier.pool)}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>

      <ul className="mt-7 space-y-3">
        {tier.items.map((item) => (
          <li
            key={item.place}
            className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white">{item.place}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{item.desc}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-bold text-[#F7931A]">{formatSats(item.sats)}</span>
              {item.count > 1 && <span className="block text-[11px] text-muted">× {item.count}</span>}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-bold text-[#F7931A]">{value}</span>
    </div>
  );
}
