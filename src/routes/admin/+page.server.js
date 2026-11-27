import { fail, redirect } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import { EMAIL_OK, sendNewsletter, getDb } from '#lib/server.js';
import { getUser, isAdmin, isAdmin1, isAdminRole, endSession, sendLink, cleanEmail, ROLES } from '#lib/auth.js';

export const prerender = false;

// Avatar colours are picked automatically (the admin form doesn't ask for them): new people get a pair from this list.
const PALETTE = [['#15803d', '#0f766e'], ['#a16207', '#4d7c0f'], ['#65a30d', '#0d9488'], ['#0d9488', '#0284c7'], ['#d97706', '#dc2626'], ['#7c3aed', '#db2777'], ['#e11d48', '#f97316']];
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const text = (f, k, max) => String(f.get(k) ?? '').trim().slice(0, max);
// Row ids are D1 integers; anything else from a form is rejected.
const idOf = (v) => (/^\d{1,12}$/.test(String(v ?? '')) ? Number(v) : null);
const all = async (sql) => (await getDb().prepare(sql).all()).results;

// Admin level 1 sees everything. Level 2 only gets Messages and Applications (people and users stay empty).
export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login?next=/admin');
  if (!isAdminRole(user.role)) redirect(303, '/account');
  const full = user.role === 'admin1';
  const none = Promise.resolve([]);
  const [tickets, applications, people, users, volunteers, downloads, subscribers] = await Promise.all([
    all('SELECT id, name, email, app, summary, created_at FROM tickets ORDER BY created_at DESC, rowid DESC LIMIT 200'),
    all('SELECT id, name, email, grade, role, department, why, skills, created_at, read_at FROM applications ORDER BY created_at DESC, id DESC LIMIT 200'),
    full ? all('SELECT id, sort, name, title, note, founder, soon FROM people ORDER BY sort, id') : none,
    full ? all('SELECT id, email, name, role, disabled, pw_hash IS NOT NULL AS active FROM users ORDER BY role, name') : none,
    full ? all('SELECT id, name, email, grade, department, note, listed FROM volunteers ORDER BY department, name') : none,
    all('SELECT file, count, last_at FROM downloads ORDER BY count DESC'),
    full ? all('SELECT id, email, unsubscribed, created_at FROM subscribers ORDER BY created_at DESC, id DESC LIMIT 2000') : none
  ]);
  return {
    authed: true, level: full ? 1 : 2, me: user.id,
    people: people.map((p) => ({ ...p, founder: Boolean(p.founder), soon: Boolean(p.soon) })),
    users: users.map((u) => ({ ...u, disabled: Boolean(u.disabled), active: Boolean(u.active) })),
    volunteers: volunteers.map((v) => ({ ...v, listed: Boolean(v.listed) })),
    tickets, applications,
    subscribers: subscribers.map((s) => ({ ...s, unsubscribed: Boolean(s.unsubscribed) })),
    downloads,
    vapidKey: env.VAPID_PUBLIC_KEY ?? ''
  };
}

export const actions = {
  logout: async ({ cookies }) => {
    await endSession(cookies);
    redirect(303, '/login');
  },

  // Saves the whole Team tab at once. Each card sends a `row` (its id, or "new" for the Add-someone card)
  // and fields named like name_<row>. Everything is checked first, then written.
  saveAll: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const f = await request.formData();
    const db = getDb();
    const writes = [];
    let added = 0;
    for (const row of f.getAll('row').map(String)) {
      const id = row === 'new' ? null : idOf(row);
      if (row !== 'new' && id === null) continue;
      const soon = Boolean(f.get(`soon_${row}`));
      const p = {
        sort: Math.trunc(Number(f.get(`sort_${row}`))) || 0,
        name: text(f, `name_${row}`, 100), title: text(f, `title_${row}`, 120), note: text(f, `note_${row}`, 300),
        founder: Boolean(f.get(`founder_${row}`)), soon
      };
      if (!id && !p.name && !p.title && !soon) continue; // the Add-someone card was left empty
      const who = p.name || 'an open spot';
      if (!p.title) return fail(400, { error: `Please give ${who} a title. Nothing was saved.` });
      if (!soon && !p.name) return fail(400, { error: 'Please type a name, or tick “Open spot”. Nothing was saved.' });
      const initials = p.name ? initialsOf(p.name) : null;
      if (id) {
        // Keep this person's existing avatar colours.
        writes.push(db.prepare('UPDATE people SET sort = ?, name = ?, initials = ?, title = ?, note = ?, founder = ?, soon = ? WHERE id = ?')
          .bind(p.sort, p.name || null, initials, p.title, p.note || null, +p.founder, +p.soon, id));
      } else {
        const [g1, g2] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        writes.push(db.prepare('INSERT INTO people (sort, name, initials, g1, g2, title, note, founder, soon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(p.sort, p.name || null, initials, g1, g2, p.title, p.note || null, +p.founder, +p.soon));
        added++;
      }
    }
    if (writes.length) await db.batch(writes); // all or nothing
    return { ok: true, saved: true, message: `Saved${added ? `, and added ${added} new ${added === 1 ? 'person' : 'people'}` : ''}. The Team page updates within a minute.` };
  },

  // Delete a support ticket (the privacy page says we delete these when asked).
  removeTicket: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM tickets WHERE id = ?').bind(id).run();
    return { ok: true, message: `Deleted ticket ${id}.` };
  },

  // Applications are never deleted. Admins just mark them read (or unread again).
  markApplicationRead: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const form = await request.formData();
    const id = idOf(form.get('id'));
    if (id === null) return fail(400, { error: 'Missing id.' });
    const read = form.get('read') === '1';
    await getDb().prepare(`UPDATE applications SET read_at = ${read ? "datetime('now')" : 'NULL'} WHERE id = ?`).bind(id).run();
    return { ok: true, message: read ? 'Marked as read.' : 'Marked as unread.' };
  },

  remove: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const id = idOf((await request.formData()).get('removeId'));
    if (id === null) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM people WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed. The Team page updates within a minute.' };
  },

  // ---- Accounts (Admin 1 only) ----
  invite: async ({ request, cookies, url }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can make accounts.' });
    const f = await request.formData();
    const name = text(f, 'name', 100), email = cleanEmail(f.get('email')), role = text(f, 'role', 20);
    if (!name || !EMAIL_OK.test(email) || !ROLES.includes(role)) return fail(400, { error: 'Please give a name, a real email, and a role.' });
    const db = getDb();
    if (await db.prepare('SELECT 1 FROM users WHERE email = ?').bind(email).first()) return fail(400, { error: `${email} already has an account.` });
    // No password yet (pw_hash stays empty): they choose their own from the invite link.
    const { meta } = await db.prepare('INSERT INTO users (email, name, role) VALUES (?, ?, ?)').bind(email, name, role).run();
    const { sent, link } = await sendLink(url.origin, { id: meta.last_row_id, email, name }, 'invite');
    return { ok: true, message: sent ? `Invite emailed to ${email}.` : `Account made, but the email didn’t send. Give ${name} this link (works 7 days): ${link}` };
  },

  resendLink: async ({ request, cookies, url }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can do that.' });
    const u = await getDb().prepare('SELECT id, email, name, pw_hash FROM users WHERE id = ? AND disabled = 0').bind(idOf((await request.formData()).get('id'))).first();
    if (!u) return fail(400, { error: 'That account can’t be found or is turned off.' });
    const { sent, link } = await sendLink(url.origin, u, u.pw_hash ? 'reset' : 'invite');
    return { ok: true, message: sent ? `Link emailed to ${u.email}.` : `The email didn’t send. Give ${u.name} this link: ${link}` };
  },

  setRole: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const f = await request.formData();
    const id = idOf(f.get('id')), role = text(f, 'role', 20);
    if (id === null || !ROLES.includes(role)) return fail(400, { error: 'Invalid role.' });
    if (id === me.id) return fail(400, { error: 'You can’t change your own role.' });
    await getDb().prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, id).run();
    return { ok: true, message: 'Role changed.' };
  },

  // Turning someone off logs them out right away: getUser() checks `disabled` on every request.
  toggleUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = idOf((await request.formData()).get('id'));
    if (id === null || id === me.id) return fail(400, { error: 'You can’t turn off your own account.' });
    const { meta } = await getDb().prepare('UPDATE users SET disabled = 1 - disabled WHERE id = ?').bind(id).run();
    if (!meta.changes) return fail(400, { error: 'That account can’t be found.' });
    return { ok: true, message: 'Account updated.' };
  },

  removeUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = idOf((await request.formData()).get('id'));
    if (id === null || id === me.id) return fail(400, { error: 'You can’t delete your own account.' });
    await getDb().prepare('DELETE FROM users WHERE id = ?').bind(id).run(); // its sessions and invite/reset links are deleted with it
    return { ok: true, message: 'Account deleted.' };
  },

  // ---- Volunteers (Admin 1 only). They show on /volunteers only when "listed" is ticked. ----
  saveVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const f = await request.formData();
    const id = idOf(f.get('id'));
    const v = { name: text(f, 'name', 100), email: cleanEmail(f.get('email')), grade: text(f, 'grade', 20), department: text(f, 'department', 50), note: text(f, 'note', 300), listed: Boolean(f.get('listed')) };
    if (!v.name || !EMAIL_OK.test(v.email) || !v.department) return fail(400, { error: 'Please give a name, a real email, and a department.' });
    const db = getDb();
    const dupe = await db.prepare('SELECT id FROM volunteers WHERE email = ?').bind(v.email).first();
    if (dupe && dupe.id !== id) return fail(400, { error: `${v.email} is already a volunteer.` });
    if (id) await db.prepare('UPDATE volunteers SET name = ?, email = ?, grade = ?, department = ?, note = ?, listed = ? WHERE id = ?').bind(v.name, v.email, v.grade || null, v.department, v.note || null, +v.listed, id).run();
    else await db.prepare('INSERT INTO volunteers (name, email, grade, department, note, listed) VALUES (?, ?, ?, ?, ?, ?)').bind(v.name, v.email, v.grade || null, v.department, v.note || null, +v.listed).run();
    return { ok: true, message: id ? `Saved ${v.name}.` : `Added ${v.name}. The Volunteers page updates within a minute.` };
  },

  removeVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const id = idOf((await request.formData()).get('id'));
    if (id === null) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM volunteers WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed the volunteer.' };
  },

  // From an application: copy the person over (not listed publicly until you tick it). Skips someone already added.
  addFromApplication: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can add volunteers.' });
    const db = getDb();
    const a = await db.prepare('SELECT name, email, grade, department FROM applications WHERE id = ?').bind(idOf((await request.formData()).get('id'))).first();
    if (!a) return fail(400, { error: 'That application can’t be found.' });
    const email = cleanEmail(a.email);
    if (await db.prepare('SELECT 1 FROM volunteers WHERE email = ?').bind(email).first()) return fail(400, { error: `${a.name} is already a volunteer.` });
    await db.prepare('INSERT INTO volunteers (name, email, grade, department, listed) VALUES (?, ?, ?, ?, 0)').bind(a.name, email, a.grade, a.department).run();
    return { ok: true, message: `Added ${a.name} to Volunteers (not shown on the website until you tick “Show on website”).` };
  },

  // ---- Newsletter (Admin 1 only) ----
  // "Send me a test" goes only to the logged-in admin. A real send needs the confirm box and goes to everyone who hasn't unsubscribed.
  sendNewsletter: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can send the newsletter.' });
    const f = await request.formData();
    const subject = text(f, 'subject', 150), body = text(f, 'body', 8000);
    const buttonLabel = text(f, 'buttonLabel', 40), buttonUrl = text(f, 'buttonUrl', 500);
    if (!subject || !body) return fail(400, { error: 'Please write a subject and a message.' });
    if (buttonUrl && (!/^https:\/\//.test(buttonUrl) || !buttonLabel)) return fail(400, { error: 'A button needs a label and a link that starts with https://.' });
    const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    const button = buttonUrl ? { label: buttonLabel, url: buttonUrl } : undefined;
    const sendId = crypto.randomUUID();
    if (f.get('mode') === 'test') {
      // The test copy uses a placeholder token, so its unsubscribe link does nothing.
      const sent = await sendNewsletter({ subject: `[Test] ${subject}`, heading: subject, paragraphs, button, subscribers: [{ email: me.email, token: '0'.repeat(32) }], sendId });
      return sent ? { ok: true, message: `Test sent to ${me.email}.` } : fail(500, { error: 'The test email didn’t send. Check RESEND_API_KEY.' });
    }
    if (!f.get('confirm')) return fail(400, { error: 'Tick the box to confirm you want to send this to everyone.' });
    const { results: subs } = await getDb().prepare('SELECT email, token FROM subscribers WHERE unsubscribed = 0 LIMIT 2000').all();
    if (!subs.length) return fail(400, { error: 'There are no subscribers yet.' });
    let sent;
    try { sent = await sendNewsletter({ subject, heading: subject, paragraphs, button, subscribers: subs, sendId }); }
    catch (e) { return fail(500, { error: e.message }); }
    return sent === subs.length
      ? { ok: true, message: `Sent to ${sent} ${sent === 1 ? 'person' : 'people'}.` }
      : fail(500, { error: `Only ${sent} of ${subs.length} emails went out. Check Resend before sending again (resending would double up the ones that worked).` });
  },

  removeSubscriber: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = idOf((await request.formData()).get('id'));
    if (id === null) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM subscribers WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed from the list.' };
  }
};
