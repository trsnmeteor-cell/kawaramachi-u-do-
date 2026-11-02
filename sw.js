/* =========================================================
   河原町 誘導ログ — Service Worker
   VERSION を上げると各端末に更新が配信される
   ========================================================= */
const VERSION = '2.0.1';
const CACHE = 'kwrm-v' + VERSION;

/* 事前キャッシュ（オフラインでも起動できるようにする核） */
const PRECACHE = [
  './',
  './index.html',
  './config.js',
  './qrdata.js',
  './ticket.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

/* 常にネットワークから取得するもの（設定値・バージョン確認） */
const NETWORK_ONLY = ['config.js', 'version.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(
        PRECACHE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // 外部（GAS等）はそのまま

  // 設定値とバージョン情報はキャッシュを使わない
  if (NETWORK_ONLY.some((f) => url.pathname.endsWith(f))) {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(() => caches.match(req)));
    return;
  }

  // 画面遷移はネットワーク優先（落ちたときだけキャッシュ）
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // それ以外の静的ファイルはキャッシュ優先＋裏で更新
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
