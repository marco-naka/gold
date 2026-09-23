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
  MERCHANT_SOURCE,
  mapsUrl,
} from '@/lib/merchants';

const PAGE_SIZE = 12;
// Oltre questa soglia la mappa stilizzata diventa illeggibile: si mostrano i primi N pin.
const MAX_PINS = 140;

// Proiezione lineare dei pin sul bounding box reale dei merchant importati.
const project = (m) => ({
  left: `${((m.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng || 1)) * 100}%`,
  top: `${(1 - (m.lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat || 1)) * 100}%`,
});

export default function MerchantMap({ t, locale }) {
  // Le categorie sono dati (id stabili), le etichette testo: stanno nel dizionario.
  const CATEGORIES = Object.entries(t.categories).map(([id, label]) => ({ id, label }));
  const categoryLabel = (id) => t.categories[id] ?? id;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MERCHANTS.filter((m) => {
      const matchCategory = category === 'all' || m.category === category;
      const matchQuery = !q || m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  // Ogni cambio di filtro riparte dalla prima pagina di risultati.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, category]);

  const shown = results.slice(0, visible);

  return (
    <section id="mappa" className="section-pad">
      <SectionTitle
        eyebrow="Mappa merchant"
        title="Dove spendere crypto a Lugano"
        subtitle="Tutti gli esercenti aderenti con POS NAKA attivo durante la settimana del Plan ₿ Forum 2026."
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

          <div className="absolute inset-0 p-10">
            <div className="relative h-full w-full">
              {results.slice(0, MAX_PINS).map((m) => {
                const pos = project(m);
                const isActive = selected?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    style={pos}
                    onClick={() => setSelected(isActive ? null : m)}
                    aria-label={`${m.name}, ${m.address}`}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform',
                      isActive ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-8 w-8 place-items-center rounded-full border text-ink-deep shadow-gold-sm transition',
                        isActive
                          ? 'border-white/60 bg-gold-gradient'
                          : m.posActive
                            ? 'border-gold/50 bg-gold/80'
                            : 'border-white/20 bg-white/20 text-white'
                      )}
                    >
                      <MapPin className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
          <p className="mb-4 text-sm text-muted" role="status" aria-live="polite">
            <span className="font-semibold text-white">{results.length}</span>{' '}
            {results.length === 1 ? t.resultsOne : t.resultsMany}
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

            {visible < results.length && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="w-full"
              >
                {t.showMore(Math.min(PAGE_SIZE, results.length - visible))}
              </Button>
            )}

            {!results.length && (
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
