/**
 * Limite di frequenza condiviso dalle route che scrivono.
 *
 * In memoria e per istanza: basta per la scala di questo sito, ma va saputo — si azzera a
 * ogni deploy e non è condiviso se Render scala a più istanze. Con un traffico serio
 * andrebbe su Redis, e l'interfaccia qui sotto resterebbe la stessa.
 *
 * La mappa viene ripulita mentre si usa: senza, ogni chiave vista resta in RAM per sempre
 * e mille email inventate diventano un modo per far crescere la memoria del processo.
 */
const buckets = new Map();
const MAX_KEYS = 10_000;

/**
 * Toglie le chiavi scadute e, se restano troppe, quelle ferme da più tempo.
 *
 * L'ordine dello sfratto conta. Eliminando le chiavi in ordine di inserimento — o di ultimo
 * accesso — chi attacca ne genera diecimila nuove per far uscire la propria e riparte da
 * zero: il tetto pensato per proteggere la memoria diventa il modo per azzerare il
 * contatore. Si sfratta quindi chi ha accumulato MENO tentativi, cioè esattamente le chiavi
 * usa e getta di un flood, e si tiene chi è vicino al limite.
 */
function prune(now, windowMs) {
  for (const [key, hits] of buckets) {
    const alive = hits.filter((t) => now - t < windowMs);
    if (alive.length) buckets.set(key, alive);
    else buckets.delete(key);
  }
  if (buckets.size <= MAX_KEYS) return;

  // Si sfrattano per primi quelli con MENO tentativi: diecimila chiavi da un colpo solo
  // valgono meno di una vicina al limite, ed è quella che non deve sparire.
  const ordinati = [...buckets.entries()].sort(
    (a, b) => a[1].length - b[1].length || a[1].at(-1) - b[1].at(-1)
  );
  for (const [key] of ordinati.slice(0, buckets.size - MAX_KEYS)) buckets.delete(key);
}

let lastPrune = 0;

/**
 * Registra un tentativo e dice se ha superato il limite.
 * @returns {boolean} true se va rifiutato
 */
export function hit(key, { max, windowMs }) {
  const now = Date.now();
  // Una pulizia al minuto: scorrere la mappa a ogni richiesta sarebbe uno spreco.
  if (now - lastPrune > 60_000) {
    prune(now, windowMs);
    lastPrune = now;
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > max;
}

export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;

/**
 * Freno complessivo, che non guarda chi chiama.
 *
 * I limiti per IP reggono finché l'IP è attendibile, e lo è solo grazie al proxy davanti
 * all'app: se un domani il servizio fosse raggiungibile in diretta, un attaccante
 * potrebbe dichiarare un indirizzo diverso a ogni richiesta e passare indisturbato.
 * Questo tetto vale comunque, ed è tarato molto sopra il traffico vero — nella settimana
 * del forum ci si aspettano poche giocate al minuto, non decine — così scatta solo quando
 * sta succedendo qualcosa di anomalo.
 */
export const globalLimit = (name, max = 120) => hit(`global:${name}`, { max, windowMs: MINUTE });
