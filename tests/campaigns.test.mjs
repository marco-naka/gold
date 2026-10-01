import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAMPAIGNS, CAMPAIGN_LIST } from '../lib/campaigns.js';

/*
 * Le due varianti del concorso devono restare gemelle: cambia il premio, non la meccanica.
 *
 * Questi test esistono perché «ricordati di aggiornare anche l'altra pagina» non è una
 * garanzia. Se si aggiunge un premio a una campagna e non all'altra, o se cambia il modo in
 * cui un premio viene assegnato, qui si rompe qualcosa prima che lo veda un commerciante.
 */

const { gold, bitcoin } = CAMPAIGNS;
const places = (c, tier) => c.prizes[tier].items.map((i) => i.place);
const assignments = (c, tier) => c.prizes[tier].items.map((i) => i.assignment);

test('le campagne hanno gli stessi montepremi, con gli stessi nomi', () => {
  assert.deepEqual(Object.keys(gold.prizes), Object.keys(bitcoin.prizes));
});

for (const tier of ['users', 'merchants']) {
  test(`${tier}: stessi premi, stesso ordine`, () => {
    assert.deepEqual(places(gold, tier), places(bitcoin, tier));
  });

  test(`${tier}: stesso modo di assegnare ogni premio`, () => {
    // Se in una variante un premio si estrae e nell'altra lo decide la giuria, i due
    // regolamenti dicono cose diverse e l'estrazione verificabile non combacia più.
    assert.deepEqual(assignments(gold, tier), assignments(bitcoin, tier));
  });

  test(`${tier}: stesso numero di vincitori per premio`, () => {
    assert.deepEqual(
      gold.prizes[tier].items.map((i) => i.count),
      bitcoin.prizes[tier].items.map((i) => i.count)
    );
  });
}

test('i totali dichiarati corrispondono alla somma dei premi', () => {
  for (const c of CAMPAIGN_LIST) {
    const somma = ['users', 'merchants'].reduce(
      (tot, tier) => tot + c.prizes[tier].items.reduce((s, i) => s + c.amountOf(i) * i.count, 0),
      0
    );
    // Gli importi in oro hanno i decimali: si confronta a meno dei residui in virgola mobile.
    assert.ok(Math.abs(somma - c.total) < 1e-6, `${c.id}: dichiarato ${c.total}, somma ${somma}`);
  }
});

test('lo stesso numero di vincitori su entrambe le varianti', () => {
  assert.equal(gold.winners, bitcoin.winners);
});

test('ogni campagna sa formattare i propri importi e ha una fonte per il prezzo', () => {
  for (const c of CAMPAIGN_LIST) {
    assert.match(c.priceApi, /^\/api\//, `${c.id}: manca l'endpoint del prezzo`);
    assert.equal(typeof c.format(1), 'string');
    assert.match(c.accent, /^#[0-9A-F]{6}$/i, `${c.id}: accento non valido`);
    assert.ok(c.valueOf(c.total, 100) > 0, `${c.id}: controvalore non calcolabile`);
  }
});

test('i due controvalori restano confrontabili', () => {
  // Non devono essere uguali, ma nemmeno di ordini di grandezza diversi: sono due
  // proposte alternative con lo stesso budget, e se una vale il triplo dell'altra
  // la scelta non è più di posizionamento.
  const valore = (c, prezzo) => c.valueOf(c.total, prezzo);
  const inOro = valore(gold, 4271); // USD per XAUT, ordine di grandezza
  const inBtc = valore(bitcoin, 83585); // USD per BTC
  const rapporto = Math.max(inOro, inBtc) / Math.min(inOro, inBtc);
  assert.ok(rapporto < 1.5, `montepremi troppo diversi: ${Math.round(inOro)} vs ${Math.round(inBtc)}`);
});
