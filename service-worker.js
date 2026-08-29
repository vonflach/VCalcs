const CACHE_NAME = "vcalcs-v2.0.1"; // Lembre-se de incrementar quando fizer alterações grandes

const ARQUIVOS = [
  "/VCalcs/",
  "/VCalcs/index.html",
  "/VCalcs/style.css",
  "/VCalcs/app.js",
  "/VCalcs/accordion.js",
  "/VCalcs/feedback.js",
  "/VCalcs/registro.js",
  "/VCalcs/registro-utilitarios.js",
  "/VCalcs/assets/img/logo.svg",
  "/VCalcs/assets/icons/github-142-svgrepo-com.svg",
  "/VCalcs/assets/icons/info.svg",
  "/VCalcs/assets/icons/magnifier.svg",
  "/VCalcs/assets/icons/math.svg",
  "/VCalcs/assets/icons/wrench.svg",
  "/VCalcs/calculadoras/albca/index.html",
  "/VCalcs/calculadoras/dpp/index.html",
  "/VCalcs/calculadoras/fena/index.html",
  "/VCalcs/calculadoras/fib/index.html",
  "/VCalcs/calculadoras/hvhs/index.html",
  "/VCalcs/calculadoras/infusao/index.html",
  "/VCalcs/calculadoras/ldl/index.html",
  "/VCalcs/calculadoras/osm/index.html",
  "/VCalcs/calculadoras/pam/index.html",
  "/VCalcs/calculadoras/rac/index.html",
  "/VCalcs/calculadoras/ret/index.html",
  "/VCalcs/calculadoras/sodio-glicose/index.html",
  "/VCalcs/calculadoras/tfg/index.html",
  "/VCalcs/calculadoras/tvp/index.html",
  "/VCalcs/utilitarios/hip/index.html",
  "/VCalcs/utilitarios/meq/index.html",
];

// Instalação resiliente (não quebra se 1 arquivo falhar)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ARQUIVOS.map((url) =>
          cache
            .add(url)
            .catch((err) => console.warn(`Falha ao cachear: ${url}`, err)),
        ),
      );
    }),
  );
  self.skipWaiting();
});

// Ativação — limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// Fetch — Stale-While-Revalidate para garantir atualizações
self.addEventListener("fetch", (event) => {
  // Ignora requisições de extensões ou KaTeX CDN para não poluir o cache local
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    }),
  );
});
