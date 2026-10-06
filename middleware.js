import { NextResponse } from 'next/server';

/**
 * Lingua d'ingresso: inglese per tutti, italiano per chi ha il dispositivo in italiano.
 *
 * L'italiano resta sulla radice (/, /p, /commercianti…) perché lì puntano i QR già stampati;
 * chi apre quegli indirizzi con il telefono in un'altra lingua viene portato alla pagina
 * inglese corrispondente, con gli stessi parametri (?s= del QR compreso).
 *
 * Decide, nell'ordine:
 * 1. la scelta fatta con il selettore IT/EN, ricordata nel cookie `naka-lang`;
 * 2. la prima lingua preferita del browser (Accept-Language): «it…» resta in italiano.
 *
 * I robot dei motori di ricerca e delle anteprime non vengono spostati: devono poter leggere
 * anche le pagine italiane. Lo stesso vale per chi non dichiara alcuna lingua.
 */
const PAIRS = {
  '/': '/en',
  '/p': '/en/p',
  '/commercianti': '/en/merchants',
  '/vincitori': '/en/winners',
  '/mappa': '/en/map',
  '/privacy': '/en/privacy',
};

const LANG_COOKIE = 'naka-lang';
const ROBOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|linkedin|embed|curl|wget/i;

export function middleware(request) {
  const target = PAIRS[request.nextUrl.pathname];
  if (!target) return NextResponse.next();

  const chosen = request.cookies.get(LANG_COOKIE)?.value;
  if (chosen === 'it') return NextResponse.next();

  if (chosen !== 'en') {
    if (ROBOT.test(request.headers.get('user-agent') || '')) return NextResponse.next();
    const accept = (request.headers.get('accept-language') || '').trim().toLowerCase();
    if (!accept || accept.startsWith('it')) return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/', '/p', '/commercianti', '/vincitori', '/mappa', '/privacy'] };
