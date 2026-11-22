import { json } from '@sveltejs/kit';
import { getDb, bad, str, EMAIL_OK } from '#lib/server.js';

export const prerender = false;

export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot: pretend it worked
  const t = {
    id: str(f.get('ticket'), 20), name: str(f.get('name'), 200), email: str(f.get('email'), 320),
    app: str(f.get('app'), 100), summary: str(f.get('summary'), 2000)
  };
  if (!/^PFY-[A-Z0-9]{5}$/.test(t.id) || !t.name || t.summary.length < 5 || !t.app || !EMAIL_OK.test(t.email)) return bad('Invalid ticket.');
  await getDb().prepare('INSERT INTO tickets (id, name, email, app, summary) VALUES (?, ?, ?, ?, ?)')
    .bind(t.id, t.name, t.email, t.app, t.summary).run();
  return json({ ok: true });
}
