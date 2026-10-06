'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ImagePlus,
  QrCode,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  Send,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { OUTCOMES, PHOTOS, SECTIONS, SCALE_MAX, isVisible } from '@/lib/survey';
import {
  SURVEY_LOCALES,
  askedIn,
  choicesIn,
  outcomeIn,
  photoIn,
  sectionIn,
  ui,
  yesNoIn,
} from '@/lib/survey-i18n';
import { MAX_PHOTO_BYTES, validateVisit } from '@/lib/survey-validation';
import { compressAll } from '@/lib/compress-image';
import { clearDraftPhotos, loadDraftPhotos, saveDraftPhotos } from '@/lib/photo-draft';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { TIME_ZONE } from '@/lib/time';

/*
 * Modulo di rilevazione, pensato per un telefono tenuto in una mano dentro un negozio.
 *
 * Tre scelte discendono da lì:
 * - una sezione per schermata, invece di un modulo lungo da scorrere;
 * - bozza salvata nel telefono a ogni tocco, così una chiamata in arrivo o la rete che cade
 *   in un retrobottega non cancellano mezz'ora di lavoro;
 * - le risposte sono bottoni grandi, non menu a tendina: si premono senza guardare.
 *
 * I testi stanno qui e non in `lib/i18n`: è uno strumento interno, in italiano, per due
 * persone. Tradurlo raddoppierebbe il lavoro su ogni domanda che aggiungerete.
 */

const DRAFT_KEY = 'naka-rilevazione-bozza';
const SURVEYOR_KEY = 'naka-rilevatore';
const LOCALE_KEY = 'naka-rilevazioni-lingua';

const YESNO = [
  { value: 'si', label: 'Sì' },
  { value: 'no', label: 'No' },
];
const YESNONA = [...YESNO, { value: 'na', label: 'N/A' }];

const readDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
};

export default function SurveyForm({ locked, pinHint }) {
  const [unlocked, setUnlocked] = useState(!locked);
  // Nome di chi è entrato col proprio PIN. Vuoto = accesso condiviso o aperto: in quel
  // caso il nome resta un campo da compilare.
  const [operator, setOperator] = useState('');
  // L'admin vede anche il pannello con tutte le rilevazioni e le esportazioni.
  const [admin, setAdmin] = useState(false);
  // La lingua è del rilevatore, non del negozio: resta su questo telefono.
  const [locale, setLocale] = useState('it');

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (SURVEY_LOCALES.includes(saved)) setLocale(saved);
    // Il cookie dura trenta giorni: chi riapre l'app è già riconosciuto.
    fetch('/api/rilevazioni?me=1')
      .then((r) => r.json())
      .then((d) => {
        if (d.operator) setOperator(d.operator);
        setAdmin(Boolean(d.admin));
      })
      .catch(() => {});
  }, []);

  const change = (next) => {
    setLocale(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* navigazione privata: la lingua resta per questa sessione */
    }
  };

  if (!unlocked) {
    return (
      <CodeGate
        onUnlock={(name) => {
          setOperator(name || '');
          setUnlocked(true);
          // Il ruolo lo sa solo il server: lo si chiede appena il cookie c'è.
          fetch('/api/rilevazioni?me=1')
            .then((r) => r.json())
            .then((d) => setAdmin(Boolean(d.admin)))
            .catch(() => {});
        }}
        locale={locale}
        onLocale={change}
        pinHint={pinHint}
      />
    );
  }
  return <Survey locale={locale} onLocale={change} operator={operator} admin={admin} />;
}

/** Interruttore IT/EN, due pulsanti e nessun menu: si cambia con un pollice. */
function LocaleSwitch({ locale, onLocale }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
      {SURVEY_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onLocale(code)}
          aria-pressed={code === locale}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition',
            code === locale ? 'bg-btc/15 text-btc' : 'text-muted hover:text-white',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- accesso */

export function CodeGate({ onUnlock, locale, onLocale, pinHint }) {
  const t = ui(locale);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append('intent', 'unlock');
    body.append('code', code);
    const res = await fetch('/api/rilevazioni', { method: 'POST', body });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) onUnlock(json.operator);
    else setError(t.gateWrong);
  }

  return (
    <div className="mx-auto w-full max-w-sm px-5 py-24">
      <div className="glass p-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-btc/25 bg-btc/10 text-btc">
          <Lock className="h-5 w-5" />
        </span>
        <div className="mt-5 flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold">{t.gateTitle}</h1>
          <LocaleSwitch locale={locale} onLocale={onLocale} />
        </div>
        <p className="mt-2 text-sm text-muted">{t.gateIntro}</p>
        <form onSubmit={submit} className="mt-6">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.gateCode}
            className={cn('field', error && 'field-error')}
            aria-invalid={Boolean(error)}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          {/* Compare solo finché i PIN sono quelli di prova: con i PIN veri sparisce da sé. */}
          {pinHint && (
            <p className="mt-3 rounded-lg border border-btc/25 bg-btc/[0.07] px-3 py-2 text-xs text-muted">
              {t.pinHint} <span className="font-mono font-bold text-btc">{pinHint}</span>
            </p>
          )}
          <Button type="submit" disabled={busy || !code} className="mt-4 w-full">
            {busy ? t.gateChecking : t.gateSubmit}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- rilevazione */

function Survey({ locale, onLocale, operator, admin }) {
  const t = ui(locale);
  const [step, setStep] = useState(0);
  const [surveyor, setSurveyor] = useState('');
  const [merchant, setMerchant] = useState(null); // { id, name, address, ... } oppure { name }
  const [answers, setAnswers] = useState({});
  const [photos, setPhotos] = useState({});
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);
  // Ricominciare cancella risposte e foto: si chiede conferma, non si fa al primo tocco.
  const [askReset, setAskReset] = useState(false);
  const restored = useRef(false);
  const photosRestored = useRef(false);

  // Bozza: si rilegge all'apertura e si riscrive a ogni modifica. Le foto restano fuori,
  // sono troppo pesanti per localStorage e si riscattano in un attimo.
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setSurveyor(draft.surveyor || '');
      setMerchant(draft.merchant || null);
      setAnswers(draft.answers || {});
      setStep(draft.step || 0);
    }
    const saved = localStorage.getItem(SURVEYOR_KEY);
    if (saved && !draft?.surveyor) setSurveyor(saved);
    restored.current = true;
    // Le foto tornano dalla bozza in IndexedDB: sui telefoni la pagina si ricarica spesso
    // dopo la fotocamera, e prima tornavano solo le risposte. Senza bozza non c'è niente da
    // riprendere, e le foto rimaste di un giro precedente si buttano.
    if (draft) {
      loadDraftPhotos().then((stored) => {
        setPhotos((current) => ({ ...stored, ...current }));
        photosRestored.current = true;
      });
    } else {
      clearDraftPhotos();
      photosRestored.current = true;
    }
  }, []);

  useEffect(() => {
    if (!photosRestored.current || done) return;
    saveDraftPhotos(photos);
  }, [photos, done]);

  useEffect(() => {
    if (!restored.current || done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ surveyor, merchant, answers, step }));
    } catch {
      /* quota piena o navigazione privata: la bozza è un extra, non un requisito */
    }
  }, [surveyor, merchant, answers, step, done]);

  useEffect(() => {
    if (surveyor) {
      try {
        localStorage.setItem(SURVEYOR_KEY, surveyor);
      } catch {
        /* vedi sopra */
      }
    }
  }, [surveyor]);

  // Le sezioni rimaste senza domande visibili spariscono dal percorso: con le condizioni
  // di oggi una sezione intera può non applicarsi, e un titolo senza domande sotto sembra
  // un errore. Il numero di passi cambia mentre si compila, ed è giusto così.
  const steps = useMemo(() => {
    const live = SECTIONS.filter((sec) => sec.questions.some((q) => isVisible(q, answers))).map(
      (sec) => sec.id,
    );
    return ['negozio', ...live, 'foto'];
  }, [answers]);

  // Se il percorso si accorcia mentre siamo in fondo, si resta dentro i limiti.
  useEffect(() => {
    setStep((s) => Math.min(s, steps.length - 1));
  }, [steps.length]);

  // Con il PIN per persona il nome lo decide il server: il campo scompare e non può
  // più essere scritto storto o attribuito a un collega.
  useEffect(() => {
    if (operator) setSurveyor(operator);
  }, [operator]);

  const setAnswer = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: undefined } : prev));
  }, []);

  function reset() {
    localStorage.removeItem(DRAFT_KEY);
    clearDraftPhotos();
    setSurveyor(localStorage.getItem(SURVEYOR_KEY) || '');
    setMerchant(null);
    setAnswers({});
    setPhotos({});
    setErrors({});
    setStep(0);
    setDone(null);
    setAskReset(false);
  }

  async function submit() {
    const data = { merchantName: merchant?.name, surveyor, answers };
    const found = validateVisit(data);
    if (Object.keys(found).length) {
      setErrors(found);
      // Porta il rilevatore alla prima sezione che contiene un errore, invece di
      // lasciarlo a cercare il campo rosso.
      const firstBad = Object.keys(found)[0];
      const section = SECTIONS.find((s) => s.questions.some((q) => q.id === firstBad));
      const idx = section ? steps.indexOf(section.id) : -1;
      if (idx >= 0) setStep(idx);
      else if (found.merchantName || found.surveyor) setStep(0);
      else setStep(steps.length - 1);
      return;
    }

    setSending(true);
    const body = new FormData();
    body.append('surveyor', surveyor);
    body.append('merchantId', merchant?.id || '');
    body.append('merchantName', merchant?.name || '');
    body.append('answers', JSON.stringify(answers));
    for (const [slot, value] of Object.entries(photos)) {
      for (const file of Array.isArray(value) ? value : [value]) if (file) body.append(`photo_${slot}`, file);
    }

    try {
      const res = await fetch('/api/rilevazioni', { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || { _: json.code });
        setSending(false);
        return;
      }
      localStorage.removeItem(DRAFT_KEY);
      clearDraftPhotos();
      setDone({ id: json.id, photos: json.photos ?? 0 });
    } catch {
      setErrors({ _: 'network' });
    }
    setSending(false);
  }

  if (done) return <Done id={done.id} photos={done.photos} merchant={merchant} onNext={reset} locale={locale} />;

  const current = steps[step];
  const section = SECTIONS.find((s) => s.id === current);
  const canGoNext = step < steps.length - 1;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10">
      <Progress step={step} total={steps.length} merchant={merchant} locale={locale} onLocale={onLocale} />

      {current === 'negozio' && (
        <MerchantStep
          merchant={merchant}
          onPick={setMerchant}
          surveyor={surveyor}
          onSurveyor={setSurveyor}
          operator={operator}
          admin={admin}
          onAnswers={setAnswers}
          error={errors.merchantName || errors.surveyor}
          photos={photos}
          setPhotos={setPhotos}
          locale={locale}
        />
      )}

      {section && (
        <section>
          <h2 className="text-xl font-bold">{sectionIn(section, locale).title}</h2>
          {sectionIn(section, locale).intro && (
            <p className="mt-1.5 text-sm text-muted">{sectionIn(section, locale).intro}</p>
          )}
          <div className="mt-7 space-y-7">
            {section.questions
              .filter((q) => isVisible(q, answers))
              .map((q) => (
                <Question
                  key={q.id}
                  question={q}
                  value={answers[q.id]}
                  onChange={setAnswer}
                  error={errors[q.id] ?? errors[`photo_${q.slot}`]}
                  photos={photos}
                  setPhotos={setPhotos}
                  answers={answers}
                  locale={locale}
                />
              ))}
          </div>
        </section>
      )}

      {current === 'foto' && (
        <PhotoStep photos={photos} setPhotos={setPhotos} errors={errors} generic={errors._} locale={locale} />
      )}

      {/* Barra fissa: i pollici stanno in basso, e in negozio si guarda lo schermo di sfuggita */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-ink-deep/95 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              aria-label={t.back}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {canGoNext ? (
              <Button onClick={() => setStep((s) => s + 1)} className="flex-1">
                {t.next}
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={sending} className="flex-1">
                <Send className="h-5 w-5" />
                {sending ? t.saving : t.save}
              </Button>
            )}

            <Button variant="ghost" onClick={() => setAskReset(true)}>
              <RotateCcw className="h-4 w-4" />
              {t.restart}
            </Button>
          </div>

          {askReset && (
            <div className="mt-3 rounded-xl border border-btc/30 bg-btc/[0.07] p-3">
              <p className="text-xs leading-relaxed text-white">{t.restartConfirm}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="btc" onClick={reset} className="flex-1">
                  {t.restartYes}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAskReset(false)} className="flex-1">
                  {t.restartNo}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pezzi */

function Progress({ step, total, merchant, locale, onLocale }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <span className="font-semibold uppercase tracking-[0.16em] text-btc">
          {step + 1} / {total}
        </span>
        <span className="flex min-w-0 items-center gap-3">
          {merchant && <span className="truncate">{merchant.name}</span>}
          <LocaleSwitch locale={locale} onLocale={onLocale} />
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-btc-gradient transition-all duration-300"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function MerchantStep({
  merchant,
  onPick,
  surveyor,
  onSurveyor,
  operator,
  admin,
  onAnswers,
  error,
  photos,
  setPhotos,
  locale,
}) {
  const t = ui(locale);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState([]);
  const [history, setHistory] = useState([]);
  const [last, setLast] = useState(null);
  const [ripreso, setRipreso] = useState(false);
  const [visited, setVisited] = useState({});
  const [mine, setMine] = useState(null);

  // Si scarica una volta sola: chi ha già una visita alle spalle va segnalato *dentro* i
  // risultati di ricerca, non dopo averlo scelto. Due persone sullo stesso elenco di 336
  // negozi si accavallano di continuo.
  useEffect(() => {
    fetch('/api/rilevazioni?visited=1')
      .then((r) => r.json())
      .then((d) => setVisited(d.visited ?? {}))
      .catch(() => {});
    // Il proprio lavoro, per non chiedersi «questo l'ho già fatto?»: c'è solo con il PIN personale.
    fetch('/api/rilevazioni?mine=1')
      .then((r) => r.json())
      .then((d) => setMine(d.visits ?? []))
      .catch(() => {});
  }, []);

  // Stato del negozio scelto: dall'elenco dei visitati (che sa se resta qualcosa da fare),
  // altrimenti dall'ultima visita dello storico.
  const seenNow = merchant
    ? visited[merchant.id] ??
      visited[merchant.name?.toLowerCase()] ??
      (history.length
        ? {
            ...history[history.length - 1],
            // Stessa regola del server: un ritorno fissato o un «da ricontattare» lasciano il
            // negozio da completare.
            status:
              history[history.length - 1].ripasso || history[history.length - 1].outcome === 'da_ricontattare'
                ? 'da_completare'
                : 'completo',
          }
        : null)
    : null;

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return setHits([]);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/merchants?full=1&q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setHits(d.merchants ?? []))
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // Visite precedenti allo stesso negozio: evita di ripetere un giro già fatto dal collega.
  useEffect(() => {
    setRipreso(false);
    if (!merchant) {
      setHistory([]);
      setLast(null);
      return;
    }
    const params = new URLSearchParams();
    if (merchant.id) params.set('merchantId', merchant.id);
    else params.set('merchantName', merchant.name);
    fetch(`/api/rilevazioni?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setHistory(d.visits ?? []);
        setLast(d.last ?? null);
      })
      .catch(() => {});
  }, [merchant]);

  return (
    <section>
      <h2 className="text-xl font-bold">{t.stepMerchant}</h2>

      {operator ? (
        <>
          <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-btc/25 bg-btc/[0.07] px-4 py-2.5 text-sm">
            <Check className="h-4 w-4 text-btc" />
            <span className="text-muted">
              {t.signedInAs} <span className="font-semibold text-white">{operator}</span>
            </span>
          </p>
          <MineList visits={mine} onPick={onPick} locale={locale} />
          {/* Pannello ed esportazioni sono dell'admin: vedere tutto non serve a chi rileva. */}
          {admin && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <a href="/rilevazioni/admin" className="font-semibold text-btc underline underline-offset-2">
                {t.adminPanel}
              </a>
              <a href="/api/rilevazioni?export=csv" className="font-semibold text-btc underline underline-offset-2">
                {t.exportCsv}
              </a>
              <a href="/api/rilevazioni?export=json" className="font-semibold text-btc underline underline-offset-2">
                {t.exportJson}
              </a>
            </div>
          )}
        </>
      ) : (
        <>
          <label htmlFor="surveyor" className="mt-6 block text-sm font-semibold text-white">
            {t.yourName}
          </label>
          <input
            id="surveyor"
            value={surveyor}
            onChange={(e) => onSurveyor(e.target.value)}
            placeholder={t.yourNamePlaceholder}
            autoComplete="name"
            className="field mt-2"
          />
          <p className="mt-1.5 text-xs text-muted">{t.yourNameHint}</p>
        </>
      )}

      <h3 className="mt-8 text-sm font-semibold text-white">{t.shop}</h3>
      {merchant ? (
        <div className="mt-2 rounded-xl border border-btc/30 bg-btc/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-white">{merchant.name}</p>
              {merchant.address && (
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-btc" />
                  {merchant.address}
                </p>
              )}
              {!merchant.id && <p className="mt-2 text-xs text-btc">{t.newShop}</p>}
            </div>
            <button
              type="button"
              onClick={() => onPick(null)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-xs font-semibold text-muted hover:border-white/25 hover:text-white"
            >
              <X className="h-4 w-4" />
              {t.changeShop}
            </button>
          </div>

          {seenNow && <AlreadyBanner seen={seenNow} locale={locale} />}

          {merchant.assets?.length > 0 && (
            <p className="mt-3 border-t border-white/10 pt-3 text-xs text-muted">
              {t.fromMap} {merchant.assets.join(' · ')}
              {merchant.phone ? ` · ${merchant.phone}` : ''}
            </p>
          )}

          {last && Object.keys(last.answers ?? {}).length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3">
              {/*
                Chi torna riparte da quello che il collega ha già rilevato: dieci risposte
                identiche non si ridigitano, e quello che è cambiato salta all'occhio.
                Le foto no: sono file, vanno riscattate.
              */}
              <Button
                variant="secondary"
                onClick={() => {
                  onAnswers((prev) => ({ ...last.answers, ...prev }));
                  setRipreso(true);
                }}
                disabled={ripreso}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4" />
                {ripreso
                  ? t.resumed
                  : t.resumeFrom(
                      last.surveyor || '—',
                      new Date(last.at).toLocaleDateString('it-CH', { timeZone: TIME_ZONE }),
                    )}
              </Button>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{t.resumeHint}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs font-semibold text-btc">{t.visitedTimes(history.length)}</p>
              <ul className="mt-1.5 space-y-1">
                {history.map((h) => (
                  <li key={h.id} className="text-xs text-muted">
                    {new Date(h.at).toLocaleDateString('it-CH', { timeZone: TIME_ZONE })} · {h.surveyor} ·{' '}
                    {outcomeIn(
                      h.outcome,
                      OUTCOMES.find((o) => o.id === h.outcome)?.label ?? h.outcome,
                      locale,
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchShop}
              autoComplete="off"
              className={cn('field pl-10', error && 'field-error')}
            />
          </div>
          {hits.length > 0 && (
            <ul className="mt-2 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
              {hits.slice(0, 8).map((m) => {
                const seen = visited[m.id] ?? visited[m.name?.toLowerCase()];
                return (
                  <li key={m.id ?? m.name}>
                    <button
                      type="button"
                      onClick={() => onPick(m)}
                      className="flex w-full items-start gap-3 p-3.5 text-left transition hover:bg-white/5"
                    >
                      <Store
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          seen?.status === 'completo' ? 'text-muted' : 'text-btc',
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{m.name}</span>
                        {m.address && <span className="block truncate text-xs text-muted">{m.address}</span>}
                        {seen && <VisitedBadge seen={seen} locale={locale} />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {q.trim().length >= 2 && (
            <button
              type="button"
              onClick={() => onPick({ name: q.trim() })}
              className="mt-2 w-full rounded-xl border border-dashed border-white/20 p-3.5 text-sm text-muted transition hover:border-btc/40 hover:text-white"
            >
              {t.notListed(q.trim())}
            </button>
          )}
          {error && <p className="mt-2 text-sm text-red-400">Scegli il negozio e scrivi il tuo nome.</p>}
        </>
      )}

      {/*
        La vetrina si fotografa adesso, davanti alla porta, non alla fine del questionario:
        a quel punto il rilevatore è dentro o già per strada. Lo stesso slot ricompare
        nell'ultima schermata, così chi se ne dimentica può rimediare.
      */}
      <div className="mt-8">
        <PhotoSlot
          photo={PHOTOS.find((p) => p.id === 'vetrina')}
          locale={locale}
          file={photos?.vetrina}
          onPick={(file) => setPhotos((p) => ({ ...p, vetrina: file }))}
          onClear={() => setPhotos((p) => ({ ...p, vetrina: null }))}
        />
      </div>
    </section>
  );
}

/**
 * Avviso in cima al negozio scelto, quando qualcuno ci è già passato.
 *
 * Il distintivo nei risultati di ricerca si vede solo cercando; chi arriva al negozio da
 * «Le tue rilevazioni», da una bozza o scrivendo il nome deve leggerlo comunque, e in
 * grande: rifare una visita completa è tempo perso per il rilevatore e per il negozio.
 */
function AlreadyBanner({ seen, locale }) {
  const t = ui(locale);
  const completo = seen.status === 'completo';
  const esito = outcomeIn(seen.outcome, OUTCOMES.find((o) => o.id === seen.outcome)?.label ?? seen.outcome, locale);
  const quando = new Date(seen.at).toLocaleDateString('it-CH', { timeZone: TIME_ZONE });
  return (
    <div
      role="status"
      className={cn(
        'mt-3 flex gap-3 rounded-xl border p-3.5',
        completo ? 'border-green-500/40 bg-green-500/10' : 'border-btc/50 bg-btc/15',
      )}
    >
      {completo ? (
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" strokeWidth={3} />
      ) : (
        <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-btc" />
      )}
      <div className="min-w-0">
        <p className={cn('text-sm font-bold', completo ? 'text-green-300' : 'text-btc')}>
          {completo ? t.alreadyDone(esito, seen.surveyor || '—', quando) : t.stillOpen(esito, seen.surveyor || '—', quando)}
          {seen.ripasso
            ? ` ${t.returnFixed(new Date(seen.ripasso).toLocaleDateString('it-CH', { timeZone: TIME_ZONE }))}`
            : ''}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{completo ? t.alreadyDoneHint : t.stillOpenHint}</p>
      </div>
    </div>
  );
}

/** Le rilevazioni salvate da chi è collegato: il proprio giro a colpo d'occhio. */
function MineList({ visits, onPick, locale }) {
  const t = ui(locale);
  if (visits === null) return null;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());
  const oggi = visits.filter((v) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date(v.at)) === today).length;
  return (
    <details className="mt-3 rounded-xl border border-white/10 bg-white/[0.03]">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-white">
        {t.mineTitle(visits.length, oggi)}
      </summary>
      {visits.length === 0 ? (
        <p className="px-4 pb-3 text-xs text-muted">{t.mineEmpty}</p>
      ) : (
        <>
          <p className="px-4 text-[11px] text-muted">{t.mineHint}</p>
          <ul className="mt-2 max-h-72 divide-y divide-white/5 overflow-y-auto border-t border-white/10">
            {visits.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onPick(v.merchantId ? { id: v.merchantId, name: v.merchantName, address: v.address } : { name: v.merchantName })}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{v.merchantName}</span>
                    <span className="block text-[11px] text-muted">
                      {new Date(v.at).toLocaleString('it-CH', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {outcomeIn(v.outcome, OUTCOMES.find((o) => o.id === v.outcome)?.label ?? v.outcome, locale)}
                      {v.ripasso ? ` · ${t.returnOn} ${new Date(v.ripasso).toLocaleDateString('it-CH', { timeZone: TIME_ZONE })}` : ''}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </details>
  );
}

/**
 * Stato del negozio nei risultati di ricerca.
 *
 * Non basta sapere che è già stato visitato: serve sapere se c'è ancora da farci qualcosa.
 * Un negozio con la transazione di prova rimandata, o lasciato in sospeso, va trattato
 * come non fatto — altrimenti il secondo giro lo salta.
 */
function VisitedBadge({ seen, locale }) {
  const t = ui(locale);
  const completo = seen.status === 'completo';
  const esito = outcomeIn(
    seen.outcome,
    OUTCOMES.find((o) => o.id === seen.outcome)?.label ?? seen.outcome,
    locale,
  );
  const quando = new Date(seen.at).toLocaleDateString('it-CH', { timeZone: TIME_ZONE });

  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
          completo
            ? 'border-green-500/30 bg-green-500/10 text-green-400'
            : 'border-btc/40 bg-btc/15 text-btc',
        )}
      >
        {completo ? <Check className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
        {completo ? t.complete : t.toComplete}
      </span>

      <span className="text-[11px] text-muted">
        {esito} · {seen.surveyor} · {quando}
        {seen.count > 1 ? ` · ${seen.count}×` : ''}
      </span>

      {seen.ripasso && (
        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-muted">
          {t.returnOn} {new Date(seen.ripasso).toLocaleDateString('it-CH', { timeZone: TIME_ZONE })}
        </span>
      )}
    </span>
  );
}

function Question({ question, value, onChange, error, photos, setPhotos, answers, locale }) {
  const id = question.id;
  const t = ui(locale);
  const { label, help } = askedIn(question, locale);
  const options = choicesIn(question, answers, locale);

  // Il QR non chiede niente: si apre a schermo pieno e si gira il telefono.
  if (question.type === 'qr') return <ReviewQr question={question} locale={locale} />;

  // Lo scatto chiesto dentro il questionario usa gli stessi slot della schermata foto:
  // il file finisce nello stesso posto, cambia solo dove lo si chiede.
  if (question.type === 'photo') {
    return (
      <PhotoSlot
        // Le proprietà dello slot — `multiple` su tutte — vengono dalla definizione in
        // PHOTOS: costruire qui un oggetto nuovo le perdeva, e la ricevuta accettava
        // una foto sola nonostante fosse dichiarata multipla.
        photo={{
          ...(PHOTOS.find((x) => x.id === question.slot) ?? {}),
          id: question.slot,
          label,
          hint: help ?? '',
        }}
        file={photos?.[question.slot]}
        error={error}
        onPick={(file) => setPhotos((p) => ({ ...p, [question.slot]: file }))}
        onClear={() => setPhotos((p) => ({ ...p, [question.slot]: null }))}
        locale={locale}
      />
    );
  }

  // La casella singola porta l'etichetta al proprio interno: ripeterla sopra la farebbe
  // leggere due volte, e qui ogni riga in più è tempo in negozio.
  if (question.type === 'check') {
    const on = value === true;
    return (
      <button
        type="button"
        onClick={() => onChange(id, on ? undefined : true)}
        aria-pressed={on}
        className={cn(
          'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition',
          on ? 'border-btc bg-btc/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25',
        )}
      >
        <span
          className={cn(
            'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border',
            on ? 'border-btc bg-btc text-ink-deep' : 'border-white/25',
          )}
        >
          {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </span>
        <span>
          <span className={cn('block text-sm font-medium', on ? 'text-btc' : 'text-white')}>{label}</span>
          {help && <span className="mt-0.5 block text-xs text-muted">{help}</span>}
        </span>
      </button>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-white">
        {label}
        {question.required && <span className="text-btc"> *</span>}
      </p>
      {help && <p className="mt-1 text-xs leading-relaxed text-muted">{help}</p>}

      <div className="mt-3">
        {(question.type === 'yesno' || question.type === 'yesnona') && (
          <Choices
            options={(question.type === 'yesno' ? YESNO : YESNONA).map((o) => ({
              ...o,
              label: yesNoIn(o.value, locale) ?? o.label,
            }))}
            value={value}
            onSelect={(v) => onChange(id, v)}
            variant="row"
          />
        )}

        {question.type === 'single' && (
          <Choices options={options} value={value} onSelect={(v) => onChange(id, v)} />
        )}

        {question.type === 'multi' && (
          <>
            {/* Da tre opzioni in su conviene un interruttore: «li ho provati tutti» è la
                risposta più frequente sui QR, e farla in quattro tocchi è tempo buttato. */}
            {options.length >= 3 && (
              <button
                type="button"
                onClick={() =>
                  onChange(
                    id,
                    (Array.isArray(value) ? value : []).length === options.length
                      ? []
                      : options.map((o) => o.value),
                  )
                }
                className="mb-2.5 text-xs font-semibold text-btc underline underline-offset-2 transition hover:text-btc-warm"
              >
                {(Array.isArray(value) ? value : []).length === options.length ? t.deselectAll : t.selectAll}
              </button>
            )}
            <Choices
              options={options}
              value={Array.isArray(value) ? value : []}
              onSelect={(v) => {
                const list = Array.isArray(value) ? value : [];
                onChange(id, list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
              }}
              multi
            />
          </>
        )}

        {question.type === 'scale' && (
          <div className="flex gap-2">
            {Array.from({ length: SCALE_MAX }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(id, n)}
                aria-pressed={Number(value) === n}
                className={cn(
                  'h-12 flex-1 rounded-xl border text-base font-bold transition',
                  Number(value) === n
                    ? 'border-btc bg-btc/15 text-btc'
                    : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {question.type === 'number' && (
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={value ?? ''}
            onChange={(e) => onChange(id, e.target.value)}
            className={cn('field', error && 'field-error')}
          />
        )}

        {(question.type === 'date' || question.type === 'time') && (
          <input
            type={question.type}
            value={value ?? ''}
            onChange={(e) => onChange(id, e.target.value)}
            // Su desktop il selettore si apre solo cliccando l'iconcina: showPicker lo apre
            // toccando il campo. Sui telefoni è già così, e dove non esiste non succede nulla.
            onClick={(e) => e.currentTarget.showPicker?.()}
            className={cn('field h-14 text-base', error && 'field-error')}
          />
        )}

        {/* Una riga per un nome, un riquadro per una nota: un textarea alto tre righe
            per scriverci «Marco» invita a scrivere poco e occupa mezza schermata. */}
        {question.type === 'text' &&
          (question.short ? (
            <input
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(id, e.target.value)}
              autoComplete="off"
              className={cn('field', error && 'field-error')}
            />
          ) : (
            <textarea
              rows={3}
              value={value ?? ''}
              onChange={(e) => onChange(id, e.target.value)}
              className={cn('field resize-y', error && 'field-error')}
            />
          ))}
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error === 'too_long' ? t.tooLong : t.required}</p>}
    </div>
  );
}

/**
 * QR della recensione Google, generato a build time da `npm run qr:review` e servito da noi:
 * niente chiamate a generatori esterni, e funziona anche con la rete che va a singhiozzo
 * dentro un negozio.
 */
function ReviewQr({ question, locale }) {
  const t = ui(locale);
  const { label, help } = askedIn(question, locale);
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-btc/25 bg-btc/[0.06] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-btc/30 bg-btc/10 text-btc">
          <QrCode className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{label}</p>
          {help && <p className="mt-0.5 text-xs leading-relaxed text-muted">{help}</p>}
        </div>
      </div>

      {open ? (
        <div className="mt-4">
          {/* Fondo bianco e nessun arrotondamento sul codice: i lettori sbagliano meno.
              eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={question.image}
            alt="QR per la recensione Google di NAKA"
            className="mx-auto block w-full max-w-[260px] rounded-xl bg-white p-3"
          />
          <p className="mt-3 break-all text-center text-[11px] text-muted/80">{question.url}</p>
          <div className="mt-3 flex gap-2">
            <Button
              as="a"
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="flex-1"
            >
              {t.openLink}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t.close}
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setOpen(true)} className="mt-3 w-full">
          <QrCode className="h-4 w-4" />
          {t.showQr}
        </Button>
      )}
    </div>
  );
}

/**
 * Tre disposizioni, scelte dal contenuto e non dal chiamante:
 *  - `row`  : sì/no/na, bottoni di uguale larghezza su una riga
 *  - tag    : opzioni corte, affiancate e a capo — occupano un terzo dello spazio
 *  - elenco : opzioni lunghe, una per riga, perché affiancate si leggerebbero male
 */
function Choices({ options, value, onSelect, multi = false, variant = 'auto' }) {
  const selected = (v) => (multi ? value.includes(v) : value === v);
  const longest = Math.max(...options.map((o) => o.label.length));
  const tags = variant === 'auto' && longest <= 22;
  const row = variant === 'row';

  return (
    <div className={cn('gap-2', row ? 'flex' : tags ? 'flex flex-wrap' : 'flex flex-col')}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          aria-pressed={selected(o.value)}
          className={cn(
            'flex min-h-12 items-center gap-2.5 rounded-xl border px-4 text-sm font-medium transition',
            row && 'flex-1 justify-center',
            tags && 'justify-start py-2.5',
            !row && !tags && 'w-full justify-start py-3 text-left',
            selected(o.value)
              ? 'border-btc bg-btc/15 text-btc'
              : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25',
          )}
        >
          {multi && (
            <span
              className={cn(
                'grid h-5 w-5 shrink-0 place-items-center rounded border',
                selected(o.value) ? 'border-btc bg-btc text-ink-deep' : 'border-white/25',
              )}
            >
              {selected(o.value) && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PhotoStep({ photos, setPhotos, errors, generic, locale }) {
  const t = ui(locale);
  return (
    <section>
      <h2 className="text-xl font-bold">{t.photosTitle}</h2>
      <p className="mt-1.5 text-sm text-muted">{t.photosIntro}</p>
      <div className="mt-7 space-y-4">
        {PHOTOS.map((photo) => (
          <PhotoSlot
            key={photo.id}
            photo={photo}
            file={photos[photo.id]}
            error={errors[`photo_${photo.id}`]}
            onPick={(file) => setPhotos((p) => ({ ...p, [photo.id]: file }))}
            onClear={() => setPhotos((p) => ({ ...p, [photo.id]: null }))}
            locale={locale}
          />
        ))}
      </div>

      {generic && (
        <p className="mt-5 text-sm text-red-400">
          {generic === 'network' ? t.offline : generic === 'storage_unavailable' ? t.storageOff : t.genericError}
        </p>
      )}
    </section>
  );
}

function PhotoSlot({ photo, file, error, onPick, onClear, locale }) {
  const t = ui(locale);
  const { label, hint } = photoIn(photo, locale);
  // Uno slot multiplo tiene un array, uno singolo il file: il resto del componente
  // lavora sempre sull'array, così la griglia e i pulsanti sono gli stessi.
  const files = photo.multiple ? (Array.isArray(file) ? file : []) : file ? [file] : [];
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length, files.map((f) => `${f.name}:${f.size}`).join('|')]);

  const [working, setWorking] = useState(false);

  // Si comprime prima di tenere il file in memoria: così la bozza, l'anteprima e
  // l'invio lavorano già sull'immagine leggera.
  const add = async (picked) => {
    if (!picked.length) return;
    setWorking(true);
    try {
      const ready = await compressAll(picked);
      onPick(photo.multiple ? [...files, ...ready] : ready[0]);
    } finally {
      setWorking(false);
    }
  };

  const removeAt = (i) => {
    if (!photo.multiple) return onClear();
    const rest = files.filter((_, idx) => idx !== i);
    onPick(rest.length ? rest : null);
  };

  return (
    <div
      className={cn('rounded-xl border p-4', error ? 'border-red-400/50' : 'border-white/10 bg-white/[0.03]')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
        </div>
        {files.length > 0 && (
          <span className="shrink-0 rounded-full border border-btc/30 bg-btc/10 px-2.5 py-1 text-xs font-semibold text-btc">
            {files.length}
          </span>
        )}
      </div>

      {previews.length > 0 && (
        <ul className={cn('mt-3 grid gap-2', photo.multiple ? 'grid-cols-3' : 'grid-cols-1')}>
          {previews.map((src, i) => (
            <li key={src} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className={cn('w-full rounded-lg object-cover', photo.multiple ? 'h-24' : 'h-40')}
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1.5 top-1.5 rounded-md bg-ink-deep/80 p-1.5 text-muted backdrop-blur transition hover:text-red-400"
                aria-label={`${t.remove} ${i + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(photo.multiple || files.length === 0) && (
        // Due ingressi: la fotocamera per lo scatto sul posto, la galleria per una foto già
        // fatta (o mandata da un collega). Con `capture` il telefono apre solo la fotocamera,
        // senza `capture` lascia scegliere dalla galleria: servono entrambi, e si vedono.
        <div className={cn('mt-3 grid grid-cols-2 gap-2', working && 'pointer-events-none opacity-60')}>
          {[
            { id: 'camera', icon: Camera, label: files.length ? t.addMore : t.take, capture: 'environment' },
            { id: 'gallery', icon: ImagePlus, label: files.length ? t.uploadMore : t.upload, capture: undefined },
          ].map((way) => (
            <label
              key={way.id}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-2 text-center text-sm text-muted transition hover:border-btc/40 hover:text-white',
                files.length ? 'h-14' : 'h-24',
              )}
            >
              <way.icon className="h-5 w-5 shrink-0" />
              {working ? t.preparing : way.label}
              <input
                type="file"
                accept="image/*"
                capture={way.capture}
                multiple={photo.multiple}
                className="sr-only"
                onChange={(e) => {
                  add(Array.from(e.target.files ?? []));
                  e.target.value = '';
                }}
              />
            </label>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error === 'photo_size' ? t.photoSize(Math.round(MAX_PHOTO_BYTES / 1024 / 1024)) : t.photoType}
        </p>
      )}
    </div>
  );
}

function Done({ id, photos, merchant, onNext, locale }) {
  const t = ui(locale);
  return (
    <div className="mx-auto w-full max-w-md px-5 py-24 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-btc-gradient text-ink-deep">
        <Check className="h-7 w-7" strokeWidth={3} />
      </span>
      <h1 className="mt-6 text-2xl font-bold">{t.savedTitle}</h1>
      <p className="mt-2 text-sm text-muted">
        {merchant?.name} · <span className="font-mono text-btc">{id}</span>
      </p>
      {/* Conferma di quello che è arrivato davvero sul disco, non di quello che si è scattato. */}
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
        <Camera className="h-3.5 w-3.5 text-btc" />
        {t.savedPhotos(photos)}
      </p>
      <Button onClick={onNext} size="lg" className="mt-8 w-full">
        {t.nextShop}
      </Button>
    </div>
  );
}
