# SIGRA FILM — Support Tool

Dashboard NOC per il monitoraggio dei dispositivi di proiezione (server, proiettori,
processori audio, router MikroTik, TMS) dei cinema del circuito.

**Sito live:** <https://roccotot.github.io/Support-Tool/>

È una **single-page app senza build e senza backend**: viene pubblicata con
GitHub Pages, ma funziona anche aprendo `index.html` direttamente nel browser.
Le uniche dipendenze (Leaflet per la mappa, ExcelJS per l'export) sono caricate
da CDN.

## Funzionalità

- **Vista Cinema** — card per cinema raggruppate per città, con stato ping di ogni
  dispositivo, copia IP e link rapidi WEB / SSH / VNC / TMS.
- **Vista Mappa** — mappa Leaflet con marker per cinema e stato aggregato
  (verde = tutto online, arancione = parziale, rosso = solo router online).
- **Vista Per tipo** — dispositivi raggruppati per categoria e modello, ordinati
  per anno di uscita.
- Filtri: VPN / Offline (rete locale) / Estivi / Al chiuso / Tutti.
- Ricerca per cinema, città, sala, dispositivo o IP.
- Export CSV (con stato ping) ed Excel.

## Come funziona il "ping"

Il browser non può fare ICMP: lo stato viene dedotto da una richiesta
`fetch` HTTP in modalità `no-cors` verso l'IP del dispositivo (timeout 3 s).
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

L'inventario è inline in `index.html`, nei tre template literal `RAW` (cinema in
VPN), `RAW_NOVPN` (cinema con sola rete locale) e `RAW_ESTIVI` (arene estive).
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
console del browser.

## Script

- `genera_dispositivi.py` — estrae i tre blocchi dati da `index.html` e genera
  `dispositivi_mancanti.xlsx` (stesso contenuto del bottone "Scarica Excel"
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
