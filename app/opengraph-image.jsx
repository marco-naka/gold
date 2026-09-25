import { ImageResponse } from 'next/og';
import { CONTEST, EVENT, TOTAL_POOL, formatXaut } from '@/lib/constants';

export const runtime = 'nodejs';
export const alt = `${CONTEST.title} — ${EVENT.name}, ${EVENT.city}`;

// Satori non ha il glifo ₿ tra i font di sistema e tenterebbe un download esterno a build time:
// nell'immagine si usa la forma testuale.
const eventName = EVENT.name.replace('₿', 'B');
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Anteprima per WhatsApp/Telegram/X: generata a build time, nessun asset esterno da caricare. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0F0F12',
          backgroundImage: 'radial-gradient(60% 60% at 85% 0%, rgba(243,186,47,0.22), transparent 70%)',
          padding: 72,
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Stesso marchio del favicon: Satori disegna l'SVG inline, nessun asset da caricare. */}
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="ogBezel" x1="9" y1="5" x2="55" y2="59" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFFDF2" />
                <stop offset=".12" stopColor="#FFE577" />
                <stop offset=".3" stopColor="#D8A015" />
                <stop offset=".46" stopColor="#8A6104" />
                <stop offset=".6" stopColor="#C3900E" />
                <stop offset=".78" stopColor="#FFEFA6" />
                <stop offset=".92" stopColor="#E4B123" />
                <stop offset="1" stopColor="#A97A08" />
              </linearGradient>
              <linearGradient id="ogFace" x1="15" y1="11" x2="49" y2="55" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFF0A0" />
                <stop offset=".28" stopColor="#FFD531" />
                <stop offset=".6" stopColor="#E5A714" />
                <stop offset=".82" stopColor="#BE820A" />
                <stop offset="1" stopColor="#F0C64A" />
              </linearGradient>
              <linearGradient id="ogBolt" x1="25" y1="16" x2="41" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFFCEA" />
                <stop offset=".38" stopColor="#FFDB4E" />
                <stop offset=".78" stopColor="#D99C0E" />
                <stop offset="1" stopColor="#F2C43E" />
              </linearGradient>
              <linearGradient id="ogGlintA" x1="15" y1="7" x2="29" y2="25" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity=".9" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ogGlintB" x1="47" y1="57" x2="38" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity=".55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30.4" fill="#7A5703" />
            <circle cx="32" cy="32" r="29.8" fill="url(#ogBezel)" />
            <circle cx="32" cy="32" r="24.4" fill="#6B4C04" />
            <circle cx="32" cy="32" r="23.2" fill="url(#ogFace)" />
            <path d="M7.6 25.4A25.6 25.6 0 0 1 25.4 6.3 26.6 26.6 0 0 0 9.8 28.6Z" fill="url(#ogGlintA)" />
            <path d="M56.2 39.4a25.6 25.6 0 0 1-17 18.3 26.6 26.6 0 0 0 15.1-21Z" fill="url(#ogGlintB)" />
            <path
              d="M32 55.2a23.2 23.2 0 0 0 20.4-12.1 23.2 23.2 0 0 1-20.4 10.5A23.2 23.2 0 0 1 11.6 43a23.2 23.2 0 0 0 20.4 12.2Z"
              fill="#FFF3C0"
              fillOpacity=".45"
            />
            <path d="M37.82 16.34 22.51 38.02h7.91L27.67 50.06 42.98 28.38h-7.91Z" fill="#6B4C04" fillOpacity=".85" />
            <path d="M36.82 15.14 21.51 36.82h7.91L26.67 48.86 41.98 27.18h-7.91Z" fill="url(#ogBolt)" />
            <path d="M36.82 15.14 21.51 36.82h1.81L37.93 16.09Z" fill="#FFFBE6" fillOpacity=".95" />
          </svg>
          <div style={{ fontSize: 26, letterSpacing: 6, fontWeight: 700 }}>NAKA</div>
          <div style={{ fontSize: 22, color: '#A1A1AA', marginLeft: 12 }}>
            {`× ${eventName} · ${EVENT.city}`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Paga in Crypto a Lugano
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, color: '#FFD700', letterSpacing: -1.5 }}>
            e vinci ORO Digitale
          </div>
          <div style={{ fontSize: 28, color: '#A1A1AA', marginTop: 8 }}>
            {"Paga in crypto sui POS NAKA e partecipa all'estrazione in Tether Gold (XAUT)"}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(255,215,0,0.12)',
              border: '1px solid rgba(255,215,0,0.35)',
              color: '#FFD700',
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {`${formatXaut(TOTAL_POOL)} di montepremi`}
          </div>
          <div style={{ fontSize: 24, color: '#A1A1AA' }}>Bitcoin · USDt · XAUT</div>
        </div>
      </div>
    ),
    size
  );
}
