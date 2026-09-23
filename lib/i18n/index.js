import it from './it.js';
import en from './en.js';

export const LOCALES = ['it', 'en'];
export const DEFAULT_LOCALE = 'it';

const DICTIONARIES = { it, en };

/** Dizionario completo per la lingua richiesta; ricade sull'italiano se sconosciuta. */
export const getDictionary = (locale) => DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];

/** Locale Intl per date e numeri: svizzero in entrambe le lingue. */
export const intlLocale = (locale) => (locale === 'en' ? 'en-CH' : 'it-CH');

/** Prefisso di percorso: l'italiano vive sulla radice, l'inglese sotto /en. */
export const localePath = (locale, path = '/') => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? '/en' : `/en${clean}`;
};

export const formatDate = (value, locale, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(value).toLocaleDateString(intlLocale(locale), options);

export const formatDateTime = (iso, locale) =>
  new Date(iso).toLocaleString(intlLocale(locale), { dateStyle: 'long', timeStyle: 'short' });
