// =============================================================
//  sw.js — Service worker de la App Transector
//  Es el "ayudante de guardia": guarda una copia de la app en el
//  celular para que abra aunque no haya internet, y guarda los
//  pedacitos del mapa (teselas) que ya se vieron.
// =============================================================

// Cada vez que cambies cualquier archivo de la app, sube este número
// (v1 → v2 → v3...). Así los celulares saben que hay versión nueva.
const VERSION = 'transector-v1';
const TESELAS = 'transector-teselas';   // caché aparte para el mapa (no se borra al cambiar de versión)
const MAX_TESELAS = 2500;               // unas 2 500 teselas ≈ 40-60 MB como máximo

// Archivos que se guardan en el celular
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './leaflet/leaflet.js',
  './leaflet/leaflet.css',
  './leaflet/images/layers.png',
  './leaflet/images/layers-2x.png',
  './leaflet/images/marker-icon.png',
  './leaflet/images/marker-icon-2x.png',
  './leaflet/images/marker-shadow.png'
];

// 1) Instalación: se descarga y guarda la copia
self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(ARCHIVOS)));
  self.skipWaiting(); // activar la versión nueva sin esperar
});

// 2) Activación: se borran las copias de versiones anteriores (menos la de teselas)
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== VERSION && n !== TESELAS).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// 3) Cada vez que la app pide algo:
self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return;   // los POST a Transector Central pasan directo
  const url = new URL(evento.request.url);

  // a) Teselas del mapa (OpenStreetMap): primero la copia guardada, si no, internet.
  //    Así el mapa de una zona que ya se vio se puede ver sin señal.
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    evento.respondWith(
      caches.open(TESELAS).then((cache) =>
        cache.match(evento.request).then((guardada) => guardada || fetch(evento.request).then((resp) => {
          cache.put(evento.request, resp.clone()).then(() => recortarTeselas(cache));
          return resp;
        }))
      )
    );
    return;
  }

  // b) Archivos de la propia app: primero internet (para tener lo más nuevo);
  //    si no hay señal, la copia guardada.
  if (url.origin !== self.location.origin) return;
  evento.respondWith(
    fetch(evento.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(VERSION).then((cache) => cache.put(evento.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(evento.request).then((r) => r || caches.match('./index.html')))
  );
});

// Si hay demasiadas teselas guardadas, borra las más viejas (las primeras que entraron).
let recortando = false;
function recortarTeselas(cache) {
  if (recortando) return;
  recortando = true;
  cache.keys().then((claves) => {
    const sobran = claves.length - MAX_TESELAS;
    return Promise.all(claves.slice(0, Math.max(0, sobran + 200 * (sobran > 0))).map((k) => cache.delete(k)));
  }).finally(() => { recortando = false; });
}
