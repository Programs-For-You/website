// Service worker for the installed /admin app. It only shows push notifications (new messages and applications);
// it doesn't cache anything, so the admin page is always live.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { /* fall back to the generic text below */ }
  e.waitUntil(self.registration.showNotification(d.title || 'Programs For You', {
    body: d.body || 'Something new is waiting in the admin.',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-96.png',
    tag: d.tag, // same tag = replace, not stack
    data: { url: d.url || '/admin' }
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || '/admin', self.location.origin).href;
  e.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const mine = open.find((c) => new URL(c.url).pathname.startsWith('/admin'));
    if (mine) { await mine.focus(); if ('navigate' in mine) return mine.navigate(url); }
    return self.clients.openWindow(url);
  })());
});
