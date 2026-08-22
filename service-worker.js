const CACHE_NAME = 'caderno-especial-ftc-v12';
const CORE_FILES = [
  './',
  './index.html',
  './v2.css',
  './app-v2.js',
  './firebase-config.js',
  './manifest.webmanifest',
  './assets/icon.png'
];

const FLAG_CODES = `af al de ad ao ag sa dz ar am au at az bs bh bd bb by be bz bj bo ba bw br bn bg bf bi bt cv cm kh ca qa kz td cl cn cy co km cg cd kp kr ci cr hr cu dk dj dm eg sv ae ec er sk si es us ee sz et fj ph fi fr ga gm gh ge gd gr gt gy gn gw gq ht hn hu ye mh sb in id ir iq ie is il it jm jp jo ki kw la ls lv lb lr ly li lt lu mk mg my mw mv ml mt ma mu mr mx fm md mc mn me mz mm na nr np ni ne ng no nz om nl pw pa pg pk py pe pl pt ke kg gb cf cz do ro rw ru ws kn sm vc lc st sn rs sc sl sg sy so lk za sd ss se ch sr tj th tl tg to tt tn tm tr tv ua ug uy uz vu va ve vn zm zw`.split(' ');
const STICKER_GROUPS = [
  ['emocoes', 10], ['terapia', 10], ['psicologia', 10], ['natureza', 10],
  ['exterior', 10], ['organizacao', 5], ['acolhimento', 5]
];
const OFFLINE_ASSETS = [
  ...Array.from({ length: 34 }, (_, index) => `./assets/capas-espiral/capa-${String(index + 1).padStart(2, '0')}.webp`),
  ...STICKER_GROUPS.flatMap(([group, total]) => Array.from({ length: total }, (_, index) => `./assets/stickers/${group}-${String(index + 1).padStart(2, '0')}.webp`)),
  ...FLAG_CODES.map(code => `./assets/flags/${code}.webp`)
].filter(path => path !== './assets/stickers/organizacao-04.webp');

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_FILES);
    for (let index = 0; index < OFFLINE_ASSETS.length; index += 24) {
      const group = OFFLINE_ASSETS.slice(index, index + 24);
      await Promise.all(group.map(path => cache.add(path)));
    }
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
