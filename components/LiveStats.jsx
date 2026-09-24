'use client';

import { useEffect, useState } from 'react';
import { Users, Trophy, Store } from 'lucide-react';
import { cn } from './ui/cn';

/**
 * Contatore pubblico. Dice quante giocate sono state registrate a fronte dei premi in palio:
 * è insieme prova sociale e trasparenza sulle probabilità, che in un concorso valgono più
 * di qualunque claim. In anteprima non si raccolgono giocate, quindi mostra solo i negozi.
 */
export default function LiveStats({ t, className }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => alive && setStats(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!stats) return null;

  const items = [
    stats.collecting ? { icon: Users, value: stats.entries.toLocaleString('it-CH'), label: t.entries } : null,
    { icon: Trophy, value: stats.prizes, label: t.prizes },
    { icon: Store, value: stats.merchants, label: t.merchants },
  ].filter(Boolean);

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="chip border-white/10 bg-white/5 px-4 py-2">
          <Icon className="h-4 w-4 text-gold" />
          <span className="font-bold text-white">{value}</span>
          <span className="text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
