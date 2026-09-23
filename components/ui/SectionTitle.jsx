import { cn } from './cn';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', className }) {
  const centered = align === 'center';
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && (
        <span className="chip border-gold/30 bg-gold/10 text-gold">{eyebrow}</span>
      )}
      <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}
