/**
 * Importa la directory merchant dalla Crypto Map ufficiale della Città di Lugano
 * (la stessa mappa incorporata in my.lugano.ch/pagare-in-lvga-lugano, plugin bfx-wp-crypto-map)
 * e genera lo snapshot statico `lib/merchants.data.json` usato dalla landing.
 *
 *   npm run import:merchants
 *
 * Lo snapshot è volutamente statico: la landing non deve dipendere a runtime
 * dall'uptime di un endpoint di terze parti durante la settimana del forum.
 *
 * ATTENZIONE: l'endpoint non è documentato pubblicamente come API aperta.
 * Prima del go-live va richiesta a Città di Lugano / Plan ₿ l'autorizzazione al riuso
 * dei dati e concordata l'attribuzione.
 */
import { writeFile } from 'node:fs/promises';

const ENDPOINT = 'https://planb.lugano.ch/wp-json/bfx-crypto-map/v1/merchants?env=production';

// Comuni del comprensorio ammessi al concorso. Paradiso resta in elenco perché il filtro sia
// già pronto, ma sulla crypto map cittadina non c'è alcun esercente di Paradiso che accetti
// BTC o USDt: finché NAKA non fornisce i suoi, la comunicazione parla solo di Lugano.
const CITIES = [
  'lugano', 'paradiso', 'massagno', 'viganello', 'pregassona', 'breganzona',
  'castagnola', 'cassarate', 'besso', 'molino nuovo', 'pazzallo', 'barbengo',
  'carabbia', 'cadro', 'sonvico', 'gandria', 'davesco', 'soragno', 'villa luganese',
];

// Tassonomia della crypto map -> categorie del concorso.
const CATEGORY_MAP = {
  restaurant: 'food', bar_and_cafe: 'food', take_away: 'food', grocery_store: 'food',
  local_food_products: 'food', food_and_drink: 'food', kiosk: 'food',
  boutique: 'shopping', retail: 'shopping', jewelry: 'shopping', electronics: 'shopping',
  optician: 'shopping', book_shop: 'shopping', flower_shop: 'shopping',
  stationary_shop: 'shopping', home_and_garden: 'shopping', art_gallery: 'shopping',
  hotel: 'hotel',
  service_provider: 'services', hair_stylist: 'services', beauty_salon: 'services',
  pharmacy: 'services', taxi: 'services', auto_and_moto: 'services',
  education: 'services', sports_and_leisure: 'services', entertainment: 'services',
};

// Codici asset della crypto map -> asset accettati sul POS NAKA.
const ASSET_MAP = { BTC: 'BTC', UST: 'USDT', USDT: 'USDT', XAUT: 'XAUT' };

// Riquadro geografico plausibile per il Luganese: la sorgente contiene coordinate corrotte
// (es. "Caffè Roma" con lat 846.005304 invece di 46.005304) che, se importate, sfondano il
// bounding box della mappa e schiacciano tutti i pin in un angolo.
const GEO = { minLat: 45.8, maxLat: 46.3, minLng: 8.6, maxLng: 9.3 };

const inRange = (lat, lng) =>
  lat >= GEO.minLat && lat <= GEO.maxLat && lng >= GEO.minLng && lng <= GEO.maxLng;

/** Scarta le cifre in eccesso in testa al valore e tiene il primo candidato plausibile. */
function repairDegree(value, lo, hi) {
  const [int, dec = ''] = Math.abs(Number(value)).toString().split('.');
  for (let i = 1; i < int.length; i += 1) {
    const candidate = Number(`${int.slice(i)}.${dec}`);
    if (Number.isFinite(candidate) && candidate >= lo && candidate <= hi) return candidate;
  }
  return null;
}

/** Coordinate validate e, dove possibile, riparate. `null` se restano implausibili. */
function sanitizeCoords(rawLat, rawLng) {
  const lat = Number(rawLat);
  const lng = Number(rawLng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (inRange(lat, lng)) return { lat, lng, repaired: false };

  const fixedLat = lat >= GEO.minLat && lat <= GEO.maxLat ? lat : repairDegree(lat, GEO.minLat, GEO.maxLat);
  const fixedLng = lng >= GEO.minLng && lng <= GEO.maxLng ? lng : repairDegree(lng, GEO.minLng, GEO.maxLng);
  if (fixedLat === null || fixedLng === null) return null;

  return { lat: fixedLat, lng: fixedLng, repaired: true };
}

const norm = (v) => (v ?? '').toString().trim();
const slug = (v) =>
  norm(v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function pickCategory(tags = []) {
  for (const tag of tags) {
    const hit = CATEGORY_MAP[tag] ?? CATEGORY_MAP[tag?.toLowerCase?.()];
    if (hit) return hit;
  }
  return 'services';
}

function parseAssets(list = []) {
  const out = new Set();
  for (const raw of list) {
    // Alcuni record hanno valori sporchi tipo "BTC. UST": si normalizzano a token.
    for (const token of norm(raw).toUpperCase().split(/[^A-Z_]+/).filter(Boolean)) {
      if (ASSET_MAP[token]) out.add(ASSET_MAP[token]);
    }
  }
  return [...out];
}

const acceptsNaka = (list = []) => list.some((a) => norm(a).toUpperCase().includes('NAKA'));

async function main() {
  process.stdout.write(`↓ Scarico ${ENDPOINT}\n`);
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Endpoint non disponibile: HTTP ${res.status}`);

  const { items = [] } = await res.json();
  const seen = new Set();
  const dropped = [];
  const repaired = [];

  const merchants = items
    .filter((m) => CITIES.includes(norm(m.city).toLowerCase()))
    // Rilevanti per il concorso: chi incassa in BTC/USDt, non chi accetta solo LVGA.
    .filter((m) => parseAssets(m.accepted_cryptos).length > 0)
    .map((m) => {
      const coords = sanitizeCoords(m.lat, m.lng);
      if (!coords) {
        dropped.push(`${norm(m.title)} (lat ${m.lat}, lng ${m.lng})`);
        return null;
      }
      if (coords.repaired) repaired.push(`${norm(m.title)}: ${m.lat},${m.lng} → ${coords.lat},${coords.lng}`);
      return { ...m, lat: coords.lat, lng: coords.lng };
    })
    .filter(Boolean)
    .map((m) => {
      const city = norm(m.city);
      const zip = norm(m.zip_code);
      const id = `lug-${slug(m.title)}-${norm(m.id).slice(0, 6)}`;
      return {
        id,
        name: norm(m.title),
        category: pickCategory(m.tags),
        address: [norm(m.address), [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
        assets: parseAssets(m.accepted_cryptos),
        // Il flag NAKA della crypto map indica l'accettazione su rail NAKA:
        // è un forte candidato, ma va confermato dal backend POS NAKA (vedi `verified`).
        posActive: acceptsNaka(m.accepted_cryptos),
        verified: false,
        website: norm(m.website) || null,
        lat: Number(m.lat.toFixed(6)),
        lng: Number(m.lng.toFixed(6)),
      };
    })
    // Deduplica per nome+indirizzo: la sorgente contiene record ripetuti con coordinate leggermente diverse.
    .filter((m) => {
      const key = `${m.name.toLowerCase()}|${m.address.toLowerCase().replace(/\s+/g, ' ')}`;
      return m.name && !seen.has(key) && seen.add(key);
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'it'));

  const payload = {
    source: 'Crypto Map – Città di Lugano / Plan ₿ Lugano',
    sourceUrl: 'https://planb.lugano.ch/crypto-map/',
    endpoint: ENDPOINT,
    importedAt: new Date().toISOString(),
    count: merchants.length,
    merchants,
  };

  await writeFile(new URL('../lib/merchants.data.json', import.meta.url), `${JSON.stringify(payload, null, 2)}\n`);

  if (repaired.length) {
    process.stdout.write(`⚠ coordinate riparate (${repaired.length}):\n  ${repaired.join('\n  ')}\n`);
  }
  if (dropped.length) {
    process.stdout.write(`⚠ record scartati per coordinate implausibili (${dropped.length}):\n  ${dropped.join('\n  ')}\n`);
  }

  const byCat = merchants.reduce((acc, m) => ({ ...acc, [m.category]: (acc[m.category] ?? 0) + 1 }), {});
  process.stdout.write(
    `✓ ${merchants.length} merchant salvati in lib/merchants.data.json\n` +
      `  con rail NAKA: ${merchants.filter((m) => m.posActive).length}\n` +
      `  per categoria: ${Object.entries(byCat).map(([k, v]) => `${k}=${v}`).join(' · ')}\n`
  );
}

main().catch((err) => {
  process.stderr.write(`✗ Import fallito: ${err.message}\n`);
  process.exit(1);
});
