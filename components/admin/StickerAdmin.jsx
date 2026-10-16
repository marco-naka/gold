'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import Button from '../ui/Button';
import AdminNav from './AdminNav';
import { cn } from '../ui/cn';
import { STICKER_STATUSES, matchesShop, stickerStatus } from '@/lib/stickers';
import { TIME_ZONE } from '@/lib/time';

/*
 * Adesivi in vetrina, per l'admin: a che punto è ogni negozio, chi ci è passato, la foto.
 */

const when = (iso) =>
  new Intl.DateTimeFormat('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const photoUrl = (key) => `/api/rilevazioni/adesivi/foto?key=${encodeURIComponent(key)}`;

const FILTERS = [
  ['all', 'Tutti'],
  ['none', 'Mai passati'],
  ...STICKER_STATUSES.map((s) => [s.id, s.label]),
];

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
  const count = (id) => shops.filter((s) => (id === 'none' ? !s.sticker : s.sticker?.status === id)).length;
  const list = shops.filter((s) => (filter === 'all' ? true : filter === 'none' ? !s.sticker : s.sticker?.status === filter)).filter((s) => matchesShop(s, q));

  return (
    <>
      <AdminNav current="stickers" locale="it" />
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-btc">Adesivi in vetrina</p>
            <h1 className="mt-1 text-2xl font-bold">Negozi e foto</h1>
            <p className="mt-1 text-sm text-muted">
              Chi monta gli adesivi entra da /rilevazioni con il PIN degli adesivi. Vede i negozi che aderiscono e quelli ancora da visitare.
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={load} className="flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4" /> Aggiorna
          </Button>
        </div>

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
                  {s.sticker?.photo ? (
                    <a href={photoUrl(s.sticker.photo)} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <img src={photoUrl(s.sticker.photo)} alt={`Vetrina di ${s.name}`} loading="lazy" className="h-20 w-28 rounded-lg border border-white/10 object-cover" />
                    </a>
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
                      {s.sticker ? (
                        <span className="rounded-full border border-btc/30 bg-btc/10 px-2 py-0.5 font-semibold text-btc">
                          {stickerStatus(s.sticker.status)?.label} · {s.sticker.by} · {when(s.sticker.at)}
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
                    <span className="font-semibold">{r.merchantName}</span> · {stickerStatus(r.status)?.label}
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
