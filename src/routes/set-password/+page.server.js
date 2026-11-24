import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '#lib/server.js';
import { findToken, changePassword, passwordProblem } from '#lib/auth.js';

export const prerender = false;

// The link from an invite or reset email: /set-password?token=...
export async function load({ url }) {
  const who = await findToken(url.searchParams.get('token'));
  return { valid: Boolean(who), name: who?.name ?? '', email: who?.email ?? '', invite: who?.kind === 'invite' };
}

export const actions = {
  default: async ({ request, url }) => {
    const who = await findToken(url.searchParams.get('token'));
    if (!who) return fail(400, { error: 'This link has expired or was already used. Ask for a new one.' });
    const f = await request.formData();
    const pw = String(f.get('password') ?? '');
    const problem = passwordProblem(pw) || (pw !== String(f.get('again') ?? '') ? 'The two passwords don’t match.' : '');
    if (problem) return fail(400, { error: problem });
    await changePassword(who.id, pw); // also uses up the link
    await getDb().prepare('DELETE FROM sessions WHERE user_id = ?').bind(who.id).run(); // a reset logs out every other browser
    redirect(303, '/login?reset');
  }
};
