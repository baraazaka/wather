const CACHE_NAME = 'vite-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/wather/',
  '/wather/index.html',
  '/wather/manifest.json',
  '/wather/icons/icon-192x192.png',
  '/wather/icons/icon-512x512.png'
];


// عند التثبيت: نخزن الملفات المحددة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// عند التفعيل: نحذف أي كاش قديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// عند الطلب: نحاول نجيب من الكاش، وإذا مش موجود من النت
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
