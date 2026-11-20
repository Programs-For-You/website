// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// The email list. Every sign-up is sent to Netlify Forms (Netlify → your site → Forms → "email-list"),
// where you can see the list, get an email for each sign-up, and download it as a spreadsheet.

const KEY = 'pfy-email';
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function savedEmail() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function saveEmail(email) {
  try { localStorage.setItem(KEY, email); } catch { /* private mode: they'll just type it again next time */ }
}
export function forgetEmail() {
  try { localStorage.removeItem(KEY); } catch { /* nothing saved */ }
}

// ---------- Terms of Service (asked only when downloading) ----------
// Asked the first time someone gets the apps (email or Google). After that the browser remembers it,
// so the box is hidden.
const TERMS_KEY = 'pfy-terms-agreed';
export function termsAgreed() {
  try { return Boolean(localStorage.getItem(TERMS_KEY)); } catch { return false; }
}
export function agreeTerms() {
  try { localStorage.setItem(TERMS_KEY, new Date().toISOString()); } catch { /* storage blocked: they'll be asked again */ }
}

/** Adds an email to the list. Returns true if Netlify saved it. */
export async function joinList(email, source, terms = '') {
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.info('[preview] Would add to the email list:', email, source); // Netlify Forms only works on the real site
    return true;
  }
  const body = new URLSearchParams({ 'form-name': 'email-list', email, source, terms, company: '' });
  try {
    const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    return r.ok;
  } catch {
    return false;
  }
}

