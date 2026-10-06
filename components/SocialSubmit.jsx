'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Link2, Loader2, MapPin, Search, Send, X } from 'lucide-react';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { normalizeUrl, platformOf } from '@/lib/social-links';
import { getDictionary } from '@/lib/i18n';

/*
 * Segnalazione di un contenuto social, nell'area commercianti.
 *
 * Il commerciante sceglie il suo negozio, sulla mappa o cercandolo per nome, incolla il link
 * e invia: è la segnalazione che il regolamento chiede per mettere il contenuto in gara. Nessun
 * account: l'elenco lo vede l'admin, e il negozio scelto deve essere uno dell'elenco.
 *
 * `shops` arriva già ridotto dal server (id, nome, indirizzo, coordinate): l'elenco completo
 * dei negozi pesa troppo per mandarlo intero a ogni visitatore.
 */

const MAX_RESULTS = 6;

export default function SocialSubmit({ shops, bounds, locale, fallbackHref, fallbackEmail }) {
  // I testi si leggono qui: contengono funzioni, che dal server a un componente client non passano.
  const t = getDictionary(locale).video.form;
  const [query, setQuery] = useState('');
  const [shopId, setShopId] = useState(null);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // trappola per bot
  const [state, setState] = useState({ status: 'idle' }); // idle | sending | done | error
  const [errors, setErrors] = useState({});

  const shop = shops.find((s) => s.id === shopId) ?? null;
  const platform = url.trim() ? platformOf(normalizeUrl(url)) : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return shops
      .filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [query, shops]);

  /* ------------------------------------------------------------ mappa */
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current) return;
      map = L.map(mapEl.current, { zoomControl: true, attributionControl: true, scrollWheelZoom: false });
      map.fitBounds(
        [
          [bounds.minLat, bounds.minLng],
          [bounds.maxLat, bounds.maxLng],
        ],
        { padding: [16, 16] },
      );
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      for (const s of shops) {
        const marker = L.circleMarker([s.lat, s.lng], {
          radius: 6,
          color: '#0D0D0D',
          weight: 1.5,
          fillColor: '#FFD700',
          fillOpacity: 0.9,
        });
        // Il nome come elemento con textContent: i nomi vengono dalla Crypto Map, niente HTML.
        const label = document.createElement('span');
        label.textContent = s.name;
        marker.bindTooltip(label, { direction: 'top', offset: [0, -6] });
        marker.on('click', () => setShopId(s.id));
        marker.addTo(map);
        markersRef.current.set(s.id, marker);
      }
      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markersRef.current = new Map();
    };
  }, [shops, bounds]);

  // Il negozio scelto si evidenzia e la mappa ci va sopra.
  useEffect(() => {
    if (!ready) return;
    for (const [id, marker] of markersRef.current) {
      const on = id === shopId;
      marker.setStyle({ radius: on ? 10 : 6, color: on ? '#FFFFFF' : '#0D0D0D', weight: on ? 3 : 1.5 });
      if (on) marker.bringToFront();
    }
    const marker = shopId && markersRef.current.get(shopId);
    if (marker) mapRef.current.flyTo(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 17), { duration: 0.5 });
  }, [ready, shopId]);

  const choose = (id) => {
    setShopId(id);
    setQuery('');
    setErrors((e) => ({ ...e, merchant: undefined }));
  };

  /* ------------------------------------------------------------ invio */
  const submit = async (event) => {
    event.preventDefault();
    const local = {};
    if (!shopId) local.merchant = 'required';
    if (!url.trim()) local.url = 'required';
    else if (!platform) local.url = 'platform';
    if (Object.keys(local).length) return setErrors(local);

    setErrors({});
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: shopId, url, email, company, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return setState({ status: 'done', duplicate: data.duplicate, platform: data.platform });
      if (data.errors) setErrors(data.errors);
      setState({ status: 'error', code: data.code ?? 'error' });
    } catch {
      setState({ status: 'error', code: 'network' });
    }
  };

  const again = () => {
    setUrl('');
    setState({ status: 'idle' });
  };

  if (state.status === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6" role="status">
        <p className="flex items-center gap-2 text-base font-bold text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          {state.duplicate ? t.duplicate : t.done}
        </p>
        <p className="mt-2 text-sm text-muted">{t.doneText(shop?.name ?? '', state.platform ?? '')}</p>
        <Button variant="secondary-gold" size="sm" className="mt-4" onClick={again}>
          {t.another}
        </Button>
      </div>
    );
  }

  const fieldError = (key) =>
    errors[key] ? <p className="mt-1.5 text-xs font-semibold text-red-300">{t.errors[`${key}_${errors[key]}`] ?? t.errors.generic}</p> : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* 1. Il negozio */}
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          <span className="text-gold">1.</span> {t.shopLabel}
        </p>
        {shop ? (
          <div className="mt-2 flex items-start justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <MapPin className="h-4 w-4 shrink-0 text-gold" />
                {shop.name}
              </span>
              <span className="block truncate text-xs text-muted">{shop.address}</span>
            </span>
            <button type="button" onClick={() => setShopId(null)} className="shrink-0 text-xs font-semibold text-gold underline underline-offset-2">
              {t.change}
            </button>
          </div>
        ) : (
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
            <input
              id="social-shop"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.shopPlaceholder}
              autoComplete="off"
              aria-describedby="social-shop-hint"
              className="w-full rounded-xl border border-white/10 bg-ink-soft py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-3 text-muted" aria-label={t.clear}>
                <X className="h-4 w-4" />
              </button>
            )}
            {results.length > 0 && (
              <ul className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-ink-soft shadow-xl">
                {results.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => choose(s.id)} className="block w-full px-4 py-2.5 text-left hover:bg-white/5">
                      <span className="block text-sm font-semibold text-white">{s.name}</span>
                      <span className="block truncate text-xs text-muted">{s.address}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && results.length === 0 && <p className="mt-1.5 text-xs text-muted">{t.noShop}</p>}
          </div>
        )}
        <p id="social-shop-hint" className="mt-2 text-xs text-muted">{t.shopHint}</p>
        {fieldError('merchant')}
        <div ref={mapEl} className="naka-map mt-3 h-64 w-full overflow-hidden rounded-xl border border-white/10 sm:h-72" aria-label={t.mapLabel} />
      </div>

      {/* 2. Il link, 3. l'email facoltativa */}
      <div className="flex min-w-0 flex-col">
        <label htmlFor="social-url" className="text-sm font-semibold">
          <span className="text-gold">2.</span> {t.urlLabel}
        </label>
        <div className="relative mt-2">
          <Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
          <input
            id="social-url"
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/…"
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-ink-soft py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
          />
        </div>
        <p className={cn('mt-1.5 text-xs', platform ? 'font-semibold text-emerald-300' : 'text-muted')}>
          {platform ? t.recognised(platform) : t.urlHint}
        </p>
        {fieldError('url')}

        <label htmlFor="social-email" className="mt-5 text-sm font-semibold">
          <span className="text-gold">3.</span> {t.emailLabel}
        </label>
        <input
          id="social-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-ink-soft px-3 py-2.5 text-sm text-white placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
        />
        {fieldError('email')}

        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <Button type="submit" size="lg" className="mt-6" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {t.submit}
        </Button>
        {state.status === 'error' && (
          <p className="mt-3 text-sm font-semibold text-red-300" role="alert">
            {t.errors[state.code] ?? t.errors.generic}
          </p>
        )}
        <p className="mt-4 text-xs text-muted">
          {t.fallback}{' '}
          <a href={fallbackHref} className="font-semibold text-gold underline underline-offset-2">
            {fallbackEmail}
          </a>
        </p>
      </div>
    </form>
  );
}
