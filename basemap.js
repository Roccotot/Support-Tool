/* ──────────────────────────────────────────────────────────────────────────
   Sfondo cartografico della mappa, condiviso da index.html e mappa.html.

   I basemap CARTO (basemaps.cartocdn.com/dark_all) richiedono ormai una API
   key: senza chiave rispondono comunque 200, ma il tile contiene la scritta
   "API key required" — nessun errore in console, solo la mappa illeggibile.
   Quindi non si usano più.

   Si parte da Esri Dark Gray Canvas (niente chiave, serve l'attribuzione) e,
   se i tile non arrivano, si passa da soli a OpenStreetMap scurito via CSS,
   così la mappa resta utilizzabile qualunque cosa succeda al provider.
   ────────────────────────────────────────────────────────────────────────── */

const SIGRA_BASEMAPS = [
  {
    nome: 'Esri Dark Gray Canvas',
    url:  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    opts: {
      maxNativeZoom: 16,   // oltre il 16 Leaflet ingrandisce l'ultimo livello
      maxZoom: 19,
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    },
  },
  {
    nome: 'OpenStreetMap',
    url:  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: {
      maxZoom: 19,
      className: 'tiles-dark',   // filtro CSS che lo rende scuro
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
];

// Aggiunge il primo sfondo disponibile alla mappa. Se i tile non arrivano
// (rete bloccata, provider giù) passa al successivo dell'elenco, una volta
// sola per sorgente.
function addBasemap(map) {
  let i = 0;
  const add = () => {
    const src   = SIGRA_BASEMAPS[i];
    const layer = L.tileLayer(src.url, src.opts).addTo(map);
    let errori  = 0;
    layer.on('tileerror', () => {
      // Qualche tile mancante capita sempre: si cambia solo se ne saltano
      // parecchi e c'è un'alternativa da provare.
      if (++errori < 4 || i >= SIGRA_BASEMAPS.length - 1) return;
      map.removeLayer(layer);
      i++;
      add();
    });
  };
  add();
}
