# SIGRA FILM — Support Tool

Dashboard NOC per il monitoraggio dei dispositivi di proiezione (server, proiettori,
processori audio, router MikroTik, TMS) dei cinema del circuito.

**Sito live:** <https://roccotot.github.io/Support-Tool/>

**Mappa pubblica per i clienti:** <https://roccotot.github.io/Support-Tool/mappa.html> —
mostra solo nomi, città e numero di sale dei cinema (niente IP né dati tecnici).
Legge lo stesso `dati.js` della dashboard, quindi si aggiorna da sola quando
l'inventario cambia.

È una **single-page app senza build e senza backend**: viene pubblicata con
GitHub Pages, ma funziona anche aprendo `index.html` direttamente nel browser.
Le librerie (Leaflet + markercluster per la mappa, ExcelJS per l'export) stanno
in `vendor/`: nessuna dipendenza da CDN esterni, quindi l'app funziona anche
senza internet. ExcelJS (~900 KB) viene caricato solo al primo click su
"Scarica Excel".

## Funzionalità

- **Vista Cinema** — card per cinema raggruppate per città, con stato ping di ogni
  dispositivo, copia IP e link rapidi WEB / SSH / VNC / TMS.
- **Vista Mappa** — mappa Leaflet con marker per cinema e stato aggregato
  (verde = tutto online, arancione = parziale, rosso = solo router online).
- **Vista Per tipo** — dispositivi raggruppati per categoria e modello, ordinati
  per anno di uscita.
- Filtri: VPN / Offline (rete locale) / Estivi / Al chiuso / Tutti.
- Ricerca per cinema, città, sala, dispositivo o IP: `/` o `Ctrl/Cmd+K` per
  andarci, `Esc` per svuotarla.
- **Stato ricordato**: vista, filtri, ricerca e card chiuse si ritrovano al
  reload, e l'hash dell'URL è condivisibile
  (`…/index.html#view=cinema&f=offline&q=flora` apre esattamente quello).
- Export CSV ed Excel: stesse colonne (Cinema, Città, Rete, Sala, Dispositivo,
  IP, Stato) e ciascuno esporta il filtro della propria vista.

## Come funziona il "ping"

Il browser non può fare ICMP: lo stato viene dedotto da una richiesta
`fetch` HTTP in modalità `no-cors` verso l'IP del dispositivo (timeout 3 s).
Il tempo di risposta viene misurato e mostrato nel tooltip del pallino.
Lo stato è tenuto **per cinema + IP**, non per IP: le reti locali dei cinema
offline riusano gli stessi indirizzi (192.168.1.10 compare in decine di
cinema) e un solo ping non deve colorare i pallini di tutti gli altri.
Il giro automatico gira ogni 5 minuti ma **si sospende quando la scheda non è
in primo piano**, e recupera al ritorno.

Limiti noti:

- un dispositivo **senza web server** (es. alcuni processori audio) può risultare
  "non risponde" anche se è acceso;
- il sito su GitHub Pages è in **HTTPS**, quindi il browser blocca di default le
  richieste `http://` verso gli IP privati (mixed content) e tutti i dispositivi
  risultano offline. Per usare i ping da
  <https://roccotot.github.io/Support-Tool/> bisogna consentire i contenuti non
  sicuri per il sito: in Chrome/Edge, lucchetto nella barra dell'indirizzo →
  **Impostazioni sito** → **Contenuti non sicuri** → **Consenti** (e ricaricare).
  Se dopo il primo giro di ping automatico nessun dispositivo risponde, l'app
  mostra un avviso con questa indicazione. In alternativa i ping funzionano
  sempre aprendo `index.html` in locale;
- serve comunque essere **connessi alla VPN** per raggiungere gli IP `10.x.x.x`;
- i cinema "Offline" usano reti locali `192.168.x.x` non raggiungibili dalla
  VPN, quindi non vengono pingati automaticamente.

## Dati

L'inventario sta in **`dati.js`**, unica sorgente condivisa da `index.html` e
`mappa.html`, in `SIGRA_RAW`: `vpn` (cinema in VPN), `offline` (cinema con sola
rete locale) e `estivi` (arene estive).
Una riga per dispositivo, separata da TAB:

```
NomeCinema - Città - Sala - Dispositivo<TAB>IP:porta<TAB>PROTOCOLLO
```

Ogni cinema ha anche una riga coordinate per la mappa:

```
NomeCinema - Città - Coord<TAB>lat,lng<TAB>GEO
```

Per aggiungere un cinema: aggiungere il blocco di righe nel template giusto
(coordinate comprese). Le righe malformate vengono ignorate con un warning in
console del browser. Un cinema che passa dalla rete locale alla VPN va
**spostato**, non copiato: se resta in entrambi i blocchi compare due volte
nella vista "Tutti".

Le coordinate di fallback per città stanno in `SIGRA_COORDS`, sempre in
`dati.js`.

## Script

- `genera_dispositivi.py` — estrae i tre blocchi dati da `dati.js` e genera
  `dispositivi_mancanti.xlsx` (stesse righe del bottone "Scarica Excel"
  dell'app). Richiede `openpyxl`:

  ```bash
  pip install openpyxl
  python3 genera_dispositivi.py
  ```

- `scarica_immagini.py` — scarica in `img/` le foto dei modelli (oggi
  hotlinkate da siti esterni in `MODEL_IMG`) e aggiorna `index.html` con i
  percorsi locali, così le immagini non spariscono se i siti le rimuovono.
  Solo libreria standard, da eseguire una volta da un PC con internet:

  ```bash
  python3 scarica_immagini.py
  # poi committare img/ e index.html
  ```

  È idempotente: si può rilanciare per riprovare solo i download falliti.
  Finché un'immagine resta remota e il link muore, viene semplicemente
  nascosta (`onerror`).

I file `.xlsx` generati non vanno committati (sono in `.gitignore`).
