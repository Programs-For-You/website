import { fail } from '@sveltejs/kit';
import { getDb } from '#lib/server.js';
import { cleanEmail, emailOk, sendLink, recentToken } from '#lib/auth.js';

export const prerender = false;

export const actions = {
  default: async ({ request, url }) => {
    const email = cleanEmail((await request.formData()).get('email'));
    if (!emailOk(email)) return fail(400, { error: 'Please type your email address.' });
    const user = await getDb().prepare('SELECT id, email, name FROM users WHERE email = ? AND disabled = 0').bind(email).first();
    if (user && !(await recentToken(user.id))) await sendLink(url.origin, user, 'reset');
    // Same answer whether or not the email has an account, so this can't be used to find out who has one.
    return { ok: true };
  }
};
