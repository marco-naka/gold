import { Upload, MapPin, ShieldCheck, Zap, Store, CalendarDays } from 'lucide-react';
import Countdown from './Countdown';
import Button from './ui/Button';
import { XautBadge } from './Brand';
import { CONTEST, EVENT, PAYMENT_ASSETS, PRIZES, TOTAL_POOL, formatXaut } from '@/lib/constants';
import { MERCHANTS } from '@/lib/merchants';

const STATS = [
  { icon: Store, value: `${MERCHANTS.filter((m) => m.posActive).length}`, label: 'Merchant con POS NAKA a Lugano' },
  {
    icon: Zap,
    value: String(PAYMENT_ASSETS.length),
    label: `Asset accettati: ${PAYMENT_ASSETS.map((a) => a.short).join(', ')}`,
  },
  { icon: ShieldCheck, value: formatXaut(TOTAL_POOL), label: 'Montepremi totale in Oro Digitale' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      {/* Bagliori decorativi di sfondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-96 w-96 rounded-full bg-gold-warm/5 blur-[100px]"
      />

      <div className="section-pad relative !pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <XautBadge />
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {EVENT.venue}
              </span>
              <span className="chip">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {CONTEST.weekLabel}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Paga in Crypto a Lugano e vinci{' '}
              <span className="text-gold-gradient">ORO Digitale!</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Paga i tuoi acquisti in crypto nei negozi convenzionati con POS NAKA durante il{' '}
              <span className="font-semibold text-white">{EVENT.name}</span> e partecipa
              all&apos;estrazione di premi in <span className="font-semibold text-white">Tether Gold (XAUT)</span>.
            </p>

            <div className="mt-9">
              <Countdown startsAt={CONTEST.validFrom} endsAt={CONTEST.validTo} />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="#partecipa" size="lg" className="animate-pulse-gold">
                <Upload className="h-5 w-5" />
                Carica Scontrino e TX ID
              </Button>
              <Button as="a" href="#mappa" variant="secondary" size="lg">
                <MapPin className="h-5 w-5" />
                Trova Negozi Aderenti
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-lg font-bold leading-none text-white">{value}</dt>
                    <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual: lingotto/token XAUT stilizzato */}
          <div className="relative mx-auto w-full max-w-sm animate-fade-up lg:max-w-none">
            <div className="glass relative overflow-hidden p-8 sm:p-10">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="mx-auto flex h-44 w-44 animate-floaty items-center justify-center rounded-full bg-gold-gradient shadow-gold sm:h-52 sm:w-52">
                <div className="grid h-[88%] w-[88%] place-items-center rounded-full bg-ink-deep">
                  <span className="text-4xl font-black text-gold-gradient sm:text-5xl">XAUT</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Row label="Montepremi Clienti" value={formatXaut(PRIZES.users.pool)} />
                <Row label="Montepremi Merchant" value={formatXaut(PRIZES.merchants.pool)} />
                <Row label="Asset del premio" value="Tether Gold · 1 XAUT = 1 oz oro" />
              </div>

              <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/80">
                XAUT è un token garantito da oro fisico custodito in Svizzera. Il valore in CHF può variare
                con il mercato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-bold text-gold">{value}</span>
    </div>
  );
}
