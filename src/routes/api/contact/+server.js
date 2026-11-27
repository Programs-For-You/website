import { json } from '@sveltejs/kit';
import { bad, str, notify, confirmToSender, mayConfirm, getDb, EMAIL_OK } from '#lib/server.js';
import { pushAdmins } from '#lib/push.js';
import { SITE } from '#lib/config.js';

export const prerender = false;

export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot: pretend it worked
  const t = {
    id: str(f.get('ticket'), 20), name: str(f.get('name'), 200), email: str(f.get('email'), 320).toLowerCase(),
    app: str(f.get('app'), 100), summary: str(f.get('summary'), 2000)
  };
  if (!/^PFY-[A-Z0-9]{5}$/.test(t.id) || !t.name || t.summary.length < 5 || !t.app || !EMAIL_OK.test(t.email)) return bad('Invalid ticket.');
  // A double click or a retry sends the same ticket twice: save and email it once.
  const db = getDb();
  if (await db.prepare('SELECT 1 FROM tickets WHERE id = ?').bind(t.id).first()) return json({ ok: true });
  const confirm = await mayConfirm(t.email);
  await db.prepare('INSERT INTO tickets (id, name, email, app, summary) VALUES (?, ?, ?, ?, ?)').bind(t.id, t.name, t.email, t.app, t.summary).run();
  await Promise.all([
    confirm && confirmToSender({
      name: t.name, email: t.email, key: `ticket-confirm-${t.id}`,
      subject: `We got your message (${t.id})`,
      lead: `Thanks for writing to ${SITE.name}. A real person on the team will read your message and answer at this address. Your ticket number is ${t.id}.`,
      rows: [['Ticket', t.id], ['App', t.app], ['Your message', t.summary]]
    }),
    notify(`New message ${t.id} from ${t.name}`, [['From', `${t.name} <${t.email}>`], ['App', t.app], ['Message', t.summary]], { replyTo: t.email, key: `ticket-notify-${t.id}` }),
    pushAdmins({ title: `New message from ${t.name}`, body: t.summary.slice(0, 140), url: '/admin?tab=tickets', tag: t.id })
  ]);
  return json({ ok: true });
}
