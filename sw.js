const C = 'tdp-v1';
const A = ['./', 'index.html', 'frases.js', 'manifest.json', 'icon-192.png', 'icon-512.png',
  ...['01-despejado','02-parcialmente-nublado','03-nublado','04-lluvia','05-tormenta','06-nieve','07-viento','08-niebla','09-calor','10-noche-despejada','11-noche-nublada','12-granizo'].map(n => 'iconos/' + n + '.png')];

self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(A))));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
));
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(C).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
