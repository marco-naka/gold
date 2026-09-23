import Link from 'next/link';
import { Mail, Zap, TrendingUp, Trophy, Video } from 'lucide-react';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import { MAILTO_MERCHANT, PRIZES, formatXaut } from '@/lib/constants';

const PERKS = [
  { icon: Zap, text: 'Zero procedure: rispondi all’email di invito NAKA' },
  { icon: TrendingUp, text: 'Visibilità sulla mappa ufficiale del concorso' },
  { icon: Trophy, text: `${formatXaut(PRIZES.merchants.pool)} di premi riservati ai merchant aderenti` },
];

export default function MerchantB2B() {
  return (
    <section id="merchant" className="section-pad">
      <GlassCard hover={false} className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-[90px]"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <span className="chip border-gold/30 bg-gold/10 text-gold">Area Commercianti</span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Sei un commerciante di <span className="text-gold-gradient">Lugano</span>?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Per aderire non serve alcuna procedura complessa: ti basta rispondere direttamente
              all&apos;email di invito ricevuta da NAKA e tenere acceso il tuo POS.
            </p>

            <ul className="mt-8 space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-muted">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={MAILTO_MERCHANT} size="lg">
                <Mail className="h-5 w-5" />
                Invia Email di Adesione
              </Button>
              <Button as={Link} href="/best-social-video" variant="secondary" size="lg">
                <Video className="h-5 w-5" />
                Premio Best Social Video
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-deep/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Checklist adesione</p>
            <ol className="mt-5 space-y-4">
              {[
                'Rispondi all’email di invito NAKA confermando i dati dell’attività.',
                'Verifica che il POS NAKA sia acceso e aggiornato.',
                'Esponi il materiale promozionale che riceverai dal team.',
                'Incassa in crypto durante la settimana del forum: ogni transazione conta.',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-muted">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-[11px] font-bold text-gold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
