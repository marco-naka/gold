'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LocateFixed, MapPin, Maximize2, Navigation, Search, ShieldCheck, X } from 'lucide-react';
import { NakaLogo } from './Brand';
import LanguageSwitch from './LanguageSwitch';
import Footer from './Footer';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { PAYMENT_ASSETS } from '@/lib/constants';
import { getDictionary, localePath } from '@/lib/i18n';
import { MERCHANTS, MERCHANT_BOUNDS, distanceMeters, mapsUrl } from '@/lib/merchants';

/*
 * Mappa dei negozi aderenti, su /mappa e /en/map.
 *
 * L'elenco della home risponde a «quale negozio ho a due passi» con la distanza; qui la
 * stessa domanda ha una risposta che si guarda: strade vere (OpenStreetMap), un punto per
 * negozio colorato per categoria, la propria posizione e i più vicini evidenziati.
 *
 * Mappa ed elenco sono la stessa cosa vista in due modi: filtri e ricerca valgono per
 * entrambi, toccare un negozio nell'elenco lo apre sulla mappa e viceversa. L'elenco è
 * anche l'alternativa accessibile a chi la mappa non la vede.
 *
 * Leaflet si carica solo nel browser (tocca `window` all'import): la pagina si disegna sul
 * server con l'elenco, la mappa arriva subito dopo.
 */

const COLORS = { food: '#F7931A', shopping: '#FFD700', services: '#60A5FA', hotel: '#C084FC' };
const PAGE = 30;
// Oltre questa distanza dal centro, «i più vicini» non sono a portata di passeggiata:
// si resta sull'inquadratura di Lugano invece di zoomare sull'Europa.
const FAR_METERS = 25000;
const LUGANO = { lat: 46.0037, lng: 8.9511 };

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export default function MerchantMap({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.mapPage;
  const tm = dict.map;
  const categoryLabel = (id) => tm.categories[id] ?? id;

  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const layerRef = useRef(null);
  const markersRef = useRef(new Map());
  const meRef = useRef(null);
  const [ready, setReady] = useState(false);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [position, setPosition] = useState(null); // { lat, lng, accuracy }
  const [geo, setGeo] = useState('idle'); // idle | loading | on | denied | unsupported
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE);

  // Ricerca, categoria e negozio aperto vivono nell'URL: un link può mostrare un negozio preciso.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) setQuery(params.get('q'));
    if (params.get('cat') && params.get('cat') in tm.categories) setCategory(params.get('cat'));
    if (params.get('negozio') && MERCHANTS.some((m) => m.id === params.get('negozio'))) setSelected(params.get('negozio'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    query.trim() ? params.set('q', query.trim()) : params.delete('q');
    category !== 'all' ? params.set('cat', category) : params.delete('cat');
    selected ? params.set('negozio', selected) : params.delete('negozio');
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
  }, [query, category, selected]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(tm.categories).map((id) => [
          id,
          id === 'all' ? MERCHANTS.length : MERCHANTS.filter((m) => m.category === id).length,
        ]),
      ),
    [tm.categories],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = MERCHANTS.filter(
      (m) =>
        (category === 'all' || m.category === category) &&
        (!q || m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q)),
    );
    if (!position) return [...list].sort((a, b) => a.name.localeCompare(b.name, locale));
    return list.map((m) => ({ ...m, distance: distanceMeters(position, m) })).sort((a, b) => a.distance - b.distance);
  }, [query, category, position, locale]);

  useEffect(() => setVisible(PAGE), [query, category, position]);

  const far = position && distanceMeters(position, LUGANO) > FAR_METERS;

  /* ------------------------------------------------------------------ mappa */

  useEffect(() => {
    let cancelled = false;
    let map;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current) return;
      map = L.map(mapEl.current, { zoomControl: true, attributionControl: true });
      map.fitBounds(
        [
          [MERCHANT_BOUNDS.minLat, MERCHANT_BOUNDS.minLng],
          [MERCHANT_BOUNDS.maxLat, MERCHANT_BOUNDS.maxLng],
        ],
        { padding: [24, 24] },
      );
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      leafletRef.current = L;
      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markersRef.current = new Map();
    };
  }, []);

  // Un punto per negozio filtrato. Il popup si costruisce come HTML: i testi vengono dalla
  // Crypto Map pubblica, quindi passano tutti da escapeHtml.
  useEffect(() => {
    if (!ready) return;
    const L = leafletRef.current;
    const layer = layerRef.current;
    layer.clearLayers();
    markersRef.current = new Map();
    for (const m of results) {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 7,
        color: '#0D0D0D',
        weight: 1.5,
        fillColor: COLORS[m.category] ?? '#F7931A',
        fillOpacity: 0.95,
      });
      const distance = m.distance != null ? ` · ${escapeHtml(tm.distance(m.distance))}` : '';
      const site = m.website
        ? `<a href="${escapeHtml(m.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tm.linkKinds[m.websiteKind] ?? tm.website)}</a>`
        : '';
      marker.bindPopup(
        `<div class="naka-pop">
          <strong>${escapeHtml(m.name)}</strong>
          <span>${escapeHtml(m.address)}</span>
          <span class="naka-pop-meta">${escapeHtml(categoryLabel(m.category))}${distance}</span>
          <span class="naka-pop-links"><a href="${escapeHtml(mapsUrl(m))}" target="_blank" rel="noopener noreferrer">${escapeHtml(tm.directions)} →</a>${site}</span>
        </div>`,
        { maxWidth: 260 },
      );
      marker.on('click', () => setSelected(m.id));
      marker.addTo(layer);
      markersRef.current.set(m.id, marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, results]);

  // Il negozio scelto si ingrandisce e apre il popup; gli altri tornano normali.
  useEffect(() => {
    if (!ready) return;
    for (const [id, marker] of markersRef.current) {
      const on = id === selected;
      marker.setStyle({ radius: on ? 11 : 7, color: on ? '#FFFFFF' : '#0D0D0D', weight: on ? 3 : 1.5 });
      if (on) marker.bringToFront();
    }
    const marker = selected && markersRef.current.get(selected);
    if (marker) {
      const map = mapRef.current;
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 17), { duration: 0.6 });
      marker.openPopup();
    }
  }, [ready, selected, results]);

  // La propria posizione: punto blu con il cerchio di precisione, e inquadratura sui più vicini.
  useEffect(() => {
    if (!ready || !position) return;
    const L = leafletRef.current;
    const map = mapRef.current;
    meRef.current?.remove();
    meRef.current = L.layerGroup([
      L.circle([position.lat, position.lng], {
        radius: Math.min(position.accuracy ?? 0, 300),
        color: '#3B82F6',
        weight: 1,
        fillColor: '#3B82F6',
        fillOpacity: 0.12,
        interactive: false,
      }),
      L.circleMarker([position.lat, position.lng], {
        radius: 8,
        color: '#FFFFFF',
        weight: 3,
        fillColor: '#3B82F6',
        fillOpacity: 1,
      }).bindTooltip(t.youAreHere, { direction: 'top', offset: [0, -8] }),
    ]).addTo(map);

    if (far) return;
    const nearest = MERCHANTS.map((m) => ({ m, d: distanceMeters(position, m) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);
    map.flyToBounds(
      L.latLngBounds([[position.lat, position.lng], ...nearest.map(({ m }) => [m.lat, m.lng])]),
      { padding: [48, 48], maxZoom: 17, duration: 0.8 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, position]);

  const locate = () => {
    if (!navigator.geolocation) return setGeo('unsupported');
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Resta nel browser: serve a ordinare e a disegnare il punto, non viene inviata.
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setGeo('on');
        setSelected(null);
      },
      () => setGeo('denied'),
      // Al primo tocco va bene una posizione di un minuto fa; «aggiorna» ne vuole una nuova.
      { enableHighAccuracy: true, timeout: 10000, maximumAge: position ? 0 : 60000 },
    );
  };

  const resetView = () => {
    setSelected(null);
    mapRef.current?.closePopup();
    mapRef.current?.flyToBounds(
      [
        [MERCHANT_BOUNDS.minLat, MERCHANT_BOUNDS.minLng],
        [MERCHANT_BOUNDS.maxLat, MERCHANT_BOUNDS.maxLng],
      ],
      { padding: [24, 24], duration: 0.6 },
    );
  };

  const pick = (id) => {
    setSelected(id);
    // Su telefono la mappa sta sopra l'elenco: si torna su a vederla.
    if (window.innerWidth < 1024) mapEl.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const shown = results.slice(0, visible);

  return (
    <>
      <header className="border-b border-white/10 bg-ink-deep/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href={localePath(locale)} aria-label={dict.nav.home}>
            <NakaLogo id="map" locale={locale} />
          </Link>
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-btc"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToSite}
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-btc">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{t.intro(MERCHANTS.length)}</p>
        <p className="mt-2 text-xs text-muted">
          {tm.allAccept}{' '}
          <span className="font-semibold text-white">{PAYMENT_ASSETS.map((a) => a.label).join(' · ')}</span>
        </p>

        {/* Controlli: valgono per mappa ed elenco insieme */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <Button type="button" variant="btc" onClick={locate} disabled={geo === 'loading'} className="lg:shrink-0">
            <LocateFixed className={cn('h-4 w-4', geo === 'loading' && 'animate-pulse')} />
            {geo === 'loading' ? t.locating : position ? t.locateAgain : t.locate}
          </Button>
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tm.searchPlaceholder}
              aria-label={tm.searchLabel}
              className="field pl-11 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={tm.clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
            {Object.entries(tm.categories).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                aria-pressed={category === id}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition',
                  category === id
                    ? 'border-btc/60 bg-btc/15 text-btc'
                    : 'border-white/10 bg-white/5 text-muted hover:border-white/25 hover:text-white',
                )}
              >
                {id !== 'all' && (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[id] }} aria-hidden="true" />
                )}
                {label}
                <span className="tabular-nums opacity-70">{counts[id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div role="status" aria-live="polite" className="mt-3 space-y-1 text-xs">
          {geo === 'denied' && <p className="text-red-300">{t.denied}</p>}
          {geo === 'unsupported' && <p className="text-red-300">{t.unsupported}</p>}
          {far && <p className="text-btc">{t.far}</p>}
          {position && results[0] && !far && (
            <p className="text-white">{t.nearest(results[0].name, tm.distance(results[0].distance))}</p>
          )}
          <p className="flex items-center gap-1.5 text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-btc" />
            {t.privacy}
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Mappa: prima su telefono, a destra su schermo largo */}
          <div className="relative lg:order-2">
            <div
              ref={mapEl}
              role="region"
              aria-label={t.title}
              className="naka-map h-[58svh] min-h-[340px] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-soft lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)]"
            />
            <button
              type="button"
              onClick={resetView}
              className="absolute bottom-4 left-4 z-[500] inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-deep/90 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:border-btc/50"
            >
              <Maximize2 className="h-3.5 w-3.5 text-btc" />
              {t.resetView}
            </button>
          </div>

          {/* Elenco */}
          <section className="lg:order-1" aria-label={position ? t.listNear : t.listAll}>
            <h2 className="flex items-baseline justify-between text-sm font-bold">
              {position ? t.listNear : t.listAll}
              <span className="text-xs font-semibold text-muted">
                {results.length} {results.length === 1 ? tm.resultsOne : tm.resultsMany}
              </span>
            </h2>

            {results.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-white/10 bg-ink-soft/60 p-6 text-center">
                <p className="text-sm font-semibold text-white">{tm.emptyTitle}</p>
                <p className="mt-1 text-xs text-muted">{tm.emptyText}</p>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60">
                {shown.map((m) => (
                  <li key={m.id}>
                    <div
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 transition',
                        selected === m.id ? 'bg-btc/10' : 'hover:bg-white/[0.03]',
                      )}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/90">
                        {m.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element -- loghi statici già ottimizzati
                          <img src={m.logo} alt="" width={40} height={40} loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
                        ) : (
                          <span className="text-sm font-extrabold text-ink-deep">{m.name.trim()[0]}</span>
                        )}
                      </span>
                      <button type="button" onClick={() => pick(m.id)} className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-semibold text-white">{m.name}</span>
                        <span className="mt-0.5 flex items-start gap-1 text-xs text-muted">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0" style={{ color: COLORS[m.category] }} />
                          <span className="truncate">{m.address}</span>
                        </span>
                        <span className="mt-1 block text-[11px] text-muted">
                          {categoryLabel(m.category)}
                          {m.distance != null && (
                            <span className="font-semibold text-btc"> · {tm.distance(m.distance)}</span>
                          )}
                        </span>
                      </button>
                      <a
                        href={mapsUrl(m)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tm.directions}: ${m.name}`}
                        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-btc transition hover:border-btc/50"
                      >
                        <Navigation className="h-4 w-4" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {visible < results.length && (
              <Button type="button" variant="ghost" onClick={() => setVisible((v) => v + PAGE)} className="mt-3 w-full">
                {t.showMore(Math.min(PAGE, results.length - visible))}
              </Button>
            )}

            <div className="mt-5 rounded-2xl border border-btc/25 bg-btc/[0.07] p-4">
              <p className="text-sm text-white">{t.howToPay}</p>
              <Button as="a" href={`${localePath(locale, '/p')}?s=mappa`} variant="secondary" size="sm" className="mt-3">
                {t.enter}
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
