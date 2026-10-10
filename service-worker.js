const CACHE_NAME = "ecoplay-pwa-v1";
const APP_SHELL = [
    "./",
    "./index.html",
    "./ecoplay.html",
    "./manifest.json",
    "./service-worker.js"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(APP_SHELL);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function(cacheName) {
                        return cacheName.indexOf("ecoplay-") === 0 &&
                            cacheName !== CACHE_NAME;
                    })
                    .map(function(cacheName) {
                        return caches.delete(cacheName);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).then(function(response) {
                const responseCopy = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseCopy);
                });
                return response;
            }).catch(function() {
                return caches.match(event.request).then(function(response) {
                    return response || caches.match("./index.html");
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
