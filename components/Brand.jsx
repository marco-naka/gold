/**
 * Marchio dell'iniziativa: moneta d'oro lucido con il fulmine in rilievo.
 * L'oro è il premio — XAUT — e il fulmine è la rete Lightning con cui si paga sui POS.
 * È la stessa forma di `app/icon.svg`: favicon e header non devono divergere.
 *
 * Il volume sta tutto nei gradienti: due bande chiare e una scura sul bisello fanno il
 * metallo, la copia scura sotto il fulmine lo stacca dalla faccia. Niente filtri di
 * sfocatura, che costano in rendering e non servono a questa dimensione.
 *
 * Gli id dei gradienti sono unici per istanza: due marchi nella stessa pagina
 * (header e footer) con lo stesso id si ruberebbero le definizioni a vicenda.
 */
export function Mark({ className = '', id = 'mark' }) {
  const bezel = `${id}-bezel`;
  const face = `${id}-face`;
  const bolt = `${id}-bolt`;
  const glintA = `${id}-glint-a`;
  const glintB = `${id}-glint-b`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={bezel} x1="9" y1="5" x2="55" y2="59" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF2" />
          <stop offset=".12" stopColor="#FFE577" />
          <stop offset=".3" stopColor="#D8A015" />
          <stop offset=".46" stopColor="#8A6104" />
          <stop offset=".6" stopColor="#C3900E" />
          <stop offset=".78" stopColor="#FFEFA6" />
          <stop offset=".92" stopColor="#E4B123" />
          <stop offset="1" stopColor="#A97A08" />
        </linearGradient>
        <linearGradient id={face} x1="15" y1="11" x2="49" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF0A0" />
          <stop offset=".28" stopColor="#FFD531" />
          <stop offset=".6" stopColor="#E5A714" />
          <stop offset=".82" stopColor="#BE820A" />
          <stop offset="1" stopColor="#F0C64A" />
        </linearGradient>
        <linearGradient id={bolt} x1="25" y1="16" x2="41" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFCEA" />
          <stop offset=".38" stopColor="#FFDB4E" />
          <stop offset=".78" stopColor="#D99C0E" />
          <stop offset="1" stopColor="#F2C43E" />
        </linearGradient>
        <linearGradient id={glintA} x1="15" y1="7" x2="29" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={glintB} x1="47" y1="57" x2="38" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30.4" fill="#7A5703" />
      <circle cx="32" cy="32" r="29.8" fill={`url(#${bezel})`} />
      <circle cx="32" cy="32" r="24.4" fill="#6B4C04" />
      <circle cx="32" cy="32" r="23.2" fill={`url(#${face})`} />
      <path d="M7.6 25.4A25.6 25.6 0 0 1 25.4 6.3 26.6 26.6 0 0 0 9.8 28.6Z" fill={`url(#${glintA})`} />
      <path d="M56.2 39.4a25.6 25.6 0 0 1-17 18.3 26.6 26.6 0 0 0 15.1-21Z" fill={`url(#${glintB})`} />
      <path
        d="M32 55.2a23.2 23.2 0 0 0 20.4-12.1 23.2 23.2 0 0 1-20.4 10.5A23.2 23.2 0 0 1 11.6 43a23.2 23.2 0 0 0 20.4 12.2Z"
        fill="#FFF3C0"
        fillOpacity=".45"
      />
      <path d="M37.82 16.34 22.51 38.02h7.91L27.67 50.06 42.98 28.38h-7.91Z" fill="#6B4C04" fillOpacity=".85" />
      <path d="M36.82 15.14 21.51 36.82h7.91L26.67 48.86 41.98 27.18h-7.91Z" fill={`url(#${bolt})`} />
      <path d="M36.82 15.14 21.51 36.82h1.81L37.93 16.09Z" fill="#FFFBE6" fillOpacity=".95" />
    </svg>
  );
}

/**
 * Lockup di testata. Il wordmark NAKA resta tipografico: è il marchio di un terzo
 * e va sostituito con l'asset ufficiale quando arriva, senza toccare il resto.
 */
export function NakaLogo({ className = '', id = 'nav' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark id={id} className="h-9 w-9 shadow-gold-sm rounded-xl" />
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
