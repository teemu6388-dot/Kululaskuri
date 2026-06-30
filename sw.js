const CACHE_NAME = 'kululaskuri-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'activityCounter.js',
  'carCounter.js',
  'manifest.json'
];

// Asennus: Tallennetaan tiedostot välimuistiin
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivointi: Siivotaan vanhat välimuistit
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Verkkopyynnöt: Haetaan ensin välimuistista, jotta toimii offline-tilassa
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});