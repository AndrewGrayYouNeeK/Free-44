/* ══════════════════════════════════════
   Free44 – Service Worker
   ══════════════════════════════════════ */

var CACHE_NAME = 'free44-v1';

var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/progress.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/css/variables.css',
  '/css/base.css',
  '/css/animations.css',
  '/css/header.css',
  '/css/panels.css',
  '/css/components.css',
  '/css/editor.css',
  '/css/history.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/templates.js',
  '/js/api.js',
  '/js/editor.js',
  '/js/history.js',
  '/js/export.js',
  '/js/theme.js',
  '/js/shortcuts.js',
  '/js/ui.js'
];

/* Install: cache static assets */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* Activate: clean old caches */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

/* Fetch: cache-first for static assets, network-first for navigation */
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  /* Skip API calls */
  if (url.hostname !== self.location.hostname) return;

  /* Network-first for HTML navigation */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(function () {
        return caches.match(e.request);
      })
    );
    return;
  }

  /* Cache-first for static assets */
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, clone);
        });
        return response;
      });
    })
  );
});
