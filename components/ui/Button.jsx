import { cn } from './cn';

const VARIANTS = {
  // CTA primaria: gradiente dorato con riflesso metallico animato all'hover
  primary:
    'relative overflow-hidden bg-gold-gradient text-ink-deep font-bold shadow-gold hover:shadow-gold ' +
    'hover:brightness-110 active:scale-[.98]',
  secondary:
    'border border-gold/40 text-gold bg-gold/5 font-semibold hover:bg-gold/12 hover:border-gold/70 active:scale-[.98]',
  ghost: 'border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-white/25',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-sm rounded-xl',
  lg: 'px-7 py-4 text-base rounded-xl',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'group inline-flex items-center justify-center gap-2 transition-all duration-300',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gold-sheen opacity-0 group-hover:opacity-100 group-hover:animate-sheen"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Tag>
  );
}
