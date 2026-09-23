import Link from 'next/link';
import {
  ArrowLeft,
  Video,
  Hash,
  AtSign,
  Trophy,
  Clock,
  Smartphone,
  Lightbulb,
  Ban,
  Mail,
  ScrollText,
  CheckCircle2,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import { NakaLogo, PlanBLogo } from '@/components/Brand';
import Footer from '@/components/Footer';
import { CONTEST, EVENT, PRIZES, SOCIAL_CONTEST, formatXaut } from '@/lib/constants';

export const metadata = {
  title: `Best Social Video — ${formatXaut(PRIZES.merchants.items[1].amount)} in palio | NAKA`,
  description:
    'Come partecipare al premio Best Social Video del concorso NAKA: hashtag, requisiti, criteri di valutazione e idee per il tuo video.',
  alternates: { canonical: '/best-social-video' },
};

const prize = PRIZES.merchants.items.find((i) => i.place === 'Best Social Video');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('it-CH', { day: 'numeric', month: 'long', year: 'numeric' });

const STEPS = [
  {
    icon: Video,
    title: 'Gira il video',
    text: `Da ${SOCIAL_CONTEST.specs.minSeconds} a ${SOCIAL_CONTEST.specs.maxSeconds} secondi, formato ${SOCIAL_CONTEST.specs.ratio}. Deve mostrare un pagamento in crypto sul POS NAKA nel tuo negozio.`,
  },
  {
    icon: Hash,
    title: 'Pubblica con gli hashtag',
    text: `Su ${SOCIAL_CONTEST.platforms.slice(0, 3).join(', ')} o Facebook Reels, dal profilo pubblico della tua attività, con tutti gli hashtag obbligatori nella didascalia.`,
  },
  {
    icon: AtSign,
    title: 'Tagga i profili',
    text: 'Menziona NAKA e Lugano Plan ₿ nella didascalia o nel video: serve a farci trovare il contenuto e ad amplificarne la portata.',
  },
  {
    icon: Mail,
    title: 'Segnalacelo',
    text: `Inviaci il link a ${CONTEST.merchantEmail} entro il ${fmtDate(SOCIAL_CONTEST.publishDeadline)}: è il passaggio che mette ufficialmente in gara il video.`,
  },
];

export default function BestSocialVideoPage() {
  const mailto = `mailto:${CONTEST.merchantEmail}?subject=${encodeURIComponent(
    'Best Social Video — candidatura'
  )}&body=${encodeURIComponent(
    [
      'Buongiorno Team NAKA,',
      '',
      'candido il mio video al premio Best Social Video.',
      '',
      'Nome attività: ',
      'Link al video: ',
      'Piattaforma: ',
      'Data di pubblicazione: ',
      'Referente e telefono: ',
      '',
      'Confermo di aver pubblicato il contenuto con gli hashtag richiesti e di avere il consenso delle persone riprese.',
      '',
      'Cordiali saluti,',
    ].join('\n')
  )}`;

  return (
    <>
      {/* Header essenziale: questa pagina si raggiunge dalla landing, non è una home */}
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Torna alla home del concorso">
            <NakaLogo />
          </Link>
          <PlanBLogo className="hidden sm:inline-flex" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href="/#montepremi"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna al montepremi
        </Link>

        {/* Intestazione */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
          <div>
            <span className="chip border-gold/30 bg-gold/10 text-gold">Premio riservato ai merchant</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Best <span className="text-gold-gradient">Social Video</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
              Racconta in un video come si paga in crypto nel tuo negozio e promuovi l&apos;iniziativa, che
              dura tutta la settimana del {EVENT.name}: {CONTEST.weekLabel}. Tra i video di maggior
              successo, quello che piace di più vince{' '}
              <span className="font-semibold text-white">{formatXaut(prize.amount)}</span> in Tether Gold.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={mailto}>
                <Mail className="h-4 w-4" />
                Candida il tuo video
              </Button>
              <Button as="a" href="#idee" variant="secondary">
                <Lightbulb className="h-4 w-4" />
                Vedi le idee
              </Button>
            </div>
          </div>

          <GlassCard hover={false} className="p-7">
            <dl className="space-y-4">
              <Stat icon={Trophy} label="Premio" value={formatXaut(prize.amount)} />
              <Stat icon={Clock} label="Pubblica entro" value={`venerdì ${fmtDate(SOCIAL_CONTEST.publishDeadline)}`} />
              <Stat
                icon={Smartphone}
                label="Formato"
                value={`${SOCIAL_CONTEST.specs.minSeconds}–${SOCIAL_CONTEST.specs.maxSeconds}s · ${SOCIAL_CONTEST.specs.ratio}`}
              />
            </dl>
          </GlassCard>
        </div>

        {/* Hashtag obbligatori */}
        <GlassCard hover={false} className="mt-14 p-7 sm:p-9">
          <h2 className="text-xl font-bold">Hashtag obbligatori</h2>
          <p className="mt-2 text-sm text-muted">
            Devono comparire <span className="font-semibold text-white">tutti e tre</span> nella didascalia:
            sono il criterio con cui individuiamo i video in gara. Senza, il contenuto non viene conteggiato.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIAL_CONTEST.hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 font-mono text-sm font-semibold text-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold text-white">Profili da menzionare</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOCIAL_CONTEST.mentions.map((m) => (
              <a
                key={`${m.platform}-${m.handle}`}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip transition hover:border-gold/40 hover:text-gold"
              >
                <AtSign className="h-3.5 w-3.5" />
                {m.handle}
                <span className="text-muted/80">· {m.platform}</span>
              </a>
            ))}
          </div>
        </GlassCard>

        {/* Come partecipare */}
        <section className="mt-16">
          <SectionTitle align="left" eyebrow="Come partecipare" title="Quattro passaggi" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <GlassCard className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-ink-deep">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </GlassCard>
              </li>
            ))}
          </ol>
        </section>

        {/* Come si vince: due fasi */}
        <section className="mt-16">
          <SectionTitle align="left" eyebrow="Come si vince" title="Prima il pubblico, poi la giuria" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SOCIAL_CONTEST.selection.map((phase, i) => (
              <GlassCard key={phase.phase} className="p-7">
                <div className="flex items-center justify-between">
                  <span className="chip border-gold/30 bg-gold/10 text-gold">{phase.phase}</span>
                  <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{phase.desc}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted/80">
            Tradotto: più fai girare il video, più possibilità hai di entrare in finale — ma in finale non
            vince il più visto, vince il più bello. Un contenuto curato e simpatico batte un numero alto di
            visualizzazioni, e un video perfetto che nessuno guarda non arriva nemmeno alla rosa.
          </p>
        </section>

        {/* Idee */}
        <section id="idee" className="mt-16 scroll-mt-24">
          <SectionTitle
            align="left"
            eyebrow="Spunti"
            title="Otto idee che funzionano"
            subtitle="Non serve un videomaker: bastano uno smartphone, luce decente e un'idea chiara. Prendi uno di questi format e adattalo alla tua attività."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SOCIAL_CONTEST.ideas.map((idea, i) => (
              <GlassCard key={idea.title} className="p-6">
                <span className="text-xs font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-bold">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{idea.desc}</p>
                <p className="mt-3 flex items-start gap-2 border-t border-white/5 pt-3 text-xs leading-relaxed text-muted/80">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  {idea.why}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Requisiti e cose da evitare */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 text-gold" />
              Requisiti
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {[
                `Durata tra ${SOCIAL_CONTEST.specs.minSeconds} e ${SOCIAL_CONTEST.specs.maxSeconds} secondi`,
                `Formato ${SOCIAL_CONTEST.specs.ratio}, almeno ${SOCIAL_CONTEST.specs.minResolution}`,
                'Girato nel tuo negozio, con un pagamento reale sul POS NAKA',
                'Pubblicato da un profilo pubblico della tua attività',
                `Pubblicato entro venerdì ${fmtDate(SOCIAL_CONTEST.publishDeadline)}`,
                'Contenuto originale e inedito, prodotto per questa iniziativa',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Ban className="h-5 w-5 text-red-400" />
              Da evitare
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {SOCIAL_CONTEST.avoid.map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400/80" />
                  {a}
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* Diritti */}
        <GlassCard hover={false} className="mt-16 p-7 sm:p-9">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ScrollText className="h-5 w-5 text-gold" />
            Diritti d&apos;uso e responsabilità
          </h2>
          <div className="mt-5 space-y-3 text-xs leading-relaxed text-muted">
            <p>
              Candidando il video, il merchant dichiara di esserne l&apos;autore o di averne la piena
              disponibilità e concede a {CONTEST.organizer} una licenza gratuita, non esclusiva e limitata
              al periodo dell&apos;iniziativa per ripubblicarlo sui propri canali, citando l&apos;attività.
            </p>
            <p>
              È responsabilità del merchant raccogliere il consenso delle persone riprese e utilizzare
              soltanto musica libera da diritti. {CONTEST.organizer} può escludere in qualsiasi momento i
              contenuti che violino i termini delle piattaforme, la normativa svizzera sulla protezione dei
              dati o il buon nome dell&apos;iniziativa.
            </p>
            <p>
              Restano validi tutti i termini del{' '}
              <Link href="/#faq" className="text-gold underline underline-offset-2">
                regolamento ufficiale del concorso
              </Link>
              , di cui questa pagina è attuazione operativa.
            </p>
          </div>
        </GlassCard>

        {/* CTA finale */}
        <GlassCard hover={false} className="mt-10 flex flex-col items-center gap-5 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">Hai girato il tuo video?</h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">
            Mandaci il link: senza la segnalazione via email il video non entra ufficialmente in gara,
            anche se hai usato tutti gli hashtag.
          </p>
          <Button as="a" href={mailto} size="lg">
            <Mail className="h-5 w-5" />
            Candida il tuo video
          </Button>
        </GlassCard>
      </main>

      <Footer />
    </>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-base font-bold text-white">{value}</dd>
      </div>
    </div>
  );
}
