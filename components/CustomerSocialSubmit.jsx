'use client';

import { useState } from 'react';
import { CheckCircle2, Link2, Loader2, Send } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { cn } from './ui/cn';
import { CONTEST, SOCIAL_CONTEST } from '@/lib/constants';
import { formatDate, getDictionary } from '@/lib/i18n';
import { normalizeUrl, platformOf } from '@/lib/social-links';

/*
 * Premio Social dei clienti: il pulsante accanto al premio apre un popup in cui il cliente
 * incolla il link del contenuto e l'email della sua partecipazione. È la segnalazione che
 * mette il contenuto davanti alla giuria; l'admin la trova in /admin/social, scheda Clienti.
 */

const input =
  'w-full rounded-xl border border-white/10 bg-ink-soft px-3 py-2.5 text-sm text-white placeholder:text-muted/60 focus:border-btc/50 focus:outline-none';

export default function CustomerSocialSubmit({ locale }) {
  const dict = getDictionary(locale);
  const t = dict.prizes.socialSubmit;
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [entryId, setEntryId] = useState('');
  const [company, setCompany] = useState(''); // trappola per bot
  const [state, setState] = useState({ status: 'idle' });
  const [errors, setErrors] = useState({});

  const platform = url.trim() ? platformOf(normalizeUrl(url)) : null;
  const deadline = formatDate(SOCIAL_CONTEST.publishDeadline, locale);

  const close = () => {
    setOpen(false);
    if (state.status === 'done') {
      setUrl('');
      setState({ status: 'idle' });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const local = {};
    if (!url.trim()) local.url = 'required';
    else if (!platform) local.url = 'platform';
    if (!email.trim()) local.email = 'required';
    if (Object.keys(local).length) return setErrors(local);

    setErrors({});
    setState({ status: 'sending' });
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'customer', url, email, entryId, company, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return setState({ status: 'done', duplicate: data.duplicate, platform: data.platform });
      if (data.errors) setErrors(data.errors);
      setState({ status: 'error', code: data.code ?? 'error' });
    } catch {
      setState({ status: 'error', code: 'network' });
    }
  };

  const fieldError = (key) =>
    errors[key] ? (
      <p className="mt-1.5 text-xs font-semibold text-red-300">{t.errors[`${key}_${errors[key]}`] ?? t.errors.generic}</p>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-btc/40 bg-btc/10 px-3 py-1.5 text-xs font-semibold text-btc transition hover:bg-btc/20"
      >
        <Send className="h-3.5 w-3.5" />
        {t.button}
      </button>

      <Modal open={open} onClose={close} title={t.title} subtitle={t.subtitle(deadline)} closeLabel={dict.modal.close}>
        <div className="overflow-y-auto px-6 py-5">
          {state.status === 'done' ? (
            <div role="status">
              <p className="flex items-center gap-2 text-base font-bold text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                {state.duplicate ? t.duplicate : t.done}
              </p>
              <p className="mt-2 text-sm text-muted">{t.doneText(state.platform ?? '')}</p>
              <Button variant="secondary" size="sm" className="mt-5" onClick={close}>
                {dict.modal.close}
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col">
              <label htmlFor="cs-url" className="text-sm font-semibold">
                {t.urlLabel}
              </label>
              <div className="relative mt-2">
                <Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  id="cs-url"
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/…"
                  autoComplete="off"
                  className={cn(input, 'pl-9')}
                />
              </div>
              <p className={cn('mt-1.5 text-xs', platform ? 'font-semibold text-emerald-300' : 'text-muted')}>
                {platform ? t.recognised(platform) : t.urlHint}
              </p>
              {fieldError('url')}

              <label htmlFor="cs-email" className="mt-5 text-sm font-semibold">
                {t.emailLabel}
              </label>
              <input
                id="cs-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                className={cn(input, 'mt-2')}
              />
              <p className="mt-1.5 text-xs text-muted">{t.emailHint}</p>
              {fieldError('email')}

              <label htmlFor="cs-entry" className="mt-5 text-sm font-semibold">
                {t.entryLabel}
              </label>
              <input
                id="cs-entry"
                type="text"
                value={entryId}
                onChange={(e) => setEntryId(e.target.value.toUpperCase())}
                autoComplete="off"
                placeholder="NK-2026-7KQ2XM"
                className={cn(input, 'mt-2 font-mono uppercase')}
              />
              <p className="mt-1.5 text-xs text-muted">{t.entryHint}</p>
              {fieldError('entryId')}

              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <Button type="submit" className="mt-6" disabled={state.status === 'sending'}>
                {state.status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.submit}
              </Button>
              {state.status === 'error' && (
                <p className="mt-3 text-sm font-semibold text-red-300" role="alert">
                  {t.errors[state.code] ?? t.errors.generic}
                </p>
              )}
              <p className="mt-4 text-xs text-muted">
                {t.fallback}{' '}
                <a href={`mailto:${CONTEST.supportEmail}`} className="font-semibold text-btc underline underline-offset-2">
                  {CONTEST.supportEmail}
                </a>
              </p>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
