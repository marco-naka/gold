import it from './it.js';
import en from './en.js';
import { TIME_ZONE } from '../time.js';

export const LOCALES = ['it', 'en'];
export const DEFAULT_LOCALE = 'it';

const DICTIONARIES = { it, en };

/** Dizionario completo per la lingua richiesta; ricade sull'italiano se sconosciuta. */
export const getDictionary = (locale) => DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];

/** Locale Intl per date e numeri: svizzero in entrambe le lingue. */
/*
 * en-CH raggrupperebbe le migliaia con l'apostrofo, come l'italiano: en-GB usa la virgola, che
 * è quello che un lettore inglese si aspetta. Orologio e date restano quelli giusti (24 ore,
 * «24 October 2026»), quindi si perde solo il separatore sbagliato.
 */
export const intlLocale = (locale) => (locale === 'en' ? 'en-GB' : 'it-CH');

/**
 * Percorsi che cambiano nome tra le due lingue: un inglese non cerca "/vincitori".
 * Sono coppie, non prefissi, quindi il cambio lingua non può limitarsi ad aggiungere /en —
 * lo faceva, e su queste pagine portava su un 404.
 */
const ROUTE_PAIRS = [
  { it: '/vincitori', en: '/winners' },
  { it: '/commercianti', en: '/merchants' },
  { it: '/mappa', en: '/map' },
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

/*
 * Date e orari sempre nel fuso di Lugano (`lib/time.js`): il server gira in UTC e il visitatore
 * può essere ovunque, ma il concorso chiude alle 16:00 di Lugano per tutti.
 */
export const formatDate = (value, locale, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(value).toLocaleDateString(intlLocale(locale), { ...options, timeZone: TIME_ZONE });

export const formatDateTime = (iso, locale, options = { dateStyle: 'long', timeStyle: 'short' }) =>
  new Date(iso).toLocaleString(intlLocale(locale), { ...options, timeZone: TIME_ZONE });

/** Solo l'ora: "18:00". */
export const formatTime = (iso, locale) =>
  new Date(iso).toLocaleTimeString(intlLocale(locale), { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE });
