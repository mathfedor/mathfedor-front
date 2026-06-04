/* Service worker del libro "Matemáticas de Fedor 2°".
   Estrategia network-first con respaldo en caché: si hay red, siempre usa la
   respuesta fresca (nunca sirve contenido obsoleto); offline, cae a la caché. */
const CACHE = 'fedor2-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || Promise.reject(new Error('offline'))))
  );
});
