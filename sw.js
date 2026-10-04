// cache-first for the heavy, rarely changing assets; network-first for the page itself so updates arrive
const C='lb-1791139611';
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C && k.startsWith('lb-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e=>{ const u=new URL(e.request.url); if (e.request.method!=='GET') return;
  const heavy=/\/(models|portraits|sfx)\//.test(u.pathname) || /cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if (heavy){ e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r || fetch(e.request).then(n=>{ if (n.ok || n.type==='opaque') c.put(e.request, n.clone()); return n; })))); return; }
  if (u.origin===location.origin) e.respondWith(fetch(e.request).then(n=>{ const cp=n.clone(); caches.open(C).then(c=>c.put(e.request, cp)); return n; }).catch(()=>caches.match(e.request)));
});
