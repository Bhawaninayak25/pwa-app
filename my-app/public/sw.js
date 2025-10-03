
// sw.js - Robust Vite + PWA Service Worker
const CACHE_NAME = "pwa-cache-v2";
const OFFLINE_URL = "/index.html";

// Assets to cache
const urlsToCache = [
  "/",                     // root page
  "/index.html",           // offline fallback
  "/manifest.json",        // manifest
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/app.js",
];

// 1️⃣ Install: cache essential assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 2️⃣ Activate: remove old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3️⃣ Fetch: safe cache-first + network with offline fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore dev-only Vite URLs
  if (request.url.includes("/@vite/") || request.url.endsWith(".jsx")) {
    return; // skip caching
  }

  // Handle navigation requests (SPA)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Other requests: cache first, then network, then fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Optionally cache dynamically fetched files
          if (response && response.status === 200 && response.type === "basic") {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch((err) => {
          console.warn("Fetch failed, returning fallback:", request.url, err);
          // Fallback for HTML pages
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
          // For other assets, return a 503 Response
          return new Response("Resource unavailable", { status: 503, statusText: "Service Unavailable" });
        });
    })
  );
});

// 4️⃣ Push notifications
self.addEventListener("push", (event) => {
  let data = event.data ? event.data.json() : {};
  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/icon-192x192.png",
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 5️⃣ Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if ("focus" in client) {
          client.navigate(event.notification.data.url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
// service-worker.js

 
// Install event: caching app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


