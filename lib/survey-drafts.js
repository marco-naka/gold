/**
 * Bozze delle rilevazioni, una per negozio, nel browser del rilevatore.
 *
 * Prima la bozza era una sola: iniziare un altro negozio la sostituiva, e una rilevazione
 * rimasta da inviare (rete assente, server in riavvio, accesso scaduto) andava persa. Ora
 * ogni negozio ha la sua: risposte qui in localStorage, foto in IndexedDB (photo-draft.js)
 * sotto la stessa chiave. Una bozza si cancella solo a invio confermato o se la si elimina.
 */
const KEY = 'naka-rilevazioni-bozze';

/** La chiave di un negozio: l'id dell'elenco, o il nome per un negozio nuovo. */
export const draftKeyOf = (merchant) =>
  merchant?.id ? merchant.id : merchant?.name?.trim() ? `nome:${merchant.name.trim().toLowerCase()}` : null;

/** La chiave delle foto di quel negozio in IndexedDB. */
export const photoKeyOf = (key) => (key ? `negozio:${key}` : null);

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* quota piena o navigazione privata: resta almeno la bozza corrente */
  }
}

/** Tutte le bozze, la più recente per prima. */
export const listShopDrafts = () =>
  Object.entries(readAll())
    .map(([key, draft]) => ({ key, ...draft }))
    .sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''));

export const readShopDraft = (key) => (key ? (readAll()[key] ?? null) : null);

export function saveShopDraft(key, draft) {
  if (!key) return;
  const all = readAll();
  all[key] = { ...draft, savedAt: new Date().toISOString() };
  writeAll(all);
}

export function deleteShopDraft(key) {
  if (!key) return;
  const all = readAll();
  delete all[key];
  writeAll(all);
}
