// The Terms of Service "I Agree" state. app.html sets html.tos-unaccepted before the first paint;
// this file keeps it in sync after that.
import { goto } from '$app/navigation';

export const LEGAL_PATHS = ['/terms', '/privacy', '/founders-agreement'];
export const isLegal = (pathname) => LEGAL_PATHS.includes(pathname.replace(/\.html$/, '').replace(/\/$/, ''));

export const tos = $state({ unaccepted: false });

export function initTos() {
  tos.unaccepted = document.documentElement.classList.contains('tos-unaccepted');
}

/** Remember the agreement. If they came from another page to read the Terms, send them back there. */
export function acceptTos({ gated }) {
  try {
    localStorage.setItem('pfy-tos', window.PFY_TOS);
    localStorage.setItem('pfy-tos-accepted-at', new Date().toISOString());
  } catch { /* storage blocked: they'll be asked again next time */ }
  document.documentElement.classList.remove('tos-unaccepted');
  tos.unaccepted = false;
  let back = null;
  try { back = sessionStorage.getItem('pfy-tos-return'); sessionStorage.removeItem('pfy-tos-return'); } catch { /* nothing saved */ }
  if (!gated && back && back.startsWith(location.origin + '/') && back !== location.href) goto(back);
}

/** Link click handler for "Terms of Service" / "Privacy Policy" links inside the gate. */
export function rememberReturn() {
  try { sessionStorage.setItem('pfy-tos-return', location.href); } catch { /* fine */ }
}
