'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { LOCALE_KEY, LocaleSwitch } from './SurveyForm';
import { TIME_ZONE } from '@/lib/time';

/*
 * I link social segnalati per i due premi Social, per l'admin: commercianti (dall'area
 * commercianti, con il negozio) e clienti (dalla home, con l'email della partecipazione).
 * Si aggiorna da solo ogni minuto; il CSV è la copia da passare alla giuria.
 */

const UI = {
  it: {
    kicker: 'Premi Social',
    title: 'Link social segnalati',
    note: 'Commercianti: il negozio è quello scelto da chi ha inviato, va verificato che il profilo sia davvero il suo. Clienti: vale solo con almeno una partecipazione registrata con la stessa email.',
    tabs: { merchant: 'Commercianti', customer: 'Clienti' },
    customerCols: ['Data', 'Email', 'Partecipazioni', 'Piattaforma', 'Link'],
    entries: (n, match) => (n ? `${n} con questa email${match === false ? ' · ID diverso' : ''}` : 'Nessuna: non ammesso'),
    refresh: 'Aggiorna',
    surveys: 'Rilevazioni',
    kpiLinks: 'Link',
    kpiShops: 'Negozi',
    kpiPlatforms: 'Per piattaforma',
    filter: 'Filtra per negozio o piattaforma',
    cols: ['Data', 'Negozio', 'Piattaforma', 'Link', 'Email'],
    empty: 'Nessun link ancora.',
    error: 'Non riesco a caricare l’elenco. Riprova.',
    open: 'Apri',
  },
  en: {
    kicker: 'Social prizes',
    title: 'Submitted social links',
    note: 'Merchants: the shop is the one picked by the sender, check that the profile really belongs to it. Customers: valid only with at least one entry registered with the same email.',
    tabs: { merchant: 'Merchants', customer: 'Customers' },
    customerCols: ['Date', 'Email', 'Entries', 'Platform', 'Link'],
    entries: (n, match) => (n ? `${n} with this email${match === false ? ' · different ID' : ''}` : 'None: not eligible'),
    refresh: 'Refresh',
    surveys: 'Surveys',
    kpiLinks: 'Links',
    kpiShops: 'Shops',
    kpiPlatforms: 'By platform',
    filter: 'Filter by shop or platform',
    cols: ['Date', 'Shop', 'Platform', 'Link', 'Email'],
    empty: 'No links yet.',
    error: 'Could not load the list. Try again.',
    open: 'Open',
  },
};

export default function SocialLinksAdmin({ initial }) {
  const [locale, setLocale] = useState('it');
  const [links, setLinks] = useState(initial);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('merchant');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const t = UI[locale];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_KEY);
      if (UI[saved]) setLocale(saved);
    } catch {
      /* navigazione privata */
    }
  }, []);
  const changeLocale = (next) => {
    setLocale(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* vedi sopra */
    }
  };

  const refresh = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/social', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setLinks((await res.json()).links);
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  const ofKind = useMemo(() => links.filter((l) => (l.kind ?? 'merchant') === kind), [links, kind]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle
      ? ofKind.filter((l) => `${l.merchantName ?? ''} ${l.platform} ${l.address ?? ''} ${l.email ?? ''}`.toLowerCase().includes(needle))
      : ofKind;
  }, [ofKind, q]);

  const byPlatform = ofKind.reduce((acc, l) => ({ ...acc, [l.platform]: (acc[l.platform] ?? 0) + 1 }), {});
  const count = (k) => links.filter((l) => (l.kind ?? 'merchant') === k).length;
  const isCustomer = kind === 'customer';
  const when = (iso) =>
    new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', {
      timeZone: TIME_ZONE,
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{t.kicker}</p>
            <LocaleSwitch locale={locale} onLocale={changeLocale} />
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t.note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={refresh} disabled={busy}>
            <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} /> {t.refresh}
          </Button>
          <Button as="a" href="/api/social?export=csv" variant="secondary" size="sm">
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button as="a" href="/rilevazioni/admin" variant="ghost" size="sm">
            {t.surveys}
          </Button>
        </div>
      </header>

      <div className="mt-8 flex gap-2" role="tablist">
        {['merchant', 'customer'].map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => setKind(k)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition',
              kind === k ? 'border-gold/40 bg-gold/10 text-gold' : 'border-white/10 text-muted hover:text-white',
            )}
          >
            {t.tabs[k]} · {count(k)}
          </button>
        ))}
      </div>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="glass p-4">
          <p className="text-xs text-muted">{t.kpiLinks}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{ofKind.length}</p>
        </div>
        <div className="glass p-4">
          <p className="text-xs text-muted">{isCustomer ? t.tabs.customer : t.kpiShops}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {new Set(ofKind.map((l) => (isCustomer ? l.email : l.merchantId))).size}
          </p>
        </div>
        <div className="glass col-span-2 p-4 sm:col-span-1">
          <p className="text-xs text-muted">{t.kpiPlatforms}</p>
          <p className="mt-1 text-sm">
            {Object.entries(byPlatform)
              .map(([p, n]) => `${p} ${n}`)
              .join(' · ') || '—'}
          </p>
        </div>
      </section>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.filter}
        className="mt-6 w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-2.5 text-sm text-white placeholder:text-muted/60 focus:border-gold/50 focus:outline-none sm:max-w-sm"
      />
      {failed && <p className="mt-3 text-sm font-semibold text-red-300">{t.error}</p>}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink-soft/60">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs text-muted">
            <tr>
              {(isCustomer ? t.customerCols : t.cols).map((c) => (
                <th key={c} className="whitespace-nowrap border-b border-white/10 px-4 py-3 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  {t.empty}
                </td>
              </tr>
            )}
            {shown.map((l) => (
              <tr key={l.id} className="border-b border-white/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted">{when(l.createdAt)}</td>
                {isCustomer ? (
                  <>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{l.email}</span>
                      {l.entryId && <span className="block font-mono text-xs text-muted">{l.entryId}</span>}
                    </td>
                    <td className={cn('px-4 py-3 text-xs font-semibold', l.entries ? 'text-emerald-300' : 'text-red-300')}>
                      {t.entries(l.entries, l.entryMatches)}
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{l.merchantName}</span>
                    <span className="block text-xs text-muted">{l.address}</span>
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-3">{l.platform}</td>
                <td className="max-w-[320px] px-4 py-3">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex max-w-full items-center gap-1 font-semibold text-gold underline underline-offset-2"
                    title={l.url}
                  >
                    <span className="truncate">{l.url.replace(/^https:\/\/(www\.)?/, '')}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </td>
                {!isCustomer && <td className="whitespace-nowrap px-4 py-3 text-muted">{l.email ?? '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
