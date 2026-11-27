import { fail, redirect } from '@sveltejs/kit';
import { getUser, endSession, startSession, login, changePassword, passwordProblem } from '#lib/auth.js';

export const prerender = false;

export async function load({ cookies }) {
  const user = await getUser(cookies);
  if (!user) redirect(303, '/login?next=/account');
  return { user };
}

export const actions = {
  password: async ({ request, cookies, url }) => {
    const user = await getUser(cookies);
    if (!user) redirect(303, '/login?next=/account');
    const f = await request.formData();
    const next = String(f.get('password') ?? '');
    if (!(await login(user.email, String(f.get('current') ?? ''))).user) return fail(400, { error: 'Your current password isn’t right.' });
    const problem = passwordProblem(next) || (next !== String(f.get('again') ?? '') ? 'The two new passwords don’t match.' : '');
    if (problem) return fail(400, { error: problem });
    await changePassword(user.id, next);
    // PocketBase logs out every browser when the password changes, so give this one a fresh login.
    const again = await login(user.email, next);
    if (again.token) startSession(cookies, url, again.token);
    return { ok: true, message: 'Password changed.' };
  },

  logout: async ({ cookies }) => {
    endSession(cookies);
    redirect(303, '/login');
  }
};
