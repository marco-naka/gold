'use client';

import { useEffect } from 'react';

/**
 * Conteggio anonimo per sorgente (?s= stampato sui QR): nessun cookie, solo un contatore.
 * Sta nelle pagine a cui puntano i QR: /p per i clienti, /commercianti per i negozi.
 */
export default function SourceTracker() {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('s');
    if (!source) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
