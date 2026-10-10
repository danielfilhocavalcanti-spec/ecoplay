const CACHE_NAME = "educa-mais-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./diversao.html",
  "./saude.html",
  "./meio_ambiente.html",
  "./ecoplay.html",
  "./bioaventura.html",
  "./aventura_da_aventura.html",
  "./style.css",
  "./pwa.js",
  "./manifest.json",
  "./imagens/icone-192.png",
  "./imagens/icone-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache files individually so one missing optional file does not cancel installation.
    await Promise.all(APP_SHELL.map(async path => {
      try { await cache.add(path); } catch (error) { console.warn("Não foi possível armazenar:", path); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === "navigate") {
        return (await caches.match("./index.html")) || Response.error();
      }
      return Response.error();
    }
  })());
});
