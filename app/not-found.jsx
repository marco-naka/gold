import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';
import { CONTEST } from '@/lib/constants';

export const metadata = { title: 'Pagina non trovata | NAKA' };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-24">
      <div className="glass w-full max-w-lg p-10 text-center">
        <p className="text-6xl font-black text-gold-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold">Questa pagina non esiste</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Il link potrebbe essere scaduto o digitato male. Torna alla home del concorso
          &laquo;{CONTEST.title}&raquo; per registrare la tua giocata o trovare i negozi aderenti.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-bold text-ink-deep transition hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            Torna alla home
          </Link>
          <Link
            href="/#mappa"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/5 px-5 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            <MapPin className="h-4 w-4" />
            Mappa merchant
          </Link>
        </div>
      </div>
    </main>
  );
}
