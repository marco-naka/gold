/**
 * Estrazione automatica.
 *
 * Gira dentro il server, una volta al minuto, perché è lì che sta il disco con le giocate: un
 * cron separato su Render non lo vedrebbe. Fa le stesse cose dello script, nello stesso ordine,
 * senza che nessuno debba essere davanti a una Shell il sabato pomeriggio:
 *
 *   dopo la chiusura          → impegno: elenchi, impronte, blocco-seme       (una volta sola)
 *   impegno pubblicato        → copia su archive.org, riprovando finché riesce
 *   seme definitivo, ≥ 17:00  → estrazione                                    (una volta sola)
 *   risultato pubblicato      → copia su archive.org
 *
 * La copia su archive.org si tenta a ogni giro ma non ferma niente: se l'archivio è giù,
 * l'estrazione avviene comunque all'ora prevista.
 *
 * Ogni passo è idempotente: impegno e risultato si scrivono in modo esclusivo, quindi neanche
 * un comando manuale lanciato nello stesso istante può produrne due. Un passo che fallisce si
 * riprova al giro successivo; gli errori finiscono nei log del servizio.
 *
 * Attivo solo in produzione. In locale e in anteprima resta spento, salvo DRAW_AUTOMATIC=on;
 * DRAW_AUTOMATIC=off lo spegne anche in produzione, se si preferisce procedere a mano.
 */
import { IS_DEMO } from '../deploy.js';
import { CONTEST } from '../constants.js';
import {
  NotYet,
  archivePublicFile,
  closesAt,
  commitDraw,
  hasCommitment,
  hasResult,
  readArchive,
  runDraw,
} from './draw.js';

const EVERY_MS = 60_000;
/** Oltre questa data il processo non ha più niente da fare e si ferma. */
const STOP_AFTER = Date.parse(CONTEST.onlineUntil);

const log = (msg) => console.log(`[estrazione] ${msg}`);

export function drawAutomationEnabled() {
  const flag = (process.env.DRAW_AUTOMATIC || '').toLowerCase();
  if (flag === 'off') return false;
  if (flag === 'on') return true;
  return !IS_DEMO && process.env.NODE_ENV === 'production';
}

let busy = false;
const warned = new Set();
/** Lo stesso avviso una volta sola: «troppo presto» ogni minuto per un'ora non aiuta nessuno. */
const once = (key, msg) => {
  if (warned.has(key)) return;
  warned.add(key);
  log(msg);
};

/**
 * Prova a depositare un file su archive.org; se non riesce, riprova al giro dopo.
 * Non blocca mai l'estrazione: archive.org è una garanzia in più, non un passaggio obbligato.
 */
async function tryArchive(name, archive) {
  if (archive[name]) return;
  try {
    const a = await archivePublicFile(name);
    log(`${name} archiviato: ${a.url}`);
  } catch (err) {
    once(`archive:${name}:${err.message}`, `archiviazione di ${name} non riuscita, si riprova: ${err.message}`);
  }
}

/** Un giro: fa i passi che servono, nell'ordine, fermandosi al primo che non è ancora possibile. */
export async function drawTick(now = Date.now()) {
  if (busy) return;
  busy = true;
  try {
    if (now < closesAt()) return;

    if (!(await hasCommitment())) {
      const c = await commitDraw({ now });
      log(`impegno pubblicato: ${c.users.count} giocate, blocco-seme ${c.seed.seedHeight}`);
    }

    await tryArchive('commitment.json', await readArchive());

    if (!(await hasResult())) {
      const r = await runDraw({ now });
      log(`estrazione eseguita sul blocco ${r.seedHeight}: ${r.users.winners.length} premi clienti`);
    }

    await tryArchive('result.json', await readArchive());
  } catch (err) {
    if (err instanceof NotYet) once(err.message, `in attesa: ${err.message}`);
    else log(`errore, si riprova tra un minuto: ${err.message}`);
  } finally {
    busy = false;
  }
}

let timer = null;

export function startDrawScheduler() {
  if (timer || !drawAutomationEnabled()) return;
  if (Date.now() > STOP_AFTER) return;
  log('processo automatico attivo');
  timer = setInterval(() => {
    if (Date.now() > STOP_AFTER) {
      clearInterval(timer);
      return;
    }
    drawTick();
  }, EVERY_MS);
  // Non tiene in vita il processo da solo: se il server si ferma, si ferma anche lui.
  timer.unref?.();
  drawTick();
}
