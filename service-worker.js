const CACHE='eden-radio-v2';
const ASSETS=['./','index.html','style.css','script.js','manifest.json','assets/logo.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
