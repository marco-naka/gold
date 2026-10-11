'use client';

import { useEffect, useMemo, useState } from 'react';
import { MERCHANTS } from './merchants';

/**
 * Id dei negozi tolti dal circuito dall'area rilevazioni dopo l'ultimo deploy. L'elenco nel
 * pacchetto non li conosce: si chiedono al server e si tolgono appena arrivano. Senza
 * risposta resta l'elenco del pacchetto.
 */
export function useExcludedIds() {
  const [ids, setIds] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/merchants/excluded')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && d?.ids?.length && setIds(new Set(d.ids)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return ids;
}

/** L'elenco pubblico di adesso. */
export function usePublicMerchants() {
  const ids = useExcludedIds();
  return useMemo(() => (ids ? MERCHANTS.filter((m) => !ids.has(m.id)) : MERCHANTS), [ids]);
}
