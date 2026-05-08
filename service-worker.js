const CACHE = 'safe-hub-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Nunca cacheia o CSV do Sheets nem o HTML principal
  if (
    e.request.url.includes('docs.google.com') ||
    e.request.url.includes('script.google.com') ||
    e.request.mode === 'navigate'
  ) {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});