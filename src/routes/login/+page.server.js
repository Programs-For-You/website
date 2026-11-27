import { fail, redirect } from '@sveltejs/kit';
import { getUser, login, startSession, landing, cleanEmail } from '#lib/auth.js';

export const prerender = false;

export async function load({ cookies, url }) {
  const user = await getUser(cookies);
  if (user) redirect(303, landing(user, url.searchParams.get('next')));
  return { reset: url.searchParams.has('reset') };
}

export const actions = {
  default: async ({ request, cookies, url }) => {
    const f = await request.formData();
    const email = cleanEmail(f.get('email'));
    const res = await login(email, String(f.get('password') ?? '').slice(0, 200));
    if (res.error) return fail(401, { error: res.error, email });
    startSession(cookies, url, res.token);
    redirect(303, landing(res.user, url.searchParams.get('next')));
  }
};
