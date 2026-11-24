import { json } from '@sveltejs/kit';
import { getDb } from '#lib/server.js';
import { isAdmin } from '#lib/auth.js';
import { pushAdmins } from '#lib/push.js';

export const prerender = false;

// Turn notifications on for this device (POST a PushSubscription), or off (DELETE with its endpoint).
// Lives under /admin because the login cookie only goes to /admin.
const clean = (v, max) => String(v ?? '').slice(0, max);

export async function POST({ request, cookies, url }) {
  if (!(await isAdmin(cookies))) return json({ ok: false, message: 'Please log in again.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const endpoint = clean(body.endpoint, 1000);
  const p256dh = clean(body.keys?.p256dh, 200);
  const auth = clean(body.keys?.auth, 100);
  if (!/^https:\/\//.test(endpoint) || !p256dh || !auth) return json({ ok: false, message: 'Invalid subscription.' }, { status: 400 });
  await getDb().prepare('INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?) ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth')
    .bind(endpoint, p256dh, auth).run();
  if (url.searchParams.has('test')) await pushAdmins({ title: 'Notifications are on', body: 'You’ll get one when a message or application comes in.', url: '/admin', tag: 'test' });
  return json({ ok: true });
}

export async function DELETE({ request, cookies }) {
  if (!(await isAdmin(cookies))) return json({ ok: false, message: 'Please log in again.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  await getDb().prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(clean(body.endpoint, 1000)).run();
  return json({ ok: true });
}
