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

/** Bounding box dei merchant, usato per proiettare i pin sulla mappa. */
export const MERCHANT_BOUNDS = MERCHANTS.reduce(
  (acc, m) => ({
    minLat: Math.min(acc.minLat, m.lat),
    maxLat: Math.max(acc.maxLat, m.lat),
    minLng: Math.min(acc.minLng, m.lng),
    maxLng: Math.max(acc.maxLng, m.lng),
  }),
  { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity }
);
