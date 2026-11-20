// Svelte actions for the motion system.
import { loadGsap, reducedMotion } from './gsap.js';

/**
 * Headline that rises line by line out of a mask (SplitText). Use on headings: <h1 data-lines use:lines>.
 * The data-lines attribute (in the markup) keeps it invisible until split, so there is no flash.
 * options.onScroll: wait until the heading scrolls into view (default: play right away, as in a hero).
 */
export function lines(node, options = {}) {
  let split, st, destroyed = false, played = false;

  loadGsap().then(async ({ gsap, ScrollTrigger, SplitText }) => {
    if (destroyed) return;
    if (reducedMotion()) { node.classList.add('is-split'); return; }
    await (document.fonts?.ready ?? Promise.resolve());
    if (destroyed) return;
    // autoSplit re-splits by itself when the font loads or the width changes, so lines always match what is on screen.
    split = SplitText.create(node, {
      type: 'lines', linesClass: 'line', mask: 'lines', aria: false, autoSplit: true,
      onSplit(self) {
        node.classList.add('is-split');
        if (played) { gsap.set(self.lines, { yPercent: 0 }); return; }
        gsap.set(self.lines, { yPercent: 110 });
        const play = () => { played = true; gsap.to(self.lines, { yPercent: 0, duration: 0.9, ease: 'power2.out', stagger: 0.07, delay: options.delay ?? 0 }); };
        if (options.onScroll) { st?.kill(); st = ScrollTrigger.create({ trigger: node, start: 'top 88%', once: true, onEnter: play }); }
        else play();
      }
    });
  });

  return {
    destroy() {
      destroyed = true;
      st?.kill();
      split?.revert();
    }
  };
}

/** Pointer-follow direction for list rows: sets --hx/--hy origin so the fill enters from the nearest edge. */
export function edgeFill(node) {
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)');
  const fill = node.querySelector('[data-fill]');
  if (!fine.matches || !fill) return {};
  const edge = (e) => {
    const r = node.getBoundingClientRect();
    const d = { top: e.clientY - r.top, right: r.right - e.clientX, bottom: r.bottom - e.clientY, left: e.clientX - r.left };
    return Object.entries(d).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
  };
  const from = { top: 'translateY(-100%)', bottom: 'translateY(100%)', left: 'translateX(-100%)', right: 'translateX(100%)' };
  const enter = (e) => {
    const side = edge(e);
    fill.style.transition = 'none';
    fill.style.transform = from[side];
    fill.getBoundingClientRect();
    fill.style.transition = '';
    fill.style.transform = 'translate(0,0)';
  };
  const leave = (e) => { fill.style.transform = from[edge(e)]; };
  node.addEventListener('mouseenter', enter);
  node.addEventListener('mouseleave', leave);
  return { destroy() { node.removeEventListener('mouseenter', enter); node.removeEventListener('mouseleave', leave); } };
}
