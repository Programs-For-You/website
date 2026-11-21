<script>
  import { onMount } from 'svelte';
  import Container from './Container.svelte';
  import Button from './Button.svelte';
  import ShaderBackdrop from './ShaderBackdrop.svelte';
  import { loadGsap, reducedMotion } from '#lib/motion/gsap.js';
  import { getLenis } from '#lib/motion/smooth.js';

  let footer = $state(), bg = $state();
  const label = 'font-mono text-[max(.8125rem,min(calc(.8125rem+.001*(100vw-27.5rem)),.875rem))] leading-none uppercase';
  const link = 'link-draw w-fit pb-[.2em] text-[1.75rem] leading-none tracking-[-.02em] text-white desktop:text-[1.125rem]';
  const col = 'flex flex-col gap-5 desktop:border-l desktop:border-white/20 desktop:pl-5';

  function top() {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.2 }); else scrollTo({ top: 0, behavior: 'smooth' });
  }

  // The colour field behind the footer drifts up into place as the footer is revealed.
  onMount(() => {
    if (reducedMotion()) return;
    let tween, cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      gsap.set(bg, { y: -120, opacity: 0.6 });
      tween = gsap.to(bg, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true } });
    });
    return () => { cancelled = true; tween?.scrollTrigger?.kill(); tween?.kill(); };
  });
</script>

<footer bind:this={footer} class="print:hidden relative z-0 overflow-clip bg-black pt-10 pb-6 text-white">
  <div bind:this={bg} class="pointer-events-none absolute inset-0 opacity-60"><ShaderBackdrop tone="night" scale={0.4} /></div>
  <Container class="relative z-1 flex flex-col pt-10 desktop:min-h-[calc(100vh-120px)] desktop:pt-[60px]">
    <div class="flex flex-1 flex-col gap-[50px] pb-[70px] min-[1281px]:grid min-[1281px]:grid-cols-[minmax(0,1fr)_minmax(0,634px)] min-[1281px]:items-start min-[1281px]:pb-[100px]">
      <div>
        <h2 class="mb-0 max-w-[16ch] text-[max(1.75rem,min(calc(1.75rem+.014*(100vw-27.5rem)),2.625rem))] leading-[1.2] tracking-[-.02em] text-white">Ready to make your day easier?</h2>
        <p class="mt-5 mb-0 max-w-[34ch] text-[max(.875rem,min(calc(.875rem+.005*(100vw-27.5rem)),1.1875rem))] leading-[1.3] text-white/80">Grab the app. No email or password needed.</p>
        <div class="mt-10"><Button href="/download" variant="notch">Get the app</Button></div>
      </div>
      <nav class="relative flex flex-col gap-[50px] border-l border-white/20 pl-5 desktop:grid desktop:grid-cols-2 desktop:gap-10 desktop:border-l-0 desktop:pl-0 min-[1281px]:pr-[88px]" aria-label="Footer">
        <div class={col}>
          <p class="{label} mb-0">Apps</p>
          <div class="flex flex-col gap-2"><a class={link} href="/school-calendar">School Calendar</a><a class={link} href="/email-assistant">Email Assistant</a><a class={link} href="/screen-assistant">Screen Assistant</a><a class={link} href="/ti-84-evo-games">TI-84 Evo Games</a><a class={link} href="/download">Downloads</a></div>
        </div>
        <div class={col}>
          <p class="{label} mb-0">Help</p>
          <div class="flex flex-col gap-2"><a class={link} href="/install">How to install</a><a class={link} href="/#faq">FAQ</a><a class={link} href="/contact">Contact us</a><a class={link} href="/founders">Founders</a><a class={link} href="/team">Team</a><a class={link} href="/apply">Join the team</a></div>
        </div>
        <button type="button" onclick={top} aria-label="Back to top" class="group absolute top-0 right-0 size-12 cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-transparent">
          <svg class="absolute inset-0 m-auto size-3 transition-transform duration-[400ms] ease-in-out-quart group-hover-fine:-translate-y-8" viewBox="0 0 12 12" fill="#fff" aria-hidden="true"><path d="M5.25 2.869V12h1.5V2.869l4.2 4.2L12 6 6 0 0 6l1.05 1.069 4.2-4.2Z"/></svg>
          <span class="absolute inset-0 grid translate-y-[110%] place-items-center rounded-[inherit] bg-white text-ink transition-transform duration-[400ms] ease-in-out-quart group-hover-fine:translate-y-0"><svg class="size-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M5.25 2.869V12h1.5V2.869l4.2 4.2L12 6 6 0 0 6l1.05 1.069 4.2-4.2Z"/></svg></span>
        </button>
      </nav>
    </div>

    <p class="mb-8 select-none text-[clamp(2.6rem,10.2vw,10rem)] leading-[.95] tracking-[-.04em] text-white/90" aria-hidden="true">Programs For You</p>

    <div class="flex flex-col gap-5 font-mono text-[max(.75rem,min(calc(.75rem+.001*(100vw-27.5rem)),.8125rem))] leading-[1.4] uppercase min-[1281px]:grid min-[1281px]:grid-cols-[minmax(0,1fr)_minmax(0,634px)]">
      <div class="max-w-[90ch] text-white/70 text-pretty">
        <p class="mb-0">© 2026 Programs For You. All rights reserved.</p>
      </div>
      <div class="flex flex-wrap gap-x-10 gap-y-3 desktop:justify-end min-[1281px]:pr-[88px]"><a class="link-draw" href="/terms">Terms of Service</a><a class="link-draw" href="/privacy">Privacy Policy</a></div>
    </div>
  </Container>
</footer>
