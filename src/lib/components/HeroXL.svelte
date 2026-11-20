<script>
  import { onMount } from 'svelte';
  import Container from './Container.svelte';
  import ShaderBackdrop from './ShaderBackdrop.svelte';
  import { lines } from '#lib/motion/actions.js';
  import { loadGsap, reducedMotion } from '#lib/motion/gsap.js';

  /**
   * The home-page hero: one screen tall, a rounded frame of flowing colour, a huge headline that rises line by line,
   * and a row with the intro on the left and the buttons on the right.
   * As you scroll, the frame grows to the screen edges and its colours drift (scrubbed with ScrollTrigger).
   * Snippets: `actions` = the buttons, `note` = small mono line under the intro.
   */
  let { title, text = '', actions, note, class: cls = '' } = $props();
  let section = $state(), frame = $state(), canvas = $state(), buttons = $state();

  onMount(() => {
    if (reducedMotion()) return;
    let ctx, cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const small = matchMedia('(max-width: 1024px)').matches;
      const inset = small ? 8 : 12;
      ctx = gsap.context(() => {
        gsap.fromTo(frame, { clipPath: 'inset(50% 50% 50% 50% round 120px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.6, delay: 0.1, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.fromTo(buttons, { opacity: 0, y: 20, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.7, ease: 'back.out(1.7)' });
        ScrollTrigger.create({
          trigger: section, start: 'top top', end: 'bottom top', scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const o = inset * (1 - p);
            frame.style.inset = `${o}px`;
            frame.style.borderRadius = `${20 * (1 - p)}px`;
            canvas.style.opacity = String(0.9 - 0.3 * p);
            canvas.style.transform = `scale(${1 + 0.2 * p})`;
          }
        });
      }, section);
    });
    return () => { cancelled = true; ctx?.revert(); };
  });
</script>

<section bind:this={section} class="relative isolate text-white {cls}">
  <div class="absolute inset-x-0 top-0 -z-10 h-full">
    <div bind:this={frame} class="absolute inset-2 overflow-hidden rounded-card-lg bg-black desktop:inset-3">
      <div bind:this={canvas} class="absolute inset-0 opacity-90 will-change-transform"><ShaderBackdrop /></div>
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/.18)_0%,transparent_30%,transparent_65%,rgb(0_0_0/.28)_100%)]"></div>
    </div>
  </div>
  <Container class="flex min-h-[640px] h-[100lvh] flex-col justify-between gap-[60px] pt-[max(112px,min(calc(112px+(148-112)*((100vw-440px)/(1440-440))),148px))] pb-[max(32px,min(calc(32px+.012*(100vw-440px)),44px))]">
    <h1 class="mb-0 max-w-[1070px] text-display" data-lines use:lines>{title}</h1>
    <div class="flex flex-col items-start justify-between gap-6 desktop:flex-row desktop:items-end">
      <div class="max-w-[640px]">
        {#if text}<p class="mb-0 text-lead" data-lines use:lines={{ delay: 0.2 }}>{text}</p>{/if}
        {#if note}<p class="mt-5 mb-0 font-mono text-mono uppercase text-white/70">{@render note()}</p>{/if}
      </div>
      <div bind:this={buttons} class="flex flex-wrap items-center gap-3 max-[1024px]:w-full">{@render actions?.()}</div>
    </div>
  </Container>
</section>
