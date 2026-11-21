const C = 'tdp-v3';
const A = ['./', 'index.html', 'frases.json', 'manifest.json', 'icon-192.png', 'icon-512.png',
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

self.addEventListener('push', e => {
  let d = { t: 'Tiempo de perros', c: '' };
  try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.t, { body: d.c, icon: 'icon-192.png', tag: d.tag || 'tdp', renotify: true }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) if ('focus' in c) return c.focus();
    return clients.openWindow('./');
  }));
});
