import './globals.css';
import { CONTEST, EVENT } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: `${CONTEST.title} | NAKA × ${EVENT.name} ${EVENT.city}`,
  description:
    'Paga in Bitcoin, USDt o XAUT nei negozi di Lugano con POS NAKA durante il Plan ₿ Forum 2026 e partecipa all’estrazione di premi in Tether Gold (XAUT).',
  keywords: ['NAKA', 'Tether Gold', 'XAUT', 'Plan B Forum', 'Lugano', 'Bitcoin', 'Lightning', 'USDt', 'concorso'],
  openGraph: {
    title: `${CONTEST.title} | NAKA`,
    description:
      'Paga in crypto nei merchant aderenti di Lugano e vinci Oro Digitale in Tether Gold (XAUT).',
    locale: 'it_CH',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0F0F12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#partecipa"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink-deep"
        >
          Vai al modulo di partecipazione
        </a>
        {children}
      </body>
    </html>
  );
}
