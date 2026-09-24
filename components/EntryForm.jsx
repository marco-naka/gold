'use client';

import { useEffect, useRef, useState } from 'react';
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
import { MAX_RECEIPT_BYTES, validateEntry } from '@/lib/validation';
import { submissionWindow } from '@/lib/contest';
import { formatDate } from '@/lib/i18n';
import { IS_DEMO } from '@/lib/deploy';

const EMPTY = {
  email: '',
  txId: '',
  merchant: '',
  confirmAge: false,
  acceptRules: false,
};

export default function EntryForm({ t, locale, onOpenRules, compact = false }) {
  const [values, setValues] = useState(EMPTY);
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);
  const [closed, setClosed] = useState(IS_DEMO ? { reason: 'demo' } : null);
  const fileInput = useRef(null);
  // Marca temporale di apertura del form: serve al controllo anti-bot lato server.
  const startedAt = useRef(0);
  const [honeypot, setHoneypot] = useState('');
  // Etichetta della sorgente (?s= sui QR stampati): serve a sapere quale materiale converte.
  const source = useRef('');

  // La finestra di invio si calcola dopo il mount: il server non deve prerenderizzare uno stato
  // che diventerebbe sbagliato con il passare delle ore (pagina statica + cache).
  useEffect(() => {
    startedAt.current = Date.now();
    source.current = new URLSearchParams(window.location.search).get('s') ?? '';
    if (IS_DEMO) return;
    const win = submissionWindow();
    if (!win.open) setClosed(win);
  }, []);

  // I suggerimenti del negozio arrivano da /api/merchants mentre si scrive: così la pagina
  // di partecipazione non scarica lo snapshot completo dei merchant per un campo facoltativo.
  const [merchantSuggestions, setMerchantSuggestions] = useState([]);

  useEffect(() => {
    const q = values.merchant.trim();
    if (q.length < 2) {
      setMerchantSuggestions([]);
      return undefined;
    }
    const controller = new AbortController();
    const id = setTimeout(() => {
      fetch(`/api/merchants?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setMerchantSuggestions(d.names ?? []))
        .catch(() => {});
    }, 180);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [values.merchant]);

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

  /** Da codice a messaggio nella lingua della pagina; un codice ignoto non resta mai a schermo. */
  const message = (code) => (code ? t.errors[code] ?? t.apiErrors.invalid_fields : null);
  const showError = (field) => ((touched[field] || status === 'error') && message(errors[field])) || null;

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
      payload.append('locale', locale);
      payload.append('source', source.current);
      if (receipt) payload.append('receipt', receipt);

      const res = await fetch('/api/entries', { method: 'POST', body: payload });
      const data = await res.json();

      if (!res.ok) {
        if (data.closed) {
          setClosed(submissionWindow());
          return;
        }
        if (data.errors) setErrors(data.errors);
        setServerError(t.apiErrors[data.code] ?? data.message ?? t.genericError);
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
      setServerError(t.networkError);
      setStatus('error');
    }
  };

  return (
    <section id="partecipa" className={compact ? 'scroll-mt-4' : 'section-pad scroll-mt-28'}>
      {!compact && <SectionTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />}

      {closed ? (
        <GlassCard hover={false} className={`mx-auto max-w-2xl p-8 text-center sm:p-10 ${compact ? 'mt-6' : 'mt-12'}`}>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <CalendarClock className="h-7 w-7" />
          </span>
          <h3 className="mt-5 text-xl font-bold">
            {closed.reason === 'demo'
              ? t.closed.demoTitle
              : closed.reason === 'upcoming'
                ? t.closed.upcomingTitle
                : t.closed.closedTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {closed.reason === 'demo'
              ? t.closed.demoText
              : closed.reason === 'upcoming'
                ? t.closed.upcomingText(formatDate(closed.opensAt, locale))
                : t.closed.closedText(formatDate(closed.closesAt, locale))}
          </p>
          <Button as="a" href="#mappa" variant="secondary" className="mt-7">
            {t.closed.cta}
          </Button>
        </GlassCard>
      ) : (
      <GlassCard hover={false} className={`mx-auto max-w-2xl p-6 sm:p-10 ${compact ? 'mt-6' : 'mt-12'}`}>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 1. Email */}
          <Field
            label={t.email}
            hint={t.emailHint}
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
              placeholder={t.emailPlaceholder}
              value={values.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={handleBlur}
              className={cn('field', showError('email') && 'field-error')}
              aria-invalid={Boolean(showError('email'))}
            />
          </Field>

          {/* 2. Prova d'acquisto: numero transazione e/o foto scontrino */}
          <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition">
            <legend className="px-2 text-sm font-semibold text-white">{t.proofLegend}</legend>
            <p className="text-xs text-muted">
              {t.proofIntro[0]} <span className="font-semibold text-white">{t.proofIntro[1]}</span>
              {t.proofIntro[2]}
            </p>

            <div className="mt-5 space-y-5">
              <Field
                label={t.txLabel}
                hint={t.txHint}
                icon={Hash}
                error={showError('txId')}
                htmlFor="txId"
              >
                <input
                  id="txId"
                  name="txId"
                  type="text"
                  spellCheck={false}
                  placeholder={t.txPlaceholder}
                  value={values.txId}
                  onChange={(e) => setField('txId', e.target.value)}
                  onBlur={handleBlur}
                  className={cn('field font-mono text-xs', showError('txId') && 'field-error')}
                  aria-invalid={Boolean(showError('txId'))}
                />
                {/* Il campo che fa abbandonare: chi non ha mai pagato in crypto non sa dove guardare. */}
                <details className="mt-2 group">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-gold underline-offset-2 hover:underline">
                    {t.txHelp.toggle}
                  </summary>
                  <div className="mt-3 flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
<svg width="96" height="126" viewBox="0 0 96 126" aria-hidden="true" className="shrink-0">
                      <rect x="3" y="3" width="90" height="120" rx="3" fill="#FAFAF7" />
                      <text x="48" y="19" textAnchor="middle" fontSize="11" fontWeight="800" fill="#16161B" letterSpacing="1">
                        {t.txHelp.receiptLabel}
                      </text>
                      <rect x="24" y="24" width="48" height="2.5" rx="1.25" fill="#C6C6BE" />
                      <rect x="14" y="36" width="30" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="60" y="36" width="22" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="14" y="44" width="26" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="64" y="44" width="18" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="14" y="52" width="22" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="58" y="52" width="24" height="2.5" rx="1.25" fill="#B4B4AC" />
                      <rect x="10" y="60" width="76" height="26" rx="3" fill="#FFF3C4" stroke="#F3BA2F" strokeWidth="1.5" />
                      <text x="14" y="70" fontSize="5.5" fontWeight="800" fill="#8A6A00">N° TRANSAZIONE</text>
                      <rect x="14" y="74" width="68" height="3" rx="1.5" fill="#16161B" />
                      <rect x="42" y="80" width="40" height="3" rx="1.5" fill="#16161B" />
                      <rect x="14" y="94" width="28" height="2.5" rx="1.25" fill="#C6C6BE" />
                      <rect x="56" y="94" width="26" height="2.5" rx="1.25" fill="#C6C6BE" />
                      <rect x="14" y="104" width="24" height="3.5" rx="1.75" fill="#8A8A82" />
                      <rect x="58" y="104" width="24" height="3.5" rx="1.75" fill="#8A8A82" />
                      <rect x="30" y="115" width="36" height="2.5" rx="1.25" fill="#C6C6BE" />
                    </svg>
                    <p className="text-xs leading-relaxed text-muted">{t.txHelp.text}</p>
                  </div>
                </details>
              </Field>

              <div data-field-error={Boolean(showError('receipt'))}>
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                  <Paperclip className="h-4 w-4 text-gold" />
                  {t.receiptLabel}
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
                    <span className="text-sm font-medium text-white">{t.receiptCta}</span>
                    <span className="text-xs text-muted">
                      {t.receiptFormats(Math.round(MAX_RECEIPT_BYTES / 1024 / 1024))}
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
                      aria-label={t.receiptRemove}
                      className="rounded-lg border border-white/10 p-1.5 text-muted transition hover:border-red-500/50 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {showError('receipt') && <ErrorText>{showError('receipt')}</ErrorText>}
              </div>
            </div>

          </fieldset>

          {/* 3. Merchant: facoltativo, testo libero con suggerimenti dalla mappa */}
          <Field
            label={
              <>
                {t.merchantLabel} <span className="font-normal text-muted">{t.merchantOptional}</span>
              </>
            }
            hint={t.merchantHint}
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
              placeholder={t.merchantPlaceholder}
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
              {t.confirmAge}
            </Checkbox>
            <Checkbox
              id="acceptRules"
              checked={values.acceptRules}
              onChange={(v) => setField('acceptRules', v)}
              onBlur={handleBlur}
              error={showError('acceptRules')}
            >
              {t.acceptRulesBefore}
              <button
                type="button"
                onClick={onOpenRules}
                className="font-semibold text-gold underline underline-offset-2 hover:text-gold-warm"
              >
                {t.acceptRulesLink}
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
                {t.submitting}
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                {t.submit}
              </>
            )}
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-muted/80">{t.footnote}</p>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <p className="text-[11px] leading-relaxed text-muted">
              <span className="font-semibold text-white">{t.trust.title}.</span> {t.trust.text('NAKA')}{' '}
              <a
                href="https://naka.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-2"
              >
                {t.trust.link}
              </a>
            </p>
          </div>
          {/* Honeypot: invisibile agli utenti, compilato dai bot. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="company">{t.honeypot}</label>
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

      <ConfirmationModal
        entry={result}
        t={t.modal}
        proofLabel={result ? t.proof[result.proof] ?? result.proof : ''}
        locale={locale}
        onClose={() => setResult(null)}
      />
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

function ConfirmationModal({ entry, t, proofLabel, locale, onClose }) {
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
      title={t.title}
      subtitle={t.subtitle}
      footer={
        <Button onClick={onClose} className="w-full">
          {t.close}
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <p className="mt-5 text-sm text-muted">{t.idLabel}</p>
        <button
          type="button"
          onClick={copy}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 font-mono text-base font-bold text-gold transition hover:bg-gold/15"
        >
          {entry.id}
          <Copy className="h-4 w-4" />
        </button>
        <span className="mt-2 h-4 text-xs text-gold/80">{copied ? t.copied : ''}</span>
      </div>

      <dl className="mt-6 space-y-2">
        <SummaryRow label={t.rowEmail} value={entry.email} />
        <SummaryRow label={t.rowProof} value={proofLabel} />
        {entry.txIdMasked && <SummaryRow label={t.rowTx} value={entry.txIdMasked} mono />}
        {entry.merchant && <SummaryRow label={t.rowMerchant} value={entry.merchant} />}
        <SummaryRow label={t.rowDate} value={entry.createdAtLabel} />
        <SummaryRow label={t.rowStatus} value={t.statusValue} />
      </dl>

      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/[0.06] p-4 text-xs leading-relaxed text-muted">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <span>{t.emailSent(entry.email)}</span>
      </p>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t.nextSteps}</p>
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
