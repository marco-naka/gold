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
 * Senza la variabile l'area adesivi è chiusa a chi non ha un PIN da rilevatore.
 *
 * Anche i rilevatori entrano nell'area adesivi con il loro PIN (`canUseStickers`): ripassano
 * dagli stessi negozi e non devono ricordare un secondo PIN. Il contrario no: il PIN degli
 * adesivi non apre il questionario.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { currentOperator, isAdmin } from './rilevazioni-auth.js';

export const STICKER_COOKIE = 'adesivi';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni, come i rilevatori

const pin = () => (process.env.RILEVAZIONI_ADESIVI_PIN || '').trim();

/**
 * Chiave casuale generata al primo uso e tenuta sul disco del server (`DATA_DIR`).
 *
 * Non si firma con nulla che si possa indovinare: né il PIN degli adesivi (quattro cifre, chi
 * avesse un cookie le proverebbe tutte offline) né i PIN dei rilevatori (dal cookie degli
 * adesivi si risalirebbe a quelli, che aprono questionario e pannello). 256 bit casuali non si
 * provano. Sul disco persistente sopravvive a deploy e riavvii.
 */
let cachedKey = null;
function serverKey() {
  if (cachedKey) return cachedKey;
  const dir = process.env.DATA_DIR || join(process.cwd(), '.data');
  const file = join(dir, 'adesivi-chiave');
  const read = () => {
    try {
      const value = readFileSync(file, 'utf8').trim();
      return value.length >= 64 ? value : null;
    } catch {
      return null;
    }
  };
  cachedKey = read();
  if (cachedKey) return cachedKey;
  const fresh = randomBytes(32).toString('hex');
  try {
    mkdirSync(dir, { recursive: true });
    // `wx`: se un'altra istanza l'ha appena scritta, vale la sua.
    writeFileSync(file, fresh, { flag: 'wx', mode: 0o600 });
    cachedKey = fresh;
  } catch {
    cachedKey = read() ?? fresh;
  }
  return cachedKey;
}

/**
 * La chiave che firma il cookie: `RILEVAZIONI_SECRET` se c'è, altrimenti la chiave casuale del
 * server. Il PIN degli adesivi entra nel messaggio firmato, così cambiarlo chiude le sessioni.
 */
const secret = () => (process.env.RILEVAZIONI_SECRET || '').trim() || serverKey();

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

/** Chi può usare l'area adesivi: il PIN degli adesivi, un rilevatore, l'admin. */
export const canUseStickers = (request) => isStickerSession(request) || currentOperator(request) !== null || isAdmin(request);
