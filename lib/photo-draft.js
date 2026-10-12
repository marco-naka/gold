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

/*
 * Nella bozza vanno i byte, non il File: Safari su iPhone salva in IndexedDB un rimando al
 * file della fotocamera, e dopo una ricarica la foto si vedeva ma non si riusciva più a
 * leggerla per inviarla. Un ArrayBuffer si salva e si rilegge sempre.
 */
const toRecord = async (file) => {
  if (!(file instanceof Blob)) return null;
  try {
    const bytes = await file.arrayBuffer();
    return bytes.byteLength ? { bytes, name: file.name || 'foto.jpg', type: file.type, lastModified: file.lastModified || Date.now() } : null;
  } catch {
    return null;
  }
};

const fromRecord = async (value) => {
  if (value?.bytes) return new File([value.bytes], value.name, { type: value.type, lastModified: value.lastModified });
  // Bozze di prima, con il File dentro: si tiene solo se si legge ancora. Se no sparisce dalla
  // bozza, e il rilevatore vede che va rifatta invece di crederla inviata.
  if (value instanceof Blob) {
    try {
      const bytes = await value.arrayBuffer();
      return bytes.byteLength ? new File([bytes], value.name || 'foto.jpg', { type: value.type }) : null;
    } catch {
      return null;
    }
  }
  return null;
};

async function mapPhotos(photos, convert) {
  const out = {};
  for (const [slot, value] of Object.entries(photos ?? {})) {
    if (Array.isArray(value)) {
      const list = (await Promise.all(value.map(convert))).filter(Boolean);
      if (list.length) out[slot] = list;
    } else if (value) {
      const one = await convert(value);
      if (one) out[slot] = one;
    }
  }
  return out;
}

// Scritture una dopo l'altra: leggere i byte richiede un attimo, e un salvataggio partito
// prima non deve finire dopo, riscrivendo foto vecchie o rimettendo una bozza appena chiusa.
let queue = Promise.resolve();
const inOrder = (task) => (queue = queue.then(task, task));

/**
 * `photos` ha la forma dello stato del modulo: slot → File, o slot → File[]. `key` distingue
 * la bozza corrente dalle bozze per negozio (survey-drafts.js).
 */
export function saveDraftPhotos(photos, key = KEY) {
  return inOrder(async () => {
    try {
      const kept = await mapPhotos(photos, toRecord);
      await run('readwrite', (store) => (Object.keys(kept).length ? store.put(kept, key) : store.delete(key)));
    } catch {
      /* navigazione privata o spazio esaurito: le foto restano almeno in memoria */
    }
  });
}

export function loadDraftPhotos(key = KEY) {
  // Anche la lettura aspetta il suo turno: deve vedere l'ultimo salvataggio, non quello prima.
  return inOrder(async () => {
    try {
      return await mapPhotos(await run('readonly', (store) => store.get(key)), fromRecord);
    } catch {
      return {};
    }
  });
}

export function clearDraftPhotos(key = KEY) {
  return inOrder(async () => {
    try {
      await run('readwrite', (store) => store.delete(key));
    } catch {
      /* vedi sopra */
    }
  });
}
