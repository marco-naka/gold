'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, CalendarClock } from 'lucide-react';
import { OUTCOMES, PHOTOS, SECTIONS } from '@/lib/survey';
import { answerIn, askedIn, outcomeIn, photoIn, sectionIn } from '@/lib/survey-i18n';
import { TIME_ZONE } from '@/lib/time';
import { cn } from './ui/cn';

/*
 * Le rilevazioni come tabella, dentro il pannello: lo stesso contenuto del CSV, ma sempre
 * aggiornato e senza scaricare niente.
 *
 * Una riga per visita, una colonna per domanda, raggruppate per sezione del questionario.
 * Il negozio resta fermo a sinistra e le intestazioni in alto mentre si scorre: con
 * cinquanta colonne è l'unico modo di sapere che cosa si sta guardando. Le sezioni si
 * nascondono dai bottoni sopra, l'ordinamento si cambia toccando un'intestazione, una riga
 * apre la scheda completa con le foto.
 */

const TONE = {
  ok: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  wait: 'border-btc/30 bg-btc/10 text-btc',
  no: 'border-red-400/30 bg-red-400/10 text-red-300',
};
const BROKEN = 'Terminale non funzionante — chiamare subito l’assistenza';
const hasPosProblem = (v) => v.answers?.problema_flag === true || v.answers?.pos_stato === BROKEN;
const photosOf = (v) => PHOTOS.flatMap((p) => [].concat(v.photos?.[p.id] ?? []).map((ph) => ({ ...ph, slot: p })));

const when = (iso, locale) =>
  new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function RilevazioniTable({ visits, locale, t, onOpen }) {
  const [hidden, setHidden] = useState(() => new Set());
  const [sort, setSort] = useState({ key: 'when', dir: 'desc' });

  // Le sezioni del questionario, con le sole domande che hanno una risposta da mostrare.
  const groups = useMemo(
    () =>
      SECTIONS.map((section) => ({
        id: section.id,
        title: sectionIn(section, locale).title,
        questions: section.questions.filter((q) => q.type !== 'photo' && q.type !== 'qr'),
      })),
    [locale],
  );
  const shownGroups = groups.filter((g) => !hidden.has(g.id));

  const outcomeOf = (id) => OUTCOMES.find((o) => o.id === id) ?? { id, label: id, tone: 'wait' };

  // Il valore con cui si ordina una colonna: data, testo o numero, mai la cella già formattata.
  const valueFor = (v, key) => {
    if (key === 'when') return v.createdAt;
    if (key === 'surveyor') return v.surveyor || '';
    if (key === 'shop') return v.merchantName;
    if (key === 'outcome') return outcomeIn(v.outcome, outcomeOf(v.outcome).label, locale);
    if (key === 'photos') return photosOf(v).length;
    const raw = v.answers?.[key];
    if (raw === undefined) return null;
    return typeof raw === 'number' ? raw : Array.isArray(raw) ? raw.join(', ') : String(raw);
  };

  const rows = useMemo(() => {
    const list = [...visits];
    list.sort((a, b) => {
      const x = valueFor(a, sort.key);
      const y = valueFor(b, sort.key);
      // Le celle vuote vanno in fondo in entrambi i versi: non sono «più piccole» di niente.
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), locale);
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits, sort, locale]);

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'when' ? 'desc' : 'asc' },
    );

  const toggleGroup = (id) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const Th = ({ id, children, className }) => (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-white/10 bg-ink-soft px-3 py-2.5 text-left font-semibold',
        className,
      )}
    >
      <button type="button" onClick={() => toggleSort(id)} className="inline-flex items-center gap-1 hover:text-white">
        {children}
        {sort.key === id &&
          (sort.dir === 'asc' ? <ArrowUp className="h-3 w-3 text-btc" /> : <ArrowDown className="h-3 w-3 text-btc" />)}
      </button>
    </th>
  );

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted">{t.columns}</span>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggleGroup(g.id)}
            aria-pressed={!hidden.has(g.id)}
            className={cn(
              'rounded-full border px-3 py-1.5 font-semibold transition',
              hidden.has(g.id) ? 'border-white/10 text-muted hover:text-white' : 'border-btc/40 bg-btc/10 text-btc',
            )}
          >
            {g.title}
          </button>
        ))}
        <span className="ml-auto hidden text-muted sm:inline">{t.tableHint}</span>
      </div>

      <div className="mt-3 max-h-[72vh] overflow-auto rounded-2xl border border-white/10 bg-ink-soft/60">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="sticky top-0 z-20 text-muted">
            {/* Prima riga: il nome della sezione sopra le sue domande */}
            <tr>
              <th
                colSpan={5}
                className="border-b border-white/10 bg-ink-soft px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] text-btc"
              >
                {t.groupVisit}
              </th>
              {shownGroups.map((g) => (
                <th
                  key={g.id}
                  colSpan={g.questions.length}
                  className="border-b border-l border-white/10 bg-ink-soft px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] text-btc"
                >
                  {g.title}
                </th>
              ))}
              <th className="border-b border-l border-white/10 bg-ink-soft" />
            </tr>
            <tr>
              <Th id="shop" className="sticky left-0 z-30 min-w-[150px] sm:min-w-[200px]">
                {t.colShop}
              </Th>
              <Th id="when">{t.colWhen}</Th>
              <Th id="surveyor">{t.colSurveyor}</Th>
              <Th id="outcome">{t.colOutcome}</Th>
              <th className="border-b border-white/10 bg-ink-soft px-3 py-2.5 text-left font-semibold">ID</th>
              {shownGroups.flatMap((g) =>
                g.questions.map((q, i) => (
                  <Th key={q.id} id={q.id} className={cn('max-w-[240px]', i === 0 && 'border-l')}>
                    <span className="max-w-[220px] truncate" title={askedIn(q, locale).label}>
                      {askedIn(q, locale).label}
                    </span>
                  </Th>
                )),
              )}
              <Th id="photos" className="border-l">
                {t.colPhotos}
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={99} className="px-5 py-8 text-center text-sm text-muted">
                  {t.empty}
                </td>
              </tr>
            )}
            {rows.map((v) => {
              const o = outcomeOf(v.outcome);
              const photos = photosOf(v);
              return (
                <tr key={v.id} onClick={() => onOpen(v)} className="group cursor-pointer">
                  <td className="sticky left-0 z-10 border-b border-white/5 bg-ink-soft px-3 py-2.5 group-hover:bg-[#1d1d24]">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      {hasPosProblem(v) && (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-300" aria-label={t.posIcon} />
                      )}
                      {v.answers?.ritorno_quando && (
                        <CalendarClock className="h-3.5 w-3.5 shrink-0 text-btc" aria-label={t.returnIcon} />
                      )}
                      <span className="max-w-[150px] truncate sm:max-w-[220px]">{v.merchantName}</span>
                    </span>
                    {v.mapSnapshot?.address && (
                      <span className="block max-w-[240px] truncate text-[11px] text-muted">
                        {v.mapSnapshot.address}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/5 px-3 py-2.5 tabular-nums text-white group-hover:bg-white/[0.03]">
                    {when(v.createdAt, locale)}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/5 px-3 py-2.5 group-hover:bg-white/[0.03]">
                    {v.surveyor || '—'}
                  </td>
                  <td className="whitespace-nowrap border-b border-white/5 px-3 py-2.5 group-hover:bg-white/[0.03]">
                    <span className={cn('rounded-full border px-2 py-0.5 font-semibold', TONE[o.tone])}>
                      {outcomeIn(o.id, o.label, locale)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b border-white/5 px-3 py-2.5 font-mono text-[11px] text-muted group-hover:bg-white/[0.03]">
                    {v.id}
                  </td>
                  {shownGroups.flatMap((g) =>
                    g.questions.map((q, i) => {
                      const raw = v.answers?.[q.id];
                      const text = raw === undefined ? '' : answerIn(q, raw, locale);
                      return (
                        <td
                          key={q.id}
                          title={text || undefined}
                          className={cn(
                            'max-w-[240px] truncate border-b border-white/5 px-3 py-2.5 group-hover:bg-white/[0.03]',
                            i === 0 && 'border-l border-l-white/10',
                            text ? 'text-white' : 'text-muted/40',
                          )}
                        >
                          {text || '—'}
                        </td>
                      );
                    }),
                  )}
                  <td className="border-b border-l border-white/5 border-l-white/10 px-3 py-2 group-hover:bg-white/[0.03]">
                    {photos.length ? (
                      <span className="flex gap-1">
                        {photos.slice(0, 4).map((ph) => (
                          // eslint-disable-next-line @next/next/no-img-element -- foto private, servite dall'API protetta
                          <img
                            key={ph.key}
                            src={`/api/rilevazioni/foto?key=${encodeURIComponent(ph.key)}`}
                            alt={photoIn(ph.slot, locale).label}
                            loading="lazy"
                            className="h-8 w-8 rounded-md border border-white/10 object-cover"
                          />
                        ))}
                        {photos.length > 4 && <span className="self-center text-muted">+{photos.length - 4}</span>}
                      </span>
                    ) : (
                      <span className="text-muted/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
