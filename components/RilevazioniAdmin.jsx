'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CalendarClock,
  Camera,
  ChevronRight,
  Download,
  MessageSquare,
  RefreshCw,
  Search,
  Store,
} from 'lucide-react';
import { ALL_QUESTIONS, OUTCOMES, PHOTOS, SECTIONS } from '@/lib/survey';
import { SURVEY_LOCALES, answerIn, askedIn, outcomeIn, photoIn, sectionIn } from '@/lib/survey-i18n';
import { adminUi } from '@/lib/admin-i18n';
import { TIME_ZONE } from '@/lib/time';
import { CodeGate, LOCALE_KEY, LocaleSwitch } from './SurveyForm';
import Button from './ui/Button';
import Modal from './ui/Modal';
import RilevazioniTable from './RilevazioniTable';
import { AmendForm, VisitHistory } from './MyVisits';
import { reschedules, wasAmended } from '@/lib/visit-history';
import { cn } from './ui/cn';

/*
 * Pannello dell'admin delle rilevazioni.
 *
 * Risponde, nell'ordine, alle domande di chi coordina il giro:
 * 1. come siamo messi — negozi visitati e il loro stato, contando l'ULTIMA visita a ogni
 *    negozio (un «da ricontattare» seguito da un «aderisce» è un negozio che aderisce);
 * 2. che cosa c'è da fare — ritorni fissati, terminali da sistemare, richieste per l'assistenza;
 * 3. che cosa è stato rilevato — l'elenco di tutte le visite, filtrabile, con la scheda completa.
 *
 * In italiano o in inglese, con lo stesso interruttore (e la stessa lingua ricordata) del
 * questionario. Le risposte restano salvate in italiano: qui si traduce solo la lettura.
 */

const BROKEN = 'Terminale non funzionante — chiamare subito l’assistenza';

const TONE = {
  ok: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  wait: 'border-btc/30 bg-btc/10 text-btc',
  no: 'border-red-400/30 bg-red-400/10 text-red-300',
};

const outcomeOf = (id) => OUTCOMES.find((o) => o.id === id) ?? { id, label: id, tone: 'wait' };
const shopKey = (v) => v.merchantId ?? v.merchantName.toLowerCase();
const hasPosProblem = (v) => v.answers?.problema_flag === true || v.answers?.pos_stato === BROKEN;

const fmt = (iso, locale, withTime = true) =>
  new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
const dayKey = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date(iso));
const swissDate = (ymd) => (ymd ? ymd.split('-').reverse().join('.') : '');
const Q = (id) => ALL_QUESTIONS.find((q) => q.id === id);
const VIEW_KEY = 'naka-admin-vista';
const LIVE_MS = 30_000;

/** Lingua del pannello: la stessa scelta nel questionario, ricordata su questo dispositivo. */
function useLocale() {
  const [locale, setLocale] = useState('it');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_KEY);
      if (SURVEY_LOCALES.includes(saved)) setLocale(saved);
    } catch {
      /* navigazione privata */
    }
  }, []);
  const change = (next) => {
    setLocale(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* vedi sopra */
    }
  };
  return [locale, change];
}

/* ------------------------------------------------------------------ accesso */

export function AdminGate({ signedInAs, pinHint }) {
  const router = useRouter();
  const [retry, setRetry] = useState(false);
  const [locale, setLocale] = useLocale();
  const t = adminUi(locale);

  // Entrato con un PIN che non è da admin: lo si dice, invece di chiedere di nuovo il codice.
  if (signedInAs && !retry) {
    return (
      <div className="mx-auto w-full max-w-sm px-5 py-24">
        <div className="glass p-8">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold">{t.reservedTitle}</h1>
            <LocaleSwitch locale={locale} onLocale={setLocale} />
          </div>
          <p className="mt-2 text-sm text-muted">{t.reservedText(signedInAs)}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button as="a" href="/rilevazioni" variant="secondary">
              {t.backToSurveys}
            </Button>
            <Button variant="ghost" onClick={() => setRetry(true)}>
              {t.otherPin}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <CodeGate locale={locale} onLocale={setLocale} pinHint={pinHint} onUnlock={() => router.refresh()} />;
}

/* ------------------------------------------------------------------ pannello */

export default function RilevazioniAdmin({ visits, operator }) {
  const router = useRouter();
  const [locale, setLocale] = useLocale();
  const t = adminUi(locale);
  const outcomeLabel = (o) => outcomeIn(o.id, o.label, locale);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState('');
  const [outcome, setOutcome] = useState('');
  const [surveyor, setSurveyor] = useState('');
  const [only, setOnly] = useState('');
  // Schede o tabella: la scelta resta su questo dispositivo.
  const [view, setView] = useState('list');
  // Tempo reale: la pagina si ricarica dal server ogni 30 secondi, finché non la si mette in
  // pausa o la scheda del browser non è nascosta. I filtri e la scheda aperta restano.
  const [live, setLive] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === 'table') setView('table');
    } catch {
      /* navigazione privata */
    }
  }, []);
  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* vedi sopra */
    }
  };

  // Ogni volta che arrivano dati nuovi dal server, l'ora dell'ultimo aggiornamento.
  useEffect(() => setUpdatedAt(new Date()), [visits]);

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh();
    }, LIVE_MS);
    return () => clearInterval(id);
  }, [live, router]);

  const sorted = useMemo(() => [...visits].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [visits]);

  // L'ultima visita a ogni negozio: è lo stato attuale del negozio.
  const latest = useMemo(() => {
    const map = new Map();
    for (const v of sorted) if (!map.has(shopKey(v))) map.set(shopKey(v), v);
    return [...map.values()];
  }, [sorted]);

  const today = dayKey(new Date().toISOString());
  const latestIds = useMemo(() => new Set(latest.map((v) => v.id)), [latest]);

  const stats = useMemo(() => {
    const byOutcome = Object.fromEntries(OUTCOMES.map((o) => [o.id, 0]));
    for (const v of latest) byOutcome[v.outcome] = (byOutcome[v.outcome] ?? 0) + 1;
    const scores = sorted.map((v) => v.answers?.naka_esperienza).filter((n) => typeof n === 'number');
    const bySurveyor = {};
    for (const v of sorted) {
      const s = (bySurveyor[v.surveyor || '—'] ??= { total: 0, today: 0 });
      s.total += 1;
      if (dayKey(v.createdAt) === today) s.today += 1;
    }
    return {
      byOutcome,
      bySurveyor,
      todayCount: sorted.filter((v) => dayKey(v.createdAt) === today).length,
      avg: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—',
      scored: scores.length,
    };
  }, [latest, sorted, today]);

  // Da fare: i ritorni fissati nell'ultima visita, i terminali con un problema, le richieste.
  const agenda = useMemo(
    () =>
      latest
        .filter((v) => v.answers?.ritorno_quando)
        .sort((a, b) =>
          `${a.answers.ritorno_quando} ${a.answers.ritorno_ora ?? ''}`.localeCompare(
            `${b.answers.ritorno_quando} ${b.answers.ritorno_ora ?? ''}`,
          ),
        ),
    [latest],
  );
  const posProblems = useMemo(() => latest.filter(hasPosProblem), [latest]);
  const requests = useMemo(() => latest.filter((v) => v.answers?.naka_problemi), [latest]);

  const surveyors = Object.keys(stats.bySurveyor).sort();

  const filtered = sorted.filter((v) => {
    if (outcome && v.outcome !== outcome) return false;
    if (surveyor && (v.surveyor || '—') !== surveyor) return false;
    if (only === 'pos' && !hasPosProblem(v)) return false;
    if (only === 'modificate' && !wasAmended(v)) return false;
    // Scaduto: il ritorno è passato e nessuno è ancora tornato in quel negozio.
    if (only === 'scaduti' && !(v.answers?.ritorno_quando < today && latestIds.has(v.id))) return false;
    if (only === 'ritorno' && !v.answers?.ritorno_quando) return false;
    if (only === 'oggi' && dayKey(v.createdAt) !== today) return false;
    if (q) {
      const hay = `${v.merchantName} ${v.mapSnapshot?.address ?? ''} ${v.surveyor} ${v.id} ${v.answers?.note ?? ''}`;
      if (!hay.toLowerCase().includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const refresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    // In tabella servono tutte le colonne che lo schermo concede: la pagina si allarga.
    <div className={cn('mx-auto w-full px-5 pb-24 pt-10', view === 'table' ? 'max-w-[1800px]' : 'max-w-6xl')}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-btc">{t.kicker}</p>
            <LocaleSwitch locale={locale} onLocale={setLocale} />
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {operator ? t.signedIn(operator) : ''}
            {t.dataNote}
          </p>
          {updatedAt && (
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
              <span className={cn('h-2 w-2 rounded-full', live ? 'animate-pulse bg-emerald-400' : 'bg-muted/50')} />
              {(live ? t.live : t.paused)(
                updatedAt.toLocaleTimeString(locale === 'en' ? 'en-GB' : 'it-CH', { timeZone: TIME_ZONE }),
              )}
              <button
                type="button"
                onClick={() => setLive((x) => !x)}
                className="font-semibold text-btc underline underline-offset-2"
              >
                {live ? t.pause : t.resume}
              </button>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} /> {t.refresh}
          </Button>
          <Button as="a" href="/api/rilevazioni?export=csv" variant="secondary" size="sm">
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button as="a" href="/api/rilevazioni?export=json" variant="ghost" size="sm">
            <Download className="h-4 w-4" /> {t.backup}
          </Button>
          {/* «Link social» è uguale in italiano e in inglese */}
          <Button as="a" href="/admin/social" variant="ghost" size="sm">
            Link social
          </Button>
          <Button as="a" href="/rilevazioni" variant="ghost" size="sm">
            {t.newSurvey}
          </Button>
        </div>
      </header>

      {/* Come siamo messi */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label={t.kpiSurveys} value={sorted.length} note={t.kpiToday(stats.todayCount)} />
        <Kpi label={t.kpiShops} value={latest.length} note={t.kpiShopsNote} />
        <Kpi label={t.kpiAvg} value={stats.avg} note={t.kpiAvgNote(stats.scored)} />
        <Kpi
          label={t.kpiFollow}
          value={agenda.length + posProblems.length}
          note={t.kpiFollowNote(agenda.length, posProblems.length)}
        />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OUTCOMES.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOutcome(outcome === o.id ? '' : o.id)}
            className={cn(
              'rounded-2xl border px-4 py-3 text-left transition',
              TONE[o.tone],
              outcome === o.id ? 'ring-2 ring-white/40' : 'hover:brightness-125',
            )}
          >
            <span className="block text-2xl font-bold">{stats.byOutcome[o.id] ?? 0}</span>
            <span className="block text-xs font-semibold">{outcomeLabel(o)}</span>
          </button>
        ))}
      </section>

      {surveyors.length > 0 && (
        <section className="mt-3 flex flex-wrap gap-2">
          {surveyors.map((s) => (
            <span key={s} className="chip">
              <span className="font-semibold text-white">{s}</span>{' '}
              {t.perSurveyor(stats.bySurveyor[s].total, stats.bySurveyor[s].today)}
            </span>
          ))}
        </section>
      )}

      {/* Che cosa c'è da fare */}
      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <TodoCard icon={CalendarClock} title={t.agendaTitle} empty={t.agendaEmpty}>
          {agenda.map((v) => (
            <TodoRow key={v.id} onClick={() => setOpen(v)} past={v.answers.ritorno_quando < today}>
              <span className="font-semibold text-white">
                {swissDate(v.answers.ritorno_quando)}
                {v.answers.ritorno_ora ? `, ${v.answers.ritorno_ora}` : ''}
                {reschedules(v) > 0 ? ` · ${t.moved(reschedules(v))}` : ''}
              </span>{' '}
              · {v.merchantName}
              <span className="block text-xs text-muted">
                {v.answers.ritorno_motivo
                  ? answerIn(Q('ritorno_motivo'), v.answers.ritorno_motivo, locale)
                  : t.noReason}{' '}
                · {v.surveyor}
              </span>
            </TodoRow>
          ))}
        </TodoCard>
        <TodoCard icon={AlertTriangle} title={t.posTitle} empty={t.posEmpty}>
          {posProblems.map((v) => (
            <TodoRow key={v.id} onClick={() => setOpen(v)} past={v.answers?.pos_stato === BROKEN}>
              <span className="font-semibold text-white">{v.merchantName}</span>
              <span className="block text-xs text-muted">
                {(v.answers?.problema_tipo && answerIn(Q('problema_tipo'), v.answers.problema_tipo, locale)) ||
                  (v.answers?.pos_stato === BROKEN ? t.posBroken : t.posReported)}
                {v.answers?.problema_note ? ` — ${v.answers.problema_note}` : ''}
              </span>
            </TodoRow>
          ))}
        </TodoCard>
        <TodoCard icon={MessageSquare} title={t.requestsTitle} empty={t.requestsEmpty}>
          {requests.map((v) => (
            <TodoRow key={v.id} onClick={() => setOpen(v)}>
              <span className="font-semibold text-white">{v.merchantName}</span>
              <span className="block text-xs text-muted">{v.answers.naka_problemi}</span>
            </TodoRow>
          ))}
        </TodoCard>
      </section>

      {/* Che cosa è stato rilevato */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{t.listTitle}</h2>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-sm">
            {[
              ['list', t.viewList],
              ['table', t.viewTable],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => changeView(id)}
                aria-pressed={view === id}
                className={cn(
                  'rounded-full px-4 py-1.5 font-semibold transition',
                  view === id ? 'bg-btc/15 text-btc' : 'text-muted hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="field pl-9"
            />
          </label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="field sm:w-48">
            <option value="">{t.allOutcomes}</option>
            {OUTCOMES.map((o) => (
              <option key={o.id} value={o.id}>
                {outcomeLabel(o)}
              </option>
            ))}
          </select>
          <select value={surveyor} onChange={(e) => setSurveyor(e.target.value)} className="field sm:w-44">
            <option value="">{t.allSurveyors}</option>
            {surveyors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={only} onChange={(e) => setOnly(e.target.value)} className="field sm:w-44">
            <option value="">{t.allVisits}</option>
            <option value="oggi">{t.onlyToday}</option>
            <option value="ritorno">{t.withReturn}</option>
            <option value="pos">{t.withPos}</option>
            <option value="modificate">{t.withAmended}</option>
            <option value="scaduti">{t.overdueReturns}</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-muted">{t.countOf(filtered.length, sorted.length)}</p>

        {view === 'table' ? (
          <RilevazioniTable visits={filtered} locale={locale} t={t} onOpen={setOpen} />
        ) : (
          <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60">
            {filtered.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted">{t.empty}</li>}
            {filtered.map((v) => {
              const o = outcomeOf(v.outcome);
              const nPhotos = Object.values(v.photos ?? {}).flat().length;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(v)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                  >
                    <Store className="hidden h-5 w-5 shrink-0 text-muted sm:block" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{v.merchantName}</span>
                      <span className="block truncate text-xs text-muted">
                        {fmt(v.createdAt, locale)} · {v.surveyor || '—'}
                        {v.mapSnapshot?.address ? ` · ${v.mapSnapshot.address}` : ''}
                      </span>
                    </span>
                    <span className="hidden items-center gap-2 text-muted sm:flex">
                      {hasPosProblem(v) && <AlertTriangle className="h-4 w-4 text-red-300" aria-label={t.posIcon} />}
                      {v.answers?.ritorno_quando && (
                        <CalendarClock className="h-4 w-4 text-btc" aria-label={t.returnIcon} />
                      )}
                      {nPhotos > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Camera className="h-4 w-4" /> {nPhotos}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn('shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold', TONE[o.tone])}
                    >
                      {outcomeLabel(o)}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <VisitModal
        visit={open}
        onClose={() => setOpen(null)}
        locale={locale}
        onSaved={() => {
          setOpen(null);
          router.refresh();
        }}
      />
    </div>
  );
}

function Kpi({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft/60 px-4 py-3">
      <span className="block text-xs font-semibold text-muted">{label}</span>
      <span className="mt-1 block text-2xl font-bold">{value}</span>
      <span className="block text-xs text-muted">{note}</span>
    </div>
  );
}

function TodoCard({ icon: Icon, title, empty, children }) {
  const items = [].concat(children ?? []).filter(Boolean);
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft/60 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-btc" /> {title}
        <span className="ml-auto text-xs font-semibold text-muted">{items.length}</span>
      </h3>
      {items.length ? (
        <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1">{items}</ul>
      ) : (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}

function TodoRow({ children, onClick, past }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/[0.05]',
          past && 'border-l-2 border-red-400/60',
        )}
      >
        {children}
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ scheda */

function VisitModal({ visit, onClose, locale, onSaved }) {
  const [amending, setAmending] = useState(false);
  useEffect(() => setAmending(false), [visit?.id]);
  if (!visit) return null;
  const t = adminUi(locale);
  const o = outcomeOf(visit.outcome);
  const photos = PHOTOS.flatMap((p) =>
    [].concat(visit.photos?.[p.id] ?? []).map((ph, i, all) => ({
      ...ph,
      label: all.length > 1 ? `${photoIn(p, locale).label} ${i + 1}` : photoIn(p, locale).label,
    })),
  );

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      closeLabel={t.close}
      title={visit.merchantName}
      subtitle={`${fmt(visit.createdAt, locale)} · ${visit.surveyor || '—'} · ${visit.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full border px-2.5 py-1 text-xs font-semibold', TONE[o.tone])}>
          {outcomeIn(o.id, o.label, locale)}
        </span>
        {visit.excludes && <span className="chip">{t.excluded}</span>}
        {!visit.merchantKnown && <span className="chip">{t.notListed}</span>}
        {visit.mapSnapshot?.address && <span className="chip">{visit.mapSnapshot.address}</span>}
        {visit.mapSnapshot?.category && <span className="chip">{visit.mapSnapshot.category}</span>}
      </div>

      {SECTIONS.map((section) => {
        const rows = section.questions.filter(
          (q) => q.type !== 'photo' && q.type !== 'qr' && visit.answers?.[q.id] !== undefined,
        );
        if (!rows.length) return null;
        return (
          <div key={section.id} className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-btc">
              {sectionIn(section, locale).title}
            </h4>
            <dl className="mt-2 divide-y divide-white/5 rounded-xl border border-white/10">
              {rows.map((q) => (
                <div key={q.id} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                  <dt className="text-xs text-muted">{askedIn(q, locale).label}</dt>
                  <dd className="whitespace-pre-wrap break-words text-sm text-white">
                    {answerIn(q, visit.answers[q.id], locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}

      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-btc">{t.photos}</h4>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((ph) => {
              const src = `/api/rilevazioni/foto?key=${encodeURIComponent(ph.key)}`;
              return (
                <a key={ph.key} href={src} target="_blank" rel="noopener noreferrer" className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- foto private, servite da un'API protetta */}
                  <img
                    src={src}
                    alt={ph.label}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl border border-white/10 object-cover transition group-hover:brightness-110"
                  />
                  <span className="mt-1 block text-xs text-muted">{ph.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* L'admin integra sempre, anche a concorso chiuso: ogni passaggio resta in cronologia. */}
      <div className="mt-6">
        {amending ? (
          <AmendForm visit={visit} locale={locale} onCancel={() => setAmending(false)} onSaved={onSaved} />
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setAmending(true)}>
            {t.amend}
          </Button>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-btc">{t.history}</h4>
        <VisitHistory visit={visit} locale={locale} />
      </div>
    </Modal>
  );
}
