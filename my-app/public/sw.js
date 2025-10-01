 const CACHE_NAME = "pwa-cache-v1";
const OFFLINE_URL = "/index.html";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/vite.svg"
];

// 1️⃣ Install event: cache offline resources
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn("Failed to cache:", url, err);
        }
      }
    })()
  );
  self.skipWaiting();
});

// 2️⃣ Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3️⃣ Fetch event: offline fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // SPA / navigation fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// 4️⃣ Push notifications
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) data = event.data.json();

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/logo192.png",
    badge: data.badge || "/logo192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 5️⃣ Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(event.notification.data.url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
