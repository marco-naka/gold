/**
 * Marchi degli asset accettati sui POS.
 *
 * Sono disegnati in SVG dentro la pagina invece di essere caricati come immagini: il sito non
 * chiama risorse di terze parti — è la ragione per cui non serve il banner cookie — e tre bitmap
 * per tre icone da 40 px sarebbero uno spreco. Così ognuno pesa meno di 2 KB e resta nitido
 * a qualsiasi densità di schermo.
 *
 * Sono marchi altrui, usati per dire quale mezzo di pagamento è accettato: vanno riprodotti nei
 * loro colori e non riadattati alla palette oro del sito, altrimenti smettono di essere
 * riconoscibili.
 */

/**
 * Bitcoin: il logo ufficiale di bitcoin.org, di pubblico dominio, ripreso tale e quale.
 * Il tracciato del ₿ non è ridisegnato a mano — le proporzioni di quel glifo sono
 * riconoscibilissime e una copia approssimativa si vede.
 */
const BITCOIN_DISC =
  'm63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78,4.272-17.145,21.635-27.579,38.775-23.305,17.144,4.274,27.576,21.64,23.302,38.784z';
const BITCOIN_SYMBOL =
  'm46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019,4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646l-1.453,5.834,3.507,0.875,1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739,1.527-4.36-0.076-6.875-3.226-8.515,2.294-0.529,4.022-2.038,4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594,10.012,1.77,8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494,8.365,1.416,7.334,5.553z';

/**
 * Il pentagono di Tether, la forma che il brand usa al posto del cerchio, con dentro il ₮:
 * barra, asta e l'ellisse che le attraversa. USDt e Tether Gold condividono la sagoma e
 * cambiano solo il colore, come nei marchi ufficiali.
 */
function TetherMark({ fill, id }) {
  return (
    <>
      {fill.startsWith('url(') && (
        <defs>
          <linearGradient id={id} x1="4" y1="10" x2="60" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#C7A24A" />
            <stop offset=".55" stopColor="#DFC177" />
            <stop offset="1" stopColor="#EFE0AE" />
          </linearGradient>
        </defs>
      )}
      <path d="M11.7 4h40.6L63 27.2 32 58.4 1 27.2Z" fill={fill} />
      <path d="M17.3 12.4h29.4v7.2H35.8v25.6h-7.6V19.6H17.3Z" fill="#fff" />
      <ellipse cx="32" cy="25.6" rx="18.6" ry="4.1" fill="none" stroke="#fff" strokeWidth="2.3" />
    </>
  );
}

const MARKS = {
  BTC: (
    <g transform="translate(.006 -.003)">
      <path fill="#F7931A" d={BITCOIN_DISC} />
      <path fill="#fff" d={BITCOIN_SYMBOL} />
    </g>
  ),
  /** USD₮: stesso pentagono dell'oro, nel verde del token. */
  USDT: <TetherMark fill="#26A17B" id="usdt-fill" />,
  XAUT: <TetherMark fill="url(#xaut-gold)" id="xaut-gold" />,
};

/** `code` è quello di PAYMENT_ASSETS: BTC, USDT, XAUT. */
export default function AssetMark({ code, className = '' }) {
  const mark = MARKS[code];
  if (!mark) return null;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={className}>
      {mark}
    </svg>
  );
}
