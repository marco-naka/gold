import { Coins } from 'lucide-react';

/**
 * Wordmark segnaposto: sostituire con gli asset ufficiali (SVG/PNG in /public)
 * forniti dai rispettivi brand prima del go-live.
 */
export function NakaLogo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-gradient text-ink-deep shadow-gold-sm">
        <Coins className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-lg font-extrabold tracking-[0.18em] text-white">NAKA</span>
    </span>
  );
}

export function PlanBLogo({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 ${className}`}
    >
      <span className="text-base font-black leading-none text-gold">₿</span>
      <span className="text-[11px] font-semibold leading-tight text-muted">
        Plan ₿ Forum
        <span className="block text-[10px] font-normal text-muted/80">2026 · Lugano</span>
      </span>
    </span>
  );
}

export function PoweredBadge({ className = '' }) {
  return (
    <span className={`chip border-gold/30 bg-gold/10 text-gold ${className}`} title="NAKA">
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
      Powered by NAKA
    </span>
  );
}
