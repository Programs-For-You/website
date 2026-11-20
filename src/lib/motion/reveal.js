// Scroll reveal for every element marked data-reveal: fades up 20px, 0.8s, staggered 0.05s.
// Only runs on desktop with motion allowed (the CSS in app.css hides the elements only in that case).
import { loadGsap, reducedMotion, isDesktop } from './gsap.js';

let triggers = [];

function showAll() {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
}

/** (Re)scan the page. Call after every navigation. */
export async function initReveal() {
  triggers.forEach((t) => t.kill());
  triggers = [];
  if (reducedMotion() || !isDesktop()) return showAll();
  const els = [...document.querySelectorAll('[data-reveal]:not(.is-revealed)')];
  if (!els.length) return;
  const { gsap, ScrollTrigger } = await loadGsap();
  triggers = ScrollTrigger.batch(els, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.05, overwrite: true,
        onComplete: () => batch.forEach((el) => { el.classList.add('is-revealed'); gsap.set(el, { clearProps: 'opacity,transform' }); })
      })
  });
}

export function stopReveal() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}
