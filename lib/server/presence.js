/**
 * Chi sta lavorando adesso, e le bozze che i rilevatori hanno sul telefono.
 *
 * Il modulo delle rilevazioni manda un segnale ogni 30 secondi mentre è aperto: negozio e
 * sezione in corso, più una copia delle bozze non inviate (risposte e numero di foto, le foto
 * restano sul telefono). Serve all'admin per due cose: non pubblicare mentre qualcuno sta
 * compilando (un deploy rende il server irraggiungibile per qualche istante) e vedere le
 * bozze rimaste sui telefoni, che altrimenti nessuno vedrebbe.
 *
 * La presenza sta in memoria: dopo un riavvio si riparte da zero, ed è giusto così. Le bozze
 * stanno su disco (DATA_DIR/rilevazioni-bozze.json), e si riscrivono solo quando cambiano.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'rilevazioni-bozze.json');

/** Oltre questo tempo senza segnali, il rilevatore non è più «al lavoro». */
export const ACTIVE_MS = 2 * 60 * 1000;
/** Con lo schermo spento o l'app in secondo piano lo si mostra ancora, per un po'. */
export const IDLE_MS = 20 * 60 * 1000;

const live = globalThis.__nakaPresence ?? (globalThis.__nakaPresence = new Map());

const text = (v, max = 160) => (typeof v === 'string' ? v.slice(0, max) : null);

/** Aggiorna lo stato di un rilevatore. `closing` quando chiude la pagina. */
export function touch(operator, { activity, visible, closing }) {
  if (!operator) return;
  if (closing) {
    live.delete(operator);
    return;
  }
  const now = Date.now();
  const prev = live.get(operator);
  const merchantName = text(activity?.merchantName);
  live.set(operator, {
    operator,
    tab: text(activity?.tab, 20) ?? 'nuova',
    merchantName,
    section: text(activity?.section, 80),
    visible: visible !== false,
    at: new Date(now).toISOString(),
    // Da quando sta su questo negozio: cambia solo quando cambia il negozio.
    since: prev && prev.merchantName === merchantName ? prev.since : new Date(now).toISOString(),
  });
}

/** I rilevatori visti di recente, il più recente per primo. */
export function presenceNow(now = Date.now()) {
  return [...live.values()]
    .filter((p) => now - Date.parse(p.at) < IDLE_MS)
    .map((p) => ({ ...p, active: p.visible && now - Date.parse(p.at) < ACTIVE_MS }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

/* ---------------------------------------------------------------- bozze */

async function readAll() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return parsed?.operators ?? {};
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

let queue = Promise.resolve();

/** Solo i campi che servono, con un tetto: il telefono non deve poter riempire il disco. */
export function cleanDrafts(drafts) {
  if (!Array.isArray(drafts)) return [];
  return drafts.slice(0, 50).flatMap((d) => {
    if (!d || typeof d !== 'object' || typeof d.key !== 'string') return [];
    const answers = d.answers && typeof d.answers === 'object' && !Array.isArray(d.answers) ? d.answers : {};
    if (JSON.stringify(answers).length > 50_000) return [];
    return [
      {
        key: d.key.slice(0, 120),
        merchant: { id: text(d.merchant?.id, 120), name: text(d.merchant?.name), address: text(d.merchant?.address) },
        answers,
        step: Number.isInteger(d.step) ? d.step : 0,
        savedAt: text(d.savedAt, 40),
        photoCount: Number.isInteger(d.photoCount) ? Math.min(d.photoCount, 99) : 0,
      },
    ];
  });
}

/** Sostituisce la copia delle bozze di un rilevatore. Scrive su disco solo se è cambiata. */
export function syncDrafts(operator, drafts) {
  const next = queue.then(async () => {
    const all = await readAll();
    const clean = cleanDrafts(drafts);
    if (JSON.stringify(all[operator]?.drafts ?? []) === JSON.stringify(clean)) {
      if (all[operator]) all[operator].seenAt = new Date().toISOString();
      return false;
    }
    all[operator] = { syncedAt: new Date().toISOString(), drafts: clean };
    await mkdir(dirname(FILE), { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), operators: all }, null, 2)}\n`);
    await rename(tmp, FILE);
    return true;
  });
  queue = next.catch(() => {});
  return next;
}

/** Tutte le bozze di tutti, la più recente per prima. */
export async function allDrafts() {
  const all = await readAll();
  return Object.entries(all)
    .flatMap(([operator, { syncedAt, drafts }]) => (drafts ?? []).map((d) => ({ operator, syncedAt, ...d })))
    .sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''));
}
