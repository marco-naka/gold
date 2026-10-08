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

/**
 * Una bozza che vale la pena riprendere: con risposte, oltre la prima schermata, o con foto.
 * La vetrina si scatta prima di entrare, quando le risposte ancora non ci sono: una bozza con
 * la sola foto è lavoro fatto, e prima spariva dall'elenco pur restando sul telefono.
 */
export const hasDraftWork = (d) => Boolean(Object.keys(d?.answers ?? {}).length || d?.step > 0 || d?.photoCount > 0);

/** Il numero di foto della bozza di un negozio: le foto stanno in IndexedDB, qui solo il conto. */
export function setShopDraftPhotoCount(key, photoCount) {
  if (!key) return;
  const all = readAll();
  if (!all[key] || all[key].photoCount === photoCount) return;
  all[key] = { ...all[key], photoCount };
  writeAll(all);
}

/** Le bozze come le vede l'admin: risposte e numero di foto, senza le foto. */
export const draftsSnapshot = () =>
  listShopDrafts()
    .filter(hasDraftWork)
    .map(({ key, merchant, answers, step, savedAt, photoCount }) => ({
      key,
      merchant: merchant ? { id: merchant.id ?? null, name: merchant.name ?? null, address: merchant.address ?? null } : null,
      answers: answers ?? {},
      step: step ?? 0,
      savedAt: savedAt ?? null,
      photoCount: photoCount ?? 0,
    }));
