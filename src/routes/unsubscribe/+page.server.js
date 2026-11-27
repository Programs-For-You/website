import { records, f as filter } from '#lib/pb.js';

export const prerender = false;

const find = (t) => (/^[a-f0-9]{32}$/.test(t ?? '') ? records.first('subscribers', filter('token = {:t}', { t })) : null);

// The link in every newsletter: /unsubscribe?t=<token>. Opening it shows a button; the button unsubscribes.
export async function load({ url }) {
  const sub = await find(url.searchParams.get('t'));
  return { valid: Boolean(sub), done: sub?.unsubscribed ?? false };
}

export const actions = {
  default: async ({ url }) => {
    const sub = await find(url.searchParams.get('t'));
    if (sub && !sub.unsubscribed) await records.update('subscribers', sub.id, { unsubscribed: true });
    return { done: true };
  }
};
