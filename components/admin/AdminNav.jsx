'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { navUi } from '@/lib/admin-panel-i18n';
import { cn } from '../ui/cn';

/**
 * La barra comune di tutte le sezioni admin: da qui si passa da rilevazioni a giocate,
 * estrazioni e link social. A destra lo stato del sito letto da /api/health, così chi lavora
 * nel pannello sa sempre se le giocate sono aperte e se le email partono.
 */
export const ADMIN_SECTIONS = [
  ['surveys', '/rilevazioni/admin'],
  ['entries', '/rilevazioni/admin/giocate'],
  ['drawUsers', '/rilevazioni/admin/estrazione'],
  ['drawMerchants', '/rilevazioni/admin/estrazione?scope=merchants'],
  ['social', '/rilevazioni/admin/social'],
];

const entriesState = (h) => {
  if (h.profile === 'demo') return 'demo';
  if (String(h.submissions).startsWith('prove')) return 'test';
  if (h.submissions === 'aperte') return 'open';
  return h.submissions === 'upcoming' ? 'upcoming' : 'closed';
};

export default function AdminNav({ current, locale }) {
  const t = navUi(locale);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ down: true }));
  }, []);

  const state = health && !health.down ? entriesState(health) : null;
  const mailOn = health?.mailer && health.mailer !== 'outbox locale';

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-ink-deep/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-btc">{t.kicker}</span>
        <div className="-mx-1 flex max-w-full gap-1 overflow-x-auto">
          {ADMIN_SECTIONS.map(([id, href]) => (
            <a
              key={id}
              href={href}
              aria-current={current === id ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition',
                current === id ? 'bg-btc/15 text-btc' : 'text-muted hover:text-white',
              )}
            >
              {t[id]}
            </a>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {health?.down && <span className="rounded-full border border-red-400/40 bg-red-400/10 px-2.5 py-1 text-red-300">{t.statusDown}</span>}
          {state && (
            <span
              className={cn(
                'rounded-full border px-2.5 py-1',
                state === 'open' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : state === 'test' ? 'border-red-400/40 bg-red-400/10 text-red-300' : 'border-white/15 bg-white/5 text-muted',
              )}
            >
              {t.statusEntries(state)}
            </span>
          )}
          {health && !health.down && (
            <span className={cn('rounded-full border px-2.5 py-1', mailOn ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-btc/30 bg-btc/10 text-btc')}>
              {t.statusMail(mailOn)}
            </span>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-white">
            {t.site} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </nav>
  );
}
