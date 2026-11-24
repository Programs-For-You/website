// © 2026 Programs For You. All rights reserved.
// Shared "I'm 13 or older and I agree to the Terms" state for every download button.
// Nothing is sent anywhere: the browser just remembers the checkbox (see emaillist.js).
import { termsAgreed, agreeTerms } from '#lib/emaillist.js';

export const agree = $state({ ok: false, warn: false });

export function loadAgree() {
  agree.ok = termsAgreed();
}
export function setAgree(v) {
  agree.ok = v;
  agree.warn = false;
  if (v) agreeTerms();
}
/** onclick for download buttons: stops the download until the box is checked. */
export function gate(e) {
  if (agree.ok) return;
  e.preventDefault();
  agree.warn = true;
  // The box nearest the button (a page can have more than one; they share one checkmark).
  const box = e.currentTarget?.closest?.('section')?.querySelector('[data-agree]') ?? document.querySelector('[data-agree]');
  box?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
