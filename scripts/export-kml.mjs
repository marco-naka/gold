#!/usr/bin/env node
/**
 * Esporta i negozi in KML, formato che Google My Maps importa direttamente.
 *
 *   npm run export:kml > negozi.kml
 *
 * Si importa una volta sola su mymaps.google.com: si ottiene una mappa vera, con strade e
 * ricerca, ospitata da Google. Sul sito resta un pulsante che la apre — la richiesta a Google
 * parte quindi solo se l'utente sceglie di andarci, e la pagina resta senza terze parti.
 */
import { MERCHANTS } from '../lib/merchants.js';

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const CATEGORY = { food: 'Ristoranti e bar', shopping: 'Shopping', hotel: 'Hotel', services: 'Servizi' };

const places = MERCHANTS.map(
  (m) => `    <Placemark>
      <name>${esc(m.name)}</name>
      <description><![CDATA[${esc(m.address)}<br>${CATEGORY[m.category] ?? m.category}<br>Accetta: ${m.assets.join(', ')}${
        m.website ? `<br><a href="${esc(m.website)}">${esc(m.website)}</a>` : ''
      }]]></description>
      <Point><coordinates>${m.lng},${m.lat},0</coordinates></Point>
    </Placemark>`
).join('\n');

process.stdout.write(`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Paga in Crypto e Vinci Oro Digitale — negozi aderenti</name>
    <description>NAKA × Plan ₿ Forum 2026, Lugano. ${MERCHANTS.length} esercenti con POS NAKA.</description>
${places}
  </Document>
</kml>
`);
