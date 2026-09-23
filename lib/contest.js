import { CONTEST } from './constants.js';

/** Stato del concorso a una data: `upcoming` | `open` | `closed`. */
export function contestPhase(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (t < new Date(CONTEST.validFrom).getTime()) return 'upcoming';
  if (t > new Date(CONTEST.validTo).getTime()) return 'closed';
  return 'open';
}

/**
 * Le giocate si accettano durante il periodo di gara e nella finestra di tolleranza successiva,
 * così chi paga poco prima della chiusura fa in tempo a registrare la transazione.
 */
export const GRACE_MS = 24 * 60 * 60 * 1000;

export function submissionWindow(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const opensAt = new Date(CONTEST.validFrom).getTime();
  const closesAt = new Date(CONTEST.validTo).getTime() + GRACE_MS;
  if (t < opensAt) return { open: false, reason: 'upcoming', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
  if (t > closesAt) return { open: false, reason: 'closed', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
  return { open: true, reason: 'open', opensAt: new Date(opensAt), closesAt: new Date(closesAt) };
}
