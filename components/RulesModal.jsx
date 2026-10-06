'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CONTEST, DRAW, EVENT, SOCIAL_CONTEST } from '@/lib/constants';
import { ANCHOR } from '@/lib/anchor';
import { DECLARED, POOLS, formatPrize } from '@/lib/campaigns';
import { SATOSHI_SPRITZ, formatSats } from '@/lib/bitcoin';
import { anchoredMerchantsSats } from '@/lib/anchor';
import { formatDate, formatDateTime, formatTime } from '@/lib/i18n';
import { formatNumber } from '@/lib/number-format';

/** "1° Premio — 5'000'000 sat; Estrazione Riservata Merchant — 0.25 XAUT ×2; …" */
const listPrizes = (pool, t, locale) =>
  pool.items
    .map((i) => {
      const place = t.prizes.items[i.place]?.place ?? i.place;
      return `${place} — ${formatPrize(i, locale)}${i.count > 1 ? ' ×' + i.count : ''}`;
    })
    .join('; ');

export default function RulesModal({ t, locale, open, onClose }) {
  const d = t.rules;
  const articles = d.articles({
    contest: t.meta.contestTitle,
    organizer: CONTEST.organizer,
    event: EVENT.name,
    city: EVENT.city,
    from: formatDateTime(CONTEST.validFrom, locale),
    to: formatDateTime(CONTEST.validTo, locale),
    // Il giorno, non l'ora: l'ora dipende dalla rete Bitcoin e l'articolo 7 ne dà la finestra.
    draw: formatDate(CONTEST.drawDate, locale),
    commitBy: formatTime(DRAW.commitBy, locale),
    blocks: DRAW.blocksAhead,
    drawFrom: formatTime(DRAW.expectedFrom, locale),
    drawTo: formatTime(DRAW.expectedBy, locale),
    support: CONTEST.supportEmail,
    users: POOLS.users.format(POOLS.users.total, locale),
    merchants: POOLS.merchants.format(POOLS.merchants.total, locale),
    declared: formatSats(DECLARED.sats, locale),
    prizeList: {
      users: listPrizes(POOLS.users, t, locale),
      merchants: listPrizes(POOLS.merchants, t, locale),
    },
    // L'ancoraggio va citato per esteso: è il conto che rende vero il numero dichiarato.
    anchor: {
      at: formatDateTime(ANCHOR.at, locale),
      btcUsd: formatNumber(ANCHOR.btcUsd, locale),
      xautUsd: formatNumber(ANCHOR.xautUsd, locale),
      ratio: DECLARED.ratio,
      // Il valore vero a quelle quotazioni: 10'000'120, non un tondo 10 milioni. Scriverlo
      // esatto è ciò che permette a chiunque di rifare il conto e trovarci d'accordo.
      merchantsSats: formatNumber(anchoredMerchantsSats(), locale),
      source: locale === 'en' ? ANCHOR.sourceEn : ANCHOR.source,
    },
    social: {
      deadline: formatDateTime(SOCIAL_CONTEST.publishDeadline, locale),
      tags: SOCIAL_CONTEST.hashtags.join(' '),
    },
    spritz: {
      from: formatDateTime(SATOSHI_SPRITZ.from, locale),
      to: formatTime(SATOSHI_SPRITZ.to, locale),
      area: SATOSHI_SPRITZ.area,
      url: SATOSHI_SPRITZ.url,
      venues: SATOSHI_SPRITZ.venueNames?.length ? SATOSHI_SPRITZ.venueNames.join(', ') : null,
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={d.title}
      subtitle={d.subtitle(t.meta.contestTitle, EVENT.name, EVENT.city)}
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
      <div className="flex items-start gap-3 rounded-xl border border-btc/30 bg-btc/[0.06] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-btc" />
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
            <h4 className="text-sm font-bold text-btc">{article.title}</h4>
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
        {d.updated(formatDate(new Date(), locale, { day: 'numeric', month: 'numeric', year: 'numeric' }), CONTEST.organizer)}
      </p>
    </Modal>
  );
}
