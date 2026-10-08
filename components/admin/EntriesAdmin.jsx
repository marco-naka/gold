'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Download, Image as ImageIcon, RefreshCw, Search } from 'lucide-react';
import { entriesUi } from '@/lib/admin-panel-i18n';
import { TIME_ZONE } from '@/lib/time';
import { LocaleSwitch } from '../SurveyForm';
import { useLocale } from '../RilevazioniAdmin';
import AdminNav from './AdminNav';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { cn } from '../ui/cn';

/*
 * Le giocate per l'admin: chi ha partecipato, con che scontrino, e lo stato che decide se
 * entra nell'estrazione. Ogni cambio di stato resta nella cronologia della giocata.
 */

const LIVE_MS = 30_000;
const TONE = {
  pending_verification: 'border-btc/30 bg-btc/10 text-btc',
  validated: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  rejected: 'border-red-400/30 bg-red-400/10 text-red-300',
};
const when = (iso, locale) =>
  iso
    ? new Date(iso).toLocaleString(locale === 'en' ? 'en-GB' : 'it-CH', { timeZone: TIME_ZONE, dateStyle: 'short', timeStyle: 'short' })
    : '—';

function Chip({ className, children }) {
  return <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', className)}>{children}</span>;
}

export function StatusChip({ status, t }) {
  return <Chip className={TONE[status] ?? 'border-white/15 bg-white/5 text-muted'}>{t.status[status] ?? status}</Chip>;
}

export const TestChip = ({ t }) => <Chip className="border-red-400/40 bg-red-400/10 text-red-300">{t.test}</Chip>;

function Kpi({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft/60 px-4 py-3">
      <span className="block text-xs font-semibold text-muted">{label}</span>
      <span className="mt-1 block text-2xl font-bold tabular-nums">{value}</span>
      {note && <span className="block text-xs text-muted">{note}</span>}
    </div>
  );
}

export default function EntriesAdmin() {
  const [locale, setLocale] = useLocale();
  const t = entriesUi(locale);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [kind, setKind] = useState('');
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/giocate', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => document.visibilityState === 'visible' && load(), LIVE_MS);
    return () => clearInterval(id);
  }, [load]);

  const entries = data?.entries ?? [];
  const real = entries.filter((e) => !e.test);
  const kpi = {
    pending: entries.filter((e) => e.status === 'pending_verification').length,
    valid: entries.filter((e) => e.status === 'validated').length,
    rejected: entries.filter((e) => e.status === 'rejected').length,
    shops: new Set(real.filter((e) => e.merchantId).map((e) => e.merchantId)).size,
    people: new Set(entries.map((e) => (e.email ?? '').toLowerCase())).size,
  };

  const shown = useMemo(
    () =>
      entries.filter((e) => {
        if (status && e.status !== status) return false;
        if (kind === 'real' && e.test) return false;
        if (kind === 'test' && !e.test) return false;
        if (unknownOnly && e.merchantKnown !== false) return false;
        if (q) {
          const hay = `${e.id} ${e.email} ${e.merchant ?? ''} ${e.txIdMasked ?? ''} ${e.tx ?? ''}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [entries, status, kind, unknownOnly, q],
  );
  const open = openId && entries.find((e) => e.id === openId);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <>
      <AdminNav current="entries" locale={locale} />
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <LocaleSwitch locale={locale} onLocale={setLocale} />
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{t.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t.intro}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refresh} disabled={refreshing}>
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} /> {t.refresh}
            </Button>
            <Button as="a" href="/api/admin/giocate?export=csv" variant="secondary" size="sm">
              <Download className="h-4 w-4" /> CSV
            </Button>
          </div>
        </header>

        {failed && <p className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{t.errorGeneric}</p>}
        {data?.committed && (
          <p className="mt-6 flex items-start gap-2 rounded-xl border border-btc/30 bg-btc/10 p-3 text-sm text-white">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-btc" /> {t.committed}
          </p>
        )}

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi label={t.kpiTotal} value={entries.length} note={t.kpiTotalNote(real.length, entries.length - real.length)} />
          <Kpi label={t.kpiPending} value={kpi.pending} />
          <Kpi label={t.kpiValid} value={kpi.valid} />
          <Kpi label={t.kpiRejected} value={kpi.rejected} />
          <Kpi label={t.kpiShops} value={kpi.shops} note={t.kpiShopsNote} />
          <Kpi label={t.kpiPeople} value={kpi.people} note={t.kpiPeopleNote} />
        </section>

        <section className="mt-8">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="field pl-10" />
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="field">
              <option value="">{t.allStatuses}</option>
              {Object.entries(t.status).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="field">
              <option value="">{t.allKinds}</option>
              <option value="real">{t.onlyReal}</option>
              <option value="test">{t.onlyTest}</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={unknownOnly} onChange={(e) => setUnknownOnly(e.target.checked)} className="accent-btc" />
              {t.unknownShop}
            </label>
            <span>{t.countOf(shown.length, entries.length)}</span>
          </div>

          {data && shown.length === 0 && <p className="mt-6 text-sm text-muted">{t.empty}</p>}
          <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60">
            {shown.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(e.id)}
                  className="grid w-full gap-1 px-4 py-3 text-left transition hover:bg-white/[0.03] sm:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)_7rem_8rem] sm:items-center sm:gap-4"
                >
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-sm font-semibold text-white">{e.id}</span>
                    {e.test && <TestChip t={t} />}
                  </span>
                  <span className="truncate text-sm text-white">{e.email}</span>
                  <span className="truncate text-sm text-muted">
                    {e.merchant ?? t.noShop}
                    {e.merchant && e.merchantKnown === false && <span className="ml-1 text-btc">· {t.notListed}</span>}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {e.amountLabel ?? '—'} · {e.txIdMasked ?? '—'}
                  </span>
                  <span className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="text-xs text-muted sm:hidden">{when(e.createdAt, locale)}</span>
                    <StatusChip status={e.status} t={t} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <Sources rows={data?.sources ?? []} t={t} />
      </div>

      {open && (
        <EntryModal
          entry={open}
          t={t}
          locale={locale}
          onClose={() => setOpenId(null)}
          onSaved={() => load()}
        />
      )}
    </>
  );
}

function Sources({ rows, t }) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold">{t.sourcesTitle}</h2>
      <p className="mt-1 text-xs text-muted">{t.sourcesIntro}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{t.sourcesEmpty}</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs text-muted">
              <tr>
                {t.sourcesCols.map((c, i) => (
                  <th key={c} className={cn('px-4 py-2 font-semibold', i === 0 ? 'text-left' : 'text-right')}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r.source}>
                  <td className="px-4 py-2 text-white">{r.source}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.visits}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.entries}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.rate === null ? '—' : `${Math.round(r.rate * 100)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EntryModal({ entry: e, t, locale, onClose, onSaved }) {
  const [action, setAction] = useState(null); // 'validated' | 'rejected' | 'pending_verification'
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const receiptSrc = `/api/admin/scontrino?id=${encodeURIComponent(e.id)}`;

  async function save() {
    setError(null);
    if (action === 'rejected' && !reason.trim()) return setError(t.errorReason);
    setBusy(true);
    try {
      const res = await fetch('/api/admin/giocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: e.id, status: action, reason, note, paidAt }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.code === 'paidAt' ? t.errorPaidAt : json.code === 'reason' ? t.errorReason : t.errorGeneric);
      setAction(null);
      setReason('');
      setNote('');
      setPaidAt('');
      onSaved();
    } catch {
      setError(t.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  const rows = [
    [t.fields.status, <StatusChip key="s" status={e.status} t={t} />],
    [t.fields.email, e.email],
    [t.fields.merchant, e.merchant ? `${e.merchant}${e.merchantKnown === false ? ` (${t.notListed})` : ''}` : t.noShop],
    [t.fields.amount, e.amountLabel],
    [t.fields.suffix, e.txIdMasked],
    [t.fields.tx, e.tx],
    [t.fields.kind, e.txKind],
    [t.fields.created, when(e.createdAt, locale)],
    [t.fields.paid, e.paidAt ? when(e.paidAt, locale) : null],
    [t.fields.source, e.source],
    [t.fields.locale, e.locale],
    [t.fields.verifiedBy, e.verifiedBy],
    [t.fields.rejectReason, e.rejectReason],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');

  return (
    <Modal open onClose={onClose} title={e.id} subtitle={e.test ? t.test : undefined} closeLabel={t.close} size="lg">
      <div className="grid gap-5 sm:grid-cols-2">
        <dl className="divide-y divide-white/5 rounded-xl border border-white/10 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-3 px-3.5 py-2">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="break-all text-right text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.receipt}</p>
          {e.hasReceipt ? (
            <a href={receiptSrc} target="_blank" rel="noopener noreferrer" className="mt-2 block">
              {/* eslint-disable-next-line @next/next/no-img-element -- scontrino privato, servito dall'API admin */}
              <img src={receiptSrc} alt={t.receipt} className="max-h-80 w-full rounded-xl border border-white/10 object-contain" />
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                <ImageIcon className="h-3 w-3" /> {t.openReceipt}
              </span>
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted">{t.noReceipt}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {e.status !== 'validated' && (
          <Button variant={action === 'validated' ? 'btc' : 'ghost'} size="sm" onClick={() => setAction('validated')}>
            {t.validate}
          </Button>
        )}
        {e.status !== 'rejected' && (
          <Button variant={action === 'rejected' ? 'btc' : 'ghost'} size="sm" onClick={() => setAction('rejected')}>
            {t.reject}
          </Button>
        )}
        {e.status !== 'pending_verification' && (
          <Button variant={action === 'pending_verification' ? 'btc' : 'ghost'} size="sm" onClick={() => setAction('pending_verification')}>
            {t.backToPending}
          </Button>
        )}
      </div>

      {action && (
        <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-ink-deep/40 p-3">
          {action === 'validated' && (
            <label className="block text-xs text-muted">
              {t.paidAt}
              <input type="datetime-local" value={paidAt} onChange={(ev) => setPaidAt(ev.target.value)} className="field mt-1" />
            </label>
          )}
          {action === 'rejected' && (
            <label className="block text-xs text-muted">
              {t.reason}
              <input value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder={t.reasonPlaceholder} className="field mt-1" />
            </label>
          )}
          {action !== 'rejected' && (
            <label className="block text-xs text-muted">
              {t.note}
              <input value={note} onChange={(ev) => setNote(ev.target.value)} className="field mt-1" />
            </label>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button variant="btc" size="sm" onClick={save} disabled={busy}>
              {t.confirm}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAction(null)} disabled={busy}>
              {t.cancel}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-btc">{t.history}</p>
      <ol className="mt-2 space-y-2 border-l border-white/10 pl-4 text-sm">
        <li>
          <span className="text-white">{t.historyCreated}</span>
          <span className="block text-[11px] text-muted">{when(e.createdAt, locale)}</span>
        </li>
        {(e.history ?? []).map((h, i) => (
          <li key={`${h.at}-${i}`}>
            <span className="text-white">{t.historyChange(h.by, t.status[h.from] ?? h.from, t.status[h.to] ?? h.to)}</span>
            <span className="block text-[11px] text-muted">{when(h.at, locale)}</span>
            {h.reason && <span className="block text-xs text-muted">{h.reason}</span>}
            {h.note && <span className="block text-xs text-muted">{h.note}</span>}
            {h.paidAt && <span className="block text-xs text-muted">{t.fields.paid}: {when(h.paidAt, locale)}</span>}
          </li>
        ))}
      </ol>
    </Modal>
  );
}
