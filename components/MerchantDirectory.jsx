'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  X,
  CheckCircle2,
  Globe,
  Instagram,
  LocateFixed,
  ArrowDownAZ,
  Wallet,
} from 'lucide-react';
import { EVENT, PAYMENT_ASSETS } from '@/lib/constants';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { formatDate } from '@/lib/i18n';
import { MERCHANTS, MERCHANT_SOURCE, distanceMeters, mapsUrl } from '@/lib/merchants';

const PAGE_SIZE = 12;

/**
 * Elenco dei negozi aderenti.
 *
 * Qui c'era una mappa schematica: pin dorati su una griglia, senza strade né lago. Sembrava
 * informazione e non lo era — nessuno capiva dove fosse un negozio, né quale fosse vicino.
 * Chi apre questa pagina in centro ha una domanda sola, "quale negozio ho a due passi": si
 * risponde con la distanza reale e con le indicazioni, non con un disegno.
 */
export default function MerchantDirectory({ t, locale, limit = null, onSeeAll = null }) {
  const categoryLabel = (id) => t.categories[id] ?? id;

  // Il conteggio accanto all'etichetta evita il filtro che non dà risultati.
  const CATEGORIES = useMemo(
    () =>
      Object.entries(t.categories).map(([id, label]) => ({
        id,
        label,
        count: id === 'all' ? MERCHANTS.length : MERCHANTS.filter((m) => m.category === id).length,
      })),
    [t.categories]
  );

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  // Ricerca e categoria vivono anche nell'URL: un merchant può mandare ai clienti il link
  // che lo mostra, e il tasto indietro del browser si comporta come ci si aspetta.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const cat = params.get('cat');
    if (q) setQuery(q);
    if (cat && cat in t.categories) setCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    query.trim() ? params.set('q', query.trim()) : params.delete('q');
    category !== 'all' ? params.set('cat', category) : params.delete('cat');
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', next);
  }, [query, category]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [position, setPosition] = useState(null);
  const [geoState, setGeoState] = useState('idle'); // idle | loading | on | denied

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = MERCHANTS.filter((m) => {
      const matchCategory = category === 'all' || m.category === category;
      const matchQuery = !q || m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });

    if (!position) return filtered;
    return filtered
      .map((m) => ({ ...m, distance: distanceMeters(position, m) }))
      .sort((a, b) => a.distance - b.distance);
  }, [query, category, position]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, category]);

  const askLocation = () => {
    if (!navigator.geolocation) return setGeoState('denied');
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // La posizione resta nel browser: non viene inviata a noi né a terzi.
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState('on');
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  const capped = limit ? results.slice(0, limit) : results;
  const shown = limit ? capped : results.slice(0, visible);

  return (
    <section id="mappa" className="section-pad">
      <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle(EVENT.name)} />

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              <span className={cn('ml-1.5 tabular-nums', category === cat.id ? 'text-gold/70' : 'text-muted/70')}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" role="status" aria-live="polite">
          <span className="font-semibold text-white">{results.length}</span>{' '}
          {results.length === 1 ? t.resultsOne : t.resultsMany}
          {category !== 'all' && t.inCategory(categoryLabel(category))}
        </p>

        <div className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setPosition(null)}
            aria-pressed={!position}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              position ? 'text-muted hover:text-white' : 'bg-gold/15 text-gold'
            )}
          >
            <ArrowDownAZ className="h-4 w-4" />
            {t.sortAlpha}
          </button>
          <button
            type="button"
            onClick={askLocation}
            disabled={geoState === 'loading'}
            aria-pressed={Boolean(position)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              position ? 'bg-gold/15 text-gold' : 'text-muted hover:text-white'
            )}
          >
            <LocateFixed className={cn('h-4 w-4', geoState === 'loading' && 'animate-pulse')} />
            {geoState === 'loading' ? t.nearMeLoading : t.sortNear}
          </button>
        </div>
      </div>

      {geoState === 'denied' && <p className="mt-2 text-xs text-muted/80">{t.nearMeDenied}</p>}

      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <Wallet className="h-3.5 w-3.5 text-gold" />
        {t.allAccept}
        {PAYMENT_ASSETS.map((asset, i) => (
          <span key={asset.code} className="font-semibold text-white">
            {asset.label}
            {i < PAYMENT_ASSETS.length - 1 && <span className="font-normal text-muted"> ·</span>}
          </span>
        ))}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {shown.map((m) => (
          <GlassCard key={m.id} className="flex flex-col p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                {/* Fondo chiaro dietro il logo: molti sono scuri o trasparenti e su nero sparirebbero */}
                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/90">
                  {m.logo ? (
                    <img
                      src={m.logo}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-base font-extrabold text-ink-deep">{m.name.trim()[0]}</span>
                  )}
                </span>
                <div className="min-w-0">
                <h3 className="text-base font-bold text-white">{m.name}</h3>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  {m.address}
                </p>
                </div>
              </div>
              {m.distance != null && (
                <span className="chip border-gold/30 bg-gold/10 text-gold">{t.distance(m.distance)}</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="chip">{categoryLabel(m.category)}</span>
              {/* Un badge si mostra solo quando distingue: l'adesione confermata da NAKA. */}
              {m.verified && (
                <span
                  className="chip border-green-500/30 bg-green-500/10 text-green-400"
                  title={t.badgeVerifiedTitle}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t.badgeVerified}
                </span>
              )}
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
                  {m.websiteKind === 'instagram' ? (
                    <Instagram className="h-4 w-4 text-gold" />
                  ) : (
                    <Globe className="h-4 w-4 text-gold" />
                  )}
                  {t.linkKinds[m.websiteKind] ?? t.website}
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {!results.length && (
        <GlassCard hover={false} className="mt-4 p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-4 text-sm font-medium text-white">{t.emptyTitle}</p>
          <p className="mt-1 text-xs text-muted">{t.emptyText}</p>
        </GlassCard>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {limit && results.length > limit && onSeeAll && (
          <Button as="a" href={onSeeAll} variant="secondary">
            {t.seeAll(results.length)}
          </Button>
        )}
        {!limit && visible < results.length && (
          <Button type="button" variant="ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            {t.showMore(Math.min(PAGE_SIZE, results.length - visible))}
          </Button>
        )}
      </div>

      {MERCHANT_SOURCE.url && (
        <p className="mt-8 text-center text-[11px] leading-relaxed text-muted/80">
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
