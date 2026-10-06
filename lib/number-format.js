/**
 * Numeri scritti allo stesso modo sul server e nel browser.
 *
 * Il raggruppamento svizzero delle migliaia non è stabile fra versioni di ICU: il Node di
 * Render (22.11) scrive «11’000’000» con l'apostrofo tipografico (U+2019), i browser recenti
 * «11'000'000» con quello semplice. La pagina generata dal server e quella ridisegnata nel
 * browser non coincidevano, e React segnalava un errore di idratazione su ogni numero.
 *
 * Qui il separatore si fissa all'apostrofo semplice, quello usato anche nei testi del sito.
 * Tutto il resto (decimali, valuta, ordine) resta quello di Intl.
 */
const TYPOGRAPHIC = /[’ʼ]/g;

export const numberLocale = (locale) => (locale === 'en' ? 'en-GB' : 'it-CH');

export function formatNumber(value, locale = 'it', options = {}) {
  return new Intl.NumberFormat(numberLocale(locale), options).format(Number(value)).replace(TYPOGRAPHIC, "'");
}
