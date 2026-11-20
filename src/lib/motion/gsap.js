// Loads GSAP and its plugins on demand (browser only) and registers them once.
let loading;

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isDesktop = () => typeof matchMedia !== 'undefined' && matchMedia('(min-width: 1025px)').matches;

/** @returns {Promise<{ gsap: any, ScrollTrigger: any, SplitText: any, MorphSVGPlugin: any }>} */
export function loadGsap() {
  if (!loading) {
    loading = (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { MorphSVGPlugin }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('gsap/MorphSVGPlugin')
      ]);
      gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin);
      return { gsap, ScrollTrigger, SplitText, MorphSVGPlugin };
    })();
  }
  return loading;
}
