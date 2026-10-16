/**
 * Adesivi in vetrina: chi li monta vede i negozi che aderiscono e quelli ancora da visitare,
 * e per ognuno manda una foto della vetrina con l'adesivo, oppure dice che non l'hanno voluto
 * o che era chiuso.
 *
 * Qui solo la logica, senza disco né rete: la usano l'API, la pagina e i test.
 */

/** Esiti possibili di un passaggio. `done` toglie il negozio da «Da fare». */
export const STICKER_STATUSES = [
  { id: 'montato', label: 'Adesivo montato', done: true },
  { id: 'rifiutato', label: 'Non ha voluto l’adesivo', done: true },
  { id: 'chiuso', label: 'Chiuso, da ripassare', done: false },
];

export const stickerStatus = (id) => STICKER_STATUSES.find((s) => s.id === id) ?? null;

/** Il nome di chi monta: lo scrive una volta sul telefono, finisce su ogni passaggio. */
export const NAME_MIN = 2;
export const NAME_MAX = 60;

/** Esiti di una rilevazione che tolgono il negozio dall'elenco degli adesivi. */
const OUT = new Set(['rifiuta', 'fuori_circuito']);

/**
 * I negozi da mostrare a chi monta gli adesivi.
 *
 * - `aderisce`: l'ultima rilevazione dice che aderisce;
 * - `da_visitare`: mai rilevato, oppure l'ultima rilevazione lo lascia in sospeso
 *   (chiuso al passaggio, da ricontattare);
 * - fuori: chi non aderisce, chi è fuori dal circuito, chi è escluso dall'elenco.
 *
 * Conta sempre l'ultima rilevazione del negozio: se dopo un «chiuso» è arrivato un «aderisce»,
 * vale «aderisce». Il passaggio per l'adesivo è l'ultimo registrato per quel negozio.
 *
 * @param merchants  tutti i negozi (`ALL_MERCHANTS`)
 * @param excluded   Set degli id esclusi (a mano o dall'area rilevazioni)
 * @param visits     tutte le rilevazioni
 * @param stickers   tutti i passaggi per gli adesivi
 */
export function stickerShops({ merchants, excluded = new Set(), visits = [], stickers = [] }) {
  const lastVisit = latestBy(visits.filter((v) => v.merchantId), (v) => v.merchantId);
  const lastSticker = latestBy(stickers, (s) => s.merchantId);

  const shops = [];
  for (const m of merchants) {
    if (excluded.has(m.id)) continue;
    const visit = lastVisit.get(m.id);
    if (visit && OUT.has(visit.outcome)) continue;
    const sticker = lastSticker.get(m.id) ?? null;
    shops.push({
      id: m.id,
      name: m.name,
      address: m.address ?? '',
      category: m.category ?? null,
      lat: m.lat ?? null,
      lng: m.lng ?? null,
      group: visit?.outcome === 'aderisce' ? 'aderisce' : 'da_visitare',
      sticker: sticker
        ? { id: sticker.id, status: sticker.status, at: sticker.createdAt, by: sticker.by, photo: sticker.photo?.key ?? null }
        : null,
    });
  }
  return shops.sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
}

/** Ancora da fare: nessun passaggio, oppure l'ultimo era «chiuso, da ripassare». */
export const isStickerDone = (shop) => Boolean(shop.sticker && stickerStatus(shop.sticker.status)?.done);

/** L'elemento più recente per chiave, secondo `createdAt`. */
function latestBy(list, keyOf) {
  const out = new Map();
  for (const item of list) {
    const key = keyOf(item);
    const prev = out.get(key);
    if (!prev || String(item.createdAt) > String(prev.createdAt)) out.set(key, item);
  }
  return out;
}

/** Distanza in metri fra due punti. Copia di `lib/merchants`: importarla porterebbe nel telefono tutto lo snapshot. */
export function distanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const h =
    Math.sin(toRad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

/** «120 m», «1,4 km». */
export const formatDistance = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);

/** In ordine di distanza da `position`; i negozi senza coordinate vanno in fondo, per nome. */
export function byDistance(shops, position) {
  return shops
    .map((s) => ({ ...s, distance: Number.isFinite(s.lat) && Number.isFinite(s.lng) ? distanceMeters(position, s) : null }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity) || a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
}

/** Ricerca per nome o via, senza accenti né maiuscole. */
export const fold = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export const matchesShop = (shop, query) => {
  const q = fold(query).trim();
  if (!q) return true;
  return q.split(/\s+/).every((word) => fold(`${shop.name} ${shop.address}`).includes(word));
};
