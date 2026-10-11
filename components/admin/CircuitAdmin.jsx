'use client';

import { useCallback, useEffect, useState } from 'react';
import { Ban, RefreshCw, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import AdminNav from './AdminNav';
import { LOCALE_KEY, LocaleSwitch } from '../SurveyForm';
import { TIME_ZONE } from '@/lib/time';

/*
 * Negozi fuori dal circuito, per l'admin: quelli tolti dai rilevatori con «Non fa più parte del
 * circuito» (si rimettono da qui), quelli tolti con un aggiornamento del sito, e lo storico.
 */

const UI = {
  it: {
    kicker: 'Elenco pubblico',
    title: 'Negozi fuori circuito',
    note: 'Si tolgono dall’area rilevazioni, scegliendo il negozio: «Non fa più parte del circuito», con il motivo. Spariscono subito da elenco, mappa e moduli del sito; qui si rimettono.',
    live: 'Tolti dall’area rilevazioni',
    fixed: 'Tolti con un aggiornamento del sito',
    fixedNote: 'Per rimetterli serve una modifica al codice e un push.',
    history: 'Storico',
    none: 'Nessun negozio tolto.',
    by: (by, when) => `${by} · ${when}`,
    restore: 'Rimetti nel circuito',
    refresh: 'Aggiorna',
    error: 'Non riesco a caricare l’elenco. Riprova.',
    failed: 'Non sono riuscito a rimetterlo. Riprova.',
    action: (a) => (a === 'exclude' ? 'Tolto' : 'Rimesso'),
  },
  en: {
    kicker: 'Public list',
    title: 'Shops out of the network',
    note: 'They are removed from the surveys area, by picking the shop: “No longer part of the network”, with a reason. They disappear at once from the site list, map and forms; here you can put them back.',
    live: 'Removed from the surveys area',
    fixed: 'Removed with a site update',
    fixedNote: 'Putting these back needs a code change and a push.',
    history: 'History',
    none: 'No shop removed.',
    by: (by, when) => `${by} · ${when}`,
    restore: 'Put back in the network',
    refresh: 'Refresh',
    error: 'Could not load the list. Try again.',
    failed: 'Could not put it back. Try again.',
    action: (a) => (a === 'exclude' ? 'Removed' : 'Put back'),
  },
};

export default function CircuitAdmin() {
  const [locale, setLocale] = useState('it');
  const [state, setState] = useState(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
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

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/rilevazioni/circuito', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setState(await res.json());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const restore = async (id) => {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch('/api/rilevazioni/circuito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', merchantId: id }),
      });
      if (!res.ok && res.status !== 409) throw new Error(String(res.status));
      await load();
    } catch {
      setError(t.failed);
    } finally {
      setBusy(null);
    }
  };

  const when = (iso) =>
    iso
      ? new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', {
          timeZone: TIME_ZONE,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          ...(iso.length > 10 ? { hour: '2-digit', minute: '2-digit' } : {}),
        })
      : '';
  const live = Object.entries(state?.excluded ?? {}).sort((a, b) => b[1].at.localeCompare(a[1].at));
  const fixed = Object.entries(state?.fixed ?? {});

  return (
    <>
      <AdminNav current="circuit" locale={locale} />
      <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{t.kicker}</p>
              <LocaleSwitch locale={locale} onLocale={changeLocale} />
            </div>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{t.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t.note}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" /> {t.refresh}
          </Button>
        </header>

        {failed && <p className="mt-6 text-sm text-red-400">{t.error}</p>}
        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-muted">
          {t.live} · {live.length}
        </h2>
        {live.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t.none}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {live.map(([id, e]) => (
              <li key={id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/[0.06] p-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <Ban className="h-4 w-4 shrink-0 text-red-300" /> {e.name}
                  </p>
                  <p className="mt-1 text-sm text-white/85">{e.reason}</p>
                  <p className="mt-1 text-xs text-muted">{t.by(e.by || '—', when(e.at))}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => restore(id)} disabled={busy === id}>
                  <RotateCcw className="h-4 w-4" /> {t.restore}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {fixed.length > 0 && (
          <>
            <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-muted">
              {t.fixed} · {fixed.length}
            </h2>
            <p className="mt-1 text-xs text-muted">{t.fixedNote}</p>
            <ul className="mt-3 divide-y divide-white/5 rounded-xl border border-white/10">
              {fixed.map(([id, e]) => (
                <li key={id} className="p-3 text-sm">
                  <span className="font-semibold text-white">{e.name}</span>
                  <span className="text-muted"> · {e.reason}{e.at ? ` · ${when(e.at)}` : ''}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {state?.history?.length > 0 && (
          <>
            <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-muted">{t.history}</h2>
            <ul className="mt-3 divide-y divide-white/5 rounded-xl border border-white/10">
              {state.history.map((h, i) => (
                <li key={`${h.id}-${h.at}-${i}`} className="p-3 text-sm">
                  <span className={h.action === 'exclude' ? 'font-semibold text-red-300' : 'font-semibold text-green-300'}>{t.action(h.action)}</span>
                  <span className="text-white"> {h.name}</span>
                  <span className="text-muted"> · {t.by(h.by || '—', when(h.at))}{h.reason ? ` · ${h.reason}` : ''}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
