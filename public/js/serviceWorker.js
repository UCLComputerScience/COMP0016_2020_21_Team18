const graceChatbot = "grace-chatbot-v1";

const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/css/icons/iconfinder_send_1608828.svg",
  "/css/icons/send-btn.svg",
  "/css/icons/send-btn-icon.png",
  "/css/background_image/double-bubble-outline.png",
  "/js/main.js",
  "/js/audio.js",
  "/js/searchbar.js",
  "/js/serviceWorker.js",
  "/utils/messages.js",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(graceChatbot).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
