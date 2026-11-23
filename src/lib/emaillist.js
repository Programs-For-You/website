// © 2026 Programs For You. All rights reserved.
// The Contact and Apply forms remember the email you typed, in your browser only, so you don't have to type it again.
// (There's no email list: downloads don't ask for an email.)

const KEY = 'pfy-email';

export function savedEmail() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function saveEmail(email) {
  try { localStorage.setItem(KEY, email); } catch { /* private mode: they'll just type it again next time */ }
}

// ---------- Terms of Service (asked only when downloading) ----------
// The Downloads page asks once: "I'm 13 or older and I agree to the Terms". After that this browser remembers it.
// Nothing is sent anywhere. Change TERMS_KEY when the Terms change, so everyone is asked again.
const TERMS_KEY = 'pfy-terms-13-2026-11-20';
export function termsAgreed() {
  try { return Boolean(localStorage.getItem(TERMS_KEY)); } catch { return false; }
}
export function agreeTerms() {
  try { localStorage.setItem(TERMS_KEY, new Date().toISOString()); } catch { /* storage blocked: they'll be asked again */ }
}
