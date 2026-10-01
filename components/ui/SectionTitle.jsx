import { cn } from './cn';

/**
 * `accent` segue il pubblico della sezione: arancio per i clienti, oro per i commercianti.
 * L'occhiello è la prima cosa colorata che si incontra scorrendo, quindi è anche il segnale
 * più economico per dire «questa parte parla a te» senza scriverlo.
 */
export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  accent = 'btc',
  className,
}) {
  const centered = align === 'center';
  const chip = accent === 'gold' ? 'border-gold/30 bg-gold/10 text-gold' : 'border-btc/30 bg-btc/10 text-btc';
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && <span className={cn('chip', chip)}>{eyebrow}</span>}
      <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}
