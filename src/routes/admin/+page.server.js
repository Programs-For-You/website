import { fail } from '@sveltejs/kit';
import { getDb, isAdmin, passwordOk, startSession, endSession } from '#lib/server.js';

export const prerender = false;

// Avatar colours are picked automatically (the admin form doesn't ask for them): new people get a pair from this list.
const PALETTE = [['#15803d', '#0f766e'], ['#a16207', '#4d7c0f'], ['#65a30d', '#0d9488'], ['#0d9488', '#0284c7'], ['#d97706', '#dc2626'], ['#7c3aed', '#db2777'], ['#e11d48', '#f97316']];
const initialsOf = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const text = (f, k, max) => String(f.get(k) ?? '').trim().slice(0, max);

export async function load({ cookies }) {
  if (!(await isAdmin(cookies))) return { authed: false, people: [], tickets: [], applications: [] };
  const db = getDb();
  const [people, tickets, applications] = await db.batch([
    db.prepare('SELECT id, sort, name, title, note, founder, soon FROM people ORDER BY sort, id'),
    db.prepare('SELECT id, name, email, app, summary, created_at FROM tickets ORDER BY created_at DESC, rowid DESC LIMIT 200'),
    db.prepare('SELECT id, name, email, grade, role, department, why, skills, created_at FROM applications ORDER BY created_at DESC, id DESC LIMIT 200')
  ]);
  return { authed: true, people: people.results, tickets: tickets.results, applications: applications.results };
}

export const actions = {
  login: async ({ request, cookies, url }) => {
    const pw = text(await request.formData(), 'password', 200);
    if (!(await passwordOk(pw))) return fail(401, { error: 'That password isn’t right.' });
    await startSession(cookies, url);
    return { ok: true };
  },

  logout: async ({ cookies }) => {
    endSession(cookies);
    return { ok: true };
  },

  // Saves the whole Team tab at once. Each card sends a `row` (its id, or "new" for the Add-someone card)
  // and fields named like name_<row>. Everything is checked first, then written together (all or nothing).
  saveAll: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
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
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = Number((await request.formData()).get('removeId'));
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM people WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed. The Team page updates within a minute.' };
  }
};
