import { fail } from '@sveltejs/kit';
import { getDb, isAdmin, passwordOk, startSession, endSession } from '#lib/server.js';

export const prerender = false;

const COLOR = /^#[0-9a-f]{6}$/i;
const text = (f, k, max) => String(f.get(k) ?? '').trim().slice(0, max);

export async function load({ cookies }) {
  if (!(await isAdmin(cookies))) return { authed: false, people: [] };
  const { results } = await getDb().prepare('SELECT id, sort, name, initials, g1, g2, title, note, founder, soon FROM people ORDER BY sort, id').all();
  return { authed: true, people: results };
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

  // Saves one person: updates the row if `id` is set, otherwise adds a new one.
  save: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const f = await request.formData();
    const id = Number(f.get('id')) || null;
    const soon = f.get('soon') ? 1 : 0;
    const p = {
      sort: Math.trunc(Number(f.get('sort'))) || 0,
      name: text(f, 'name', 100) || null,
      initials: text(f, 'initials', 3).toUpperCase() || null,
      g1: text(f, 'g1', 7), g2: text(f, 'g2', 7),
      title: text(f, 'title', 120), note: text(f, 'note', 300) || null,
      founder: f.get('founder') ? 1 : 0, soon
    };
    const who = p.name || 'this spot';
    if (!p.title) return fail(400, { error: `Please give ${who} a title.`, id });
    if (!soon && !p.name) return fail(400, { error: 'Please type a name (or tick “Open spot”).', id });
    if (!soon && !p.initials) return fail(400, { error: `Please add initials for ${who}.`, id });
    if (!COLOR.test(p.g1) || !COLOR.test(p.g2)) return fail(400, { error: 'Colors must look like #15803d.', id });

    const vals = [p.sort, p.name, p.initials, p.g1, p.g2, p.title, p.note, p.founder, p.soon];
    const db = getDb();
    if (id) await db.prepare('UPDATE people SET sort=?, name=?, initials=?, g1=?, g2=?, title=?, note=?, founder=?, soon=? WHERE id=?').bind(...vals, id).run();
    else await db.prepare('INSERT INTO people (sort, name, initials, g1, g2, title, note, founder, soon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(...vals).run();
    return { ok: true, message: `Saved ${who}. The Team page updates within a minute.` };
  },

  remove: async ({ request, cookies }) => {
    if (!(await isAdmin(cookies))) return fail(401, { error: 'Please log in again.' });
    const id = Number((await request.formData()).get('id'));
    if (!id) return fail(400, { error: 'Missing id.' });
    await getDb().prepare('DELETE FROM people WHERE id = ?').bind(id).run();
    return { ok: true, message: 'Removed. The Team page updates within a minute.' };
  }
};
