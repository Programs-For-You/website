import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '#lib/server.js';
import { getUser, endSession, login, changePassword, passwordProblem } from '#lib/auth.js';

export const prerender = false;

export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login?next=/account');
  return { user };
}

export const actions = {
  password: async ({ request, cookies }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login?next=/account');
    const f = await request.formData();
    const next = String(f.get('password') ?? '');
    if (!(await login(user.email, String(f.get('current') ?? ''))).user) return fail(400, { error: 'Your current password isn’t right.' });
    const problem = passwordProblem(next) || (next !== String(f.get('again') ?? '') ? 'The two new passwords don’t match.' : '');
    if (problem) return fail(400, { error: problem });
    await changePassword(user.id, next);
    // Log out every other browser, keeping this one.
    const keep = cookies.get('pfy-session');
    await getDb().prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').bind(user.id, await sha256(keep)).run();
    return { ok: true, message: 'Password changed.' };
  },

  logout: async ({ cookies }) => {
    await endSession(cookies);
    redirect(303, '/login');
  }
};

async function sha256(t) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))), (b) => b.toString(16).padStart(2, '0')).join('');
}
