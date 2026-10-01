import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

/**
 * I file dell'estrazione, scaricabili da chiunque: è ciò che rende il sorteggio verificabile.
 * Contengono solo ID di giocate e di negozi, nessun dato personale. Elenco chiuso: nessun
 * altro file della cartella dati è raggiungibile da qui.
 */
const PUBLIC_FILES = {
  'commitment.json': 'application/json; charset=utf-8',
  'result.json': 'application/json; charset=utf-8',
  'participants-clienti.txt': 'text/plain; charset=utf-8',
  'participants-satoshi-spritz.txt': 'text/plain; charset=utf-8',
  'participants-merchant.txt': 'text/plain; charset=utf-8',
};

export async function GET(_request, { params }) {
  const type = PUBLIC_FILES[params.file];
  if (!type) return NextResponse.json({ code: 'not_found' }, { status: 404 });
  try {
    const body = await readFile(join(DATA_DIR, 'draw', params.file));
    return new NextResponse(body, {
      headers: {
        'Content-Type': type,
        // Una volta pubblicati non cambiano, salvo un'esclusione dopo la verifica: cache breve.
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch {
    return NextResponse.json({ code: 'not_published' }, { status: 404 });
  }
}
