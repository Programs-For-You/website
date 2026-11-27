import { json } from '@sveltejs/kit';
import { bad, str, welcomeMail, EMAIL_OK } from '#lib/server.js';
import { records, f as filter } from '#lib/pb.js';

export const prerender = false;

// Newsletter signup. A repeat signup does nothing (no second email); someone who unsubscribed can sign up again.
export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot
  const email = str(f.get('email'), 320).toLowerCase();
  if (!EMAIL_OK.test(email)) return bad('Please type a real email address.');
  const old = await records.first('subscribers', filter('email = {:e}', { e: email }));
  if (old) {
    if (old.unsubscribed) await records.update('subscribers', old.id, { unsubscribed: false });
    return json({ ok: true });
  }
  const sub = await records.create('subscribers', { email, token: crypto.randomUUID().replaceAll('-', ''), unsubscribed: false });
  await welcomeMail(sub);
  return json({ ok: true });
}
