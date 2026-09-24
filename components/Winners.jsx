import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Hourglass, Trophy, Hash } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
import { NakaLogo } from './Brand';
import { CONTEST, PRIZES, formatXaut } from '@/lib/constants';
import { formatDate, formatDateTime, getDictionary, localePath } from '@/lib/i18n';
import { readDrawResult } from '@/lib/server/draw-result';

/**
 * Pagina dei vincitori e della trasparenza.
 *
 * Prima dell'estrazione spiega la procedura verificabile: è l'argomento più forte
 * dell'iniziativa e nel regolamento, all'articolo 7, non lo legge nessuno.
 * Dopo l'estrazione mostra il risultato con i dati che permettono di rifare il conto.
 */
export default async function Winners({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.winners;
  const result = await readDrawResult();

  const prizeLabel = (place) => dict.prizes.items[place]?.place ?? place;

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href={localePath(locale)} aria-label={dict.nav.home}>
            <NakaLogo />
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToSite}
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>

        {!result && (
          <GlassCard hover={false} className="mt-8 flex flex-col items-center gap-4 p-8 text-center sm:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Hourglass className="h-7 w-7" />
            </span>
            <h2 className="text-xl font-bold">{t.pendingTitle}</h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              {t.pendingText(formatDate(CONTEST.drawDate, locale))}
            </p>
          </GlassCard>
        )}

        {result && (
          <section className="mt-8">
            <GlassCard hover={false} className="p-7 sm:p-9">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Trophy className="h-5 w-5 text-gold" />
                {t.resultTitle}
              </h2>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <Row label={t.drawnAt} value={formatDateTime(result.drawnAt, locale)} />
                <Row label={t.participantsLabel} value={String(result.users?.participants ?? 0)} />
                <Row label={t.seedLabel} value={result.seed} mono />
                <Row label={t.listHashLabel} value={result.users?.listHash ?? ''} mono />
              </dl>

              {[
                { key: 'users', heading: t.usersSection },
                { key: 'merchants', heading: t.merchantsSection },
              ].map(({ key, heading }) =>
                result[key]?.winners?.length ? (
                  <div key={key} className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{heading}</h3>
                    <table className="mt-3 w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/15 text-left text-xs uppercase tracking-wider text-muted">
                          <th className="py-2 pr-3 font-semibold">{t.prizeCol}</th>
                          <th className="py-2 pr-3 font-semibold">{t.amountCol}</th>
                          <th className="py-2 font-semibold">{t.entryId}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result[key].winners.map((w) => (
                          <tr key={`${w.rank}-${w.winnerId}`} className="border-b border-white/5">
                            <td className="py-2.5 pr-3">{prizeLabel(w.place)}</td>
                            <td className="py-2.5 pr-3 font-semibold text-gold">{formatXaut(w.amount)}</td>
                            <td className="py-2.5 font-mono text-xs">{w.winnerId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              )}

              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{t.notDrawnTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.notDrawnText}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {PRIZES.merchants.items
                    .filter((i) => i.assignment !== 'draw')
                    .map((i) => (
                      <li key={i.place}>
                        · {prizeLabel(i.place)} — {formatXaut(i.amount)}
                      </li>
                    ))}
                </ul>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted">{t.contacted}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {t.publishedUntil(formatDate(CONTEST.onlineUntil, locale))}
              </p>
            </GlassCard>
          </section>
        )}

        <section className="mt-16">
          <SectionTitle align="left" eyebrow={<span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />{t.howTitle}</span>} title={t.howTitle} subtitle={t.howIntro} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.steps.map((step, i) => (
              <GlassCard key={step.title} className="p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Hash className="h-5 w-5" />
                  </span>
                  <span className="text-4xl font-black leading-none text-white/[0.07]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-1 break-all text-sm font-medium text-white ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}
