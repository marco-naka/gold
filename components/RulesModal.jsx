'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CONTEST, EVENT, PRIZES, formatXaut } from '@/lib/constants';
import { formatDate, formatDateTime, intlLocale } from '@/lib/i18n';

/** "1° Premio — 2.00 XAUT ciascuno; …" a partire dai dati dei premi. */
const listPrizes = (tier, t) =>
  tier.items
    .map((i) => {
      const place = t.prizes.items[i.place]?.place ?? i.place;
      return `${place} — ${formatXaut(i.amount)}${i.count > 1 ? ' ×' + i.count : ''}`;
    })
    .join('; ');

export default function RulesModal({ t, locale, open, onClose }) {
  const d = t.rules;
  const articles = d.articles({
    contest: CONTEST.title,
    organizer: CONTEST.organizer,
    event: EVENT.name,
    city: EVENT.city,
    from: formatDateTime(CONTEST.validFrom, locale),
    to: formatDateTime(CONTEST.validTo, locale),
    draw: formatDateTime(CONTEST.drawDate, locale),
    support: CONTEST.supportEmail,
    users: formatXaut(PRIZES.users.pool),
    merchants: formatXaut(PRIZES.merchants.pool),
    prizeList: {
      users: listPrizes(PRIZES.users, t),
      merchants: listPrizes(PRIZES.merchants, t),
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={d.title}
      subtitle={d.subtitle(CONTEST.title, EVENT.name, EVENT.city)}
      closeLabel={t.modal.close}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {d.close}
          </Button>
          <Button as="a" href="#partecipa" size="sm" onClick={onClose}>
            {d.accept}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-muted">{d.draftNotice}</p>
      </div>

      {/* Nella traduzione si dichiara quale versione fa fede */}
      {d.prevailing && (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-muted">
          {d.prevailing}
        </p>
      )}

      <div className="mt-6 space-y-7">
        {articles.map((article) => (
          <article key={article.title}>
            <h4 className="text-sm font-bold text-gold">{article.title}</h4>
            <div className="mt-2 space-y-2">
              {article.body.map((p) => (
                <p key={p} className="text-xs leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 border-t border-white/10 pt-5 text-[11px] text-muted/80">
        {d.updated(new Date().toLocaleDateString(intlLocale(locale)), CONTEST.organizer)}
      </p>
    </Modal>
  );
}
