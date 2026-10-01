// Directory merchant del concorso.
// Le etichette di categoria stanno nei dizionari (lib/i18n): qui restano solo dati.
// I dati provengono dallo snapshot `merchants.data.json`, generato da `npm run import:merchants`
// a partire dalla Crypto Map ufficiale della Città di Lugano / Plan ₿ (vedi scripts/import-merchants.mjs).
// Il file SEED resta come fallback di sviluppo se lo snapshot non è ancora stato generato.
import snapshot from './merchants.data.json';
import overrides from './merchants.overrides.json';

const SEED = [
  {
    id: 'demo-001',
    name: 'Ristorante Lago Blu',
    category: 'food',
    address: 'Riva Vincenzo Vela 12, 6900 Lugano',
    assets: ['BTC', 'USDT'],
    posActive: true,
    verified: false,
    website: null,
    lat: 46.0034,
    lng: 8.9519,
  },
];

export const MERCHANT_SOURCE = {
  label: snapshot?.source ?? 'Dati dimostrativi',
  url: snapshot?.sourceUrl ?? null,
  importedAt: snapshot?.importedAt ?? null,
};

const ALL = snapshot?.merchants?.length ? snapshot.merchants : SEED;

/**
 * Negozi tolti dall'elenco pubblico a seguito di una rilevazione sul campo: chi ha detto di
 * no, chi ha chiuso, chi non si è trovato. Il file lo rigenera `npm run visits exclude` e non
 * tocca lo snapshot, così l'esclusione è reversibile e si vede nel diff di git perché è stata
 * fatta. L'area rilevazioni continua a poterli cercare: escono dalla vetrina, non dai dati.
 */
export const MERCHANT_EXCLUSIONS = overrides?.excluded ?? {};

export const MERCHANTS = ALL.filter((m) => !MERCHANT_EXCLUSIONS[m.id]);

/** Elenco completo, esclusioni comprese: serve all'area rilevazioni e al back-office. */
export const ALL_MERCHANTS = ALL;

export const mapsUrl = (merchant) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${merchant.name}, ${merchant.address}`)}`;

/**
 * Riquadro della mappa.
 *
 * Non si usa il minimo/massimo assoluto: pochi esercenti di collina (Sonvico, Gandria) allargano
 * il riquadro di dieci chilometri e schiacciano il centro città, dove sta l'86% dei negozi, in un
 * quarto dello spazio. Si inquadra quindi il 5°–95° percentile e chi resta fuori viene accostato
 * al bordo, segnalato come tale.
 */
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};

const lats = MERCHANTS.map((m) => m.lat);
const lngs = MERCHANTS.map((m) => m.lng);

export const MERCHANT_BOUNDS = {
  minLat: percentile(lats, 0.05),
  maxLat: percentile(lats, 0.95),
  minLng: percentile(lngs, 0.05),
  maxLng: percentile(lngs, 0.95),
};

/**
 * Punti di riferimento ricavati dagli indirizzi reali: la posizione è il centroide degli
 * esercenti di quella via. Nessuna geografia inventata, solo dati già in nostro possesso.
 */
export const MERCHANT_LANDMARKS = (() => {
  const streetOf = (address) =>
    address.replace(/^c\/o[^,]*,\s*/i, '').split(',')[0].replace(/\s*\d+[a-z]?$/i, '').trim();

  const groups = MERCHANTS.reduce((acc, m) => {
    const key = streetOf(m.address);
    (acc[key] ??= []).push(m);
    return acc;
  }, {});

  return Object.entries(groups)
    .filter(([, list]) => list.length >= 6)
    .map(([name, list]) => ({
      name,
      count: list.length,
      lat: list.reduce((sum, m) => sum + m.lat, 0) / list.length,
      lng: list.reduce((sum, m) => sum + m.lng, 0) / list.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
})();

/** Distanza in metri fra due punti (formula dell'emisenoverso). */
export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
