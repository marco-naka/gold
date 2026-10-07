'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  Camera,
  Check,
  ChevronRight,
  History,
  Navigation,
  PencilLine,
  Play,
  Search,
} from 'lucide-react';
import { ALL_QUESTIONS, OUTCOMES, PHOTOS, SECTIONS, isVisible } from '@/lib/survey';
import { answerIn, askedIn, outcomeIn, photoIn, sectionIn, ui } from '@/lib/survey-i18n';
import { FREE_FIELDS } from '@/lib/visit-history';
import { TIME_ZONE } from '@/lib/time';
import { mapsUrl } from '@/lib/merchants';
import { PhotoSlot, Question } from './SurveyForm';
import Button from './ui/Button';
import { cn } from './ui/cn';

/*
 * L'area personale del rilevatore: le sue visite, la scheda di ciascuna con la cronologia,
 * le integrazioni dopo l'invio e l'agenda dei ritorni.
 *
 * Regola di fondo (lib/visit-history.js): una visita inviata non si riscrive, si integra.
 * Qui lo si vede: la scheda mostra lo stato attuale e, sotto, ogni passaggio con ora e nome.
 *
 * `AmendForm` e `VisitHistory` li usa anche il pannello dell'admin.
 */

const BROKEN = 'Terminale non funzionante — chiamare subito l’assistenza';
const TONE = {
  ok: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  wait: 'border-btc/30 bg-btc/10 text-btc',
  no: 'border-red-400/30 bg-red-400/10 text-red-300',
};
const Q = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
const outcomeOf = (id) => OUTCOMES.find((o) => o.id === id) ?? { id, label: id, tone: 'wait' };
const photosOf = (v) => PHOTOS.flatMap((p) => [].concat(v.photos?.[p.id] ?? []).map((ph) => ({ ...ph, slot: p })));
const intl = (locale) => (locale === 'en' ? 'en-GB' : 'it-CH');
const dateTime = (iso, locale) =>
  new Date(iso).toLocaleString(intl(locale), { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const swiss = (ymd) => (ymd ? ymd.split('-').reverse().join('.') : '');
const todayYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());
const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const photoSrc = (key) => `/api/rilevazioni/foto?key=${encodeURIComponent(key)}`;

function OutcomeBadge({ id, locale, className }) {
  const o = outcomeOf(id);
  return (
    <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', TONE[o.tone], className)}>
      {outcomeIn(o.id, o.label, locale)}
    </span>
  );
}

/* ------------------------------------------------------------------ elenco */

export function MyVisits({ visits, locale, onChanged, onGoNow }) {
  const t = ui(locale);
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState(null);

  if (visits === null) return <p className="px-5 py-16 text-center text-sm text-muted">{t.mineLoading}</p>;
  const open = openId && visits.find((v) => v.id === openId);
  if (open) {
    return (
      <VisitDetail visit={open} locale={locale} onBack={() => setOpenId(null)} onChanged={onChanged} onGoNow={onGoNow} />
    );
  }

  const shown = visits.filter((v) => !q || `${v.merchantName} ${v.address ?? ''} ${v.id}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-24 pt-6">
      <h2 className="text-xl font-bold">{t.mineTitle(visits.length, 0).split(' · ')[0]}</h2>
      {visits.length > 0 && (
        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.mineSearch} className="field pl-10" />
        </label>
      )}
      {visits.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t.mineEmpty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60">
          {shown.map((v) => {
            const nPhotos = photosOf(v).length;
            const pos = v.answers?.problema_flag === true || v.answers?.pos_stato === BROKEN;
            const amended = (v.history ?? []).some((e) => e.type === 'amend');
            return (
              <li key={v.id}>
                <button type="button" onClick={() => setOpenId(v.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03]">
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold text-white">{v.merchantName}</span>
                      <OutcomeBadge id={v.outcome} locale={locale} className="shrink-0" />
                    </span>
                    <span className="mt-1 block text-xs text-muted">{dateTime(v.createdAt, locale)} · {v.id}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {nPhotos === 0 && <Chip tone="no" icon={Camera}>{t.badgeNoPhotos}</Chip>}
                      {pos && <Chip tone="no" icon={AlertTriangle}>{t.badgePos}</Chip>}
                      {v.ripasso && !v.superseded && <Chip tone="wait" icon={CalendarClock}>{t.badgeReturn(swiss(v.ripasso))}</Chip>}
                      {amended && <Chip icon={PencilLine}>{t.badgeAmended}</Chip>}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Chip({ tone, icon: Icon, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        tone ? TONE[tone] : 'border-white/15 bg-white/5 text-muted',
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ scheda */

function VisitDetail({ visit, locale, onBack, onChanged, onGoNow }) {
  const t = ui(locale);
  const [amending, setAmending] = useState(false);
  const photos = photosOf(visit);

  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-24 pt-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted hover:text-btc">
        <ArrowLeft className="h-4 w-4" /> {t.detailBack}
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{visit.merchantName}</h2>
          {visit.address && <p className="mt-1 text-xs text-muted">{visit.address}</p>}
          <p className="mt-1 text-xs text-muted">
            {dateTime(visit.createdAt, locale)} · <span className="font-mono">{visit.id}</span>
          </p>
        </div>
        <OutcomeBadge id={visit.outcome} locale={locale} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visit.editable && !amending && (
          <Button variant="btc" size="sm" onClick={() => setAmending(true)}>
            <PencilLine className="h-4 w-4" /> {t.amendOpen}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onGoNow(visit)}>
          <Play className="h-4 w-4 text-btc" /> {t.goNow}
        </Button>
        {visit.address && (
          <Button as="a" href={mapsUrl({ name: visit.merchantName, address: visit.address })} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm">
            <Navigation className="h-4 w-4 text-btc" /> {t.directions}
          </Button>
        )}
      </div>
      {!visit.editable && <p className="mt-3 text-xs text-muted">{t.amendClosed}</p>}

      {amending && (
        <AmendForm
          visit={visit}
          locale={locale}
          onCancel={() => setAmending(false)}
          onSaved={() => {
            setAmending(false);
            onChanged();
          }}
        />
      )}

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-btc">{t.detailAnswers}</h3>
      <Answers visit={visit} locale={locale} />

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-btc">{t.detailPhotos}</h3>
      {photos.length ? (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {photos.map((ph) => (
            <a key={ph.key} href={photoSrc(ph.key)} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- foto private, servite dall'API protetta */}
              <img src={photoSrc(ph.key)} alt={photoIn(ph.slot, locale).label} loading="lazy" className="aspect-square w-full rounded-xl border border-white/10 object-cover" />
              <span className="mt-1 block truncate text-[11px] text-muted">{photoIn(ph.slot, locale).label}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">{t.detailNoPhotos}</p>
      )}

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-btc">{t.detailHistory}</h3>
      <VisitHistory visit={visit} locale={locale} />
    </section>
  );
}

function Answers({ visit, locale }) {
  return SECTIONS.map((section) => {
    const rows = section.questions.filter((q) => q.type !== 'photo' && q.type !== 'qr' && visit.answers?.[q.id] !== undefined);
    if (!rows.length) return null;
    return (
      <div key={section.id} className="mt-3">
        <p className="text-xs font-semibold text-white">{sectionIn(section, locale).title}</p>
        <dl className="mt-1.5 divide-y divide-white/5 rounded-xl border border-white/10">
          {rows.map((q) => (
            <div key={q.id} className="grid gap-0.5 px-3.5 py-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-3">
              <dt className="text-xs text-muted">{askedIn(q, locale).label}</dt>
              <dd className="whitespace-pre-wrap break-words text-sm text-white">{answerIn(q, visit.answers[q.id], locale)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  });
}

/* ------------------------------------------------------------------ cronologia */

const valueText = (id, value, locale, t) =>
  value === null || value === undefined ? t.histEmptyValue : Q[id] ? answerIn(Q[id], value, locale) : String(value);

export function VisitHistory({ visit, locale }) {
  const t = ui(locale);
  const events = [{ type: 'created', at: visit.createdAt, by: visit.surveyor }, ...(visit.history ?? [])].sort((a, b) =>
    b.at.localeCompare(a.at),
  );
  return (
    <ol className="mt-3 space-y-3 border-l border-white/10 pl-4">
      {events.map((e, i) => (
        <li key={`${e.type}-${e.at}-${i}`} className="relative">
          <span className="absolute -left-[21px] top-1.5 grid h-2.5 w-2.5 place-items-center rounded-full bg-btc" />
          <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
            {e.type === 'created' ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : e.type === 'reschedule' ? <CalendarClock className="h-3.5 w-3.5 text-btc" /> : <History className="h-3.5 w-3.5 text-btc" />}
            {e.type === 'created' ? t.histCreated(e.by || '—') : e.type === 'reschedule' ? t.histReschedule(e.by) : t.histAmend(e.by)}
          </p>
          <p className="text-[11px] text-muted">{dateTime(e.at, locale)}</p>
          {e.type === 'reschedule' && (
            <p className="mt-1 text-xs text-white">
              {swiss(e.from.date)}
              {e.from.time ? ` ${e.from.time}` : ''} → {swiss(e.to.date)}
              {e.to.time ? ` ${e.to.time}` : ''}
            </p>
          )}
          {e.type === 'amend' && (
            <div className="mt-1 space-y-1 text-xs">
              {(e.changes ?? []).map((c) => (
                <p key={c.id} className="text-white">
                  <span className="text-muted">{Q[c.id] ? askedIn(Q[c.id], locale).label : c.id}: </span>
                  <span className="line-through decoration-red-300/70 text-muted">{valueText(c.id, c.from, locale, t)}</span> →{' '}
                  {valueText(c.id, c.to, locale, t)}
                </p>
              ))}
              {e.outcomeFrom && (
                <p className="text-white">
                  {t.histOutcome(outcomeIn(e.outcomeFrom, outcomeOf(e.outcomeFrom).label, locale), outcomeIn(e.outcomeTo, outcomeOf(e.outcomeTo).label, locale))}
                </p>
              )}
              {e.photosAdded?.length > 0 && <p className="text-white">{t.histPhotos(e.photosAdded.length)}</p>}
              {e.note && <p className="text-white"><span className="text-muted">{t.histNote}: </span>{e.note}</p>}
            </div>
          )}
          {e.reason && (
            <p className="mt-1 text-xs text-white">
              <span className="text-muted">{t.histReason}: </span>
              {e.reason}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ integrazione */

export function AmendForm({ visit, locale, onCancel, onSaved }) {
  const t = ui(locale);
  const [photos, setPhotos] = useState({});
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [changes, setChanges] = useState({});
  const [picked, setPicked] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const merged = useMemo(() => {
    const m = { ...visit.answers };
    for (const [id, v] of Object.entries(changes)) {
      if (v === null || v === undefined || v === '' || v === false || (Array.isArray(v) && !v.length)) delete m[id];
      else m[id] = v;
    }
    return m;
  }, [visit.answers, changes]);

  // Le domande che si possono correggere: quelle visibili con le risposte di adesso.
  const editable = ALL_QUESTIONS.filter((q) => q.type !== 'photo' && q.type !== 'qr' && isVisible(q, merged));
  const changedIds = Object.keys(changes);
  // Le domande in correzione: quella appena scelta, quelle già toccate e quelle che una
  // risposta di adesso ha appena fatto comparire. Spuntata la lamentela MyLugano, per esempio,
  // scelte e commento sono subito lì, senza tornare al menu. In ordine di questionario.
  const shownIds = new Set([...changedIds, picked].filter(Boolean));
  for (const q of editable) if (!isVisible(q, visit.answers)) shownIds.add(q.id);
  const shown = editable.map((q) => q.id).filter((id) => shownIds.has(id));
  const needsReason = changedIds.some((id) => !FREE_FIELDS.includes(id));
  // La vetrina è una sola: si propone solo se manca.
  const slots = PHOTOS.filter((p) => p.multiple || !visit.photos?.[p.id]);

  async function save() {
    setError(null);
    if (needsReason && !reason.trim()) return setError(t.amendReasonMissing);
    setBusy(true);
    const body = new FormData();
    body.append('intent', 'amend');
    body.append('visitId', visit.id);
    body.append('changes', JSON.stringify(changes));
    body.append('note', note);
    body.append('reason', reason);
    for (const [slot, value] of Object.entries(photos)) {
      for (const file of [].concat(value ?? [])) if (file) body.append(`photo_${slot}`, file);
    }
    try {
      const res = await fetch('/api/rilevazioni', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (res.ok) return onSaved(json);
      if (res.status === 401) return setError(t.sessionExpired);
      const errs = json.errors ?? {};
      if (errs._ === 'nothing') setError(t.amendNothing);
      else if (errs.reason) setError(t.amendReasonMissing);
      else {
        const missing = Object.keys(errs).filter((id) => Q[id]).map((id) => askedIn(Q[id], locale).label);
        setError(missing.length ? t.amendIncomplete(missing.join(', ')) : t.genericError);
      }
    } catch {
      setError(t.offline);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-btc/30 bg-btc/[0.05] p-4">
      <p className="text-sm font-bold text-white">{t.amendTitle}</p>
      <p className="mt-1 text-xs text-muted">{t.amendIntro}</p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.amendPhotos}</p>
      <div className="mt-2 space-y-3">
        {slots.map((photo) => (
          <PhotoSlot
            key={photo.id}
            photo={photo}
            file={photos[photo.id]}
            onPick={(file) => setPhotos((p) => ({ ...p, [photo.id]: file }))}
            onClear={() => setPhotos((p) => ({ ...p, [photo.id]: null }))}
            locale={locale}
          />
        ))}
      </div>

      <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.12em] text-btc" htmlFor={`note-${visit.id}`}>
        {t.amendNote}
      </label>
      <textarea id={`note-${visit.id}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.amendNotePlaceholder} rows={3} className="field mt-2" />

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.amendFix}</p>
      <select value={picked} onChange={(e) => setPicked(e.target.value)} className="field mt-2">
        <option value="">{t.amendPick}</option>
        {editable.map((q) => (
          <option key={q.id} value={q.id}>
            {askedIn(q, locale).label}
          </option>
        ))}
      </select>
      {/* Le domande in correzione: quella appena scelta più quelle già toccate. */}
      <div className="mt-3 space-y-4">
        {shown.map((id) => (
          <div key={id} className="rounded-xl border border-white/10 bg-ink-deep/40 p-3">
            <Question
              question={Q[id]}
              value={merged[id]}
              onChange={(qid, value) => setChanges((c) => ({ ...c, [qid]: value }))}
              answers={merged}
              photos={{}}
              setPhotos={() => {}}
              locale={locale}
            />
            {id in changes && (
              <button
                type="button"
                onClick={() => {
                  setChanges(({ [id]: _, ...rest }) => rest);
                  if (picked === id) setPicked('');
                }}
                className="mt-2 text-xs font-semibold text-muted underline underline-offset-2 hover:text-white"
              >
                {t.amendCancelFix}
              </button>
            )}
          </div>
        ))}
      </div>

      {needsReason && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-white" htmlFor={`reason-${visit.id}`}>
            {t.amendReason}
          </label>
          <input id={`reason-${visit.id}`} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t.amendReasonPlaceholder} className="field mt-2" />
          <p className="mt-1 text-[11px] text-muted">{t.amendReasonHelp}</p>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      <div className="mt-5 flex gap-2">
        <Button variant="btc" onClick={save} disabled={busy} className="flex-1">
          {busy ? t.amendSaving : t.amendSave}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          {t.amendCancel}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ agenda */

export function Agenda({ visits, locale, onChanged, onGoNow }) {
  const t = ui(locale);
  const [moving, setMoving] = useState(null);
  if (visits === null) return <p className="px-5 py-16 text-center text-sm text-muted">{t.mineLoading}</p>;

  const today = todayYmd();
  const tomorrow = addDays(today, 1);
  const open = visits
    .filter((v) => v.ripasso && !v.superseded)
    .sort((a, b) => `${a.ripasso} ${a.answers?.ritorno_ora ?? ''}`.localeCompare(`${b.ripasso} ${b.answers?.ritorno_ora ?? ''}`));
  const groups = [
    ['overdue', t.agendaOverdue, open.filter((v) => v.ripasso < today)],
    ['today', t.agendaToday, open.filter((v) => v.ripasso === today)],
    ['tomorrow', t.agendaTomorrow, open.filter((v) => v.ripasso === tomorrow)],
    ['later', t.agendaLater, open.filter((v) => v.ripasso > tomorrow)],
  ].filter(([, , list]) => list.length);

  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-24 pt-6">
      <h2 className="text-xl font-bold">{t.tabAgenda}</h2>
      <p className="mt-1 text-xs text-muted">{t.agendaHint}</p>
      {groups.length === 0 && <p className="mt-6 text-sm text-muted">{t.agendaEmpty}</p>}
      {groups.map(([id, title, list]) => (
        <div key={id} className="mt-6">
          <h3 className={cn('text-xs font-semibold uppercase tracking-[0.14em]', id === 'overdue' ? 'text-red-300' : 'text-btc')}>
            {title} · {list.length}
          </h3>
          <ul className="mt-2 space-y-2">
            {list.map((v) => (
              <li key={v.id} className={cn('rounded-2xl border bg-ink-soft/60 p-4', id === 'overdue' ? 'border-red-400/30' : 'border-white/10')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{v.merchantName}</p>
                    {v.address && <p className="text-xs text-muted">{v.address}</p>}
                    <p className="mt-1 text-sm text-white">
                      {swiss(v.ripasso)}
                      {v.answers?.ritorno_ora ? `, ${v.answers.ritorno_ora}` : ''}
                      {v.reschedules > 0 && <span className="ml-2 text-xs text-btc">{t.rescheduledTimes(v.reschedules)}</span>}
                    </p>
                    {v.answers?.ritorno_motivo && <p className="text-xs text-muted">{answerIn(Q.ritorno_motivo, v.answers.ritorno_motivo, locale)}</p>}
                  </div>
                  <OutcomeBadge id={v.outcome} locale={locale} className="shrink-0" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="btc" size="sm" onClick={() => onGoNow(v)}>
                    <Play className="h-4 w-4" /> {t.goNow}
                  </Button>
                  {v.editable && (
                    <Button variant="ghost" size="sm" onClick={() => setMoving(moving === v.id ? null : v.id)}>
                      <CalendarClock className="h-4 w-4 text-btc" /> {t.reschedule}
                    </Button>
                  )}
                  <Button as="a" href={`/api/rilevazioni?ics=${encodeURIComponent(v.id)}`} variant="ghost" size="sm">
                    <CalendarPlus className="h-4 w-4 text-btc" /> {t.addCalendar}
                  </Button>
                  {v.address && (
                    <Button as="a" href={mapsUrl({ name: v.merchantName, address: v.address })} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm">
                      <Navigation className="h-4 w-4 text-btc" /> {t.directions}
                    </Button>
                  )}
                </div>
                {moving === v.id && (
                  <RescheduleForm
                    visit={v}
                    locale={locale}
                    onDone={() => {
                      setMoving(null);
                      onChanged();
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function RescheduleForm({ visit, locale, onDone }) {
  const t = ui(locale);
  const [date, setDate] = useState(visit.ripasso);
  const [time, setTime] = useState(visit.answers?.ritorno_ora ?? '');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append('intent', 'reschedule');
    body.append('visitId', visit.id);
    body.append('date', date);
    body.append('time', time);
    body.append('reason', reason);
    try {
      const res = await fetch('/api/rilevazioni', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (res.ok) return onDone();
      if (res.status === 401) return setError(t.sessionExpired);
      setError(json.errors?._ === 'nothing' ? t.amendNothing : t.genericError);
    } catch {
      setError(t.offline);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-ink-deep/40 p-3 sm:grid-cols-2">
      <label className="text-xs text-muted">
        {t.rescheduleDate}
        <input type="date" value={date} min={todayYmd()} onChange={(e) => setDate(e.target.value)} className="field mt-1" />
      </label>
      <label className="text-xs text-muted">
        {t.rescheduleTime}
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1" />
      </label>
      <label className="text-xs text-muted sm:col-span-2">
        {t.rescheduleReason}
        <input value={reason} onChange={(e) => setReason(e.target.value)} className="field mt-1" />
      </label>
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <Button variant="btc" size="sm" onClick={save} disabled={busy || !date} className="sm:col-span-2">
        {t.rescheduleSave}
      </Button>
    </div>
  );
}
