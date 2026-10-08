import { CONTEST } from './constants.js';

/** Stato del concorso a una data: `upcoming` | `open` | `closed`. */
export function contestPhase(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (t < new Date(CONTEST.validFrom).getTime()) return 'upcoming';
  if (t > new Date(CONTEST.validTo).getTime()) return 'closed';
  return 'open';
}

/**
 * Tolleranza dopo la chiusura per registrare una transazione già effettuata.
 * Sta in constants perché è un parametro di campagna, non una costante tecnica.
 */
export const GRACE_MS = CONTEST.graceMinutes * 60 * 1000;

/** Vero mentre valgono le giocate di prova del team (vedi `CONTEST.testEntriesFrom`). */
export function testWindowOpen(now = new Date()) {
  if (!CONTEST.testEntriesFrom) return false;
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return t >= new Date(CONTEST.testEntriesFrom).getTime() && t < new Date(CONTEST.testEntriesUntil).getTime();
}

export function submissionWindow(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const opensAt = new Date(CONTEST.validFrom).getTime();
  const closesAt = new Date(CONTEST.validTo).getTime() + GRACE_MS;
  // Prima dell'apertura vera, nella finestra di prova: si registra, ma la giocata è una prova.
  if (t < opensAt && testWindowOpen(t)) {
    return { open: true, reason: 'test', test: true, opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
  }
  if (t < opensAt) return { open: false, reason: 'upcoming', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
  if (t > closesAt) return { open: false, reason: 'closed', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
  return { open: true, reason: 'open', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
}
