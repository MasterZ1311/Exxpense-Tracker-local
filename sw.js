importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log(`[PWA] Workbox is loaded 🎉`);

  // Cache HTML, CSS, JS using StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document' || 
                     request.destination === 'style' || 
                     request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'fintrack-assets-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache images using CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'fintrack-images-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Fallback for everything else
  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst()
  );

} else {
  console.warn(`[PWA] Workbox didn't load 😬`);
  
  // Basic fallback if Workbox fails to load
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
}

// Precache base files on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('fintrack-assets-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== 'fintrack-assets-v1' && key !== 'fintrack-images-v1')
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});
