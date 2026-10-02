import { notFound } from 'next/navigation';

/**
 * Qualunque indirizzo che non corrisponde a una pagina finisce qui e mostra la 404 del sito.
 *
 * Senza, Next mostrava la sua 404 di base — bianca, in inglese, senza stile — perché il sito ha
 * due layout radice (uno per lingua) e per un indirizzo sconosciuto non sa quale usare. Le route
 * statiche (/api, /en, /privacy, robots.txt…) hanno sempre la precedenza su questa.
 */
export default function CatchAll() {
  notFound();
}
