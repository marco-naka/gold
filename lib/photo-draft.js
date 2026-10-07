/**
 * Le foto della bozza, nel browser.
 *
 * Le risposte della bozza stanno in localStorage, che tiene solo testo. Le foto restavano
 * in memoria, e sui telefoni la memoria non dura: aprire la fotocamera manda il browser in
 * secondo piano, il sistema chiude la scheda per far posto, e al ritorno la pagina si
 * ricarica con le risposte ma senza le foto. Il rilevatore inviava convinto di averle.
 *
 * IndexedDB conserva i file così come sono (già compressi, qualche centinaio di KB l'uno).
 * Ogni operazione è un extra: se il browser non la concede, la bozza resta quella di prima.
 */
const DB = 'naka-rilevazioni';
const STORE = 'foto';
const KEY = 'bozza';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, action) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = action(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(req?.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * `photos` ha la forma dello stato del modulo: slot → File, o slot → File[]. `key` distingue
 * la bozza corrente dalle bozze per negozio (survey-drafts.js).
 */
export async function saveDraftPhotos(photos, key = KEY) {
  try {
    const kept = Object.fromEntries(
      Object.entries(photos).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : Boolean(v))),
    );
    await run('readwrite', (store) => (Object.keys(kept).length ? store.put(kept, key) : store.delete(key)));
  } catch {
    /* navigazione privata o spazio esaurito: le foto restano almeno in memoria */
  }
}

export async function loadDraftPhotos(key = KEY) {
  try {
    return (await run('readonly', (store) => store.get(key))) ?? {};
  } catch {
    return {};
  }
}

export async function clearDraftPhotos(key = KEY) {
  try {
    await run('readwrite', (store) => store.delete(key));
  } catch {
    /* vedi sopra */
  }
}
