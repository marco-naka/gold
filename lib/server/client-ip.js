/**
 * Indirizzo del chiamante, preso in modo che non si possa falsificare.
 *
 * `x-forwarded-for` è una lista, e il primo valore NON è affidabile: se il client manda un
 * proprio header, il proxy gli accoda il vero indirizzo invece di sostituirlo. Leggendo il
 * primo elemento chiunque può dichiararsi un IP diverso a ogni richiesta — e con quello
 * cadono insieme il limite per IP e il tetto sulle chiavi, perché ogni richiesta ne crea
 * una nuova.
 *
 * Si legge quindi l'ULTIMO valore, che è quello aggiunto dal proxy davanti all'app.
 * Se un domani ci fosse più di un proxy in catena, qui va tolto un hop per volta.
 */
export function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map((v) => v.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
