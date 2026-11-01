/* 河原町 誘導ログ — Service Worker
   ・アプリ本体をキャッシュしてオフラインでも起動できるようにします
   ・HTML はネットワーク優先（＝新しい版があればすぐ反映）
   ・Google API（GAS / チャット）への通信はキャッシュしません

   ★ アプリを更新したら VERSION を必ず上げてください（例 1.1.0 → 1.1.1）。
     ブラウザはこのファイルの差分を見て更新を検知するため、VERSION を上げるだけで
     各端末は自動的に新しい版へ切り替わります。 */

const VERSION = '1.1.1';
const CACHE = 'kwrm-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './version.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS).catch(() => {}))
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
  if (e.data === 'SKIP_WAITING' || (e.data && e.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // GAS / チャットAPIはそのまま

  // バージョン確認は常に最新を取りに行く
  if (/\/version\.json$/.test(url.pathname)) {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(() => caches.match(req)));
    return;
  }

  // 画面遷移（HTML）はネットワーク優先：更新があれば即座に新HTML
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./')))
    );
    return;
  }

  // それ以外の静的ファイル：キャッシュ優先＋裏で更新
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) {
        fetch(req).then((res) => {
          if (res && res.status === 200) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        }).catch(() => {});
        return hit;
      }
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
