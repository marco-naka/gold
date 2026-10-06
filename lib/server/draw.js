/**
 * Estrazione verificabile ("provably fair") — il motore.
 *
 * Lo usano due chiamanti: lo script `scripts/draw.mjs`, a mano dalla Shell, e il processo
 * automatico `lib/server/draw-scheduler.js`, dentro il server. La logica sta qui una volta
 * sola, così i due non possono divergere.
 *
 * Il problema non è generare un numero casuale: è dimostrare a un terzo che NON è stato scelto
 * dopo aver visto i partecipanti. Due impegni pubblici, in quest'ordine, e l'ordine è la garanzia:
 *
 *   1. COMMIT — subito dopo la chiusura si pubblicano gli elenchi degli ID ammessi e la loro
 *               impronta SHA-256. Nello stesso file si fissa il seme: l'hash del blocco Bitcoin
 *               che verrà minato `DRAW.blocksAhead` posizioni dopo la cima della catena in quel
 *               momento. Quel blocco non esiste ancora: nessuno può conoscerne l'hash.
 *               Una copia dell'impegno va su archive.org: una data che non dipende da noi.
 *   2. RUN    — quando il blocco-seme c'è, e sopra di lui ne è stato minato almeno un altro, il
 *               calcolo è deterministico: sha256("<seme>:<categoria>:<ID>"), dal più basso.
 *   3. VERIFY — chiunque, con elenchi e seme, rifà il conto e ottiene lo stesso esito.
 *
 * Ogni giocata vince al massimo un premio. Si estrae prima il concorso generale dei clienti, poi
 * il Satoshi Spritz saltando chi ha già vinto. I merchant sono un'estrazione a parte, fra negozi.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { POOLS } from '../campaigns.js';
import { SATOSHI_SPRITZ } from '../bitcoin.js';
import { CONTEST, DRAW } from '../constants.js';
import { GRACE_MS } from '../contest.js';
import { SITE_URL } from '../site.js';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '.data');
const DRAW_DIR = join(DATA_DIR, 'draw');
const ENTRIES = join(DATA_DIR, 'entries.json');
const COMMITMENT = join(DRAW_DIR, 'commitment.json');
const RESULT = join(DRAW_DIR, 'result.json');
const ARCHIVE = join(DRAW_DIR, 'archive.json');
const MERCHANTS_SNAPSHOT = join(process.cwd(), 'lib', 'merchants.data.json');

export const FILES = {
  users: 'participants-clienti.txt',
  merchants: 'participants-merchant.txt',
  spritz: 'participants-satoshi-spritz.txt',
};
/** L'ordine conta: lo Spritz si calcola dopo il generale, per saltarne i vincitori. */
export const SCOPES = ['users', 'spritz', 'merchants'];

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const exists = (path) => stat(path).then(() => true, () => false);
/** Scrittura esclusiva: se il file c'è già fallisce. Due processi non possono impegnare due volte. */
const writeOnce = (path, data) => writeFile(path, data, { flag: 'wx' });

export const hasCommitment = () => exists(COMMITMENT);
export const hasResult = () => exists(RESULT);
export const readCommitmentFile = () => readJson(COMMITMENT);
export const readResultFile = () => readJson(RESULT);
export const readArchive = () => readJson(ARCHIVE).catch(() => ({}));

/* ---------- Chi partecipa ---------- */

export const closesAt = () => new Date(CONTEST.validTo).getTime() + GRACE_MS;

/**
 * Chi entra negli elenchi: le giocate registrate entro la chiusura e non respinte.
 * «In verifica» basta: la verifica completa si fa su chi vince, prima di pagare.
 */
export const isAdmitted = (entry) =>
  entry.status !== 'rejected' && Date.parse(entry.createdAt ?? '') <= closesAt();

/**
 * I locali del Satoshi Spritz. Finché gli organizzatori non pubblicano il loro elenco
 * (`SATOSHI_SPRITZ.venues`), valgono tutti i negozi dell'elenco che stanno all'indirizzo della
 * serata: è il criterio scritto nel regolamento, art. 6-ter.
 */
export async function spritzVenues() {
  if (SATOSHI_SPRITZ.venues) return [...SATOSHI_SPRITZ.venues].sort();
  const street = SATOSHI_SPRITZ.area.split(',').at(0).trim().toLowerCase();
  const { merchants = [] } = await readJson(MERCHANTS_SNAPSHOT).catch(() => ({}));
  return merchants
    .filter((m) => (m.address ?? '').toLowerCase().includes(street))
    .map((m) => m.id)
    .sort();
}

/**
 * Entra nell'elenco dello Spritz una giocata fatta in un locale della serata e pagata durante
 * la serata. Conta l'ora della TRANSAZIONE registrata dal POS (`paidAt`), non quella in cui il
 * cliente compila il modulo: si può registrare fino alla chiusura del concorso.
 *
 * Se all'impegno l'ora del POS di una giocata non è ancora stata caricata, la giocata entra
 * purché registrata dopo l'inizio della serata (prima non poteva essere stata pagata lì), e se
 * viene estratta l'ora si controlla sul POS prima di pagare: fuori orario, perde lo Spritz
 * (`disqualify --only spritz`) ma resta nell'estrazione generale.
 */
export function isSpritzEntry(entry, venues) {
  if (!entry.merchantId || !venues.includes(entry.merchantId)) return false;
  const from = Date.parse(SATOSHI_SPRITZ.from);
  if (entry.paidAt) {
    const paid = Date.parse(entry.paidAt);
    return paid >= from && paid <= Date.parse(SATOSHI_SPRITZ.to);
  }
  return Date.parse(entry.createdAt ?? '') >= from;
}

/**
 * Elenchi canonici, ordinati e senza duplicati.
 * - clienti : un biglietto per ogni giocata ammessa (più giocate = più possibilità)
 * - spritz  : le giocate ammesse fatte nei locali e nell'orario della serata
 * - merchant: un solo biglietto per esercente con almeno una transazione registrata,
 *             indipendentemente da quante ne ha fatte (è un'estrazione tra pari)
 */
export function buildLists(entries, { includeAll = false, venues = [] } = {}) {
  const eligible = entries.filter((e) => includeAll || isAdmitted(e));
  return {
    users: [...new Set(eligible.map((e) => e.id))].sort(),
    merchants: [...new Set(eligible.map((e) => e.merchantId).filter(Boolean))].sort(),
    spritz: [...new Set(eligible.filter((e) => isSpritzEntry(e, venues)).map((e) => e.id))].sort(),
  };
}

/** L'impronta di un elenco: sha256 degli ID ordinati, uno per riga, senza a capo finale. */
export const listHash = (ids) => sha256(ids.join('\n'));

/** Il blocco-seme e quello che serve sopra di lui, a partire dalla cima al momento dell'impegno. */
export const seedHeightFor = (tipHeight) => tipHeight + DRAW.blocksAhead;
export const readyHeightFor = (seedHeight) => seedHeight + DRAW.confirmationsAbove;

/* ---------- Catena Bitcoin: due esploratori, che devono essere d'accordo ---------- */

async function ask(base, path) {
  const res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${base}${path}: HTTP ${res.status}`);
  return (await res.text()).trim();
}

export async function tipHeight() {
  // La cima può differire di un blocco per qualche secondo: per l'impegno vale la più alta,
  // che rende il seme solo più lontano, mai più vicino.
  const heights = await Promise.all(DRAW.explorers.map((base) => ask(base, '/blocks/tip/height')));
  return Math.max(...heights.map(Number));
}

/** Lo stesso hash da tutti gli esploratori; si rifiuta se anche uno solo dice altro. */
export async function blockHash(height) {
  const answers = await Promise.all(DRAW.explorers.map((base) => ask(base, `/block-height/${height}`)));
  if (new Set(answers).size !== 1) {
    throw new Error(
      `Gli esploratori non concordano sull'hash del blocco ${height}:\n` +
        DRAW.explorers.map((b, i) => `  ${b} → ${answers.at(i)}`).join('\n')
    );
  }
  return answers.at(0);
}

/* ---------- Il calcolo ---------- */

/**
 * Biglietto di ogni partecipante: sha256 deterministico su (seme, categoria, id).
 * La categoria separa i sorteggi: lo stesso seme non produce correlazioni fra un ordine e l'altro.
 */
export const ticketOf = (seed, id, scope = 'users') => sha256(`${seed}:${scope}:${id}`);

/**
 * I premi estratti di una quota, meno quelli che hanno un elenco proprio.
 * Il premio Satoshi Spritz è marcato `pool: 'spritz'`: esce dallo stesso seme ma da un elenco
 * ristretto, quindi non va pescato anche dall'estrazione generale dei clienti.
 */
const drawnTiers = (pool, sub = null) =>
  pool.items.filter((i) => i.assignment === 'draw' && (i.pool ?? null) === sub);
export const tiersOf = (scope) =>
  scope === 'spritz' ? drawnTiers(POOLS.users, 'spritz') : drawnTiers(POOLS[scope]);

/**
 * Ordina gli ID per biglietto e assegna i premi dall'alto.
 *
 * I primi della fila occupano i posti premiati, nell'ordine dei premi. Un ID in `exclude` che
 * cade su un posto premiato lo lascia alla prima riserva disponibile, con lo stesso premio: gli
 * altri vincitori non cambiano premio (regolamento, art. 7 lettera d). Nessun nuovo sorteggio,
 * nessuna scelta: l'ordine è quello pubblicato.
 */
export function drawWinners(ids, seed, tiers, scope = 'users', { exclude = [], reserves = 0 } = {}) {
  const ordered = [...ids]
    .map((id) => ({ id, ticket: ticketOf(seed, id, scope) }))
    .sort((a, b) => (a.ticket < b.ticket ? -1 : a.ticket > b.ticket ? 1 : a.id < b.id ? -1 : 1));

  const skip = new Set(exclude);
  // I posti premiati, uno per premio, nell'ordine dei premi.
  const slots = tiers.flatMap((tier) => Array.from({ length: tier.count }, () => tier));
  const top = ordered.slice(0, slots.length);
  // Chi sta dopo i posti premiati, escluse le giocate saltate: è la fila delle riserve.
  const queue = ordered.slice(slots.length).filter((o) => !skip.has(o.id));

  const winners = [];
  slots.forEach((tier, i) => {
    const holder = top[i] && !skip.has(top[i].id) ? top[i] : queue.shift();
    if (!holder) return; // meno partecipanti che premi
    winners.push({
      rank: i + 1,
      place: tier.place,
      amount: tier.amount,
      // L'asset viaggia col vincitore: un importo senza unità non si può stampare né pubblicare.
      asset: tier.asset,
      winnerId: holder.id,
      ticket: holder.ticket,
    });
  });
  const reserveList = queue.slice(0, reserves).map((o, i) => ({ rank: i + 1, id: o.id, ticket: o.ticket }));

  return { winners, reserves: reserveList, ordered };
}

/**
 * Esito di tutte le estrazioni, dato il seme e le esclusioni.
 *
 * Una giocata vince al massimo un premio: il generale si calcola per primo, e lo Spritz salta
 * chi ha vinto lì. Se più tardi un vincitore del generale viene escluso e al suo posto sale una
 * riserva che aveva vinto lo Spritz, quella giocata passa al premio più alto e lo Spritz va alla
 * giocata successiva del suo elenco: il ricalcolo lo fa da sé, sempre nello stesso modo.
 */
export function computeAll(lists, seed, disqualified = []) {
  // Un'esclusione vale per tutte le estrazioni, o per una sola (`only`): chi ha pagato fuori
  // dall'orario dello Spritz perde lo Spritz, non la partecipazione al generale.
  const excludedIn = (scope) => disqualified.filter((d) => !d.only || d.only === scope).map((d) => d.id);
  const opts = (scope, more = []) => ({ exclude: [...excludedIn(scope), ...more], reserves: DRAW.reserves });

  const users = drawWinners(lists.users, seed, tiersOf('users'), 'users', opts('users'));
  const usersWon = users.winners.map((w) => w.winnerId);
  const spritz = drawWinners(lists.spritz, seed, tiersOf('spritz'), 'spritz', opts('spritz', usersWon));
  const merchants = drawWinners(lists.merchants, seed, tiersOf('merchants'), 'merchants', opts('merchants'));

  const pick = ({ winners, reserves }) => ({ winners, reserves });
  return { users: pick(users), spritz: pick(spritz), merchants: pick(merchants) };
}

/* ---------- Le fasi ---------- */

/** Errore atteso (troppo presto, catena non pronta…): il processo automatico riprova, non allarma. */
export class NotYet extends Error {}

export async function commitDraw({ includeAll = false, force = false, tip = null, now = Date.now() } = {}) {
  if (await hasCommitment()) {
    // Un secondo impegno è esattamente la manipolazione che la procedura deve impedire:
    // rifarlo dopo aver visto il seme permetterebbe di scegliere l'elenco.
    throw new Error('Esiste già un impegno pubblicato: non si sovrascrive. Se è una prova, cancella a mano .data/draw.');
  }
  if (!force && now < closesAt()) throw new NotYet('Le registrazioni non sono ancora chiuse.');

  const { entries } = await readJson(ENTRIES);
  const venues = await spritzVenues();
  const lists = buildLists(entries, { includeAll, venues });
  if (!lists.users.length) throw new Error('Nessuna giocata ammissibile: niente da impegnare.');

  const tipNow = tip != null ? Number(tip) : await tipHeight();
  if (!Number.isInteger(tipNow) || tipNow <= 0) throw new Error(`Altezza della cima non valida: ${tip}`);
  const seedHeight = seedHeightFor(tipNow);

  const commitment = {
    createdAt: new Date(now).toISOString(),
    entriesClosedAt: new Date(closesAt()).toISOString(),
    algorithm: 'sha256 della lista di ID ordinati, separati da \\n, senza a capo finale',
    users: { count: lists.users.length, listHash: listHash(lists.users), file: FILES.users },
    spritz: {
      count: lists.spritz.length,
      listHash: listHash(lists.spritz),
      file: FILES.spritz,
      // Il criterio con cui l'elenco è stato costruito, così chiunque può controllarlo.
      venues,
      paidBetween: [SATOSHI_SPRITZ.from, SATOSHI_SPRITZ.to],
      withoutPosTime: 'inclusa se registrata dopo l\u2019inizio della serata; se estratta, ora verificata sul POS',
    },
    merchants: { count: lists.merchants.length, listHash: listHash(lists.merchants), file: FILES.merchants },
    seed: {
      rule: `Hash del blocco Bitcoin all'altezza ${seedHeight}: ${DRAW.blocksAhead} blocchi dopo la cima (${tipNow}) al momento di questo impegno.`,
      tipHeightAtCommit: tipNow,
      tipSource: tip != null ? 'manuale' : DRAW.explorers,
      seedHeight,
      drawWhenHeight: readyHeightFor(seedHeight),
      notBefore: DRAW.expectedFrom,
    },
    ticket: 'sha256("<hash del blocco>:<users|spritz|merchants>:<ID>"), in ordine crescente',
    onePrizePerEntry: 'Si estrae prima "users"; in "spritz" si saltano gli ID già vincitori in "users".',
  };

  await mkdir(DRAW_DIR, { recursive: true });
  // Senza a capo finale: il file è esattamente ciò di cui si pubblica l'impronta, così
  // `shasum -a 256 participants-clienti.txt` restituisce lo stesso valore di listHash.
  for (const scope of SCOPES) await writeFile(join(DRAW_DIR, FILES[scope]), lists[scope].join('\n'));
  await writeOnce(COMMITMENT, `${JSON.stringify(commitment, null, 2)}\n`);
  return commitment;
}

/** Elenchi letti dal disco, controllati contro le impronte impegnate. */
export async function loadCommitted() {
  const commitment = await readJson(COMMITMENT);
  const lists = {};
  for (const scope of SCOPES) {
    const raw = await readFile(join(DRAW_DIR, commitment[scope].file), 'utf8');
    const ids = raw.trim() ? raw.trim().split('\n') : [];
    const hash = listHash(ids);
    // Gli elenchi devono combaciare con quelli impegnati: è ciò che rende l'estrazione non manipolabile.
    if (hash !== commitment[scope].listHash) {
      throw new Error(`Elenco "${scope}" alterato dopo l'impegno!\n  atteso ${commitment[scope].listHash}\n  trovato ${hash}`);
    }
    lists[scope] = ids;
  }
  return { commitment, lists };
}

export async function drawStatus() {
  const commitment = await readJson(COMMITMENT);
  const tip = await tipHeight();
  return { tip, ...commitment.seed };
}

export async function runDraw({ seed: manualSeed = null, force = false, now = Date.now() } = {}) {
  if (await hasResult()) throw new Error('L’estrazione è già stata eseguita. Per escludere un vincitore usa `disqualify`.');
  const { commitment, lists } = await loadCommitted();
  const { seedHeight, drawWhenHeight, notBefore } = commitment.seed;

  if (!force && now < Date.parse(notBefore)) throw new NotYet(`Estrazione annunciata non prima di ${notBefore}.`);

  let seed = manualSeed;
  let seedSources = 'manuale';
  if (!seed) {
    const tip = await tipHeight();
    if (tip < drawWhenHeight) {
      throw new NotYet(`Cima a ${tip}: il seme è il blocco ${seedHeight}, si estrae a ${drawWhenHeight}.`);
    }
    seed = await blockHash(seedHeight);
    seedSources = DRAW.explorers;
  }
  if (!/^[0-9a-f]{64}$/.test(seed)) throw new Error(`Hash del blocco non valido: ${seed}`);

  const computed = computeAll(lists, seed);
  const result = {
    drawnAt: new Date(now).toISOString(),
    seedHeight,
    seed,
    seedSources,
    disqualified: [],
    ...Object.fromEntries(
      SCOPES.map((scope) => [
        scope,
        { participants: lists[scope].length, listHash: commitment[scope].listHash, ...computed[scope] },
      ])
    ),
    notDrawn: [...POOLS.merchants.items, ...POOLS.users.items]
      .filter((i) => i.assignment !== 'draw')
      .map((i) => ({ place: i.place, amount: i.amount, asset: i.asset, assignment: i.assignment })),
    howToVerify: [
      '1. Scarica gli elenchi: lo sha256 di ciascuno (ID separati da \\n) deve essere uguale al listHash pubblicato.',
      `2. Apri il blocco ${seedHeight} su un qualunque esploratore: il suo hash deve essere identico a seed.`,
      '3. Per ogni ID calcola sha256("<seed>:<users|spritz|merchants>:<ID>") e ordina in modo crescente.',
      '4. I primi vincono, nell’ordine dei premi; chi segue è riserva. Un ID escluso lascia il suo premio alla prima riserva disponibile.',
      '5. Una partecipazione vince un solo premio: nello Spritz si saltano gli ID che hanno vinto in "users".',
      '   Oppure: node scripts/draw.mjs verify',
    ],
  };

  await writeOnce(RESULT, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

export async function disqualifyWinner(id, reason, { only = null } = {}) {
  if (!id || !reason) throw new Error('Servono l’ID e una motivazione pubblicabile, senza dati personali.');
  if (only && !SCOPES.includes(only)) throw new Error(`Estrazione sconosciuta: ${only} (${SCOPES.join(', ')})`);
  const result = await readJson(RESULT);
  const { lists } = await loadCommitted();

  const isWinner = (only ? [only] : SCOPES).some((s) => result[s].winners.some((w) => w.winnerId === id));
  if (!isWinner) {
    throw new Error(`${id} non è tra i vincitori attuali${only ? ` di "${only}"` : ''}: si escludono solo giocate estratte.`);
  }

  const disqualified = [
    ...(result.disqualified ?? []),
    { id, reason, ...(only ? { only } : {}), at: new Date().toISOString() },
  ];
  const next = computeAll(lists, result.seed, disqualified);
  for (const scope of SCOPES) Object.assign(result[scope], next[scope]);
  result.disqualified = disqualified;
  await writeFile(RESULT, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

export async function verifyDraw({ offline = false } = {}) {
  const result = await readJson(RESULT);
  const { commitment, lists } = await loadCommitted(); // lancia se un elenco non combacia con l'impegno

  const checks = [];
  checks.push({
    ok: result.seedHeight === commitment.seed.seedHeight,
    label: `il risultato usa il blocco annunciato (${commitment.seed.seedHeight})`,
  });
  if (!offline) {
    checks.push({
      ok: (await blockHash(commitment.seed.seedHeight)) === result.seed,
      label: `il seme è l’hash del blocco ${commitment.seed.seedHeight}`,
    });
  }
  const again = computeAll(lists, result.seed, result.disqualified ?? []);
  for (const scope of SCOPES) {
    checks.push({
      ok:
        JSON.stringify(again[scope].winners) === JSON.stringify(result[scope].winners) &&
        JSON.stringify(again[scope].reserves) === JSON.stringify(result[scope].reserves),
      label: `vincitori e riserve ${scope} riproducibili (${lists[scope].length} partecipanti)`,
    });
  }
  return checks;
}

/* ---------- Copia indipendente su archive.org ---------- */

/**
 * Chiede alla Wayback Machine di archiviare un file pubblico dell'estrazione.
 *
 * L'impegno vive sul nostro sito: chi non l'ha visto alle 16:30 dovrebbe fidarsi che sia quello
 * di allora. Una copia su archive.org porta una data e un'ora registrate da un terzo, quindi
 * dimostra che gli elenchi esistevano PRIMA del blocco-seme. Il file contiene solo ID e
 * impronte, nessun dato personale.
 */
export async function archivePublicFile(name) {
  const target = `${SITE_URL}/api/draw/${name}`;
  if (/localhost|127\.0\.0\.1/.test(SITE_URL)) throw new NotYet(`URL pubblico non configurato: ${target} non è raggiungibile da archive.org.`);

  const res = await fetch(`https://web.archive.org/save/${target}`, {
    signal: AbortSignal.timeout(90_000),
    headers: { 'User-Agent': 'NAKA concorso - archiviazione estrazione verificabile' },
  });
  if (!res.ok) throw new Error(`archive.org ha risposto HTTP ${res.status}`);
  // La Wayback Machine porta alla copia appena fatta: /web/<data>/<url>.
  const location = res.headers.get('content-location');
  const snapshot = location ? `https://web.archive.org${location}` : res.url;
  if (!/web\.archive\.org\/web\/\d{14}/.test(snapshot)) throw new Error(`Copia non confermata da archive.org (${snapshot}).`);

  const archive = await readArchive();
  archive[name] = { url: snapshot, archivedAt: new Date().toISOString(), of: target };
  await mkdir(DRAW_DIR, { recursive: true });
  await writeFile(ARCHIVE, `${JSON.stringify(archive, null, 2)}\n`);
  return archive[name];
}
