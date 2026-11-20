<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { onNavigate, afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import Header from '#lib/components/Header.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import { startSmoothScroll, getLenis } from '#lib/motion/smooth.js';
  import { initReveal, stopReveal } from '#lib/motion/reveal.js';
  import { DARK_HERO } from '#lib/chrome.js';
  import { organization, website } from '#lib/seo.js';
  // Who we are and what the site is: on every page, for search and answer engines.
  const siteLd = [organization(), website()].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}<\/script>`).join('');

  let { children } = $props();
  const here = $derived(page.url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/');
  const hasHero = $derived(DARK_HERO.includes(here));

  // Cross-fade between pages (0.8s), like a full-page view transition, where the browser supports it.
  onNavigate((navigation) => {
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  // Rescan scroll reveals after every page change (and once on first load).
  afterNavigate(() => { initReveal(); });

  onMount(() => {
    let stop = () => {};
    startSmoothScroll()
      .then((s) => (stop = s))
      .catch(() => document.documentElement.classList.remove('js-motion'));
    // Failsafe: if the reveal code never ran, never leave content hidden.
    const failsafe = setTimeout(() => {
      if (!document.querySelector('[data-reveal].is-revealed') && !document.querySelector('[data-reveal]:not(.is-revealed)')) return;
    }, 4000);
    return () => { clearTimeout(failsafe); stop(); stopReveal(); };
  });
</script>

<svelte:head>{@html siteLd}</svelte:head>

<div>
  <a class="absolute -left-[9999px] focus:top-3 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2" href="#main">Skip to content</a>
  <Header />
  <main id="main" class="page-sheet {hasHero ? '' : 'pt-[104px] desktop:pt-[132px]'}">
    {@render children()}
  </main>
  <Footer />
</div>
