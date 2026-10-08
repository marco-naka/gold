import { NextResponse } from 'next/server';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { submissionWindow } from '@/lib/contest';
import { CONTEST } from '@/lib/constants';
import { DEPLOY_PROFILE, IS_DEMO } from '@/lib/deploy';
import { hasCommitment, hasResult } from '@/lib/server/draw';
import { drawAutomationEnabled } from '@/lib/server/draw-scheduler';
import { persistentStorage } from '@/lib/server/persistence';

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
  // In demo il disco non serve: non si scrive nulla, quindi non è un guasto.
  const healthy = IS_DEMO || storage === 'ok';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      profile: DEPLOY_PROFILE,
      storage,
      dataDir: DATA_DIR,
      submissions: IS_DEMO ? 'disattivate (anteprima)' : window.test ? `prove del team, fino al ${CONTEST.testEntriesUntil}` : window.open ? 'aperte' : window.reason,
      // Le rilevazioni non dipendono dal profilo: si salvano solo su un disco che resta.
      rilevazioni: persistentStorage() ? `attive, su ${DATA_DIR}` : 'bloccate: manca il disco (DATA_DIR)',
      mailer: process.env.MAIL_PROVIDER_API_KEY ? 'provider configurato' : 'outbox locale',
      draw: {
        automatic: drawAutomationEnabled(),
        phase: (await hasResult()) ? 'estratto' : (await hasCommitment()) ? 'impegnato' : 'in attesa',
      },
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
