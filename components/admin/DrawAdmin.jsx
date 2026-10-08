'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Circle, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { drawUi } from '@/lib/admin-panel-i18n';
import { formatPrize } from '@/lib/campaigns';
import { TIME_ZONE } from '@/lib/time';
import { LocaleSwitch } from '../SurveyForm';
import { useLocale } from '../RilevazioniAdmin';
import AdminNav from './AdminNav';
import Button from '../ui/Button';
import { cn } from '../ui/cn';

/*
 * L'estrazione per l'admin. Il server impegna ed estrae da solo (lib/server/draw-scheduler.js):
 * qui si segue la procedura, si vedono vincitori e riserve con i dati per contattarli, si
 * esclude un vincitore non valido e si rifà la verifica.
 */

const when = (iso, locale) =>
  iso
    ? new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', { timeZone: TIME_ZONE, dateStyle: 'medium', timeStyle: 'short' })
    : '—';
const SCOPES = ['users', 'spritz', 'merchants'];

export default function DrawAdmin({ scope: initialScope }) {
  const [locale, setLocale] = useLocale();
  const t = drawUi(locale);
  const [scope, setScope] = useState(SCOPES.includes(initialScope) ? initialScope : 'users');
  const [s, setS] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/estrazione', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setS(await res.json());
      setError(null);
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }, [t.error]);

  useEffect(() => {
    load();
  }, [load]);

  // La scheda nell'indirizzo: «Estrazione commercianti» nella barra apre direttamente la sua.
  const pick = (next) => {
    setScope(next);
    const url = new URL(window.location.href);
    if (next === 'users') url.searchParams.delete('scope');
    else url.searchParams.set('scope', next);
    window.history.replaceState(null, '', url);
  };

  async function verify() {
    setChecks(null);
    const res = await fetch('/api/admin/estrazione', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify' }),
    });
    const json = await res.json().catch(() => ({}));
    setChecks(res.ok ? json.checks : [{ ok: false, label: json.message ?? t.error }]);
  }

  return (
    <>
      <AdminNav current={scope === 'merchants' ? 'drawMerchants' : 'drawUsers'} locale={locale} />
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <LocaleSwitch locale={locale} onLocale={setLocale} />
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{t.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t.intro}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={load} disabled={busy}>
            <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} /> {t.refresh}
          </Button>
        </header>
        {error && <p className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}

        {s && (
          <>
            <Steps s={s} t={t} locale={locale} />
            {!s.commitment && <Preview s={s} t={t} />}

            <div className="mt-10 flex gap-1 border-b border-white/10">
              {SCOPES.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pick(id)}
                  aria-pressed={scope === id}
                  className={cn(
                    '-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition',
                    scope === id ? 'border-btc text-btc' : 'border-transparent text-muted hover:text-white',
                  )}
                >
                  {t.tabs[id]}
                </button>
              ))}
            </div>
            <ScopePanel key={scope} scope={scope} s={s} t={t} locale={locale} onChanged={load} />

            {s.result && (
              <section className="mt-10">
                <Button variant="secondary" size="sm" onClick={verify}>
                  <ShieldCheck className="h-4 w-4" /> {t.verify}
                </Button>
                {checks && (
                  <ul className="mt-3 space-y-1 text-sm">
                    <li className={cn('font-semibold', checks.every((c) => c.ok) ? 'text-emerald-300' : 'text-red-300')}>
                      {checks.every((c) => c.ok) ? t.verifyOk : t.verifyKo}
                    </li>
                    {checks.map((c) => (
                      <li key={c.label} className={c.ok ? 'text-muted' : 'text-red-300'}>
                        {c.ok ? '✓' : '✗'} {c.label}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Steps({ s, t, locale }) {
  const now = Date.parse(s.now);
  const seed = s.commitment?.seed;
  const steps = [
    { done: now >= Date.parse(s.closesAt), title: t.steps.close(when(s.closesAt, locale)) },
    {
      done: Boolean(s.commitment),
      title: t.steps.commit,
      note: s.commitment ? when(s.commitment.createdAt, locale) : t.steps.commitWait(s.blocksAhead),
    },
    {
      done: Boolean(s.result) || (seed && s.tip >= seed.drawWhenHeight),
      title: seed ? t.steps.seed(seed.seedHeight) : t.steps.seed('—'),
      note: seed && !s.result ? t.steps.seedWait(s.tip, Math.max(0, seed.drawWhenHeight - (s.tip ?? 0))) : null,
    },
    {
      done: Boolean(s.result),
      title: t.steps.draw,
      note: s.result ? when(s.result.drawnAt, locale) : t.steps.drawWait(when(s.notBefore, locale), when(s.expectedBy, locale)),
    },
  ];
  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-4">
      {steps.map((step, i) => (
        <li key={i} className={cn('rounded-2xl border p-4', step.done ? 'border-emerald-400/30 bg-emerald-400/[0.05]' : 'border-white/10 bg-ink-soft/60')}>
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            {step.done ? <Check className="h-4 w-4 text-emerald-300" /> : <Circle className="h-4 w-4 text-muted" />}
            {step.title}
          </span>
          {step.note && <span className="mt-1 block text-xs text-muted">{step.note}</span>}
        </li>
      ))}
    </ol>
  );
}

function Preview({ s, t }) {
  const p = s.preview;
  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-ink-soft/60 p-4 text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.preview}</p>
      <ul className="mt-2 space-y-0.5 text-white">
        <li>{t.previewUsers(p.users)}</li>
        <li>{t.previewSpritz(p.spritz)}</li>
        <li>{t.previewMerchants(p.merchants)}</li>
      </ul>
      <p className="mt-2 text-xs text-muted">{t.previewOut(p.excludedTest, p.excludedRejected)}</p>
      {p.pending > 0 && <p className="text-xs text-muted">{t.previewPending(p.pending)}</p>}
    </section>
  );
}

function ScopePanel({ scope, s, t, locale, onChanged }) {
  const panel = s.scopes[scope];
  const merchants = scope === 'merchants';
  const excluded = (s.result?.disqualified ?? []).filter((d) => !d.only || d.only === scope);
  return (
    <section className="mt-6 space-y-6">
      {scope === 'spritz' && (
        <p className="text-sm text-muted">{t.spritzRule(s.spritz.venues.join(', '), when(s.spritz.from, locale), when(s.spritz.to, locale))}</p>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.prizes}</p>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {panel.tiers.map((tier) => (
            <li key={tier.place} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="text-muted">{tier.place}</span> · <span className="font-semibold text-white">{formatPrize(tier, locale)}</span>
              {tier.count > 1 && <span className="text-muted"> × {tier.count}</span>}
            </li>
          ))}
        </ul>
        {scope !== 'spritz' && s.juryPrizes.some((j) => (merchants ? j.asset === 'XAUT' : j.asset !== 'XAUT')) && (
          <p className="mt-2 text-xs text-muted">
            {t.jury}:{' '}
            {s.juryPrizes
              .filter((j) => (merchants ? j.asset === 'XAUT' : j.asset !== 'XAUT'))
              .map((j) => `${j.place} (${formatPrize(j, locale)})`)
              .join(' · ')}
          </p>
        )}
      </div>

      {panel.committed && (
        <p className="text-sm text-white">
          {t.committedList(panel.committed.count)} ·{' '}
          <a href={`/api/draw/${panel.committed.file}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-btc underline underline-offset-2">
            {t.publicFile} <ExternalLink className="h-3 w-3" />
          </a>
          <span className="mt-1 block break-all font-mono text-[11px] text-muted">{panel.committed.listHash}</span>
        </p>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.winners}</p>
        {!s.result ? (
          <p className="mt-2 text-sm text-muted">{t.notDrawn}</p>
        ) : (
          <>
            <p className="mt-1 break-all text-[11px] text-muted">
              {t.drawnAt} {when(s.result.drawnAt, locale)} · {t.seed} {s.result.seedHeight}: <span className="font-mono">{s.result.seed}</span>
            </p>
            <ul className="mt-2 space-y-2">
              {panel.winners.map((w) => (
                <Winner key={`${w.rank}-${w.winnerId}`} w={w} scope={scope} t={t} locale={locale} onChanged={onChanged} />
              ))}
            </ul>
          </>
        )}
      </div>

      {excluded.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300">{t.excluded}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {excluded.map((d) => (
              <li key={`${d.id}-${d.at}`} className="text-muted">
                <span className="font-mono text-white">{d.id}</span> · {d.reason} · {when(d.at, locale)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {s.result && panel.reserves.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.reserves(s.reservesPerScope)}</p>
          <ol className="mt-2 space-y-1 text-sm">
            {panel.reserves.map((r) => (
              <li key={r.id} className="flex flex-wrap gap-x-2 text-muted">
                <span className="w-6 text-right tabular-nums">{r.rank}.</span>
                <Who who={r.who} id={r.id} merchants={merchants} t={t} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function Who({ who, id, merchants, t }) {
  if (merchants) {
    return (
      <span>
        <span className="font-semibold text-white">{who.name}</span>
        {who.address && <span className="text-muted"> · {who.address}</span>}
        <span className="text-muted"> · {t.entriesAtShop(who.entries)}</span>
      </span>
    );
  }
  if (!who || who.missing) return <span className="font-mono text-white">{id} <span className="text-red-300">· {t.missing}</span></span>;
  return (
    <span>
      <span className="font-mono text-white">{who.id}</span>
      {who.test && <span className="text-red-300"> · {t.test}</span>}
      <span className="text-muted"> · {who.email} · {who.merchant ?? '—'} · {who.amountLabel ?? '—'} · {t.status[who.status] ?? who.status}</span>
      {who.hasReceipt && (
        <>
          {' · '}
          <a href={`/api/admin/scontrino?id=${encodeURIComponent(who.id)}`} target="_blank" rel="noopener noreferrer" className="text-btc underline underline-offset-2">
            {t.receipt}
          </a>
        </>
      )}
    </span>
  );
}

function Winner({ w, scope, t, locale, onChanged }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function exclude() {
    if (!reason.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/estrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Nello Spritz di norma si esclude solo da lì (pagato fuori orario): resta nel generale.
        body: JSON.stringify({ action: 'disqualify', id: w.winnerId, reason, only: scope === 'spritz' && !all ? 'spritz' : null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.message ?? t.error);
      setOpen(false);
      onChanged();
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl border border-white/10 bg-ink-soft/60 p-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span>
          <span className="font-semibold text-btc">{w.place}</span>
          <span className="text-white"> · {formatPrize(w, locale)}</span>
          <span className="mt-1 block">
            <Who who={w.who} id={w.winnerId} merchants={scope === 'merchants'} t={t} />
          </span>
        </span>
        <Button variant="ghost" size="sm" onClick={() => setOpen((x) => !x)}>
          {t.exclude}
        </Button>
      </div>
      {open && (
        <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-ink-deep/40 p-3">
          <label className="block text-xs text-muted">
            {t.excludeReason}
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t.excludeReasonPlaceholder} className="field mt-1" />
          </label>
          {scope === 'spritz' && (
            <label className="inline-flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="accent-btc" /> {t.excludeAll}
            </label>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button variant="btc" size="sm" onClick={exclude} disabled={busy || !reason.trim()}>
              {t.excludeConfirm}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={busy}>
              {t.cancel}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
