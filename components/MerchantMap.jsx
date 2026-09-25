'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Navigation, X, CheckCircle2, Globe } from 'lucide-react';
import { EVENT } from '@/lib/constants';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { formatDate } from '@/lib/i18n';
import {
  MERCHANTS,
  MERCHANT_BOUNDS as BOUNDS,
  MERCHANT_LANDMARKS,
  MERCHANT_SOURCE,
  mapsUrl,
} from '@/lib/merchants';

const PAGE_SIZE = 12;
// Lato della cella di raggruppamento, in percentuale del riquadro. A 700 px sono circa 38 px:
// abbastanza da non far sovrapporre due punti, abbastanza poco da non fondere vie diverse.
const CELL = 5.5;

/** Coordinate in percentuale del riquadro. Chi cade fuori viene accostato al bordo. */
function project(point) {
  const x = ((point.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng || 1)) * 100;
  const y = (1 - (point.lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat || 1)) * 100;
  const outside = x < 0 || x > 100 || y < 0 || y > 100;
  return { x: Math.min(97, Math.max(3, x)), y: Math.min(97, Math.max(3, y)), outside };
}

/**
 * Raggruppa i negozi vicini in un unico punto.
 *
 * Senza raggruppamento i 336 esercenti producono quasi cinquemila coppie di pin sovrapposti:
 * il centro città diventa una macchia in cui non si distingue nulla e non si può toccare niente.
 */
function clusterize(list) {
  const cells = new Map();
  for (const merchant of list) {
    const p = project(merchant);
    const key = `${Math.floor(p.x / CELL)}:${Math.floor(p.y / CELL)}`;
    const cell = cells.get(key) ?? { key, x: 0, y: 0, outside: false, items: [] };
    cell.items.push(merchant);
    cell.x += p.x;
    cell.y += p.y;
    cell.outside = cell.outside || p.outside;
    cells.set(key, cell);
  }
  return [...cells.values()]
    .map((c) => ({ ...c, x: c.x / c.items.length, y: c.y / c.items.length }))
    .sort((a, b) => a.items.length - b.items.length);
}

export default function MerchantMap({ t, locale }) {
  // Le categorie sono dati (id stabili), le etichette testo: stanno nel dizionario.
  const CATEGORIES = Object.entries(t.categories).map(([id, label]) => ({ id, label }));
  const categoryLabel = (id) => t.categories[id] ?? id;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [zone, setZone] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MERCHANTS.filter((m) => {
      const matchCategory = category === 'all' || m.category === category;
      const matchQuery = !q || m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  // I punti si raggruppano sui risultati filtrati: la mappa segue sempre ricerca e categoria.
  const clusters = useMemo(() => clusterize(results), [results]);

  // Toccare un punto della mappa filtra l'elenco su quei negozi, e viceversa.
  const zoneItems = useMemo(
    () => (zone ? (clusters.find((c) => c.key === zone)?.items ?? []) : null),
    [clusters, zone]
  );
  const listed = zoneItems ?? results;

  // Ogni cambio di filtro riparte dalla prima pagina di risultati.
  useEffect(() => {
    setVisible(PAGE_SIZE);
    setZone(null);
  }, [query, category]);

  const shown = listed.slice(0, visible);

  return (
    <section id="mappa" className="section-pad">
      <SectionTitle
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle(EVENT.name)}
      />

      {/* Ricerca + filtri */}
      <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchLabel}
            className="field pl-11 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
                category === cat.id
                  ? 'border-gold/60 bg-gold/15 text-gold'
                  : 'border-white/10 bg-white/5 text-muted hover:border-white/25 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* Mappa stilizzata: sostituibile con Mapbox/Leaflet mantenendo lo stesso stato `selected`. */}
        <GlassCard hover={false} className="relative h-80 overflow-hidden p-0 lg:h-auto lg:min-h-[34rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-[50%] bg-gold/[0.07] blur-3xl"
          />
          <span className="absolute left-5 top-5 chip border-gold/30 bg-ink-deep/80 text-gold">
            <MapPin className="h-3.5 w-3.5" /> {t.center}
          </span>

          {/* Riferimenti ricavati dagli indirizzi: danno l'orientamento che una griglia vuota non dà */}
          <div className="absolute inset-0 p-10">
            <div className="relative h-full w-full">
              {MERCHANT_LANDMARKS.map((landmark) => {
                const p = project(landmark);
                if (p.outside) return null;
                return (
                  <span
                    key={landmark.name}
                    aria-hidden="true"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-white/25"
                  >
                    {landmark.name}
                  </span>
                );
              })}

              {clusters.map((cluster) => {
                const count = cluster.items.length;
                const isActive = zone === cluster.key;
                const holdsSelected = selected && cluster.items.some((m) => m.id === selected.id);
                // Il diametro cresce con la radice del numero: l'area resta proporzionale ai negozi
                const size = Math.min(52, 22 + Math.sqrt(count) * 7);
                return (
                  <button
                    key={cluster.key}
                    type="button"
                    style={{ left: `${cluster.x}%`, top: `${cluster.y}%`, width: size, height: size }}
                    onClick={() => {
                      setZone(isActive ? null : cluster.key);
                      setSelected(null);
                    }}
                    aria-label={count === 1 ? cluster.items[0].name : t.zoneCount(count)}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-[11px] font-bold transition',
                      'grid place-items-center',
                      isActive || holdsSelected
                        ? 'z-20 border-white/70 bg-gold-gradient text-ink-deep shadow-gold'
                        : 'z-10 border-gold/50 bg-gold/25 text-white backdrop-blur-sm hover:border-gold hover:bg-gold/40'
                    )}
                  >
                    {count === 1 ? <MapPin className="h-4 w-4" strokeWidth={2.4} /> : count}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="pointer-events-none absolute inset-x-5 bottom-5 text-center text-[11px] leading-relaxed text-white/40">
            {t.mapLegend}
          </p>

          {selected && (
            <div className="absolute inset-x-4 bottom-4 z-30 animate-scale-in rounded-2xl border border-gold/30 bg-ink-deep/95 p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{selected.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{selected.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label={t.closeCard}
                  className="rounded-lg border border-white/10 p-1.5 text-muted transition hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <Button as="a" href={mapsUrl(selected)} target="_blank" rel="noopener noreferrer" size="sm" className="mt-3 w-full">
                <Navigation className="h-4 w-4" />
                {t.directions}
              </Button>
            </div>
          )}
        </GlassCard>

        {/* Directory */}
        <div>
          {zone && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5">
              <span className="text-sm font-semibold text-gold">{t.zoneTitle}</span>
              <button
                type="button"
                onClick={() => setZone(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                {t.zoneClear}
              </button>
            </div>
          )}

          <p className="mb-4 text-sm text-muted" role="status" aria-live="polite">
            <span className="font-semibold text-white">{listed.length}</span>{' '}
            {listed.length === 1 ? t.resultsOne : t.resultsMany}
            {category !== 'all' && t.inCategory(categoryLabel(category))}
          </p>

          <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
            {shown.map((m) => (
              <GlassCard
                key={m.id}
                onMouseEnter={() => setSelected(m)}
                onFocusCapture={() => setSelected(m)}
                className={cn('p-5', selected?.id === m.id && 'border-gold/50 bg-white/[0.06]')}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white">{m.name}</h3>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                      {m.address}
                    </p>
                  </div>
                  <span className="chip">{categoryLabel(m.category)}</span>
                  {project(m).outside && <span className="chip border-white/10">{t.outsideCore}</span>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'chip',
                      m.verified
                        ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : m.posActive
                          ? 'border-gold/30 bg-gold/10 text-gold'
                          : 'border-white/10'
                    )}
                    title={
                      m.verified
                        ? t.badgeVerifiedTitle
                        : t.badgeCircuitTitle
                    }
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {m.verified ? t.badgeVerified : m.posActive ? t.badgeCircuit : t.badgePending}
                  </span>
                  {m.assets.map((a) => (
                    <span key={a} className="chip">
                      {a}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    as="a"
                    href={mapsUrl(m)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <Navigation className="h-4 w-4 text-gold" />
                    {t.directions}
                  </Button>
                  {m.website && (
                    <Button
                      as="a"
                      href={m.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Globe className="h-4 w-4 text-gold" />
                      {t.website}
                    </Button>
                  )}
                </div>
              </GlassCard>
            ))}

            {visible < listed.length && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="w-full"
              >
                {t.showMore(Math.min(PAGE_SIZE, listed.length - visible))}
              </Button>
            )}

            {!listed.length && (
              <GlassCard hover={false} className="p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-4 text-sm font-medium text-white">{t.emptyTitle}</p>
                <p className="mt-1 text-xs text-muted">{t.emptyText}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      {MERCHANT_SOURCE.url && (
        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/80">
          {t.sourcePrefix}
          <a
            href={MERCHANT_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 underline underline-offset-2 hover:text-gold"
          >
            {MERCHANT_SOURCE.label}
          </a>
          {t.sourceSuffix(MERCHANT_SOURCE.importedAt ? formatDate(MERCHANT_SOURCE.importedAt, locale) : '')}
        </p>
      )}
    </section>
  );
}
