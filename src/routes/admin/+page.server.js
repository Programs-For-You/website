import { fail, redirect } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import { EMAIL_OK, sendNewsletter } from '#lib/server.js';
import { records, f as filter } from '#lib/pb.js';
import { getUser, isAdmin, isAdmin1, isAdminRole, endSession, sendLink, cleanEmail, ROLES } from '#lib/auth.js';

export const prerender = false;

// Avatar colours are picked automatically (the admin form doesn't ask for them): new people get a pair from this list.
const PALETTE = [['#15803d', '#0f766e'], ['#a16207', '#4d7c0f'], ['#65a30d', '#0d9488'], ['#0d9488', '#0284c7'], ['#d97706', '#dc2626'], ['#7c3aed', '#db2777'], ['#e11d48', '#f97316']];
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const text = (f, k, max) => String(f.get(k) ?? '').trim().slice(0, max);
// PocketBase dates look like "2026-11-27 02:35:56.123Z"; the admin screens want "2026-11-27 02:35:56".
const ts = (s) => (s ? s.slice(0, 19) : s);

// Admin level 1 sees everything. Level 2 only gets Messages and Applications (people and users stay empty).
export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login?next=/admin');
  if (!isAdminRole(user.role)) redirect(303, '/account');
  const full = user.role === 'admin1';
  const none = Promise.resolve([]);
  const [tickets, applications, people, users, volunteers, downloads, subscribers] = await Promise.all([
    records.list('tickets', { sort: '-created_at', limit: 200 }),
    records.list('applications', { sort: '-created_at', limit: 200 }),
    full ? records.list('people', { sort: 'sort,id' }) : none,
    full ? records.list('users', { sort: 'role,name' }) : none,
    full ? records.list('volunteers', { sort: 'department,name' }) : none,
    records.list('downloads', { sort: '-count' }),
    full ? records.list('subscribers', { sort: '-created_at', limit: 2000 }) : none
  ]);
  return {
    authed: true, level: full ? 1 : 2, me: user.id,
    people: people.map((p) => ({ id: p.id, sort: p.sort, name: p.name, title: p.title, note: p.note, founder: p.founder, soon: p.soon })),
    users: users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, disabled: u.disabled, active: u.verified })),
    volunteers: volunteers.map((v) => ({ id: v.id, name: v.name, email: v.email, grade: v.grade, department: v.department, note: v.note, listed: v.listed })),
    tickets: tickets.map((t) => ({ id: t.ticket_id, name: t.name, email: t.email, app: t.app, summary: t.summary, created_at: ts(t.created_at) })),
    applications: applications.map((a) => ({ id: a.id, name: a.name, email: a.email, grade: a.grade, role: a.role, department: a.department, why: a.why, skills: a.skills, created_at: ts(a.created_at), read_at: ts(a.read_at) })),
    subscribers: subscribers.map((s) => ({ id: s.id, email: s.email, unsubscribed: s.unsubscribed, created_at: ts(s.created_at) })),
    downloads: downloads.map((d) => ({ file: d.file, count: d.count, last_at: ts(d.last_at) })),
    vapidKey: env.VAPID_PUBLIC_KEY ?? ''
  };
}

export const actions = {
  logout: async ({ cookies }) => {
    endSession(cookies);
    redirect(303, '/login');
  },

  // Saves the whole Team tab at once. Each card sends a `row` (its id, or "new" for the Add-someone card)
  // and fields named like name_<row>. Everything is checked first, then written.
  saveAll: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const f = await request.formData();
    const writes = [];
    let added = 0;
    for (const row of f.getAll('row').map(String)) {
      const id = row === 'new' ? null : row;
      if (row !== 'new' && !/^[a-z0-9]{15}$/.test(row)) continue;
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
      const initials = p.name ? initialsOf(p.name) : '';
      if (id) {
        // Keep this person's existing avatar colours.
        writes.push(() => records.update('people', id, { ...p, initials }));
      } else {
        const [g1, g2] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        writes.push(() => records.create('people', { ...p, initials, g1, g2 }));
        added++;
      }
    }
    await Promise.all(writes.map((w) => w()));
    return { ok: true, saved: true, message: `Saved${added ? `, and added ${added} new ${added === 1 ? 'person' : 'people'}` : ''}. The Team page updates within a minute.` };
  },

  // Delete a support ticket (the privacy page says we delete these when asked).
  removeTicket: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    const t = await records.first('tickets', filter('ticket_id = {:i}', { i: id }));
    if (t) await records.remove('tickets', t.id);
    return { ok: true, message: `Deleted ticket ${id}.` };
  },

  // Applications are never deleted. Admins just mark them read (or unread again).
  markApplicationRead: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const form = await request.formData();
    const id = text(form, 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    const read = form.get('read') === '1';
    await records.update('applications', id, { read_at: read ? new Date().toISOString().replace('T', ' ') : '' });
    return { ok: true, message: read ? 'Marked as read.' : 'Marked as unread.' };
  },

  remove: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change the Team page.' });
    const id = text(await request.formData(), 'removeId', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    await records.remove('people', id);
    return { ok: true, message: 'Removed. The Team page updates within a minute.' };
  },

  // ---- Accounts (Admin 1 only) ----
  invite: async ({ request, cookies, url }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can make accounts.' });
    const f = await request.formData();
    const name = text(f, 'name', 100), email = cleanEmail(f.get('email')), role = text(f, 'role', 20);
    if (!name || !EMAIL_OK.test(email) || !ROLES.includes(role)) return fail(400, { error: 'Please give a name, a real email, and a role.' });
    if (await records.first('users', filter('email = {:e}', { e: email }))) return fail(400, { error: `${email} already has an account.` });
    // PocketBase needs a password to make an account; this random one is never shared. `verified` stays false until they choose their own.
    const secret = crypto.randomUUID() + crypto.randomUUID();
    const u = await records.create('users', { email, name, role, password: secret, passwordConfirm: secret, verified: false, disabled: false });
    const { sent, link } = await sendLink(url.origin, { id: u.id, email, name }, 'invite');
    return { ok: true, message: sent ? `Invite emailed to ${email}.` : `Account made, but the email didn’t send. Give ${name} this link (works 7 days): ${link}` };
  },

  resendLink: async ({ request, cookies, url }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can do that.' });
    const u = await records.get('users', text(await request.formData(), 'id', 20));
    if (!u || u.disabled) return fail(400, { error: 'That account can’t be found or is turned off.' });
    const { sent, link } = await sendLink(url.origin, u, u.verified ? 'reset' : 'invite');
    return { ok: true, message: sent ? `Link emailed to ${u.email}.` : `The email didn’t send. Give ${u.name} this link: ${link}` };
  },

  setRole: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const f = await request.formData();
    const id = text(f, 'id', 20), role = text(f, 'role', 20);
    if (!id || !ROLES.includes(role)) return fail(400, { error: 'Invalid role.' });
    if (id === me.id) return fail(400, { error: 'You can’t change your own role.' });
    await records.update('users', id, { role });
    return { ok: true, message: 'Role changed.' };
  },

  // Turning someone off logs them out right away: getUser() checks `disabled` on every request.
  toggleUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id || id === me.id) return fail(400, { error: 'You can’t turn off your own account.' });
    const u = await records.get('users', id);
    if (!u) return fail(400, { error: 'That account can’t be found.' });
    await records.update('users', id, { disabled: !u.disabled });
    return { ok: true, message: 'Account updated.' };
  },

  removeUser: async ({ request, cookies }) => {
    const me = await getUser(cookies);
    if (me?.role !== 'admin1') return fail(401, { error: 'Only Admin 1 can do that.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id || id === me.id) return fail(400, { error: 'You can’t delete your own account.' });
    await records.remove('users', id); // its invite/reset links are deleted with it
    return { ok: true, message: 'Account deleted.' };
  },

  // ---- Volunteers (Admin 1 only). They show on /volunteers only when "listed" is ticked. ----
  saveVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const f = await request.formData();
    const id = text(f, 'id', 20) || null;
    const v = { name: text(f, 'name', 100), email: cleanEmail(f.get('email')), grade: text(f, 'grade', 20), department: text(f, 'department', 50), note: text(f, 'note', 300), listed: Boolean(f.get('listed')) };
    if (!v.name || !EMAIL_OK.test(v.email) || !v.department) return fail(400, { error: 'Please give a name, a real email, and a department.' });
    const dupe = await records.first('volunteers', filter('email = {:e}', { e: v.email }));
    if (dupe && dupe.id !== id) return fail(400, { error: `${v.email} is already a volunteer.` });
    if (id) await records.update('volunteers', id, v);
    else await records.create('volunteers', v);
    return { ok: true, message: id ? `Saved ${v.name}.` : `Added ${v.name}. The Volunteers page updates within a minute.` };
  },

  removeVolunteer: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can change volunteers.' });
    const id = text(await request.formData(), 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    await records.remove('volunteers', id);
    return { ok: true, message: 'Removed the volunteer.' };
  },

  // From an application: copy the person over (not listed publicly until you tick it). Skips someone already added.
  addFromApplication: async ({ request, cookies }) => {
    if (!(await isAdmin1(cookies))) return fail(401, { error: 'Only Admin 1 can add volunteers.' });
    const a = await records.get('applications', text(await request.formData(), 'id', 20));
    if (!a) return fail(400, { error: 'That application can’t be found.' });
    const email = cleanEmail(a.email);
    if (await records.first('volunteers', filter('email = {:e}', { e: email }))) return fail(400, { error: `${a.name} is already a volunteer.` });
    await records.create('volunteers', { name: a.name, email, grade: a.grade, department: a.department, listed: false });
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
    const subs = (await records.list('subscribers', { filter: 'unsubscribed = false', limit: 2000, fields: 'email,token' }));
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
    const id = text(await request.formData(), 'id', 20);
    if (!id) return fail(400, { error: 'Missing id.' });
    await records.remove('subscribers', id);
    return { ok: true, message: 'Removed from the list.' };
  }
};
