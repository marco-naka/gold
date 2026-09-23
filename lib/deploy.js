/**
 * Profilo di deploy.
 *
 * `demo`       — vetrina: il sito si vede tutto ma NON accetta giocate. Si usa sui piani senza
 *                disco persistente, dove i dati andrebbero persi al primo riavvio senza che
 *                nessuno se ne accorga.
 * `production` — raccolta reale, richiede un disco persistente montato su DATA_DIR.
 *
 * Volutamente esplicito: è il profilo, non l'infrastruttura, a decidere se si possono
 * accettare dati. Così una configurazione incompleta non diventa una perdita silenziosa.
 */
export const DEPLOY_PROFILE =
  (process.env.NEXT_PUBLIC_DEPLOY_PROFILE || process.env.DEPLOY_PROFILE || 'production').toLowerCase();

export const IS_DEMO = DEPLOY_PROFILE === 'demo';
