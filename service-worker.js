const CACHE = 'eden-radio-v4';
const FILES = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'favicon.png',
  'assets/logo.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/share-card.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
