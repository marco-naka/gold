/**
 * Adesivi in vetrina e materiale: chi passa dai negozi vede quelli che aderiscono e quelli ancora
 * da visitare, e per ognuno segna cosa ha lasciato (flyer, adesivi, rollup A3, locandine) con una
 * foto, oppure dice che non l'hanno voluto o che era chiuso. Si può ripassare quante volte serve,
 * anche da chi ha già l'adesivo: ogni passaggio resta, e il negozio somma tutto quello che ha avuto.
 *
 * Qui solo la logica, senza disco né rete: la usano l'API, la pagina e i test.
 */

/** Il materiale che si può lasciare. L'ordine è quello delle caselle sul telefono. */
export const MATERIALS = [
  { id: 'flyer', label: 'Flyer' },
  { id: 'adesivi', label: 'Adesivi' },
  { id: 'rollup_a3', label: 'Rollup A3' },
  { id: 'locandine', label: 'Locandine' },
];
export const materialLabel = (id) => MATERIALS.find((m) => m.id === id)?.label ?? id;
const MATERIAL_IDS = new Set(MATERIALS.map((m) => m.id));

/**
 * Esiti possibili di un passaggio. `done` toglie il negozio da «Da fare».
 * `montato` è quello dei primi giorni, prima delle caselle: vale «adesivi lasciati», con la sua
 * foto. Non si offre più sul telefono, ma i passaggi già salvati restano come sono.
 */
export const STICKER_STATUSES = [
  { id: 'lasciato', label: 'Materiale lasciato', done: true },
  { id: 'montato', label: 'Adesivo montato', done: true, legacy: true },
  { id: 'rifiutato', label: 'Non ha voluto il materiale', done: true },
  { id: 'chiuso', label: 'Chiuso, da ripassare', done: false },
];

export const stickerStatus = (id) => STICKER_STATUSES.find((s) => s.id === id) ?? null;

/** Il materiale lasciato in un passaggio. Un vecchio «montato» vuol dire adesivi. */
export function materialsOf(record) {
  if (Array.isArray(record?.materials)) return MATERIALS.map((m) => m.id).filter((id) => record.materials.includes(id));
  return record?.status === 'montato' ? ['adesivi'] : [];
}

/** Pulisce le caselle arrivate dal telefono: solo materiali noti, senza doppioni, in ordine. */
export const cleanMaterials = (list) => MATERIALS.map((m) => m.id).filter((id) => (list ?? []).includes(id) && MATERIAL_IDS.has(id));

/** La foto è obbligatoria quando si lasciano gli adesivi: è la prova dell'adesivo in vetrina. */
export const photoRequired = (materials) => materials.includes('adesivi');

/** Il nome di chi monta: lo scrive una volta sul telefono, finisce su ogni passaggio. */
export const NAME_MIN = 2;
export const NAME_MAX = 60;

/** Esiti di una rilevazione che tolgono il negozio dall'elenco degli adesivi. */
const OUT = new Set(['rifiuta', 'fuori_circuito']);

/**
 * I negozi da mostrare a chi passa con il materiale.
 *
 * - `aderisce`: l'ultima rilevazione dice che aderisce;
 * - `da_visitare`: mai rilevato, oppure l'ultima rilevazione lo lascia in sospeso
 *   (chiuso al passaggio, da ricontattare);
 * - fuori: chi non aderisce, chi è fuori dal circuito, chi è escluso dall'elenco.
 *
 * Conta sempre l'ultima rilevazione del negozio. Dei passaggi per il materiale invece si tiene
 * tutto: `sticker` è l'ultimo, `left` dice quando è stato lasciato ogni materiale (l'ultima
 * volta), `photos` sono tutte le foto, dalla più recente. Un ripasso «chiuso» non cancella
 * l'adesivo montato la settimana prima.
 *
 * @param merchants  tutti i negozi (`ALL_MERCHANTS`)
 * @param excluded   Set degli id esclusi (a mano o dall'area rilevazioni)
 * @param visits     tutte le rilevazioni
 * @param stickers   tutti i passaggi per il materiale
 */
export function stickerShops({ merchants, excluded = new Set(), visits = [], stickers = [] }) {
  const lastVisit = latestBy(visits.filter((v) => v.merchantId), (v) => v.merchantId);
  const passes = new Map();
  for (const s of [...stickers].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))) {
    if (!passes.has(s.merchantId)) passes.set(s.merchantId, []);
    passes.get(s.merchantId).push(s);
  }

  const shops = [];
  for (const m of merchants) {
    if (excluded.has(m.id)) continue;
    const visit = lastVisit.get(m.id);
    if (visit && OUT.has(visit.outcome)) continue;
    const mine = passes.get(m.id) ?? [];
    const last = mine.at(-1) ?? null;
    const left = {};
    for (const p of mine) for (const id of materialsOf(p)) left[id] = p.createdAt;
    shops.push({
      id: m.id,
      name: m.name,
      address: m.address ?? '',
      category: m.category ?? null,
      lat: m.lat ?? null,
      lng: m.lng ?? null,
      group: visit?.outcome === 'aderisce' ? 'aderisce' : 'da_visitare',
      sticker: last
        ? { id: last.id, status: last.status, at: last.createdAt, by: last.by, materials: materialsOf(last), photo: last.photo?.key ?? null }
        : null,
      left,
      passes: mine.length,
      photos: mine
        .filter((p) => p.photo?.key)
        .reverse()
        .map((p) => ({ key: p.photo.key, at: p.createdAt, by: p.by, id: p.id })),
    });
  }
  return shops.sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
}

/**
 * Fatto: ha già avuto del materiale (anche se poi un ripasso l'ha trovato chiuso), oppure
 * l'ultimo passaggio dice che non lo vuole. Da fare: mai passati, o solo «chiuso».
 */
export const isStickerDone = (shop) =>
  Object.keys(shop.left ?? {}).length > 0 || Boolean(shop.sticker && stickerStatus(shop.sticker.status)?.done);

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
