/**
 * Accesso all'area rilevazioni: un PIN per persona.
 *
 * `RILEVAZIONI_OPERATORI` elenca chi può entrare, nella forma `Anna:4821,Luca:7390`.
 * Il PIN non è solo una password: è anche l'identità. Il nome del rilevatore non viene
 * più digitato nel modulo ma dedotto dal PIN e scritto dal server, così «chi ha fatto
 * questa visita» smette di dipendere da chi si ricorda di scriverlo giusto — e due
 * persone che si passano il telefono non si attribuiscono il lavoro a vicenda.
 *
 * Resta supportata la vecchia `RILEVAZIONI_CODE`, un codice condiviso senza identità:
 * in quel caso il nome torna a essere un campo da compilare.
 *
 * Senza nessuna delle due variabili l'area è aperta: comodo in locale, da non lasciare
 * in produzione. `/api/health` e il README lo segnalano.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'rilevazioni';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni: si digita a inizio giro, non a ogni negozio

const raw = () => (process.env.RILEVAZIONI_OPERATORI || '').trim();
const shared = () => (process.env.RILEVAZIONI_CODE || '').trim();

/** [{ name, pin }] — un PIN vuoto o un nome vuoto fanno scartare la voce invece di aprire un buco. */
export function operators() {
  return raw()
    .split(',')
    .map((entry) => {
      const [name, pin] = entry.split(':').map((v) => (v ?? '').trim());
      return name && pin ? { name, pin } : null;
    })
    .filter(Boolean);
}

export const isOpenAccess = () => operators().length === 0 && shared().length === 0;

/**
 * PIN segnaposto usati durante le prove, da mostrare in chiaro sulla pagina d'accesso.
 *
 * L'avviso è legato al valore: appena i PIN veri sostituiscono questi, il suggerimento
 * sparisce da solo. Se invece fosse una riga da cancellare a mano prima del go-live,
 * quella riga resterebbe — succede sempre.
 */
const SEGNAPOSTO = ['0000', '1234'];

export function placeholderPin() {
  const pins = [...operators().map((o) => o.pin), shared()].filter(Boolean);
  if (!pins.length) return null;
  return pins.every((pin) => SEGNAPOSTO.includes(pin)) ? pins[0] : null;
}

/**
 * Chi firma i cookie.
 *
 * Con `RILEVAZIONI_SECRET` la chiave è fissa: aggiungere o togliere un rilevatore non tocca
 * le sessioni degli altri. Senza, si usa l'elenco dei PIN, come prima; ma allora ogni modifica
 * a quell'elenco fa decadere tutte le sessioni aperte, e chi sta inviando una rilevazione se
 * la vede rifiutare (è successo il 7 ottobre, aggiungendo un rilevatore a metà giornata).
 */
const secret = () => (process.env.RILEVAZIONI_SECRET || '').trim() || raw() || shared();

const sign = (payload) => createHmac('sha256', secret()).update(`rilevazioni-v2:${payload}`).digest('hex');

const equals = (a, b) => {
  const x = Buffer.from(a || '');
  const y = Buffer.from(b || '');
  // timingSafeEqual pretende lunghezze uguali: il confronto si fa solo se combaciano.
  return x.length === y.length && timingSafeEqual(x, y);
};

/**
 * Riconosce il PIN e restituisce il nome di chi l'ha digitato, oppure null.
 * Con il codice condiviso il nome è vuoto: l'accesso vale, l'identità no.
 */
export function identify(input) {
  const value = (input || '').trim();
  if (!value) return null;

  for (const { name, pin } of operators()) if (equals(value, pin)) return name;
  if (shared() && equals(value, shared())) return '';
  return null;
}

/** Nome dell'operatore dal cookie, o null. Stringa vuota = entrato col codice condiviso. */
export function currentOperator(request) {
  if (isOpenAccess()) return '';
  const value = request.cookies.get(COOKIE)?.value;
  if (!value) return null;

  const at = value.lastIndexOf('.');
  if (at === -1) return null;
  const name = value.slice(0, at);
  return equals(value.slice(at + 1), sign(name)) ? name : null;
}

export const isAuthorized = (request) => isOpenAccess() || currentOperator(request) !== null;

/**
 * Chi vede tutte le rilevazioni: pannello, foto ed esportazioni.
 *
 * `RILEVAZIONI_ADMIN` elenca i nomi, gli stessi di `RILEVAZIONI_OPERATORI`, separati da virgola.
 * L'admin non ha un PIN a parte: è un rilevatore con un permesso in più, e il PIN resta uno
 * solo da ricordare. I PIN non stanno nel codice ma nelle variabili di Render.
 *
 * Ad accesso aperto (in locale, senza PIN configurati) il pannello è aperto come il resto;
 * in produzione no: un'area senza PIN non deve esporre anche le foto di tutti.
 */
export const admins = () =>
  (process.env.RILEVAZIONI_ADMIN || '')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

export function isAdmin(request) {
  if (isOpenAccess()) return process.env.NODE_ENV !== 'production';
  const name = currentOperator(request);
  return Boolean(name) && admins().includes(name.toLowerCase());
}

export const sessionCookie = (name = '') => ({
  name: COOKIE,
  value: `${name}.${sign(name)}`,
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE,
});
