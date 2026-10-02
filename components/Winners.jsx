import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Hourglass, Trophy, Hash, Download, Lock, Clock, ExternalLink } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Footer from './Footer';
import LanguageSwitch from './LanguageSwitch';
import { NakaLogo } from './Brand';
import { CONTEST, DRAW } from '@/lib/constants';
import { POOLS, formatPrize } from '@/lib/campaigns';
import { formatDate, formatDateTime, formatTime, getDictionary, localePath } from '@/lib/i18n';
import { readArchive, readCommitment, readDrawResult } from '@/lib/server/draw-result';

/** I tre elenchi impegnati, nell'ordine in cui si mostrano. */
const SCOPES = ['users', 'spritz', 'merchants'];

/**
 * Pagina dei vincitori e della trasparenza. Ha tre stati, quanti sono i momenti dell'estrazione:
 *
 *   1. prima dell'impegno   — spiega la procedura e quando arriveranno gli elenchi;
 *   2. impegno pubblicato   — elenchi scaricabili, impronte, blocco-seme annunciato: è il momento
 *                             che rende verificabile tutto il resto, e deve vedersi PRIMA del seme;
 *   3. estrazione eseguita  — vincitori, riserve, eventuali esclusioni, e gli stessi file.
 */
export default async function Winners({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.winners;
  const [commitment, result, archive] = await Promise.all([readCommitment(), readDrawResult(), readArchive()]);

  const prizeLabel = (place) => dict.prizes.items[place]?.place ?? place;
  const seedHeight = result?.seedHeight ?? commitment?.seed?.seedHeight ?? null;

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href={localePath(locale)} aria-label={dict.nav.home}>
            <NakaLogo id="winners" locale={locale} />
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-btc"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToSite}
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>

        {/* 1. Prima dell'impegno */}
        {!commitment && !result && (
          <GlassCard hover={false} className="mt-8 flex flex-col items-center gap-4 p-8 text-center sm:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-btc/30 bg-btc/10 text-btc">
              <Hourglass className="h-7 w-7" />
            </span>
            <h2 className="text-xl font-bold">{t.pendingTitle}</h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              {t.pendingText(formatDate(CONTEST.drawDate, locale), formatTime(DRAW.commitBy, locale))}
            </p>
          </GlassCard>
        )}

        {/* 2. Impegno pubblicato, seme non ancora minato */}
        {commitment && !result && (
          <GlassCard hover={false} className="mt-8 p-7 sm:p-9">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Lock className="h-5 w-5 text-btc" />
              {t.committedTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t.committedText(seedHeight, formatDateTime(commitment.createdAt, locale))}
            </p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <Row label={t.committedAt} value={formatDateTime(commitment.createdAt, locale)} />
              <Row label={t.tipLabel} value={String(commitment.seed.tipHeightAtCommit)} mono />
              <Row label={t.seedHeightLabel} value={<BlockLink height={seedHeight} label={t.openBlock} />} mono />
            </dl>
          </GlassCard>
        )}

        {/* 3. Estrazione eseguita */}
        {result && (
          <section className="mt-8">
            <GlassCard hover={false} className="p-7 sm:p-9">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Trophy className="h-5 w-5 text-btc" />
                {t.resultTitle}
              </h2>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <Row label={t.drawnAt} value={formatDateTime(result.drawnAt, locale)} />
                <Row label={t.participantsLabel} value={String(result.users?.participants ?? 0)} />
                <Row label={t.seedHeightLabel} value={<BlockLink height={seedHeight} label={t.openBlock} />} mono />
                <Row label={t.seedLabel} value={result.seed} mono />
              </dl>

              {[
                { key: 'users', heading: t.usersSection, accent: 'text-btc' },
                // Il premio del Satoshi Spritz esce da un elenco suo: va mostrato come tale,
                // altrimenti sembra estratto fra tutte le giocate e il conto non torna.
                { key: 'spritz', heading: t.spritzSection, accent: 'text-btc' },
                { key: 'merchants', heading: t.merchantsSection, accent: 'text-gold' },
              ].map(({ key, heading, accent }) =>
                result[key]?.winners?.length ? (
                  <div key={key} className="mt-8">
                    <h3 className={`text-sm font-semibold uppercase tracking-[0.18em] ${accent}`}>{heading}</h3>
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
                            <td className={`py-2.5 pr-3 font-semibold ${accent}`}>{formatPrize(w, locale)}</td>
                            <td className="py-2.5 font-mono text-xs">{w.winnerId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {result[key].reserves?.length > 0 && (
                      <details className="group mt-3">
                        <summary className="cursor-pointer text-xs font-semibold text-muted hover:text-white">
                          {t.reservesTitle} ({result[key].reserves.length})
                        </summary>
                        <p className="mt-2 text-xs text-muted">{t.reservesNote}</p>
                        <ol className="mt-2 grid gap-1 font-mono text-xs text-muted sm:grid-cols-2">
                          {result[key].reserves.map((r) => (
                            <li key={r.id}>
                              {r.rank}. {r.id}
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </div>
                ) : null,
              )}

              {result.disqualified?.length > 0 && (
                <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/[0.05] p-4">
                  <p className="text-sm font-semibold text-white">{t.disqualifiedTitle}</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted">
                    {result.disqualified.map((d) => (
                      <li key={d.id}>
                        <span className="font-mono">{d.id}</span>
                        {/* Un'esclusione può valere per un solo premio: chi ha pagato fuori orario
                            perde lo Spritz, non il resto. */}
                        {d.only && ` (${{ users: t.usersSection, spritz: t.spritzSection, merchants: t.merchantsSection }[d.only]})`}{' '}
                        — {d.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{t.notDrawnTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.notDrawnText}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {POOLS.merchants.items
                    .filter((i) => i.assignment !== 'draw')
                    .map((i) => (
                      <li key={i.place}>
                        · {prizeLabel(i.place)} — {formatPrize(i, locale)}
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

        {/* I file: dal momento dell'impegno in poi, chiunque li scarica e rifà il conto. */}
        {commitment && <DrawFiles t={t} commitment={commitment} hasResult={Boolean(result)} />}
        {commitment && <ArchiveNote t={t} copy={archive['commitment.json']} locale={locale} />}

        {/* La versione per chi non sa cosa sia un hash: viene prima della procedura tecnica. */}
        <GlassCard hover={false} className="mt-16 p-7 sm:p-9">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5 text-btc" />
            {t.simpleTitle}
          </h2>
          <div className="mt-4 space-y-3">
            {t.simple.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </GlassCard>

        <section className="mt-12">
          <SectionTitle
            align="left"
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t.howEyebrow}
              </span>
            }
            title={t.howTitle}
            subtitle={t.howIntro}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.steps(DRAW.blocksAhead).map((step, i) => (
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

          {/* L'orario non è un dettaglio da nascondere: è la conseguenza diretta del metodo. */}
          <GlassCard hover={false} className="mt-4 flex items-start gap-4 p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-btc/30 bg-btc/10 text-btc">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold">{t.timingTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t.timingText(
                  DRAW.blocksAhead,
                  formatTime(DRAW.expectedFrom, locale),
                  formatTime(DRAW.expectedBy, locale),
                )}
              </p>
            </div>
          </GlassCard>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}

/** Elenchi impegnati, impronte e file scaricabili: il materiale per rifare il calcolo. */
function DrawFiles({ t, commitment, hasResult }) {
  const files = [
    ...SCOPES.filter((scope) => commitment[scope]).map((scope) => ({
      key: scope,
      label: t.lists[scope],
      file: commitment[scope].file,
      count: commitment[scope].count,
      hash: commitment[scope].listHash,
    })),
    { key: 'commitment', label: t.lists.commitment, file: 'commitment.json' },
    ...(hasResult ? [{ key: 'result', label: t.lists.result, file: 'result.json' }] : []),
  ];

  return (
    <GlassCard hover={false} className="mt-6 p-7 sm:p-9">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Download className="h-5 w-5 text-btc" />
        {t.listsTitle}
      </h2>
      <ul className="mt-5 space-y-3">
        {files.map((f) => (
          <li key={f.key} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">
                {f.label}
                {f.count != null && <span className="ml-2 font-normal text-muted">{t.listCount(f.count)}</span>}
              </span>
              <a
                href={`/api/draw/${f.file}`}
                download
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-btc underline underline-offset-2 hover:text-btc-warm"
              >
                <Download className="h-3.5 w-3.5" />
                {t.download} {f.file}
              </a>
            </div>
            {f.hash && (
              <p className="mt-1.5 break-all font-mono text-[11px] text-muted">
                {t.hashLabel}: {f.hash}
              </p>
            )}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/** La copia su archive.org: la data dell'impegno certificata da un terzo. */
function ArchiveNote({ t, copy, locale }) {
  return (
    <GlassCard hover={false} className="mt-4 flex items-start gap-4 p-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-btc/30 bg-btc/10 text-btc">
        <Lock className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-base font-bold">{t.archiveTitle}</h3>
        {copy ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.archiveText(formatDateTime(copy.archivedAt, locale, { dateStyle: 'long', timeStyle: 'medium' }))}
            </p>
            <a
              href={copy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-btc underline underline-offset-2 hover:text-btc-warm"
            >
              {t.archiveLink}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.archivePending}</p>
        )}
      </div>
    </GlassCard>
  );
}

function BlockLink({ height, label }) {
  if (height == null) return '—';
  return (
    <a
      href={DRAW.blockUrl(height)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-btc underline underline-offset-2 hover:text-btc-warm"
      aria-label={`${label} ${height}`}
    >
      {height}
      <ExternalLink className="h-3 w-3" />
    </a>
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
