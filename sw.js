const CACHE = "gc-poudre-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./calculateur.html",
  "./styles.css",
  "./script.js",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.webmanifest"
];

// Install: pré-cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: nettoyage anciens caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Fetch: stratégie réseau d’abord, sinon cache
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).then(resp => {
      // Optionnel: mettre en cache les nouvelles réponses
      const copy = resp.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy));
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
