import { json } from '@sveltejs/kit';
import { bad, str, welcomeMail, getDb, EMAIL_OK } from '#lib/server.js';

export const prerender = false;

// Newsletter signup. A repeat signup does nothing (no second email); someone who unsubscribed can sign up again.
export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot
  const email = str(f.get('email'), 320).toLowerCase();
  if (!EMAIL_OK.test(email)) return bad('Please type a real email address.');
  const db = getDb();
  const old = await db.prepare('SELECT unsubscribed FROM subscribers WHERE email = ?').bind(email).first();
  if (old) {
    if (old.unsubscribed) await db.prepare('UPDATE subscribers SET unsubscribed = 0 WHERE email = ?').bind(email).run();
    return json({ ok: true });
  }
  const sub = { email, token: crypto.randomUUID().replaceAll('-', '') };
  // INSERT OR IGNORE: two quick signups with the same address make one row (and the loser sends no second welcome email).
  const { meta } = await db.prepare('INSERT OR IGNORE INTO subscribers (email, token) VALUES (?, ?)').bind(sub.email, sub.token).run();
  if (!meta.changes) return json({ ok: true });
  await welcomeMail(sub);
  return json({ ok: true });
}
