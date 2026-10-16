/**
 * Accesso di chi monta gli adesivi: un PIN solo, `RILEVAZIONI_ADESIVI_PIN` (es. 2000).
 *
 * È un accesso a parte, con un suo cookie: chi entra con questo PIN vede solo l'elenco dei
 * negozi per gli adesivi, non il questionario delle rilevazioni né il pannello. Il cookie
 * dei rilevatori resta com'è, e nessuna route delle rilevazioni lo riconosce.
 *
 * Il PIN deve essere diverso da quelli dei rilevatori (`RILEVAZIONI_OPERATORI`): lo sblocco
 * prova prima quelli, e un PIN uguale aprirebbe il questionario.
 *
 * Senza la variabile l'area adesivi è chiusa: la vede solo l'admin.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const STICKER_COOKIE = 'adesivi';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni, come i rilevatori

const pin = () => (process.env.RILEVAZIONI_ADESIVI_PIN || '').trim();

/**
 * La chiave che firma il cookie. Mai il solo PIN: con quattro cifre, chi avesse in mano un
 * cookie potrebbe provarle tutte offline e risalire al PIN. Si usa `RILEVAZIONI_SECRET` o, in
 * mancanza, l'elenco dei PIN dei rilevatori, che resta sul server; il PIN degli adesivi entra
 * comunque nel messaggio firmato, così cambiarlo chiude le sessioni aperte.
 */
const secret = () =>
  (process.env.RILEVAZIONI_SECRET || '').trim() ||
  (process.env.RILEVAZIONI_OPERATORI || '').trim() ||
  (process.env.RILEVAZIONI_CODE || '').trim() ||
  pin();

const token = () => createHmac('sha256', secret()).update(`adesivi-v1:${pin()}`).digest('hex');

const equals = (a, b) => {
  const x = Buffer.from(a || '');
  const y = Buffer.from(b || '');
  return x.length === y.length && timingSafeEqual(x, y);
};

export const stickerAreaConfigured = () => pin().length > 0;

/** Il codice digitato è il PIN degli adesivi? */
export const isStickerPin = (input) => stickerAreaConfigured() && equals(String(input ?? '').trim(), pin());

/** La richiesta arriva da chi è entrato col PIN degli adesivi? */
export function isStickerSession(request) {
  if (!stickerAreaConfigured()) return false;
  const value = request.cookies.get(STICKER_COOKIE)?.value;
  return Boolean(value) && equals(value, token());
}

export const stickerCookie = () => ({
  name: STICKER_COOKIE,
  value: token(),
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
});
