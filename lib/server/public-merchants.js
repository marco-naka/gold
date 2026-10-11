import { MERCHANTS } from '../merchants.js';
import { excludedIds } from './merchant-exclusions.js';

/**
 * L'elenco pubblico com'è adesso: quello del pacchetto, meno i negozi tolti dal circuito
 * dall'area rilevazioni (vedi `merchant-exclusions.js`).
 */
export async function publicMerchants() {
  const out = await excludedIds();
  return out.size ? MERCHANTS.filter((m) => !out.has(m.id)) : MERCHANTS;
}
