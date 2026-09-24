'use client';

import { useEffect, useState } from 'react';
import Button from './ui/Button';

const STORAGE_KEY = 'naka-consent';

/**
 * Richiesta di consenso, pronta ma spenta.
 *
 * Oggi il sito non installa cookie e non carica strumenti di terze parti, quindi un banner
 * sarebbe solo un ostacolo alla conversione: non c'è nulla da consentire. Il componente
 * compare soltanto se viene configurata la variabile NEXT_PUBLIC_ANALYTICS_ID, cioè nel
 * momento in cui si introduce uno strumento che richiede consenso preventivo.
 */
export default function ConsentBanner({ t, privacyHref }) {
  const enabled = Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID);
  const [choice, setChoice] = useState('pending');

  useEffect(() => {
    if (!enabled) return;
    try {
      setChoice(window.localStorage.getItem(STORAGE_KEY) ?? 'none');
    } catch {
      // Storage non disponibile (navigazione privata): si chiede di nuovo, non si assume nulla.
      setChoice('none');
    }
  }, [enabled]);

  if (!enabled || choice !== 'none') return null;

  const decide = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* la scelta vale comunque per questa visita */
    }
    setChoice(value);
  };

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-ink-soft/95 p-5 shadow-2xl backdrop-blur-xl sm:inset-x-6"
    >
      <p className="text-sm font-bold">{t.title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        {t.text}{' '}
        <a href={privacyHref} className="text-gold underline underline-offset-2">
          {t.link}
        </a>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" size="sm" onClick={() => decide('rejected')}>
          {t.reject}
        </Button>
        <Button size="sm" onClick={() => decide('accepted')}>
          {t.accept}
        </Button>
      </div>
    </div>
  );
}
