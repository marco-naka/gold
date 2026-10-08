/**
 * L'estrazione vista dall'admin: a che punto è, chi entrerebbe negli elenchi adesso, e dopo
 * l'estrazione vincitori e riserve con i dati che servono a contattarli e verificarli.
 *
 * Qui non si impegna e non si estrae: lo fa da solo il server (lib/server/draw-scheduler.js),
 * e a mano si interviene dalla Shell (`npm run draw`). Il pannello può solo escludere un
 * vincitore — entra la riserva — e rifare la verifica: le due cose che servono dopo.
 */
import { POOLS } from '../campaigns.js';
import { CONTEST, DRAW } from '../constants.js';
import { SATOSHI_SPRITZ } from '../bitcoin.js';
import { listEntries } from './store.js';
import { readArchive, readCommitment, readDrawResult } from './draw-result.js';
import { SCOPES, buildLists, closesAt, isAdmitted, spritzVenues, tiersOf, tipHeight } from './draw.js';

const entryView = (e) =>
  e
    ? {
        id: e.id,
        email: e.email,
        merchant: e.merchant,
        merchantId: e.merchantId,
        amountLabel: e.amountLabel,
        txIdMasked: e.txIdMasked,
        status: e.status,
        createdAt: e.createdAt,
        paidAt: e.paidAt ?? null,
        test: Boolean(e.test),
        hasReceipt: Boolean(e.receipt?.key),
      }
    : null;

/**
 * @param now        l'istante a cui leggere lo stato (i test lo fissano)
 * @param merchants  l'elenco dei negozi, per nome e indirizzo: lo passa la route, perché
 *                   lib/merchants.js si importa solo dentro Next
 */
export async function drawAdminState({ now = Date.now(), merchants: shopList = [] } = {}) {
  const [entries, commitment, result, archive, venues] = await Promise.all([
    listEntries(),
    readCommitment(),
    readDrawResult(),
    readArchive(),
    spritzVenues(),
  ]);
  const byId = new Map(entries.map((e) => [e.id, e]));
  const merchants = new Map(shopList.map((m) => [m.id, m]));
  const perMerchant = entries.filter(isAdmitted).reduce((acc, e) => {
    if (e.merchantId) acc[e.merchantId] = (acc[e.merchantId] ?? 0) + 1;
    return acc;
  }, {});
  const merchantView = (id) => ({
    id,
    name: merchants.get(id)?.name ?? id,
    address: merchants.get(id)?.address ?? '',
    entries: perMerchant[id] ?? 0,
  });

  const closes = closesAt();
  const phase = result ? 'drawn' : commitment ? 'committed' : now < closes ? 'open' : 'closed';

  // Chi entrerebbe negli elenchi se l'impegno fosse adesso: lo stesso calcolo del commit.
  const lists = buildLists(entries, { venues });
  const preview = {
    users: lists.users.length,
    spritz: lists.spritz.length,
    merchants: lists.merchants.length,
    excludedTest: entries.filter((e) => e.test).length,
    excludedRejected: entries.filter((e) => e.status === 'rejected' && !e.test).length,
    pending: entries.filter((e) => e.status === 'pending_verification' && !e.test).length,
  };

  // La cima della catena serve solo tra impegno ed estrazione, per dire quanto manca.
  let tip = null;
  if (commitment && !result) {
    tip = await Promise.race([tipHeight(), new Promise((r) => setTimeout(() => r(null), 5000))]).catch(() => null);
  }

  const scopes = {};
  for (const scope of SCOPES) {
    const r = result?.[scope];
    const isMerchant = scope === 'merchants';
    const who = (id) => (isMerchant ? merchantView(id) : entryView(byId.get(id)) ?? { id, missing: true });
    scopes[scope] = {
      tiers: tiersOf(scope).map((t) => ({ place: t.place, amount: t.amount, asset: t.asset, count: t.count ?? 1 })),
      committed: commitment?.[scope] ? { count: commitment[scope].count, listHash: commitment[scope].listHash, file: commitment[scope].file } : null,
      participants: r?.participants ?? null,
      winners: (r?.winners ?? []).map((w) => ({ ...w, who: who(w.winnerId) })),
      reserves: (r?.reserves ?? []).map((x) => ({ ...x, who: who(x.id) })),
    };
  }

  return {
    phase,
    now: new Date(now).toISOString(),
    closesAt: new Date(closes).toISOString(),
    notBefore: DRAW.expectedFrom,
    expectedBy: DRAW.expectedBy ?? null,
    blocksAhead: DRAW.blocksAhead,
    reservesPerScope: DRAW.reserves,
    spritz: { venues: venues.map((id) => merchants.get(id)?.name ?? id), from: SATOSHI_SPRITZ.from, to: SATOSHI_SPRITZ.to },
    preview,
    commitment: commitment ? { createdAt: commitment.createdAt, seed: commitment.seed } : null,
    tip,
    result: result ? { drawnAt: result.drawnAt, seedHeight: result.seedHeight, seed: result.seed, disqualified: result.disqualified ?? [] } : null,
    archive,
    scopes,
    juryPrizes: [...POOLS.users.items, ...POOLS.merchants.items]
      .filter((i) => i.assignment !== 'draw')
      .map((i) => ({ place: i.place, amount: i.amount, asset: i.asset, assignment: i.assignment })),
    contest: { validFrom: CONTEST.validFrom, validTo: CONTEST.validTo },
  };
}
