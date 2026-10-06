/**
 * Link ai contenuti social dei commercianti: che cosa si accetta dal modulo dell'area
 * commercianti. Modulo puro, lo usano il modulo nel browser, l'API e i test.
 *
 * Solo le piattaforme ammesse dal regolamento (SOCIAL_CONTEST.platforms), riconosciute dal
 * dominio del link. I link brevi delle app (vm.tiktok.com, fb.watch, lnkd.in) valgono: sono
 * quelli che il tasto «Condividi» copia sul telefono.
 */
import { SOCIAL_CONTEST } from './constants.js';

const HOSTS = {
  Instagram: ['instagram.com', 'instagr.am'],
  Facebook: ['facebook.com', 'fb.com', 'fb.watch'],
  TikTok: ['tiktok.com'],
  LinkedIn: ['linkedin.com', 'lnkd.in'],
  X: ['x.com', 'twitter.com'],
};

export const MAX_URL_LENGTH = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** La piattaforma di un link, o null se il dominio non è di una piattaforma ammessa. */
export function platformOf(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\.|^m\.|^mobile\.|^vm\.|^vt\./, '');
  } catch {
    return null;
  }
  for (const [platform, hosts] of Object.entries(HOSTS)) {
    if (!SOCIAL_CONTEST.platforms.includes(platform)) continue;
    if (hosts.some((h) => host === h || host.endsWith(`.${h}`))) return platform;
  }
  return null;
}

/** Il link come lo si salva: https, senza spazi, senza il frammento. */
export function normalizeUrl(input) {
  let value = String(input ?? '').trim();
  if (!value) return '';
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    url.protocol = 'https:';
    url.hash = '';
    // Lo stesso post arriva con o senza www/m e con i parametri che le app aggiungono a ogni
    // condivisione: tolti, due invii dello stesso contenuto restano uno.
    url.hostname = url.hostname.toLowerCase().replace(/^(www|m|mobile)\./, '');
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_|^(igsh|igshid|si|fbclid|mibextid|ref)$/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value;
  }
}

/**
 * Controlla una segnalazione. `merchantIds` è l'insieme dei negozi ammessi.
 * Restituisce { errors } con chiavi di campo, oppure { value } pulito.
 */
export function validateSocialLink({ merchantId, url, email }, merchantIds) {
  const errors = {};
  const link = normalizeUrl(url);
  const contact = String(email ?? '').trim();
  if (!merchantId || !merchantIds.has(merchantId)) errors.merchant = 'required';
  if (!link) errors.url = 'required';
  else if (link.length > MAX_URL_LENGTH) errors.url = 'too_long';
  else if (!platformOf(link)) errors.url = 'platform';
  if (contact && (contact.length > 200 || !EMAIL_RE.test(contact))) errors.email = 'invalid';
  if (Object.keys(errors).length) return { errors };
  return { value: { merchantId, url: link, platform: platformOf(link), email: contact || null } };
}

/** Il periodo in cui si accettano segnalazioni: fino alla scadenza di pubblicazione. */
export const socialOpen = (now = new Date()) => now <= new Date(SOCIAL_CONTEST.publishDeadline);
