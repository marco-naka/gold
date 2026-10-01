/**
 * Accesso all'area rilevazioni.
 *
 * Non è un sistema di account: sono due persone e un codice condiviso, come la chiave del
 * magazzino. L'URL nascosto da solo non basta — basta che finisca in una cronologia o in una
 * chat perché diventi pubblico — quindi davanti c'è comunque un codice.
 *
 * `RILEVAZIONI_CODE` non impostata significa area aperta: comodo in locale, da evitare in
 * produzione. `/api/health` e il README lo segnalano.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'rilevazioni';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni: si digita a inizio giro, non a ogni negozio

const code = () => process.env.RILEVAZIONI_CODE || '';

/** Senza codice configurato l'area è aperta: lo stato è esplicito, non un caso limite. */
export const isOpenAccess = () => code().length === 0;

/**
 * Il cookie non contiene il codice ma la sua firma, così leggerlo non lo rivela.
 * Il segreto della firma è il codice stesso: non serve una seconda variabile da gestire.
 */
const token = () => createHmac('sha256', code()).update('rilevazioni-v1').digest('hex');

const equals = (a, b) => {
  const x = Buffer.from(a || '');
  const y = Buffer.from(b || '');
  // timingSafeEqual pretende lunghezze uguali: il confronto si fa solo se combaciano.
  return x.length === y.length && timingSafeEqual(x, y);
};

export const isValidCode = (input) => !isOpenAccess() && equals((input || '').trim(), code());

export const isAuthorized = (request) =>
  isOpenAccess() || equals(request.cookies.get(COOKIE)?.value, token());

export const sessionCookie = () => ({
  name: COOKIE,
  value: token(),
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
});
