/**
 * Avvio del server: qui parte il processo automatico dell'estrazione (`lib/server/draw-scheduler.js`).
 * Solo nel runtime Node, dove ci sono il disco e i timer. La condizione va scritta così, con
 * l'import DENTRO l'if: Next compila questo file anche per l'edge e, solo in questa forma, toglie
 * il ramo Node da quella build invece di provare a impacchettare `node:fs`.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startDrawScheduler } = await import('./lib/server/draw-scheduler.js');
    startDrawScheduler();
    // Le prove del team si azzerano da sole la sera prima dell'apertura.
    const { startTestResetScheduler } = await import('./lib/server/test-reset.js');
    startTestResetScheduler();
  }
}
