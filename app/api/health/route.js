import { NextResponse } from 'next/server';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { submissionWindow } from '@/lib/contest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');

/**
 * Health check per Render. Verifica anche che il disco persistente sia scrivibile:
 * senza, le giocate verrebbero accettate e perse, che è il modo peggiore di fallire.
 */
export async function GET() {
  // Prova di scrittura reale: la cartella viene creata al bisogno, quindi verificarne
  // soltanto l'esistenza darebbe un falso allarme al primo avvio.
  let storage = 'ok';
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const probe = join(DATA_DIR, '.health');
    await writeFile(probe, new Date().toISOString());
    await rm(probe, { force: true });
  } catch (err) {
    storage = `non scrivibile (${err.code ?? 'errore'})`;
  }

  const window = submissionWindow();
  const healthy = storage === 'ok';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      storage,
      dataDir: DATA_DIR,
      submissions: window.open ? 'aperte' : window.reason,
      mailer: process.env.MAIL_PROVIDER_API_KEY ? 'provider configurato' : 'outbox locale',
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
