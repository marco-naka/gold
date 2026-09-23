'use client';

import { useEffect, useState } from 'react';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    total: ms,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/**
 * Countdown live verso l'inizio dell'iniziativa; una volta partita passa al conto alla rovescia
 * sulla chiusura delle giocate. Il primo render è statico per evitare mismatch di idratazione.
 */
export default function Countdown({ startsAt, endsAt, t }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const tick = () => {
      const toStart = diff(startsAt);
      const live = toStart.total === 0;
      setState({ live, ...(live ? diff(endsAt) : toStart) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startsAt, endsAt]);

  const ended = state && state.live && state.total === 0;
  const units = [
    { key: 'days', label: t.days },
    { key: 'hours', label: t.hours },
    { key: 'minutes', label: t.minutes },
    { key: 'seconds', label: t.seconds },
  ];

  return (
    <div className="w-full">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {!state && t.loading}
        {state && !state.live && t.toStart}
        {state && state.live && !ended && t.running}
        {ended && t.ended}
      </p>
      <div className="grid max-w-md grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
        {units.map((unit) => (
          <div key={unit.key} className="glass flex flex-col items-center px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-gold-gradient text-2xl font-extrabold tabular-nums sm:text-3xl">
              {state ? String(state[unit.key]).padStart(2, '0') : '--'}
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted sm:text-xs">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
