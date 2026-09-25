// Directory merchant del concorso.
// Le etichette di categoria stanno nei dizionari (lib/i18n): qui restano solo dati.
// I dati provengono dallo snapshot `merchants.data.json`, generato da `npm run import:merchants`
// a partire dalla Crypto Map ufficiale della Città di Lugano / Plan ₿ (vedi scripts/import-merchants.mjs).
// Il file SEED resta come fallback di sviluppo se lo snapshot non è ancora stato generato.
import snapshot from './merchants.data.json';

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

export const MERCHANTS = snapshot?.merchants?.length ? snapshot.merchants : SEED;

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
