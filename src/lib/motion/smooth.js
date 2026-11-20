// Smooth (eased) scrolling with Lenis, kept in step with GSAP's ScrollTrigger.
import { loadGsap, reducedMotion } from './gsap.js';

let lenis = null;

export function getLenis() { return lenis; }

/** Starts smooth scrolling. Returns a function that stops it. Does nothing when the visitor prefers reduced motion. */
export async function startSmoothScroll() {
  if (lenis || reducedMotion()) return () => {};
  const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import('lenis'), loadGsap()]);
  if (lenis) return () => {};
  lenis = new Lenis({ lerp: 0.1, duration: 1.2, autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}
