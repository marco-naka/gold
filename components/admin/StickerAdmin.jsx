'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import AdminNav from './AdminNav';
import { cn } from '../ui/cn';
import { MATERIALS, matchesShop, materialLabel, materialsOf, stickerStatus } from '@/lib/stickers';
import { TIME_ZONE } from '@/lib/time';

/*
 * Adesivi e materiale, per l'admin: cosa ha avuto ogni negozio, chi ci è passato, tutte le foto.
 */

const when = (iso) =>
  new Intl.DateTimeFormat('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const photoUrl = (key) => `/api/rilevazioni/adesivi/foto?key=${encodeURIComponent(key)}`;

const day = (iso) => new Intl.DateTimeFormat('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit' }).format(new Date(iso));

/** Filtri: mai passati, chi ha avuto ogni materiale, e l'esito dell'ultimo passaggio se è un «no». */
const FILTERS = [
  ['all', 'Tutti', () => true],
  ['none', 'Mai passati', (s) => !s.passes],
  ...MATERIALS.map((m) => [`has:${m.id}`, `Con ${m.label}`, (s) => Boolean(s.left?.[m.id])]),
  ['no:adesivi', 'Senza adesivi', (s) => !s.left?.adesivi],
  ['rifiutato', 'Non ha voluto (ultimo)', (s) => s.sticker?.status === 'rifiutato'],
  ['chiuso', 'Chiuso (ultimo)', (s) => s.sticker?.status === 'chiuso'],
];
const filterFn = (id) => (FILTERS.find((f) => f[0] === id) ?? FILTERS[0])[2];

const passLabel = (r) => (r.status === 'lasciato' ? `${stickerStatus(r.status)?.label}: ${materialsOf(r).map(materialLabel).join(', ')}` : stickerStatus(r.status)?.label);

export default function StickerAdmin() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/rilevazioni/adesivi?all=1', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const shops = useMemo(() => data?.shops ?? [], [data]);
  const count = (id) => shops.filter(filterFn(id)).length;
  const list = shops.filter(filterFn(filter)).filter((s) => matchesShop(s, q));
  const photoCount = (data?.stickers ?? []).filter((r) => r.photo?.key).length;

  return (
    <>
      <AdminNav current="stickers" locale="it" />
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-btc">Adesivi e materiale</p>
            <h1 className="mt-1 text-2xl font-bold">Negozi e foto</h1>
            <p className="mt-1 text-sm text-muted">
              Chi passa con il materiale entra da /rilevazioni con il PIN degli adesivi. Vede i negozi che aderiscono e quelli ancora da visitare, e può
              ripassare anche da chi ha già l’adesivo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/api/rilevazioni/adesivi/backup"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-btc/50 hover:text-btc"
            >
              <Download className="h-4 w-4" /> Copia di sicurezza (foto + passaggi)
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={load} className="flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4" /> Aggiorna
            </Button>
          </div>
        </div>
        {data && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            {photoCount} foto salvate. I passaggi si aggiungono soltanto e le foto non si possono sovrascrivere: nessun ripasso cancella quelle di prima.
          </p>
        )}

        {failed && <p className="mt-4 text-sm text-red-300">Non riesco a caricare i dati. Riprova.</p>}
        {!data && !failed && <p className="mt-6 text-sm text-muted">Carico…</p>}

        {data && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {FILTERS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-semibold',
                    filter === id ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-muted hover:text-white',
                  )}
                >
                  {label} ({id === 'all' ? shops.length : count(id)})
                </button>
              ))}
            </div>

            <div className="relative mt-3 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca negozio o via" className="field pl-10" />
            </div>

            <ul className="mt-4 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
              {list.map((s) => (
                <li key={s.id} className="flex flex-wrap items-start gap-4 p-4">
                  {s.photos?.length ? (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {s.photos.map((p) => (
                        <a key={p.key} href={photoUrl(p.key)} target="_blank" rel="noopener noreferrer" title={`${p.by} · ${when(p.at)}`} className="block">
                          <img src={photoUrl(p.key)} alt={`Vetrina di ${s.name}, ${when(p.at)}`} loading="lazy" className="h-20 w-28 rounded-lg border border-white/10 object-cover" />
                          <span className="mt-0.5 block text-[10px] text-muted">{day(p.at)}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="grid h-20 w-28 shrink-0 place-items-center rounded-lg border border-dashed border-white/10 text-xs text-muted">nessuna foto</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-muted">{s.address}</p>
                    <p className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-semibold text-muted">
                        {s.group === 'aderisce' ? 'Aderisce' : 'Da visitare'}
                      </span>
                      {MATERIALS.filter((m) => s.left?.[m.id]).map((m) => (
                        <span key={m.id} className="rounded-full border border-btc/30 bg-btc/10 px-2 py-0.5 font-semibold text-btc">
                          {m.label} · {day(s.left[m.id])}
                        </span>
                      ))}
                      {s.sticker ? (
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-muted">
                          Ultimo: {passLabel(s.sticker)} · {s.sticker.by} · {when(s.sticker.at)}
                          {s.passes > 1 ? ` · ${s.passes} passaggi` : ''}
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-muted">Mai passati</span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
              {list.length === 0 && <li className="p-4 text-sm text-muted">Nessun negozio.</li>}
            </ul>

            <h2 className="mt-10 text-lg font-bold">Tutti i passaggi</h2>
            <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 text-sm">
              {(data.stickers ?? []).map((r) => (
                <li key={r.id} className="flex flex-wrap justify-between gap-2 p-3">
                  <span>
                    <span className="font-semibold">{r.merchantName}</span> · {passLabel(r)}
                    {r.photo?.key && (
                      <>
                        {' · '}
                        <a href={photoUrl(r.photo.key)} target="_blank" rel="noopener noreferrer" className="text-btc underline">
                          foto
                        </a>
                      </>
                    )}
                  </span>
                  <span className="text-muted">
                    {r.by} · {when(r.createdAt)} · {r.id}
                  </span>
                </li>
              ))}
              {(data.stickers ?? []).length === 0 && <li className="p-3 text-muted">Ancora nessun passaggio.</li>}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
