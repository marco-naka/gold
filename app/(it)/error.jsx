'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { CONTEST } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n';

const t = getDictionary('it').error;

export default function Error({ error, reset }) {
  useEffect(() => {
    // TODO produzione: inoltrare a Sentry/monitoraggio.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-24">
      <div className="glass w-full max-w-lg p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">{t.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t.text}{' '}
          <a href={`mailto:${CONTEST.supportEmail}`} className="text-gold underline underline-offset-2">
            {CONTEST.supportEmail}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-bold text-ink-deep transition hover:brightness-110"
        >
          <RotateCcw className="h-4 w-4" />
          {t.retry}
        </button>
      </div>
    </main>
  );
}
