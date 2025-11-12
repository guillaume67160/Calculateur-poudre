// GC Epox-Design — Service Worker
const CACHE_VERSION = 'gc-poudre-v1';
const STATIC_CACHE  = `static-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './calculateur.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './04331F25-6EC7-4A53-AA4A-A03E86CD5B80.png'
];

// Install : pré-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(ASSETS)));
});

// Activate : nettoie anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch : HTML réseau d'abord, autres cache d'abord
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isHTML = req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req).then(res => {
        caches.open(STATIC_CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then(r => r || fetch(req).then(net => {
        caches.open(STATIC_CACHE).then(c => c.put(req, net.clone()));
        return net;
      }))
    );
  }
});
