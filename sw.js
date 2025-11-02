
// v52
const CACHE_NAME = 'tmg-v54b';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{
    if(k!==CACHE_NAME) return caches.delete(k);
  }))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')){
    e.respondWith(
      fetch(e.request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c=>c.put('./index.html', copy));
        return r;
      }).catch(()=> caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r=>{
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c=> c.put(e.request, copy));
      return r;
    }))
  );
});
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached=> cached || fetch(e.request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c=> c.put(e.request, copy));
        return r;
      }).catch(()=> caches.match('./index.html')))
    );
  }
});
