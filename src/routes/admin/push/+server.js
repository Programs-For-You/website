import { json } from '@sveltejs/kit';
import { records, f } from '#lib/pb.js';
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
  const old = await records.first('push_subscriptions', f('endpoint = {:e}', { e: endpoint }));
  if (old) await records.update('push_subscriptions', old.id, { p256dh, auth });
  else await records.create('push_subscriptions', { endpoint, p256dh, auth });
  if (url.searchParams.has('test')) await pushAdmins({ title: 'Notifications are on', body: 'You’ll get one when a message or application comes in.', url: '/admin', tag: 'test' });
  return json({ ok: true });
}

export async function DELETE({ request, cookies }) {
  if (!(await isAdmin(cookies))) return json({ ok: false, message: 'Please log in again.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const old = await records.first('push_subscriptions', f('endpoint = {:e}', { e: clean(body.endpoint, 1000) }));
  if (old) await records.remove('push_subscriptions', old.id);
  return json({ ok: true });
}
