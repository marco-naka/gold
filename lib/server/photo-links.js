/**
 * Link alle foto delle rilevazioni che si aprono da un foglio di calcolo.
 *
 * Le foto sono private: il pannello le mostra solo all'admin collegato. Ma un link in un
 * CSV si apre da Excel, da un altro computer, magari inoltrato al commerciale: lì il cookie
 * non c'è. Il link porta allora con sé il permesso, firmato e con una scadenza: vale per
 * quella foto e per quei giorni, poi basta riesportare.
 *
 * Il segreto è quello già configurato per l'area rilevazioni (o uno dedicato, se si vuole
 * poter invalidare i link senza cambiare i PIN). Cambiandolo, i link già esportati smettono
 * di funzionare: è il modo di revocarli.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from '../site.js';

export const LINK_DAYS = 60;

const secret = () =>
  (process.env.RILEVAZIONI_LINK_SECRET || process.env.RILEVAZIONI_OPERATORI || process.env.RILEVAZIONI_CODE || '').trim();

const signature = (key, exp) =>
  createHmac('sha256', secret()).update(`foto-v1:${key}:${exp}`).digest('hex').slice(0, 32);

export function signedPhotoUrl(key, now = Date.now()) {
  const exp = String(Math.floor(now / 1000) + LINK_DAYS * 86400);
  const params = new URLSearchParams({ key, exp, sig: signature(key, exp) });
  return `${SITE_URL}/api/rilevazioni/foto?${params}`;
}

export function validPhotoSignature(key, exp, sig, now = Date.now()) {
  if (!secret() || !key || !exp || !sig) return false;
  if (!/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false;
  const expected = Buffer.from(signature(key, exp));
  const given = Buffer.from(String(sig));
  return expected.length === given.length && timingSafeEqual(expected, given);
}
