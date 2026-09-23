# Paga in Crypto e Vinci Oro Digitale — NAKA × Plan ₿ Forum 2026 Lugano

Landing page / web app del concorso NAKA: paga in crypto su POS NAKA a Lugano e partecipa
all'estrazione di premi in Tether Gold (XAUT).

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

Il numero di transazione è validato in modo permissivo (≥6 caratteri alfanumerici): sul POS può
essere un hash, una invoice Lightning o il riferimento stampato sulla ricevuta. `txKind` etichetta
automaticamente il tipo (`blockchain` / `lightning` / `ricevuta`) per il triage a valle; l'autenticità
la stabilisce il riscontro sul backend NAKA, non il regex.

**L'indirizzo wallet non è più chiesto in fase di giocata**: viene richiesto via email ai soli
vincitori. Regolamento (art. 4, 7, 8) e FAQ sono allineati a questo flusso.

## Import merchant dalla Crypto Map di Lugano

```bash
npm run import:merchants
```

`scripts/import-merchants.mjs` interroga l'endpoint pubblico usato dalla mappa ufficiale
(`POST https://planb.lugano.ch/wp-json/bfx-crypto-map/v1/merchants?env=production`, la stessa
incorporata in `my.lugano.ch/pagare-in-lvga-lugano`), filtra il comprensorio di Lugano, scarta chi
accetta solo LVGA, mappa la tassonomia sulle 4 categorie del concorso (`UST` → `USDT`) e scrive lo
snapshot statico `lib/merchants.data.json`.

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
| API | finestra temporale: fuori dal periodo di gara (+24h di tolleranza) si risponde 403 |
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

## Estrazione verificabile

```bash
npm run draw commit                 # impegna l'elenco delle giocate validate
npm run draw -- run --seed <hash>   # estrae usando l'hash del blocco Bitcoin annunciato
npm run draw verify                 # ricalcola e conferma il risultato
```

Estrae solo i premi con `assignment: 'draw'` (clienti + estrazione riservata merchant): Top Volume
è una classifica sui volumi POS e Best Social Video è deciso dalla giuria, quindi restano fuori.
I merchant hanno **un biglietto ciascuno**, non uno per transazione: è un'estrazione tra pari.
I due sorteggi sono separati crittograficamente (`sha256("<seme>:<categoria>:<id>")`).

Tre fasi: **commit** dell'elenco (SHA-256 degli ID ordinati, pubblicato prima che il seme esista),
**seme** pubblico e imprevedibile (hash di un blocco Bitcoin a un'altezza annunciata in anticipo),
**estrazione** deterministica — il vincitore è chi ha il valore `sha256("<seme>:<ID giocata>")` più
basso. `run` rifiuta di procedere se l'elenco non combacia con il commit.

Si pubblicano `commitment.json`, `participants.txt` (soli ID, nessun dato personale) e `result.json`:
chiunque rifà il calcolo e ottiene gli stessi vincitori. Coperto da 6 test, incluso un controllo di
distribuzione su 200 semi.

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
