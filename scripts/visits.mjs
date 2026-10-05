#!/usr/bin/env node
/**
 * Back-office delle rilevazioni sul campo.
 *
 *   npm run visits stats                    quadro generale
 *   npm run visits list [--outcome rifiuta] elenco, filtrabile per esito e per rilevatore
 *   npm run visits show RV-2026-AB12CD      una rilevazione per intero
 *   npm run visits export > rilevazioni.csv una riga per visita, una colonna per domanda
 *   npm run visits agenda                   i ripassi fissati, in ordine di data
 *   npm run visits exclude [-- --yes]       toglie dall'elenco pubblico chi ha detto no
 *
 * Si esegue dove il disco dei dati è montato: in locale qui, in produzione dalla Shell di Render.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ALL_QUESTIONS, OUTCOMES } from '../lib/survey.js';
import { TIME_ZONE } from '../lib/time.js';
import { answerText, visitsCsv } from '../lib/survey-export.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const FILE = join(DATA_DIR, 'rilevazioni.json');
const OVERRIDES = join(process.cwd(), 'lib', 'merchants.overrides.json');

const [, , command = 'stats', ...rest] = process.argv;
const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? null : rest[i + 1] ?? true;
};

async function load() {
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    return Array.isArray(parsed.visits) ? parsed.visits : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

const label = (id) => OUTCOMES.find((o) => o.id === id)?.label ?? id;
const day = (iso) => new Date(iso).toLocaleDateString('it-CH', { timeZone: TIME_ZONE });

const show = answerText;

const visits = await load();

if (command === 'stats') {
  if (!visits.length) {
    console.log('Nessuna rilevazione registrata.');
    process.exit(0);
  }

  console.log(`\nRilevazioni: ${visits.length}\n`);

  console.log('Per esito');
  for (const o of OUTCOMES) {
    const n = visits.filter((v) => v.outcome === o.id).length;
    if (n) console.log(`  ${o.label.padEnd(24)} ${String(n).padStart(4)}`);
  }

  console.log('\nPer rilevatore');
  const perSurveyor = {};
  for (const v of visits) perSurveyor[v.surveyor] = (perSurveyor[v.surveyor] ?? 0) + 1;
  for (const [name, n] of Object.entries(perSurveyor).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name.padEnd(24)} ${String(n).padStart(4)}`);
  }

  // Le medie delle scale sono il dato che si guarda per primo in riunione.
  const scales = ALL_QUESTIONS.filter((q) => q.type === 'scale');
  if (scales.length) {
    console.log('\nValutazioni medie');
    for (const q of scales) {
      const values = visits.map((v) => v.answers?.[q.id]).filter((n) => typeof n === 'number');
      if (!values.length) continue;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      console.log(`  ${q.label.slice(0, 46).padEnd(48)} ${avg.toFixed(2)}  (${values.length} risposte)`);
    }
  }

  // Chi ha promesso un contenuto: è la rosa da cui esce il premio Best Social Content,
  // e a ridosso della scadenza serve sapere chi ricordarglielo.
  const social = visits.filter((v) => v.answers?.adesione === 'Aderisce e creerà un contenuto social');
  if (social.length) {
    console.log(`\nHanno promesso un contenuto social: ${social.length}`);
    for (const v of social) console.log(`  ${v.merchantName}`);
  }

  const recensioni = visits.filter((v) => v.answers?.naka_recensione);
  if (recensioni.length) {
    console.log(`\nHanno promesso una recensione Google: ${recensioni.length}`);
    for (const v of recensioni) console.log(`  ${v.merchantName}`);
  }

  const leads = visits.filter((v) => v.answers?.appuntamento_commerciale);
  if (leads.length) {
    console.log(`\nAppuntamenti commerciali richiesti: ${leads.length}`);
    for (const v of leads) console.log(`  ${v.merchantName}`);
  }

  const pending = visits.filter((v) => v.answers?.ritorno_quando).length;
  if (pending) console.log(`\n${pending} ritorni da fare: npm run visits agenda`);

  const noPhotos = visits.filter((v) => !Object.keys(v.photos ?? {}).length).length;
  if (noPhotos) console.log(`\n${noPhotos} rilevazioni senza alcuna foto.`);

  const unknown = visits.filter((v) => !v.merchantKnown);
  if (unknown.length) {
    console.log(`\n${unknown.length} negozi non presenti nello snapshot, da valutare per l'inserimento:`);
    for (const v of unknown) console.log(`  ${v.merchantName}`);
  }
  console.log();
} else if (command === 'list') {
  const byOutcome = flag('outcome');
  const bySurveyor = flag('surveyor');
  const rows = visits
    .filter((v) => (byOutcome ? v.outcome === byOutcome : true))
    .filter((v) => (bySurveyor ? v.surveyor.toLowerCase().includes(String(bySurveyor).toLowerCase()) : true));

  if (!rows.length) {
    console.log('Nessuna rilevazione con questi filtri.');
    process.exit(0);
  }
  for (const v of rows) {
    const photos = Object.values(v.photos ?? {}).reduce((n, x) => n + (Array.isArray(x) ? x.length : 1), 0);
    console.log(
      `${v.id}  ${day(v.createdAt)}  ${label(v.outcome).padEnd(20)} ${v.merchantName.slice(0, 34).padEnd(36)} ${v.surveyor.padEnd(16)} ${photos} foto`
    );
  }
} else if (command === 'show') {
  const id = rest[0];
  const v = visits.find((x) => x.id === id);
  if (!v) {
    console.error(`Rilevazione ${id} non trovata.`);
    process.exit(1);
  }
  console.log(`\n${v.id} — ${v.merchantName}`);
  console.log(`${day(v.createdAt)} · ${v.surveyor} · ${label(v.outcome)}`);
  if (!v.merchantKnown) console.log('⚠ negozio non presente nello snapshot');
  if (v.mapSnapshot) console.log(`Mappa: ${v.mapSnapshot.address ?? '—'}`);
  console.log();
  for (const q of ALL_QUESTIONS) {
    if (v.answers?.[q.id] === undefined) continue;
    console.log(`  ${q.label}`);
    console.log(`    ${show(v.answers[q.id])}\n`);
  }
  const photos = Object.entries(v.photos ?? {});
  if (photos.length) {
    console.log('Foto');
    for (const [slot, value] of photos) {
      for (const p of Array.isArray(value) ? value : [value]) console.log(`  ${slot.padEnd(10)} ${p.key}`);
    }
  }
  console.log();
} else if (command === 'export') {
  process.stdout.write(visitsCsv(visits));
} else if (command === 'agenda') {
  // I ritorni fissati, per qualunque motivo: prova da fare, titolare assente, materiale da
  // consegnare. È la lista con cui si organizza il secondo giro, ed è il motivo per cui la
  // data si chiede sul posto invece che dopo.
  const key = (v) => `${v.answers.ritorno_quando} ${v.answers.ritorno_ora ?? '99:99'}`;
  const pending = visits
    .filter((v) => v.answers?.ritorno_quando)
    .sort((a, b) => key(a).localeCompare(key(b)));

  if (!pending.length) {
    console.log('Nessun ripasso fissato.');
    process.exit(0);
  }

  const today = new Date().toISOString().slice(0, 10);
  console.log(`\nRitorni fissati: ${pending.length}\n`);
  for (const v of pending) {
    const when = v.answers.ritorno_quando;
    // L'ora è facoltativa: dove manca resta la colonna vuota, allineata con le altre.
    const at = (v.answers.ritorno_ora ?? '').padEnd(5);
    const late = when < today ? ' ⚠ scaduto' : '';
    console.log(
      `${when} ${at}  ${v.merchantName.slice(0, 30).padEnd(32)} ${(v.answers.ritorno_motivo ?? []).join(', ').slice(0, 30).padEnd(32)} ${v.id}${late}`
    );
  }
  console.log();
} else if (command === 'exclude') {
  // Chi ha detto no, ha chiuso o non si è trovato esce dall'elenco pubblico dei negozi.
  // Vale l'ULTIMA rilevazione di ogni negozio: chi prima rifiuta e poi ci ripensa rientra.
  const latest = new Map();
  for (const v of visits) {
    if (!v.merchantId) continue;
    const prev = latest.get(v.merchantId);
    if (!prev || new Date(v.createdAt) > new Date(prev.createdAt)) latest.set(v.merchantId, v);
  }

  const excluded = {};
  for (const [id, v] of latest) {
    if (!v.excludes) continue;
    excluded[id] = { name: v.merchantName, reason: v.outcome, visit: v.id, at: v.createdAt };
  }

  const current = JSON.parse(await readFile(OVERRIDES, 'utf8'));
  const before = Object.keys(current.excluded ?? {});
  const after = Object.keys(excluded);
  const added = after.filter((id) => !before.includes(id));
  const removed = before.filter((id) => !after.includes(id));

  console.log(`Esclusi: ${after.length} (prima ${before.length})`);
  for (const id of added) console.log(`  + ${excluded[id].name} — ${label(excluded[id].reason)}`);
  for (const id of removed) console.log(`  − ${current.excluded[id].name} — rientra in elenco`);

  if (!added.length && !removed.length) {
    console.log('Niente da cambiare.');
    process.exit(0);
  }

  if (flag('yes') !== true) {
    console.log('\nRilancia con --yes per scrivere lib/merchants.overrides.json.');
    process.exit(0);
  }

  await writeFile(
    OVERRIDES,
    `${JSON.stringify(
      {
        _comment: current._comment,
        updatedAt: new Date().toISOString(),
        excluded,
      },
      null,
      2
    )}\n`
  );
  console.log('\nScritto. Serve un nuovo deploy perché l’elenco pubblico si aggiorni.');
} else {
  console.error(`Comando sconosciuto: ${command}`);
  console.error('Usa: stats | list | show <id> | export | agenda | exclude');
  process.exit(1);
}
