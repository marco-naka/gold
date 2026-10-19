'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Camera, Check, CircleSlash, DoorClosed, LocateFixed, MapPin, Navigation, Search, SortAsc, Square, SquareCheck, Store, UserRound } from 'lucide-react';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { CodeGate } from './SurveyForm';
import { compressImage, inMemory } from '@/lib/compress-image';
import { MATERIALS, NAME_MAX, NAME_MIN, byDistance, formatDistance, isStickerDone, matchesShop, materialLabel, photoRequired, stickerStatus } from '@/lib/stickers';
import { TIME_ZONE } from '@/lib/time';

// Non da `lib/merchants`: importarlo porterebbe nel telefono tutto l'elenco dei negozi.
const mapsUrl = (shop) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}`)}`;
// Le indicazioni a piedi, come nelle rilevazioni; senza coordinate, la ricerca per nome e indirizzo.
const directionsUrl = (shop) =>
  shop.lat != null && shop.lng != null
    ? `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${shop.lat},${shop.lng}`
    : mapsUrl(shop);

/*
 * Area di chi passa dai negozi con adesivi e materiale. Cercare il negozio, spuntare cosa si è
 * lasciato (flyer, adesivi, rollup A3, locandine) con la foto, oppure dire che non l'hanno voluto
 * o che era chiuso. Si ripassa anche da chi ha già l'adesivo: la scheda dice cosa ha già avuto.
 */

const NAME_KEY = 'naka-adesivi-nome';
const PAGE = 60;

const ERRORS = {
  unauthorized: 'La sessione è scaduta. Ricarica la pagina e inserisci di nuovo il PIN.',
  rate_limited: 'Troppi invii ravvicinati. Aspetta un minuto e riprova.',
  storage_unavailable: 'Il server non può salvare in questo momento. Riprova tra poco.',
  too_large: 'La foto è troppo pesante. Scattane un’altra.',
  photo_not_saved: 'La foto non è stata salvata. Riprova.',
  network: 'Invio non riuscito: controlla la connessione e riprova.',
  materials: 'Spunta almeno una cosa che hai lasciato.',
  photo: {
    required: 'Con gli adesivi serve la foto della vetrina.',
    too_large: 'La foto è troppo pesante. Scattane un’altra.',
    not_image: 'Il file non è una foto. Scatta o scegli una foto.',
  },
  merchantId: 'Questo negozio non è più nell’elenco. Torna indietro e aggiorna.',
  by: 'Il tuo nome non è valido. Cambialo in alto.',
  generic: 'Invio non riuscito. Riprova.',
};

const when = (iso) =>
  new Intl.DateTimeFormat('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const day = (iso) => new Intl.DateTimeFormat('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit' }).format(new Date(iso));

/** L'accesso: il PIN degli adesivi oppure quello di un rilevatore, e in tutti e due i casi si resta qui. */
export function StickerGate() {
  return (
    <CodeGate
      locale="it"
      onLocale={() => {}}
      pinHint={null}
      // Anche un PIN da rilevatore apre questa pagina: si ricarica con il suo cookie.
      onUnlock={() => window.location.reload()}
    />
  );
}

export default function StickerApp({ operator = null }) {
  const [name, setName] = useState(operator);
  const [shops, setShops] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [tab, setTab] = useState('todo');
  // Nei «Fatti», per ripassare: solo chi non ha ancora un certo materiale.
  const [missing, setMissing] = useState(null);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState(null);
  // Ordine dell'elenco: per nome, oppure dal più vicino. La posizione resta sul telefono.
  const [sort, setSort] = useState('name');
  const [position, setPosition] = useState(null);
  const [geo, setGeo] = useState('idle'); // idle | loading | on | denied

  const locate = () => {
    setSort('near');
    setLimit(PAGE);
    if (!navigator.geolocation) return setGeo('denied');
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeo('on');
      },
      () => setGeo('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  useEffect(() => {
    if (operator) return;
    try {
      setName(localStorage.getItem(NAME_KEY) || '');
    } catch {
      setName('');
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/rilevazioni/adesivi', { cache: 'no-store' });
      if (res.status === 401) return window.location.reload();
      if (!res.ok) throw new Error(String(res.status));
      setShops((await res.json()).shops);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const saveName = (value) => {
    try {
      localStorage.setItem(NAME_KEY, value);
    } catch {
      /* navigazione privata: il nome resta per questa sessione */
    }
    setName(value);
  };

  const todo = useMemo(() => (shops ?? []).filter((s) => !isStickerDone(s)), [shops]);
  const done = useMemo(() => (shops ?? []).filter(isStickerDone), [shops]);
  const todoJoined = useMemo(() => todo.filter((s) => s.group === 'aderisce'), [todo]);
  const TABS = { todo, joined: todoJoined, done };
  const filtered = (TABS[tab] ?? todo).filter((s) => matchesShop(s, q)).filter((s) => tab !== 'done' || !missing || !s.left?.[missing]);
  // Se il negozio cercato non è in questa scheda: dove sta, per portarci con un tocco.
  const elsewhere = q && !filtered.length ? (done.some((s) => matchesShop(s, q)) && tab !== 'done' ? 'done' : todo.some((s) => matchesShop(s, q)) && tab !== 'todo' ? 'todo' : null) : null;
  const list = sort === 'near' && position ? byDistance(filtered, position) : filtered;

  if (name === null) return null;
  if (!name) return <NameStep onSave={saveName} />;

  if (open) {
    const shop = shops?.find((s) => s.id === open) ?? null;
    if (shop) {
      return (
        <ShopStep
          shop={shop}
          name={name}
          onBack={() => setOpen(null)}
          onSent={(sticker, hasPhoto) =>
            setShops((all) =>
              all.map((s) =>
                s.id === shop.id
                  ? {
                      ...s,
                      sticker,
                      left: { ...s.left, ...Object.fromEntries((sticker.materials ?? []).map((id) => [id, sticker.at])) },
                      passes: (s.passes ?? 0) + 1,
                      photos: (s.photos ?? 0) + (hasPhoto ? 1 : 0),
                    }
                  : s,
              ),
            )
          }
        />
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-btc">Adesivi e materiale</p>
          <h1 className="mt-1 text-2xl font-bold">Negozi</h1>
        </div>
        {operator ? (
          <span className="flex flex-col items-end gap-1.5">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
              <UserRound className="h-3.5 w-3.5" />
              {name}
            </span>
            {/* Ritorno al questionario, per chi è entrato con il PIN da rilevatore. */}
            <a href="/rilevazioni" className="text-xs text-muted underline underline-offset-2 hover:text-white">
              Torna alle rilevazioni
            </a>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => saveName('')}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted hover:text-white"
          >
            <UserRound className="h-3.5 w-3.5" />
            {name} · cambia
          </button>
        )}
      </header>

      <div className="mt-5 grid grid-cols-3 gap-2" role="tablist">
        {[
          ['todo', `Da fare (${todo.length})`],
          ['joined', `Da fare · aderito (${todoJoined.length})`],
          ['done', `Fatti (${done.length})`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setMissing(null);
              setLimit(PAGE);
            }}
            className={cn(
              'rounded-xl border px-2 py-2.5 text-xs font-semibold leading-tight transition sm:text-sm',
              tab === id ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-muted hover:text-white',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'done' && (
        <div className="mt-3">
          <p className="text-xs text-muted">Per ripassare, mostra solo chi non ha ancora:</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={missing === m.id}
                onClick={() => {
                  setMissing((cur) => (cur === m.id ? null : m.id));
                  setLimit(PAGE);
                }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition',
                  missing === m.id ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-muted hover:text-white',
                )}
              >
                {m.label} ({done.filter((s) => !s.left?.[m.id]).length})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Cerca il negozio o la via"
          autoComplete="off"
          className="field pl-10"
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSort('name')}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition',
            sort === 'name' ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-muted hover:text-white',
          )}
        >
          <SortAsc className="h-4 w-4" /> Per nome
        </button>
        <button
          type="button"
          onClick={locate}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition',
            sort === 'near' ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-muted hover:text-white',
          )}
        >
          <LocateFixed className="h-4 w-4" /> Vicino a me
        </button>
      </div>
      {sort === 'near' && geo === 'loading' && <p className="mt-2 text-sm text-muted">Cerco la tua posizione…</p>}
      {sort === 'near' && geo === 'denied' && (
        <p className="mt-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
          Posizione non disponibile: consenti la localizzazione al browser e riprova. Intanto l’elenco resta per nome.
        </p>
      )}

      {loadError && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
          Non riesco a caricare l’elenco.{' '}
          <button type="button" onClick={load} className="underline">
            Riprova
          </button>
        </p>
      )}
      {!shops && !loadError && <p className="mt-6 text-sm text-muted">Carico l’elenco…</p>}

      {shops && (
        <>
          {list.length === 0 ? (
            <EmptyList q={q} tab={tab} elsewhere={elsewhere} onSwitch={() => elsewhere && setTab(elsewhere)} />
          ) : (
            <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
              {list.slice(0, limit).map((s) => (
                <li key={s.id} className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => setOpen(s.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 p-3.5 text-left transition hover:bg-white/5"
                  >
                    <Store className={cn('mt-0.5 h-4 w-4 shrink-0', isStickerDone(s) ? 'text-muted' : 'text-btc')} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{s.name}</span>
                      {s.address && <span className="block truncate text-xs text-muted">{s.address}</span>}
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {s.distance != null && <span className="text-xs font-semibold text-btc">{formatDistance(s.distance)}</span>}
                        <GroupBadge group={s.group} />
                        {s.sticker && <StatusBadge sticker={s.sticker} />}
                        <LeftBadges left={s.left} />
                      </span>
                    </span>
                  </button>
                  {/* Google Maps senza aprire la scheda del negozio. */}
                  <a
                    href={directionsUrl(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name}: Google Maps`}
                    className="flex shrink-0 items-center border-l border-white/5 px-3.5 text-muted transition hover:bg-white/5 hover:text-btc"
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {list.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE)}
              className="mt-3 w-full rounded-xl border border-white/10 p-3 text-sm text-muted hover:text-white"
            >
              Mostra altri ({list.length - limit})
            </button>
          )}
        </>
      )}
    </div>
  );
}

/** Elenco vuoto: se il negozio cercato sta nell'altra scheda, lo si dice e ci si passa. */
function EmptyList({ q, tab, elsewhere, onSwitch }) {
  if (elsewhere) {
    const name = elsewhere === 'done' ? 'Fatti' : 'Da fare';
    return (
      <p className="mt-6 text-sm text-muted">
        Qui non c’è, ma è in «{name}».{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-btc underline">
          Apri {name}
        </button>
      </p>
    );
  }
  const empty = { todo: 'Tutto fatto.', joined: 'Nessun negozio aderente ancora da fare.', done: 'Nessun negozio qui.' };
  return <p className="mt-6 text-sm text-muted">{q ? 'Nessun negozio con questo nome.' : empty[tab]}</p>;
}

function GroupBadge({ group }) {
  return group === 'aderisce' ? (
    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Aderisce</span>
  ) : (
    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-muted">Da visitare</span>
  );
}

/** L'ultimo passaggio. Il materiale di tutti i passaggi lo dice `LeftBadges`. */
function StatusBadge({ sticker }) {
  const s = stickerStatus(sticker.status);
  if (!s) return null;
  if (sticker.status === 'lasciato' || sticker.status === 'montato') {
    return (
      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-muted">Ultimo passaggio · {when(sticker.at)}</span>
    );
  }
  const tone = sticker.status === 'chiuso' ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-red-400/30 bg-red-400/10 text-red-300';
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', tone)}>
      {s.label} · {when(sticker.at)}
    </span>
  );
}

/** Cosa ha già avuto il negozio, da tutti i passaggi. */
function LeftBadges({ left }) {
  const ids = MATERIALS.map((m) => m.id).filter((id) => left?.[id]);
  return ids.map((id) => (
    <span key={id} className="flex items-center gap-1 rounded-full border border-btc/40 bg-btc/10 px-2 py-0.5 text-[11px] font-semibold text-btc">
      <Check className="h-3 w-3" /> {materialLabel(id)} · {day(left[id])}
    </span>
  ));
}

/* ------------------------------------------------------------ il nome, una volta */

function NameStep({ onSave }) {
  const [value, setValue] = useState('');
  const clean = value.trim().replace(/\s+/g, ' ');
  const ok = clean.length >= NAME_MIN && clean.length <= NAME_MAX;
  return (
    <div className="mx-auto w-full max-w-sm px-5 py-20">
      <div className="glass p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-btc">Adesivi e materiale</p>
        <h1 className="mt-2 text-xl font-bold">Come ti chiami?</h1>
        <p className="mt-2 text-sm text-muted">Lo chiediamo una volta sola: resta su questo telefono e finisce su ogni passaggio che invii.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ok) onSave(clean);
          }}
          className="mt-5"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nome e cognome"
            autoComplete="name"
            maxLength={NAME_MAX}
            className="field"
          />
          <Button type="submit" disabled={!ok} className="mt-4 w-full">
            Continua
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- il negozio */

function ShopStep({ shop, name, onBack, onSent }) {
  const [materials, setMaterials] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(null);
  const input = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    // Copia in memoria subito: su iPhone il file della fotocamera può sparire prima dell'invio.
    const copy = (await inMemory(file)) ?? file;
    setPhoto(copy);
    setPreview(URL.createObjectURL(copy));
  }

  async function send(status) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('merchantId', shop.id);
      body.append('status', status);
      body.append('by', name);
      if (status === 'lasciato') {
        if (!materials.length) {
          setError(ERRORS.materials);
          return;
        }
        if (photoRequired(materials) && !photo) {
          setError(ERRORS.photo.required);
          return;
        }
        for (const id of materials) body.append('materials', id);
        if (photo) body.append('photo', await compressImage(photo));
      }
      let res;
      try {
        res = await fetch('/api/rilevazioni/adesivi', { method: 'POST', body });
      } catch {
        setError(ERRORS.network);
        setBusy(false);
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        onSent(json.sticker, json.hasPhoto);
        setSent(json.sticker);
      } else if (json.code === 'invalid_fields' && json.errors) {
        const [field, code] = Object.entries(json.errors)[0];
        const msg = ERRORS[field];
        setError(typeof msg === 'object' ? msg[code] ?? ERRORS.generic : msg ?? ERRORS.generic);
      } else {
        setError(ERRORS[json.code] ?? ERRORS.generic);
      }
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <div className="glass p-7 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Check className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-bold">Inviato</h2>
          <p className="mt-2 text-sm text-muted">
            {shop.name}:{' '}
            {sent.status === 'lasciato' ? `lasciato ${sent.materials.map(materialLabel).join(', ')}` : stickerStatus(sent.status)?.label}.
          </p>
          <Button type="button" onClick={onBack} className="mt-6 w-full">
            Torna all’elenco
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Elenco
      </button>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{shop.name}</h1>
        {shop.address && (
          <a
            href={mapsUrl(shop)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted underline-offset-2 hover:text-white hover:underline"
          >
            <MapPin className="h-4 w-4" /> {shop.address}
          </a>
        )}
        <a
          href={directionsUrl(shop)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-white transition hover:border-btc/50 hover:text-btc"
        >
          <Navigation className="h-4 w-4" /> Apri in Google Maps
        </a>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <GroupBadge group={shop.group} />
          {shop.sticker && <StatusBadge sticker={shop.sticker} />}
        </div>
      </div>

      {shop.passes > 0 && (
        <section className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          <p className="font-semibold">Ripasso</p>
          {Object.keys(shop.left ?? {}).length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <LeftBadges left={shop.left} />
            </div>
          ) : (
            <p className="mt-1 text-muted">Finora nessun materiale lasciato.</p>
          )}
          <p className="mt-2 text-xs text-muted">
            {shop.passes === 1 ? '1 passaggio' : `${shop.passes} passaggi`}
            {shop.photos ? ` · ${shop.photos === 1 ? '1 foto salvata' : `${shop.photos} foto salvate`}` : ''}. Quello che invii ora si aggiunge: niente di prima si perde.
          </p>
        </section>
      )}

      <section className="glass mt-6 p-5">
        <h2 className="font-semibold">Cosa hai lasciato?</h2>
        <p className="mt-1 text-sm text-muted">Spunta tutto quello che lasci oggi.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {MATERIALS.map((m) => {
            const on = materials.includes(m.id);
            const Icon = on ? SquareCheck : Square;
            return (
              <button
                key={m.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => {
                  setError(null);
                  setMaterials((cur) => (on ? cur.filter((x) => x !== m.id) : [...cur, m.id]));
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-semibold transition',
                  on ? 'border-btc/50 bg-btc/15 text-btc' : 'border-white/10 bg-white/5 text-white hover:border-white/25',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0">
                  {m.label}
                  {shop.left?.[m.id] && <span className="block text-[11px] font-normal text-muted">già lasciato il {day(shop.left[m.id])}</span>}
                </span>
              </button>
            );
          })}
        </div>

        <h3 className="mt-5 font-semibold">Foto della vetrina{photoRequired(materials) ? '' : ' (facoltativa)'}</h3>
        <p className="mt-1 text-sm text-muted">
          {photoRequired(materials) ? 'Con gli adesivi è obbligatoria: da fuori, con l’adesivo ben visibile.' : 'Da fuori, con il materiale visibile.'}
        </p>

        <input ref={input} type="file" accept="image/*" onChange={pick} className="hidden" />
        {preview ? (
          <div className="mt-4">
            <img src={preview} alt="Foto della vetrina" className="max-h-80 w-full rounded-xl border border-white/10 object-cover" />
            <button type="button" onClick={() => input.current?.click()} className="mt-2 text-sm text-muted underline hover:text-white">
              Cambia foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="mt-4 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-btc/40 bg-btc/5 p-8 text-btc transition hover:bg-btc/10"
          >
            <Camera className="h-7 w-7" />
            <span className="font-semibold">Scatta o carica la foto</span>
          </button>
        )}

        <Button
          type="button"
          variant="btc"
          disabled={!materials.length || (photoRequired(materials) && !photo) || busy}
          onClick={() => send('lasciato')}
          className="mt-4 w-full"
        >
          {busy && !confirm ? 'Invio…' : 'Invia'}
        </Button>
      </section>

      <section className="mt-6">
        <p className="text-sm text-muted">Non è stato possibile?</p>
        {confirm ? (
          <div className="glass mt-2 p-4">
            <p className="text-sm">
              Confermi: <span className="font-semibold">{stickerStatus(confirm)?.label}</span>?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirm(null)}>
                Annulla
              </Button>
              <Button type="button" disabled={busy} onClick={() => send(confirm)}>
                {busy ? 'Invio…' : 'Conferma'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirm('rifiutato')} className="flex items-center justify-center gap-1.5">
              <CircleSlash className="h-4 w-4" /> Non ha voluto il materiale
            </Button>
            <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirm('chiuso')} className="flex items-center justify-center gap-1.5">
              <DoorClosed className="h-4 w-4" /> Chiuso, da ripassare
            </Button>
          </div>
        )}
      </section>

      {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
