# Paga in Crypto e Vinci Bitcoin — NAKA × Plan ₿ Forum 2026 Lugano

Landing page / web app del concorso NAKA: paga in crypto su POS NAKA a Lugano e partecipa
all'estrazione.

**Il montepremi è diviso in due asset**, ed è la decisione portante del progetto: chi paga
vince bitcoin, chi offre il pagamento vince oro. Non è una scelta estetica — un negoziante non
paga, mette a disposizione il modo di pagare — e si riflette in tutto il resto:

| | Clienti | Commercianti |
|---|---|---|
| Premio | 11'000'000 sat | 2.00 XAUT |
| Rete | Lightning | Ethereum |
| Vincitori | 12 | 4 |
| Pagina | `/` (`/en`) | `/commercianti` (`/en/merchants`) |
| Modulo | `lib/bitcoin.js` | `lib/constants.js` |

Il totale dichiarato — **21'000'000 di satoshi** — è la somma delle due quote a un'equivalenza
fissata a un istante preciso: `lib/anchor.js` la documenta e `npm run anchor` la rimisura. I due
moduli dei premi si incontrano solo in `lib/campaigns.js`, che è l'unico posto da cui i
componenti leggono importi, formati e conteggi.

## Stack
Next.js 14 (App Router) · React 18 · TailwindCSS 3 · lucide-react. Nessuna dipendenza extra.

## Avvio
```bash
npm install
npm run dev              # http://localhost:3000
npm test                 # 14 test su validazione, finestra di gara e store
npm run import:merchants # rigenera lo snapshot merchant dalla mappa di Lugano
npm run build && npm run start
```

Copiare `.env.example` in `.env.local` per configurare URL pubblico, override delle date di gara
(utile per le demo: fuori dal periodo il form mostra lo stato "registrazioni chiuse"), cartella dati
e chiave del provider email.

## Struttura
```
app/
  layout.jsx            metadata SEO/OG, font, tema dark
  page.jsx              composizione sezioni + stato modale regolamento
  globals.css           design system (glass, campi form, palette oro)
  api/entries/route.js  registrazione giocata + logica anti-frode server-side
components/
  Navbar · Hero · Countdown · DualInitiative · HowItWorks · Prizes
  EntryForm · MerchantMap · MerchantB2B · Faq · RulesModal · Footer · Brand
  ui/  Button · GlassCard · Modal · SectionTitle · cn
lib/
  constants.js   date evento, montepremi, email, mailto merchant
  merchants.js   directory merchant + categorie + link Google Maps
  validation.js  regole di validazione condivise client/server
```

## Punti di configurazione
- **Date evento e periodo di gara**: `lib/constants.js` (`EVENT`, `CONTEST`) — valori attualmente
  ipotizzati, da allineare al calendario ufficiale Plan ₿ Forum 2026.
- **Montepremi**: `PRIZES` in `lib/constants.js` (usato anche dal regolamento, resta sempre coerente).
- **Merchant**: `lib/merchants.data.json`, generato da `npm run import:merchants` a partire dalla
  Crypto Map ufficiale della Città di Lugano / Plan ₿ (vedi sotto). `lib/merchants.js` contiene un
  seed di fallback se lo snapshot non è presente.
- **Loghi**: `components/Brand.jsx` contiene wordmark segnaposto; sostituire con gli asset ufficiali
  NAKA / Plan ₿ Forum / Tether Gold prima del go-live.
- **Email**: `CONTEST.supportEmail` e `CONTEST.merchantEmail` (usata dal mailto di adesione B2B).

## Form di partecipazione

Tre campi: **email**, **prova d'acquisto** (numero transazione *oppure* foto scontrino) e **negozio
facoltativo** (testo libero con suggerimenti `<datalist>` dai merchant della mappa; un nome fuori
elenco è accettato e marcato `merchantKnown: false` per la verifica manuale).

Del numero di transazione si chiedono le **ultime 6 cifre**: sulla ricevuta NAKA è lungo 32
caratteri e spezzato su due righe, e copiarlo per intero da uno scontrino termico è il modo più
veloce per far abbandonare il form. Chi preferisce incolla il numero intero: il confronto usa
comunque il suffisso.

Le 6 cifre da sole però collidono — su 2.000 giocate c'è l'11% di probabilità che due finiscano
uguali, e un cliente onesto si vedrebbe rifiutare la giocata come duplicata. La chiave di unicità è
quindi **suffisso + importo**, che porta quella probabilità sotto lo 0,1%: l'importo è già stampato
sulla ricevuta, si copia in un attimo e serve anche al riscontro del premio Top Numero di Transazioni.

**L'indirizzo wallet non è più chiesto in fase di giocata**: viene richiesto via email ai soli
vincitori. Regolamento (art. 4, 7, 8) e FAQ sono allineati a questo flusso.

## Elenco negozi, non mappa

Al posto della mappa schematica c'è l'elenco con ricerca, filtri per categoria e **ordinamento
per vicinanza**: la geolocalizzazione del browser resta nel dispositivo, non viene inviata né a
noi né a terzi, e ogni scheda mostra la distanza reale ("180 m da te").

La mappa disegnata è stata rimossa: pin dorati su una griglia senza strade né lago sembravano
informazione senza esserlo — con 336 esercenti diventava una macchia in cui non si distingueva
nulla. Chi apre la pagina in centro ha una domanda sola, "quale negozio ho a due passi", e si
risponde con la distanza e le indicazioni.

```bash
npm run export:kml > negozi.kml
```

Genera il file da importare una volta su **Google My Maps**: si ottiene una mappa vera, con
strade e ricerca, ospitata da Google. Sul sito resta un pulsante che la apre, così la richiesta a
Google parte solo se l'utente decide di andarci e la pagina resta senza terze parti.
Il file pronto è `negozi-lugano.kml` (336 esercenti).

## Import merchant dalla Crypto Map di Lugano

```bash
npm run import:merchants
```

`scripts/import-merchants.mjs` interroga l'endpoint pubblico usato dalla mappa ufficiale
(`POST https://planb.lugano.ch/wp-json/bfx-crypto-map/v1/merchants?env=production`, la stessa
incorporata in `my.lugano.ch/pagare-in-lvga-lugano`), filtra il comprensorio di Lugano, scarta chi
accetta solo LVGA, mappa la tassonomia sulle 4 categorie del concorso (`UST` → `USDT`) e scrive lo
snapshot statico `lib/merchants.data.json`.

ℹ️ **Paradiso**: sulla crypto map cittadina c'è un solo esercente (Funicolare San Salvatore) e
accetta solo LVGA, quindi non entra nell'elenco. I merchant di Paradiso arriveranno da NAKA a parte;
fino ad allora la comunicazione parla solo di Lugano. Il filtro dell'import li accetta già.

```bash
npm run import:logos
```

Scarica i loghi, li riduce a 128 px e li converte in WebP dentro `public/img/merchants/`:
**136 loghi per 360 KB complessivi**, 3 KB l'uno. Gli originali stanno su un bucket S3 di terze
parti e vanno da 4 KB a oltre mezzo megabyte — usarli via URL avrebbe rimesso una richiesta
esterna per ogni scheda. Chi non ha logo mostra l'iniziale del nome; il riquadro ha fondo chiaro
perché molti loghi sono scuri o trasparenti e su nero sparirebbero.

Dalla sorgente si prendono anche **telefono** (125 esercenti, normalizzato in formato
internazionale così `tel:` funziona da un telefono estero) e il **tipo di link**: il campo
`website` a volte contiene un profilo Instagram, e il pulsante lo dice invece di chiamarlo "Sito".

Non ci sono invece **orari di apertura** né descrizioni: la sorgente ha i campi ma sono vuoti.
Chi vuole sapere se un negozio è aperto lo scopre aprendo "Indicazioni", che porta alla scheda
Google del locale.

Ultimo import: **336 merchant**, di cui **328 con rail NAKA** (food 107 · servizi 130 · shopping 92 ·
hotel 7).

Lo script sanifica i dati della sorgente, che contiene errori: coordinate fuori range vengono riparate
o scartate (es. `Caffè Roma` aveva lat `846.005304` invece di `46.005304`, e da sola sfondava il
bounding box della mappa schiacciando tutti i pin sul bordo) e i duplicati sono deduplicati per
nome+indirizzo. Ogni anomalia è segnalata a console durante l'import. Lo snapshot è statico di proposito: la landing non deve dipendere a runtime da un endpoint
di terze parti durante la settimana del forum.

`posActive` deriva dal flag `NAKA_CARD` della crypto map: indica accettazione su rail NAKA, **non**
conferma che il POS sia abilitato al concorso. Ogni record porta `verified: false` finché non è
riscontrato sul backend POS NAKA. Prima del go-live va richiesta a Città di Lugano / Plan ₿
l'autorizzazione al riuso dei dati; l'attribuzione è già mostrata sotto la mappa.

## Allineamento al circuito Plan ₿ Lugano

Riferimento: [planb.lugano.ch/paga-in-cripto](https://planb.lugano.ch/paga-in-cripto/?lang=it).
Da quella pagina derivano: la terminologia ufficiale usata nei testi (Bitcoin su rete Lightning /
USD₮ / LVGA / NAKA Card), la tassonomia delle categorie (verificata: tutti i 29 tag dello snapshot
hanno una mappatura), i wallet consigliati in `lib/wallets.js` con i tutorial Plan ₿ Network
(mostrati sotto "Come funziona") e il posizionamento rispetto al cashback MyLugano.

La sezione "Come funziona" non riscrive la procedura di pagamento sui POS: rimanda alla guida
ufficiale (`OFFICIAL_GUIDE` in `lib/wallets.js`, versione IT ed EN), linkata anche dal footer.
La pagina è Elementor e non ha anchor stabili — gli id sono hash rigenerati a ogni modifica — quindi
si linka la pagina intera e non una sua sezione.

Il cashback 5–10% via app MyLugano è un'iniziativa della Città di Lugano, non di NAKA: in pagina è
presentato come vantaggio che si somma, senza numeri. Confermare con NAKA prima del go-live se
citarlo esplicitamente.

## Anti-frode implementata
| Livello | Controllo |
|---|---|
| Form | validazione live per campo, blur + submit, focus sull'errore |
| Condiviso (`lib/validation.js`) | email, formato del numero transazione, tipo e peso allegato, checkbox obbligatorie |
| API | rivalidazione server-side (non aggirabile disabilitando JS) |
| API | unicità del numero di transazione (409 sui duplicati) |
| API | rate limit 10 giocate/ora per IP+email (429) |
| API | mascheramento del numero transazione nella risposta; la chiave dello scontrino non esce mai dal server |
| API | finestra temporale: fuori dal periodo di gara si risponde 403 |
| API | honeypot invisibile + tempo minimo di compilazione (3s), con risposta fittizia per non istruire i bot |

### Livello dati (`lib/server/`)

Tre adapter con interfaccia stabile: in locale scrivono su disco, in produzione si sostituisce
l'implementazione senza toccare i chiamanti.

| Modulo | Locale | Produzione |
|---|---|---|
| `store.js` | `.data/entries.json`, scrittura atomica e coda che serializza le transazioni | Postgres/Prisma |
| `receipts.js` | `.data/receipts/<anno>/<id>.<ext>`, fuori dalla cartella pubblica, con sha256 | S3/R2 + URL firmati |
| `mailer.js` | messaggi in `.data/outbox/*.json` | Resend/Postmark/SES (`MAIL_PROVIDER_API_KEY`) |

Il controllo di unicità avviene **dentro** la transazione di scrittura: due richieste simultanee con
lo stesso numero di transazione non possono passare entrambe (coperto da test). Se la giocata viene
rifiutata, lo scontrino già archiviato viene rimosso: niente file orfani.

Resta da fare in produzione la verifica incrociata sul gateway POS NAKA, marcata `TODO produzione`
nella route.

## Parametri di campagna

`lib/constants.js` è l'unica fonte per date, premi, canali e contatti:

| | |
|---|---|
| **Forum** (sede ed evento) | 23–24 ottobre 2026, Palazzo dei Congressi · [biglietti](https://planb.lugano.ch/planb-forum/#tickets) |
| **Iniziativa** (territorio) | Lugano, negozi con POS NAKA |
| Apertura | lunedì 19 ottobre 2026, **08:00** |
| Chiusura registrazioni | sabato 24 ottobre 2026, **16:00** |
| Contenuti social | entro venerdì 23 ottobre |
| Estrazione | sabato 24 ottobre, **16:30** — mezz'ora dopo la chiusura |
| Hashtag | `#PayCryptoWinGold` `#LuganoPlanB` `#Naka` |
| Piattaforme | Instagram, Facebook, TikTok, LinkedIn (su LinkedIn si può taggare la pagina NAKA) |
| Annuncio ufficiale | [LinkedIn NAKA](https://www.linkedin.com/company/nakafinances/) |
| Assistenza merchant | `assistenza@naka.com` · tel. 091 222 02 00 · WhatsApp 077 991 65 87 |

I numeri svizzeri sono convertiti in formato internazionale nei link `tel:` e `wa.me`, così
funzionano anche dal telefono di un visitatore straniero.

**XAUT non è un metodo di pagamento**: nei dati della crypto map tutti e 336 i merchant accettano
BTC e USDt, nessuno XAUT. Il token resta l'asset del premio. Se NAKA conferma che i POS incassano
anche in XAUT, si rimette la voce in `PAYMENT_ASSETS` e tutti i testi si aggiornano da soli.

Il premio si chiama **Best Social Content** (non più "Video"): accetta video, post e immagini.
La pagina è `/best-social-content`, con redirect permanente dal vecchio `/best-social-video`.

## Lingue

Italiano (`/`) e inglese (`/en`), stessa struttura per entrambe.

```
lib/i18n/it.js · en.js   tutti i testi, chiavi speculari
lib/i18n/index.js        getDictionary, localePath, formatDate/DateTime
app/(it)/ · app/(en)/    due root layout: l'attributo lang sta su <html>,
                         che un layout annidato non può modificare
```

Numeri, date, premi e dati merchant restano in `lib/constants.js` e negli snapshot: i dizionari
contengono **solo** testo. Le interpolazioni sono funzioni (`t.prizes.title(pool)`), quindi il
dizionario non attraversa il confine server→client: i componenti ricevono il `locale` come stringa
e risolvono il testo nel bundle client.

Tre test di parità impediscono che una lingua resti indietro: stesse chiavi, stessi tipi, stesse
lunghezze di lista. Il regolamento inglese dichiara che **in caso di discrepanza prevale
l'italiano** — è una traduzione di cortesia, non un testo legale autonomo.

## Deploy su Render

Il repository contiene `render.yaml` (blueprint): su Render → **New → Blueprint** si punta alla repo
e il servizio si crea da solo.

| Voce | Valore |
|---|---|
| Runtime | Node 22 · `npm ci && npm run build` → `npm run start` |
| Region | Frankfurt (il più vicino alla Svizzera) |
| Piano | **Starter o superiore** — i dischi persistenti non esistono sul free |
| Disco | `data`, mount su `/var/data`, 5 GB |
| Health check | `/api/health` — verifica anche che il disco sia **scrivibile** |

Variabili da impostare a mano (`sync: false` nel blueprint):
`NEXT_PUBLIC_SITE_URL`, `MAIL_PROVIDER_API_KEY`, `MAIL_FROM`.

⚠️ `DATA_DIR` deve restare uguale a `mountPath`: giocate, scontrini e outbox vivono lì. Su un piano
senza disco il servizio parte lo stesso ma **perde tutti i dati a ogni riavvio o deploy**; il health
check lo segnala restituendo 503.

Le rilevazioni non aspettano il 19 ottobre: si raccolgono anche con il profilo `demo`, ma solo se
`DATA_DIR` è impostata. Senza, `/api/rilevazioni` rifiuta l'invio (`storage_unavailable`) e la
bozza resta sul telefono; `/api/health` dice in che stato sono alla voce `rilevazioni`.

I comandi di back-office ed estrazione si eseguono dalla **Shell** del servizio Render, dove il
disco è montato.

## Pagine e funnel

| Percorso | A chi serve |
|---|---|
| `/` · `/en` | Landing completa: chi arriva da LinkedIn o dalla locandina |
| `/p` · `/en/p` | **Pagina del QR**: solo il form, 24 KB contro i 230 della home. Chi inquadra il codice è alla cassa con trenta secondi: 43 parole prima del campo email invece di 648 |
| `/vincitori` · `/en/winners` | Risultato dell'estrazione e spiegazione della procedura verificabile (prima del sorteggio mostra solo quest'ultima) |
| `/commercianti` · `/en/merchants` | Area commercianti: i tre premi, come aderire, regole del premio social |
| `/rilevazioni` | **Non linkata, con codice.** Area interna dei rilevatori sul campo |

I suggerimenti del negozio arrivano da `/api/merchants?q=` mentre si scrive: lo snapshot da 123 KB
non entra più nel bundle del form.

## Privacy, cookie e ciclo di vita

Il sito **non installa cookie** e non carica risorse di terze parti: i font sono ospitati in
`public/fonts`, quindi navigando l'IP del visitatore non raggiunge Google. È la ragione per cui
non c'è alcun banner da mostrare — non perché sia stato dimenticato.

`components/ConsentBanner.jsx` esiste ed è pronto, ma si accende **solo** se viene configurata
`NEXT_PUBLIC_ANALYTICS_ID`: nel momento in cui si introduce uno strumento con cookie, compare la
richiesta di consenso preventiva senza altro lavoro.

Informativa completa su `/privacy` (e `/en/privacy`), collegata dal footer.

### Conservazione

| | |
|---|---|
| Raccolta giocate | fino al 24 ottobre 2026, 16:00 |
| Estrazione | 24 ottobre 2026, 16:30 |
| Elenco vincitori online | fino al **24 novembre 2026** (`CONTEST.onlineUntil`), con i soli ID |
| Cancellazione dati personali | entro la stessa data, con `npm run entries purge -- --yes` |

Il purge elimina scontrini, email e numeri di transazione e lascia ID, esito, sorgente e data:
dati che non identificano nessuno e che tengono verificabile l'estrazione già pubblicata. Il comando
avvisa se viene lanciato prima della data prevista.

## Misurazione senza cookie

I QR stampati portano un parametro sorgente, uno per materiale:

| Etichetta | Materiale |
|---|---|
| `locandina` | locandina A3, in italiano (`/p`) e in inglese (`/en/p`) |
| `banco` | cartoncino A6 accanto al POS |
| `vetrina` | vetrofanie e bollino della porta |
| `volantino-cliente` · `volantino-merchant` | volantini A5 |
| `mappa` | pulsante «Registra il pagamento» della mappa dei negozi |
| `linkedin` · `sito` · `altro` | canali digitali |

`/api/track` conta le aperture per etichetta in `.data/visits.json`
e la sorgente viene salvata sulla giocata: `npm run entries stats` mostra la conversione per
materiale. Nessun cookie, nessun IP, nessun identificatore — niente da far consentire sotto LPD.
Le etichette fuori elenco vengono scartate.

`/api/stats` alimenta il contatore pubblico in pagina (giocate registrate, premi, negozi): prova
sociale e trasparenza sulle probabilità nello stesso posto.

## Back-office giocate

```bash
npm run entries stats                    # quadro generale per stato
npm run entries list --status pending_verification
npm run entries show NK-2026-ABC123
npm run entries validate NK-2026-ABC123 -- --note "riscontro POS #4412"
npm run entries reject   NK-2026-ABC123 -- --reason "transazione non trovata"
npm run entries validate-all -- --yes    # convalida in blocco
npm run entries export > giocate.csv
```

È l'anello tra la registrazione (`pending_verification`) e l'estrazione, che ammette **solo** le
giocate `validated`. `stats` segnala le giocate con negozio non riconosciuto, da controllare a mano.

## Area rilevazioni sul campo

Due incaricati girano i negozi di Lugano prima del forum: spiegano l'iniziativa, verificano il
POS e raccolgono lo stato della comunicazione in vetrina. Registrano tutto da **`/rilevazioni`**,
un'area non linkata da nessuna parte del sito, esclusa dalla sitemap, con `noindex` e protetta da
un codice condiviso (`RILEVAZIONI_CODE`).

⚠️ Se la variabile è vuota l'area è **aperta a chiunque conosca l'indirizzo**: comodo in locale,
da impostare prima del go-live. Un URL nascosto smette di esserlo appena finisce in una cronologia.

### Le domande stanno in un file solo

`lib/survey.js` contiene sezioni, domande, esiti e slot fotografici. Aggiungere o riordinare una
domanda non richiede di toccare il modulo, la validazione o l'esportazione: si ridisegnano da lì.

| Tipo | Risposta |
|---|---|
| `yesno` · `yesnona` | sì / no, con «non applicabile» opzionale |
| `single` · `multi` | una o più opzioni da un elenco |
| `scale` | valutazione 1–5 |
| `number` · `text` | numero intero, testo libero (max 1000 caratteri) |

`showIf` mostra una domanda solo se un'altra ha un certo valore (`value`, `not`, `min`), così il
modulo resta corto: se il POS non c'è, le tre domande sul POS non compaiono — e la validazione
non le pretende, perché il rilevatore non le ha nemmeno viste.

L'`id` di una domanda è la chiave con cui la risposta viene salvata e la colonna del CSV: una
volta raccolte le prime rilevazioni non va più cambiato, altrimenti le vecchie risposte restano
orfane. Un test verifica che gli id siano unici, che le domande a scelta abbiano le opzioni e che
ogni `showIf` punti a una domanda esistente.

### Il modulo

Pensato per un telefono tenuto in una mano dentro un negozio: una sezione per schermata, risposte
a bottoni grandi invece che menu a tendina, barra dei comandi fissa in basso dove stanno i pollici.

La **bozza è salvata nel telefono** a ogni tocco: una chiamata in arrivo o la rete che cade nel
retrobottega non cancellano mezz'ora di lavoro. Il nome del rilevatore resta memorizzato tra un
negozio e l'altro. Le foto restano fuori dalla bozza — troppo pesanti per `localStorage` e si
riscattano in un attimo.

Scelto il negozio, la scheda mostra **i dati della mappa** (indirizzo, asset accettati, telefono) da
verificare sul posto e **le visite precedenti**, così non si rifà un giro già fatto dal collega. Un
negozio fuori elenco si aggiunge scrivendone il nome e viene marcato per l'inserimento.

Tre foto, **nessuna obbligatoria**: vetrina prima di entrare, POS con il QR, ricevuta della
transazione di prova. Decide il rilevatore in base a cosa ha senso in quel negozio.

### Chi dice no esce dall'elenco

L'esito della visita è il campo su cui si filtra. `Non aderisce` e `Chiuso o non trovato` marcano
il record come escludente; `npm run visits exclude` raccoglie **l'ultima** rilevazione di ogni
negozio e rigenera `lib/merchants.overrides.json`, che `lib/merchants.js` sottrae dall'elenco
pubblico. Vale l'ultima visita, quindi chi prima rifiuta e poi ci ripensa rientra da solo.

Lo snapshot non viene toccato: l'esclusione è reversibile e si vede nel diff di git perché è stata
fatta. `MERCHANTS` è l'elenco pubblico, `ALL_MERCHANTS` quello completo — l'area rilevazioni cerca
nel secondo, altrimenti un negozio escluso non si potrebbe più visitare.

```bash
npm run visits stats                     # esiti, rilevatori, medie delle valutazioni
npm run visits list --outcome rifiuta
npm run visits show RV-2026-AB12CD
npm run visits export > rilevazioni.csv  # una riga per visita, una colonna per domanda
npm run visits exclude -- --yes          # aggiorna gli esclusi dall'elenco pubblico
```

`stats` segnala le rilevazioni senza foto e i negozi non presenti nello snapshot.

Senza Shell: **`/rilevazioni/admin`** è il pannello di tutte le rilevazioni — stato dei negozi
(contando l'ultima visita), ritorni in agenda, POS da sistemare, richieste per l'assistenza, elenco
filtrabile con la scheda completa e le foto. Da lì si scaricano **CSV** e **backup JSON**.
Pannello, foto ed esportazioni sono riservati ai nomi elencati in `RILEVAZIONI_ADMIN` (gli stessi
di `RILEVAZIONI_OPERATORI`, con il loro PIN). Le foto restano sul disco, coperte dagli snapshot
giornalieri di Render.

### Dati

`.data/rilevazioni.json` per le rilevazioni, `.data/rilevazioni/<anno>/<id>-<slot>.<ext>` per le foto, fuori
dalla cartella pubblica come gli scontrini. Lo stesso negozio può essere visitato più volte: non
c'è unicità da garantire, lo storico è il dato utile.

## Estrazione verificabile

**È automatica.** In produzione il server stesso (`lib/server/draw-scheduler.js`, avviato da
`instrumentation.js`) controlla ogni minuto e fa i passi da solo: impegno dopo la chiusura, copia
su archive.org, estrazione appena il seme è definitivo, copia del risultato. Stato su
`/api/health` (`draw.phase`), dettagli nei log del servizio con il prefisso `[estrazione]`.
`DRAW_AUTOMATIC=off` lo spegne; in locale e in demo è spento. I comandi qui sotto restano per
controllare, intervenire se l'automatismo si ferma, verificare ed escludere un vincitore:

```bash
npm run draw commit                          # entro le 16:30: elenchi + impronte + blocco-seme
npm run draw status                          # quanti blocchi mancano
npm run draw run                             # dalle 17:00, quando il seme ha un blocco sopra
npm run draw disqualify <ID> -- --reason "…" # vincitore non verificato: entra la riserva
npm run draw verify                          # ricalcola tutto e rilegge il blocco online
```

L'ordine è la garanzia: **prima** si impegnano gli elenchi, **poi** nasce il seme. Il seme non è
«il primo blocco dopo la chiusura» — quello arriverebbe mentre l'elenco si prepara, e chi lo
prepara lo conoscerebbe già — ma il blocco che sarà minato **6 posizioni dopo** la cima della
catena al momento dell'impegno. Parametri in `DRAW` (`lib/constants.js`).

| Quando (24 ottobre) | Cosa |
|---|---|
| 16:00 | chiusura delle registrazioni |
| entro 16:30 | `commit`: elenchi, impronte SHA-256, cima della catena e altezza del blocco-seme, subito su /vincitori e da ripubblicare su LinkedIn |
| ~1 ora dopo | la rete mina il blocco-seme (6 blocchi: nel 95% dei casi meno di 1 h 45) |
| +1 blocco | il seme è definitivo: `run`, mai prima delle 17:00 |
| di norma 17:00–19:00 | finestra annunciata nel regolamento (art. 7) |

- Negli elenchi entrano **tutte** le giocate registrate in tempo e non respinte, anche se ancora in
  verifica: così l'impegno non aspetta ore di riscontri. La verifica completa si fa su chi vince;
  chi non la supera viene escluso con `disqualify`, con una motivazione pubblica, e il premio passa
  alla prima riserva dell'ordine già pubblicato. Nessun nuovo sorteggio, nessuna scelta.
- `commit` rifiuta di sovrascrivere un impegno esistente; `run` rifiuta di partire prima delle
  17:00 o prima che sopra il seme ci sia un altro blocco. `--force` esiste solo per le prove.
- Cima della catena e hash del blocco si leggono da **due esploratori** (mempool.space e
  blockstream.info) e devono coincidere.
- Biglietto: `sha256("<seme>:<users|spritz|merchants>:<ID>")`, ordine crescente; seguono 10 riserve.
- I file pubblici (`commitment.json`, elenchi, `result.json`) si scaricano da `/api/draw/<file>`:
  contengono solo ID, nessun dato personale. Subito dopo l'impegno ne viene depositata una copia
  su **archive.org**, che ne certifica data e ora: è la prova, indipendente da noi, che gli elenchi
  esistevano prima del blocco-seme. Se l'archivio non risponde si riprova, senza fermare l'estrazione.
- **Un premio per giocata.** Si estrae prima il generale dei clienti; nello Spritz si saltano gli
  ID che hanno già vinto lì. Se un'esclusione promuove nel generale una giocata che aveva vinto lo
  Spritz, lo Spritz passa da solo alla successiva del suo elenco.
- **Satoshi Spritz**: entrano le giocate fatte nei locali della piazza (`SATOSHI_SPRITZ.venues`, o
  tutti i negozi all'indirizzo della serata finché l'elenco non c'è) pagate durante la serata. Conta
  l'ora del POS, non quella di registrazione: si registra fino alla chiusura del concorso. L'ora si
  salva con `npm run entries paid <ID> -- --at "2026-10-22 19:30"` (ora di Lugano). Se all'impegno
  manca ancora, la giocata entra purché registrata dopo l'inizio della serata; se vince e il POS dice
  fuori orario: `npm run draw disqualify <ID> -- --only spritz --reason "…"`, e resta nel generale.

Top Numero di Transazioni (classifica sul numero di pagamenti registrati dal POS) e Best Social Content (giuria) non passano dal sorteggio.

## Note legali
Il testo del regolamento in `components/RulesModal.jsx` è una bozza operativa completa
(eleggibilità, verifica transazioni, estrazione, LPD/GDPR, manleva, foro di Lugano):
va validato dal consulente legale prima della pubblicazione.

## Infrastruttura pagina

`app/icon.svg`, `app/opengraph-image.jsx` (anteprima 1200×630 generata a build time, nessun asset
esterno), `app/robots.js`, `app/sitemap.js`, `app/not-found.jsx` e `app/error.jsx` a tema.
`metadataBase` e canonical leggono `NEXT_PUBLIC_SITE_URL`.

## Accessibilità & responsive
Mobile-first, breakpoint sm/md/lg/xl, menu mobile, modali con ESC + focus trap + scroll lock,
`aria-*` sui controlli interattivi, focus ring dorato visibile, supporto `prefers-reduced-motion`,
skip-link, contatore risultati con `aria-live`, schede merchant selezionabili anche da tastiera.
Contrasti verificati: testo secondario ≥ 5,1:1, oro su fondo scuro 13,6:1 (WCAG AA superato).

## Cosa resta aperto

- **Verifica merchant**: i badge distinguono "Circuito NAKA" (dato della mappa cittadina) da
  "POS NAKA Attivo" (`verified: true`, adesione confermata da NAKA). Oggi nessun record è verificato.
- **XAUT come metodo di pagamento**: i testi lo citano (`PAYMENT_ASSETS` in `lib/constants.js`), ma
  nei dati della mappa nessun merchant lo accetta. Da confermare con NAKA: è una riga sola da cambiare.
- **Versione inglese**: il pubblico del forum è internazionale. Richiede scelta dello stack i18n e
  traduzione legale asseverata del regolamento.
