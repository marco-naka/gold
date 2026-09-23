'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Mail,
  Store,
  Hash,
  Upload,
  Paperclip,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Copy,
  CalendarClock,
} from 'lucide-react';
import Button from './ui/Button';
import GlassCard from './ui/GlassCard';
import Modal from './ui/Modal';
import SectionTitle from './ui/SectionTitle';
import { cn } from './ui/cn';
import { MERCHANTS } from '@/lib/merchants';
import { MAX_RECEIPT_BYTES, validateEntry } from '@/lib/validation';
import { submissionWindow } from '@/lib/contest';

const EMPTY = {
  email: '',
  txId: '',
  merchant: '',
  confirmAge: false,
  acceptRules: false,
};

export default function EntryForm({ onOpenRules }) {
  const [values, setValues] = useState(EMPTY);
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);
  const [closed, setClosed] = useState(null);
  const fileInput = useRef(null);
  // Marca temporale di apertura del form: serve al controllo anti-bot lato server.
  const startedAt = useRef(0);
  const [honeypot, setHoneypot] = useState('');

  // La finestra di invio si calcola dopo il mount: il server non deve prerenderizzare uno stato
  // che diventerebbe sbagliato con il passare delle ore (pagina statica + cache).
  useEffect(() => {
    startedAt.current = Date.now();
    const win = submissionWindow();
    if (!win.open) setClosed(win);
  }, []);

  // Suggerimenti per il campo facoltativo: nomi dei merchant della mappa, inseribili anche a mano.
  const merchantNames = useMemo(
    () => [...new Set(MERCHANTS.filter((m) => m.posActive).map((m) => m.name))].sort((a, b) => a.localeCompare(b, 'it')),
    []
  );

  // Si rendono solo i suggerimenti pertinenti: 327 <option> nell'HTML pesavano ~15 KB
  // e su mobile rallentavano la prima interazione con il campo.
  const merchantSuggestions = useMemo(() => {
    const q = values.merchant.trim().toLowerCase();
    if (q.length < 2) return [];
    return merchantNames.filter((name) => name.toLowerCase().includes(q)).slice(0, 8);
  }, [merchantNames, values.merchant]);

  const runValidation = (next = values, nextReceipt = receipt) =>
    validateEntry(next, nextReceipt ? { name: nextReceipt.name, size: nextReceipt.size, type: nextReceipt.type } : null);

  const setField = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || Object.keys(errors).length) setErrors(runValidation(next));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(runValidation());
  };

  const handleFile = (file) => {
    setReceipt(file ?? null);
    setErrors(runValidation(values, file ?? null));
  };

  const showError = (field) => (touched[field] || status === 'error') && errors[field];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = runValidation();
    setErrors(found);
    setTouched(Object.keys(EMPTY).reduce((acc, k) => ({ ...acc, [k]: true }), { receipt: true }));
    setServerError('');

    if (Object.keys(found).length) {
      setStatus('error');
      document.querySelector('[data-field-error="true"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setStatus('submitting');
    try {
      const payload = new FormData();
      Object.entries(values).forEach(([k, v]) => payload.append(k, String(v)));
      payload.append('company', honeypot); // honeypot: deve restare vuoto
      payload.append('startedAt', String(startedAt.current));
      if (receipt) payload.append('receipt', receipt);

      const res = await fetch('/api/entries', { method: 'POST', body: payload });
      const data = await res.json();

      if (!res.ok) {
        if (data.closed) {
          setClosed(submissionWindow());
          return;
        }
        if (data.errors) setErrors(data.errors);
        setServerError(data.message || 'Invio non riuscito. Riprova tra qualche istante.');
        setStatus('error');
        return;
      }

      setResult(data.entry);
      setStatus('idle');
      setValues(EMPTY);
      setReceipt(null);
      setTouched({});
      setErrors({});
      if (fileInput.current) fileInput.current.value = '';
    } catch {
      setServerError('Connessione non disponibile. Verifica la rete e riprova.');
      setStatus('error');
    }
  };

  return (
    <section id="partecipa" className="section-pad scroll-mt-28">
      <SectionTitle
        eyebrow="Registra la giocata"
        title="Carica Scontrino e TX ID"
        subtitle="Inserisci il numero della transazione e la foto dello scontrino: servono entrambi per convalidare la giocata."
      />

      {closed ? (
        <GlassCard hover={false} className="mx-auto mt-12 max-w-2xl p-8 text-center sm:p-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <CalendarClock className="h-7 w-7" />
          </span>
          <h3 className="mt-5 text-xl font-bold">
            {closed.reason === 'upcoming' ? 'Le registrazioni non sono ancora aperte' : 'Registrazioni chiuse'}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {closed.reason === 'upcoming'
              ? `Potrai registrare le tue giocate dal ${closed.opensAt.toLocaleDateString('it-CH', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}. Nel frattempo scopri i negozi aderenti.`
              : `Il termine per registrare le giocate è scaduto il ${closed.closesAt.toLocaleDateString('it-CH', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}. I vincitori vengono avvisati via email.`}
          </p>
          <Button as="a" href="#mappa" variant="secondary" className="mt-7">
            Vedi i negozi aderenti
          </Button>
        </GlassCard>
      ) : (
      <GlassCard hover={false} className="mx-auto mt-12 max-w-2xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 1. Email */}
          <Field
            label="La tua email"
            hint="Ti contattiamo qui se vinci: è l’unico dato che ti serve per essere raggiungibile."
            icon={Mail}
            error={showError('email')}
            htmlFor="email"
          >
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nome@dominio.ch"
              value={values.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={handleBlur}
              className={cn('field', showError('email') && 'field-error')}
              aria-invalid={Boolean(showError('email'))}
            />
          </Field>

          {/* 2. Prova d'acquisto: numero transazione e/o foto scontrino */}
          <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition">
            <legend className="px-2 text-sm font-semibold text-white">Prova d&apos;acquisto</legend>
            <p className="text-xs text-muted">
              Servono <span className="font-semibold text-white">entrambe</span>: il numero della
              transazione per il riscontro automatico sul POS e la foto dello scontrino per la verifica
              documentale.
            </p>

            <div className="mt-5 space-y-5">
              <Field
                label="Numero transazione"
                hint="Lo trovi sulla ricevuta del POS o nel tuo wallet."
                icon={Hash}
                error={showError('txId')}
                htmlFor="txId"
              >
                <input
                  id="txId"
                  name="txId"
                  type="text"
                  spellCheck={false}
                  placeholder="es. 0x4f2a… · lnbc… · rif. ricevuta"
                  value={values.txId}
                  onChange={(e) => setField('txId', e.target.value)}
                  onBlur={handleBlur}
                  className={cn('field font-mono text-xs', showError('txId') && 'field-error')}
                  aria-invalid={Boolean(showError('txId'))}
                />
              </Field>

              <div data-field-error={Boolean(showError('receipt'))}>
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <Paperclip className="h-4 w-4 text-gold" />
                  Foto dello scontrino
                </span>
                <input
                  ref={fileInput}
                  id="receipt"
                  name="receipt"
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {!receipt ? (
                  <label
                    htmlFor="receipt"
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition hover:border-gold/50 hover:bg-gold/[0.04]',
                      showError('receipt') ? 'border-red-500/60 bg-red-500/[0.04]' : 'border-white/15 bg-ink-deep/50'
                    )}
                  >
                    <Upload className="h-6 w-6 text-gold" />
                    <span className="text-sm font-medium text-white">Tocca per scattare o caricare</span>
                    <span className="text-xs text-muted">
                      JPG, PNG, WEBP, HEIC o PDF — max {Math.round(MAX_RECEIPT_BYTES / 1024 / 1024)} MB
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/[0.06] px-4 py-3">
                    <Paperclip className="h-4 w-4 shrink-0 text-gold" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{receipt.name}</p>
                      <p className="text-xs text-muted">{(receipt.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleFile(null);
                        if (fileInput.current) fileInput.current.value = '';
                      }}
                      aria-label="Rimuovi allegato"
                      className="rounded-lg border border-white/10 p-1.5 text-muted transition hover:border-red-500/50 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {showError('receipt') && <ErrorText>{errors.receipt}</ErrorText>}
              </div>
            </div>

          </fieldset>

          {/* 3. Merchant: facoltativo, testo libero con suggerimenti dalla mappa */}
          <Field
            label={
              <>
                Negozio <span className="font-normal text-muted">(facoltativo)</span>
              </>
            }
            hint="Se lo indichi velocizzi la verifica. Scrivilo liberamente: i suggerimenti arrivano dalla mappa del circuito."
            icon={Store}
            error={showError('merchant')}
            htmlFor="merchant"
          >
            <input
              id="merchant"
              name="merchant"
              type="text"
              list="merchant-options"
              autoComplete="off"
              placeholder="Inizia a scrivere il nome del negozio…"
              value={values.merchant}
              onChange={(e) => setField('merchant', e.target.value)}
              onBlur={handleBlur}
              className={cn('field', showError('merchant') && 'field-error')}
              aria-invalid={Boolean(showError('merchant'))}
            />
            <datalist id="merchant-options">
              {merchantSuggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </Field>

          {/* Dichiarazioni obbligatorie */}
          <div className="space-y-3">
            <Checkbox
              id="confirmAge"
              checked={values.confirmAge}
              onChange={(v) => setField('confirmAge', v)}
              onBlur={handleBlur}
              error={showError('confirmAge')}
            >
              Dichiaro di aver compiuto 18 anni e di conservare lo scontrino originale.
            </Checkbox>
            <Checkbox
              id="acceptRules"
              checked={values.acceptRules}
              onChange={(v) => setField('acceptRules', v)}
              onBlur={handleBlur}
              error={showError('acceptRules')}
            >
              Accetto il{' '}
              <button
                type="button"
                onClick={onOpenRules}
                className="font-semibold text-gold underline underline-offset-2 hover:text-gold-warm"
              >
                Regolamento Ufficiale e l&apos;Informativa Privacy (LPD/GDPR)
              </button>
              .
            </Checkbox>
          </div>

          {serverError && (
            <p className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {serverError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full">
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifica in corso…
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Invia e Partecipa
              </>
            )}
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-muted/80">
            Lo stesso numero di transazione può essere registrato una sola volta. Le giocate sono sottoposte
            a controllo incrociato con i dati del POS NAKA. L&apos;indirizzo per ricevere il premio in XAUT
            ti verrà richiesto via email solo in caso di vincita.
          </p>
          {/* Honeypot: invisibile agli utenti, compilato dai bot. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="company">Azienda (non compilare)</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
        </form>
      </GlassCard>
      )}

      <ConfirmationModal entry={result} onClose={() => setResult(null)} />
    </section>
  );
}

/* ---------- Sottocomponenti form ---------- */

function Field({ label, hint, icon: Icon, error, htmlFor, children }) {
  return (
    <div data-field-error={Boolean(error)}>
      <label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
        {Icon && <Icon className="h-4 w-4 text-gold" />}
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted/80">{hint}</p>}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-red-400">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}

function Checkbox({ id, checked, onChange, onBlur, error, children }) {
  return (
    <div data-field-error={Boolean(error)}>
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition',
          error ? 'border-red-500/60 bg-red-500/[0.04]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'
        )}
      >
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/30 bg-ink-deep accent-gold"
          aria-invalid={Boolean(error)}
        />
        <span className="text-xs leading-relaxed text-muted">{children}</span>
      </label>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ConfirmationModal({ entry, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!entry) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(entry.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard non disponibile: l'ID resta visibile a schermo */
    }
  };

  return (
    <Modal
      open={Boolean(entry)}
      onClose={onClose}
      title="Giocata registrata!"
      subtitle="Conserva lo scontrino originale fino alla comunicazione dei vincitori."
      footer={
        <Button onClick={onClose} className="w-full">
          Ho capito
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <p className="mt-5 text-sm text-muted">Il tuo ID giocata è</p>
        <button
          type="button"
          onClick={copy}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 font-mono text-base font-bold text-gold transition hover:bg-gold/15"
        >
          {entry.id}
          <Copy className="h-4 w-4" />
        </button>
        <span className="mt-2 h-4 text-xs text-gold/80">{copied ? 'Copiato negli appunti' : ''}</span>
      </div>

      <dl className="mt-6 space-y-2">
        <SummaryRow label="Email" value={entry.email} />
        <SummaryRow label="Prova d'acquisto" value={entry.proof} />
        {entry.txIdMasked && <SummaryRow label="Numero transazione" value={entry.txIdMasked} mono />}
        {entry.merchant && <SummaryRow label="Negozio" value={entry.merchant} />}
        <SummaryRow label="Registrata il" value={entry.createdAtLabel} />
        <SummaryRow label="Stato" value="In verifica sul backend POS NAKA" />
      </dl>

      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-xs leading-relaxed text-muted">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <span>
          Abbiamo inviato la conferma a <span className="font-semibold text-white">{entry.email}</span> con il
          riepilogo della giocata. Se non la trovi, controlla la posta indesiderata.
        </span>
      </p>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Riceverai una seconda email alla convalida. In caso di vincita ti chiederemo l&apos;indirizzo wallet su
        cui accreditare il premio in XAUT: NAKA non chiede mai chiavi private o frasi di recupero.
      </p>
    </Modal>
  );
}

function SummaryRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn('max-w-[60%] break-all text-right text-xs font-medium text-white', mono && 'font-mono')}>
        {value}
      </dd>
    </div>
  );
}
