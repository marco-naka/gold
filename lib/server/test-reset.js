/**
 * Azzeramento delle prove del team, prima dell'apertura vera del concorso.
 *
 * Niente viene cancellato: ogni file si sposta in DATA_DIR/archivio-prove/<data-ora>/, così
 * una prova si ritrova se servisse. Si spostano giocate, scontrini, email in coda, contatori
 * delle sorgenti, file dell'estrazione e i link social dei clienti. Restano dove sono le
 * rilevazioni, le loro bozze e foto, e i link social dei commercianti: sono lavoro vero.
 *
 * Lo usano `npm run reset-prove` (a mano) e il timer qui sotto, che lo fa da solo a
 * `CONTEST.testEntriesUntil` — la sera prima dell'apertura — una volta sola.
 */
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CONTEST } from '../constants.js';

const dataDir = () => process.env.DATA_DIR || join(process.cwd(), '.data');
const MOVE = ['entries.json', 'receipts', 'outbox', 'visits.json', 'draw'];
/** Il segno che l'azzeramento automatico è già passato: un riavvio non lo ripete. */
const MARKER = 'reset-prove.json';

const exists = (p) => stat(p).then(() => true, () => false);
const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));

async function describe(dir, name) {
  const p = join(dir, name);
  if (!(await exists(p))) return null;
  if ((await stat(p)).isDirectory()) return `${(await readdir(p)).length} file`;
  if (name === 'entries.json') return `${(await readJson(p)).entries?.length ?? 0} giocate`;
  if (name === 'visits.json') return `${Object.keys(await readJson(p)).length} contatori`;
  return 'presente';
}

/** Che cosa c'è da spostare. Con `apply` lo sposta e restituisce dove. */
export async function resetTestData({ apply = false, now = new Date() } = {}) {
  const dir = dataDir();
  const found = [];
  for (const name of MOVE) found.push({ name, what: await describe(dir, name) });

  const socialFile = join(dir, 'social.json');
  const links = (await exists(socialFile)) ? ((await readJson(socialFile)).links ?? []) : [];
  const customers = links.filter((l) => l.kind === 'customer');
  const report = { dir, found, customerLinks: customers.length, merchantLinks: links.length - customers.length, dest: null };
  if (!apply) return report;

  const dest = join(dir, 'archivio-prove', now.toISOString().replace(/[:.]/g, '-').slice(0, 19));
  await mkdir(dest, { recursive: true });
  for (const { name, what } of found) if (what) await rename(join(dir, name), join(dest, name));
  if (customers.length) {
    await writeFile(join(dest, 'social-clienti.json'), `${JSON.stringify({ links: customers }, null, 2)}\n`);
    const tmp = `${socialFile}.${process.pid}.tmp`;
    const kept = links.filter((l) => l.kind !== 'customer');
    await writeFile(tmp, `${JSON.stringify({ updatedAt: new Date().toISOString(), links: kept }, null, 2)}\n`);
    await rename(tmp, socialFile);
  }
  return { ...report, dest };
}

/**
 * Il passo del timer. Agisce solo tra la fine delle prove e l'apertura vera: dopo l'apertura
 * le giocate sono del pubblico, e un server riavviato tardi non deve toccarle.
 */
export async function testResetTick(now = new Date()) {
  if (!CONTEST.testEntriesFrom) return 'off';
  const t = now.getTime();
  if (t < Date.parse(CONTEST.testEntriesUntil)) return 'waiting';
  if (t >= Date.parse(CONTEST.validFrom)) return 'too_late';
  const marker = join(dataDir(), MARKER);
  if (await exists(marker)) return 'done';
  const r = await resetTestData({ apply: true, now });
  await writeFile(marker, `${JSON.stringify({ at: now.toISOString(), dest: r.dest }, null, 2)}\n`);
  console.log(`[prove] azzerate alle ${now.toISOString()}: archivio in ${r.dest}`);
  return 'reset';
}

let timer = null;

export function startTestResetScheduler() {
  if (timer || !CONTEST.testEntriesFrom) return;
  if (Date.now() >= Date.parse(CONTEST.validFrom)) return;
  console.log(`[prove] azzeramento automatico previsto per ${CONTEST.testEntriesUntil}`);
  const tick = () =>
    testResetTick().then(
      (state) => {
        if (state === 'reset' || state === 'done' || state === 'too_late') clearInterval(timer);
      },
      (err) => console.error(`[prove] azzeramento non riuscito, si riprova: ${err.message}`),
    );
  timer = setInterval(tick, 60_000);
  timer.unref?.();
  tick();
}
