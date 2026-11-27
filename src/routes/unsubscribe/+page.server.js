import { getDb } from '#lib/server.js';

export const prerender = false;

const find = (t) => (/^[a-f0-9]{32}$/.test(t ?? '') ? getDb().prepare('SELECT unsubscribed FROM subscribers WHERE token = ?').bind(t).first() : null);

// The link in every newsletter: /unsubscribe?t=<token>. Opening it shows a button; the button unsubscribes.
export async function load({ url }) {
  const sub = await find(url.searchParams.get('t'));
  return { valid: Boolean(sub), done: Boolean(sub?.unsubscribed) };
}

export const actions = {
  default: async ({ url }) => {
    const sub = await find(url.searchParams.get('t'));
    if (sub && !sub.unsubscribed) await getDb().prepare('UPDATE subscribers SET unsubscribed = 1 WHERE token = ?').bind(url.searchParams.get('t')).run();
    return { done: true };
  }
};
