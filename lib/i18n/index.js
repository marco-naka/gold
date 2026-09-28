import it from './it.js';
import en from './en.js';

export const LOCALES = ['it', 'en'];
export const DEFAULT_LOCALE = 'it';

const DICTIONARIES = { it, en };

/** Dizionario completo per la lingua richiesta; ricade sull'italiano se sconosciuta. */
export const getDictionary = (locale) => DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];

/** Locale Intl per date e numeri: svizzero in entrambe le lingue. */
export const intlLocale = (locale) => (locale === 'en' ? 'en-CH' : 'it-CH');

/**
 * Percorsi che cambiano nome tra le due lingue: un inglese non cerca "/vincitori".
 * Sono coppie, non prefissi, quindi il cambio lingua non può limitarsi ad aggiungere /en —
 * lo faceva, e su queste pagine portava su un 404.
 */
const ROUTE_PAIRS = [
  { it: '/vincitori', en: '/winners' },
  { it: '/commercianti', en: '/merchants' },
];

/** Prefisso di percorso: l'italiano vive sulla radice, l'inglese sotto /en. */
export const localePath = (locale, path = '/') => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const pair = ROUTE_PAIRS.find((r) => r.it === clean || r.en === clean);
  const target = pair ? pair[locale] ?? clean : clean;
  if (locale === DEFAULT_LOCALE) return target;
  return target === '/' ? '/en' : `/en${target}`;
};

/** Lo stesso contenuto nell'altra lingua, a partire dal percorso corrente del browser. */
export const switchLocalePath = (pathname, target) =>
  localePath(target, (pathname || '/').replace(/^\/en(?=\/|$)/, '') || '/');

export const formatDate = (value, locale, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(value).toLocaleDateString(intlLocale(locale), options);

export const formatDateTime = (iso, locale) =>
  new Date(iso).toLocaleString(intlLocale(locale), { dateStyle: 'long', timeStyle: 'short' });
