import { fail, redirect } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import { getDb, EMAIL_OK } from '#lib/server.js';
import { getUser, isAdmin, isAdmin1, isAdminRole, endSession, sendLink, cleanEmail, ROLES } from '#lib/auth.js';

export const prerender = false;

// Avatar colours are picked automatically (the admin form doesn't ask for them): new people get a pair from this list.
const PALETTE = [['#15803d', '#0f766e'], ['#a16207', '#4d7c0f'], ['#65a30d', '#0d9488'], ['#0d9488', '#0284c7'], ['#d97706', '#dc2626'], ['#7c3aed', '#db2777'], ['#e11d48', '#f97316']];
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const text = (f, k, max) => String(f.get(k) ?? '').trim().slice(0, max);

// Admin level 1 sees everything. Level 2 only gets Messages and Applications (people and users stay empty).
export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login?next=/admin');
  if (!isAdminRole(user.role)) redirect(303, '/account');
  const db = getDb();
  const full = user.role === 'admin1';
  const [tickets, applications, people, users, volunteers] = await db.batch([
    db.prepare('SELECT id, name, email, app, summary, created_at FROM tickets ORDER BY created_at DESC, rowid DESC LIMIT 200'),
    db.prepare('SELECT id, name, email, grade, role, department, why, skills, created_at FROM applications ORDER BY created_at DESC, id DESC LIMIT 200'),
    db.prepare(full ? 'SELECT id, sort, name, title, note, founder, soon FROM people ORDER BY sort, id' : 'SELECT 1 WHERE 0'),
    db.prepare(full ? 'SELECT id, email, name, role, disabled, (pw_hash IS NOT NULL) AS active FROM users ORDER BY role, name' : 'SELECT 1 WHERE 0'),
    db.prepare(full ? 'SELECT id, name, email, grade, department, note, listed FROM volunteers ORDER BY department, name' : 'SELECT 1 WHERE 0')
  ]);
  return { authed: true, level: full ? 1 : 2, me: user.id, people: people.results, users: users.results, volunteers: volunteers.results, tickets: tickets.results, applications: applications.results, vapidKey: env.VAPID_PUBLIC_KEY ?? '' };
}

export const actions = {
  logout: async ({ cookies }) => {
    await endSession(cookies);
    redirect(303, '/login');
  },

  // Saves the whole Team tab at once. Each card sends a `row` (its id, or "new" for the Add-someone card)
  // and fields named like name_<row>. Everything is checked first, then written together (all or nothing).
  saveAll: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const f = await request.formData();
    const db = getDb();
    const writes = [];
    let added = 0;
    for (const row of f.getAll('row').map(String)) {
      const id = row === 'new' ? null : Number(row);
      if (row !== 'new' && !id) continue;
      const soon = f.get(`soon_${row}`) ? 1 : 0;
      const p = {
        sort: Math.trunc(Number(f.get(`sort_${row}`))) || 0,
        name: text(f, `name_${row}`, 100) || null,
        title: text(f, `title_${row}`, 120), note: text(f, `note_${row}`, 300) || null,
        founder: f.get(`founder_${row}`) ? 1 : 0, soon
      };
      if (!id && !p.name && !p.title && !soon) continue; // the Add-someone card was left empty
      const who = p.name || 'an open spot';
      if (!p.title) return fail(400, { error: `Please give ${who} a title. Nothing was saved.` });
      if (!soon && !p.name) return fail(400, { error: 'Please type a name, or tick “Open spot”. Nothing was saved.' });
      const initials = p.name ? initialsOf(p.name) : null;
      if (id) {
        // Keep this person's existing avatar colours.
        writes.push(db.prepare('UPDATE people SET sort=?, name=?, initials=?, title=?, note=?, founder=?, soon=? WHERE id=?')
          .bind(p.sort, p.name, initials, p.title, p.note, p.founder, p.soon, id));
      } else {
        const [g1, g2] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        writes.push(db.prepare('INSERT INTO people (sort, name, initials, g1, g2, title, note, founder, soon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(p.sort, p.name, initials, g1, g2, p.title, p.note, p.founder, p.soon));
        added++;
      }
    }
    if (writes.length) await db.batch(writes);
    return { ok: true, saved: true, message: `Saved${added ? `, and added ${added} new ${added === 1 ? 'person' : 'people'}` : ''}. The Team page updates within a minute.` };
  },

  // Delete a support ticket or a job application (the privacy page says we delete these when asked).
  removeTicket: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM tickets WHERE id = ?').bind(id).run();
    return { ok: true, message: `Deleted ticket ${id}.` };
  },

  removeApplication: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = Number((await request.formData()).get('id'));
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM applications WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Deleted the application.' };
  },

  remove: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const id = Number((await request.formData()).get('removeId'));
    if (!id) return fail(400, { error: 'Missing id.' });
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
    const { meta } = await db.prepare('INSERT INTO users (email, name, role) VALUES (?, ?, ?)').bind(email, name, role).run();
    const { sent, link } = await sendLink(url.origin, { id: meta.last_row_id, email, name }, 'invite');
    return { ok: true, message: sent ? `Invite emailed to ${email}.` : `Account made, but the email didn’t send. Give ${name} this link (works 7 days): ${link}` };
  },

  resendLink: async ({ request, cookies, url }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can do that.' });
    const u = await getDb().prepare('SELECT id, email, name, pw_hash FROM users WHERE id = ? AND disabled = 0').bind(Number((await request.formData()).get('id'))).first();
    if (!u) return fail(400, { error: 'That account can’t be found or is turned off.' });
    const { sent, link } = await sendLink(url.origin, u, u.pw_hash ? 'reset' : 'invite');
    return { ok: true, message: sent ? `Link emailed to ${u.email}.` : `The email didn’t send. Give ${u.name} this link: ${link}` };
  },

  setRole: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const f = await request.formData();
    const id = Number(f.get('id')), role = text(f, 'role', 20);
    if (!id || !ROLES.includes(role)) return fail(400, { error: 'Invalid role.' });
    if (id === me.id) return fail(400, { error: 'You can’t change your own role.' });
    await getDb().prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, id).run();
    return { ok: true, message: 'Role changed.' };
  },

  toggleUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = Number((await request.formData()).get('id'));
    if (!id || id === me.id) return fail(400, { error: 'You can’t turn off your own account.' });
    const db = getDb();
    await db.batch([
      db.prepare('UPDATE users SET disabled = 1 - disabled WHERE id = ?').bind(id),
      db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id) // turning someone off logs them out right away
    ]);
    return { ok: true, message: 'Account updated.' };
  },

  removeUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = Number((await request.formData()).get('id'));
    if (!id || id === me.id) return fail(400, { error: 'You can’t delete your own account.' });
    const db = getDb();
    await db.batch([db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id), db.prepare('DELETE FROM tokens WHERE user_id = ?').bind(id), db.prepare('DELETE FROM users WHERE id = ?').bind(id)]);
    return { ok: true, message: 'Account deleted.' };
  },

  // ---- Volunteers (Admin 1 only). They show on /volunteers only when "listed" is ticked. ----
  saveVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const f = await request.formData();
    const id = Number(f.get('id')) || null;
    const v = { name: text(f, 'name', 100), email: cleanEmail(f.get('email')), grade: text(f, 'grade', 20) || null, department: text(f, 'department', 50), note: text(f, 'note', 300) || null, listed: f.get('listed') ? 1 : 0 };
    if (!v.name || !EMAIL_OK.test(v.email) || !v.department) return fail(400, { error: 'Please give a name, a real email, and a department.' });
    const q = id
      ? getDb().prepare('UPDATE volunteers SET name=?, email=?, grade=?, department=?, note=?, listed=? WHERE id=?').bind(v.name, v.email, v.grade, v.department, v.note, v.listed, id)
      : getDb().prepare('INSERT INTO volunteers (name, email, grade, department, note, listed) VALUES (?, ?, ?, ?, ?, ?)').bind(v.name, v.email, v.grade, v.department, v.note, v.listed);
    await q.run();
    return { ok: true, message: id ? `Saved ${v.name}.` : `Added ${v.name}. The Volunteers page updates within a minute.` };
  },

  removeVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const id = Number((await request.formData()).get('id'));
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM volunteers WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed the volunteer.' };
  },

  // From an application: copy the person over (not listed publicly until you tick it). Skips someone already added.
  addFromApplication: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can add volunteers.' });
    const db = getDb();
    const a = await db.prepare('SELECT name, email, grade, department FROM applications WHERE id = ?').bind(Number((await request.formData()).get('id'))).first();
    if (!a) return fail(400, { error: 'That application can’t be found.' });
    const email = cleanEmail(a.email);
    if (await db.prepare('SELECT 1 FROM volunteers WHERE email = ?').bind(email).first()) return fail(400, { error: `${a.name} is already a volunteer.` });
    await db.prepare('INSERT INTO volunteers (name, email, grade, department) VALUES (?, ?, ?, ?)').bind(a.name, email, a.grade, a.department).run();
    return { ok: true, message: `Added ${a.name} to Volunteers (not shown on the website until you tick “Show on website”).` };
  }
};
