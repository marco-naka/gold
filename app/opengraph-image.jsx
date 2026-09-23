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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#F3BA2F,#FFD700)',
              color: '#0F0F12',
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            N
          </div>
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
