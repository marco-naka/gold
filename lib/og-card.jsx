import { ImageResponse } from 'next/og';
import { CONTEST, EVENT } from '@/lib/constants';
import { DECLARED } from '@/lib/campaigns';
import { formatSats } from '@/lib/bitcoin';
import { getDictionary } from '@/lib/i18n';

// Satori non ha il glifo ₿ tra i font di sistema e tenterebbe un download esterno a build time:
// nell'immagine si usa la forma testuale.
const eventName = EVENT.name.replace('₿', 'B');
export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Anteprima per WhatsApp/Telegram/X: generata a build time, nessun asset esterno da caricare.
 *
 * Il testo segue la lingua della pagina. Finché l'immagine era una sola, ogni link inglese
 * condiviso in chat si presentava in italiano — ed era anche l'ultima cosa che restava a dire
 * «vinci oro» dopo la divisione dei montepremi.
 */
export function ogCard(locale = 'it') {
  const t = getDictionary(locale);
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0F0F12',
        backgroundImage: 'radial-gradient(60% 60% at 85% 0%, rgba(247,147,26,0.22), transparent 70%)',
        padding: 72,
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Stesso marchio del favicon: Satori disegna l'SVG inline, nessun asset da caricare. */}
        <svg width="64" height="64" viewBox="0 0 64 64">
          {/* Logo ufficiale di Bitcoin, lo stesso di AssetMark e del favicon. */}
          <g transform="translate(0.5 0.5)">
            <path
              fill="#F7931A"
              d="m63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78,4.272-17.145,21.635-27.579,38.775-23.305,17.144,4.274,27.576,21.64,23.302,38.784z"
            />
            <path
              fill="#FFF"
              d="m46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019,4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646l-1.453,5.834,3.507,0.875,1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739,1.527-4.36-0.076-6.875-3.226-8.515,2.294-0.529,4.022-2.038,4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594,10.012,1.77,8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494,8.365,1.416,7.334,5.553z"
            />
          </g>
        </svg>
        <div style={{ fontSize: 26, letterSpacing: 6, fontWeight: 700 }}>NAKA</div>
        <div style={{ fontSize: 22, color: '#A1A1AA', marginLeft: 12 }}>
          {`× ${eventName} · ${EVENT.city}`}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
          {t.hero.titleLead}
        </div>
        <div
          style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, color: '#F7931A', letterSpacing: -1.5 }}
        >
          {t.hero.titleGold}
        </div>
        <div style={{ fontSize: 28, color: '#A1A1AA', marginTop: 8 }}>{t.meta.ogDescription}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            padding: '12px 22px',
            borderRadius: 999,
            background: 'rgba(247,147,26,0.12)',
            border: '1px solid rgba(247,147,26,0.4)',
            color: '#F7931A',
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {`${formatSats(DECLARED.sats, locale)} · ${t.prizes.poolLabel}`}
        </div>
        <div style={{ fontSize: 24, color: '#A1A1AA' }}>Bitcoin · USDt · XAUT</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
