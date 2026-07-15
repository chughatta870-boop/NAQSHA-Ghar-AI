const CACHE_NAME = 'naqsha-ghar-ai-v2'; // ورژن اپڈیٹ کر دیا
const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/notonastaliqurdu/v48/...' // فونٹ بھی cache
];

// 1. INSTALL - سب فائلیں Cache کریں
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
     .then(cache => {
       console.log('NAQSHA Cache Opened');
       return cache.addAll(URLS_TO_CACHE);
     })
  );
});

// 2. FETCH - پہلے Cache دیکھو، نہ ملے تو Network, وہ بھی نہ ملے تو index.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
     .then(response => {
       return response || fetch(event.request).catch(() => {
         // اگر نیٹ نہیں اور صفحہ مانگ رہا ہے
         if (event.request.mode === 'navigate') {
           return caches.match('./index.html');
         }
       });
     })
  );
});

// 3. ACTIVATE - پرانا cache ڈیلیٹ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
