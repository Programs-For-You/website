// Who is signed in (Firebase, or pretend in preview mode). The header reads this; other pages may too.
import { onUser } from './auth.js';

export const account = $state({ ready: false, user: null });
let started = false;

/** Call once from the root layout, in the browser. */
export function startAccount() {
  if (started) return;
  started = true;
  onUser((u) => { account.user = u; account.ready = true; });
}
