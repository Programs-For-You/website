<script>
  import Container from './Container.svelte';
  import ShaderBackdrop from './ShaderBackdrop.svelte';
  import Eyebrow from './Eyebrow.svelte';
  import { lines } from '#lib/motion/actions.js';

  /**
   * Hero for app pages: a rounded frame of flowing colour, a label chip, a big headline, then intro on the left and
   * buttons on the right. Put anything extra (an app icon, a status badge) in the `top` snippet, the buttons in `actions`,
   * and a small print line in `note`. `side` places a picture on the right of the headline on wide screens.
   */
  let { eyebrow = '', title, text = '', top, actions, note, side, class: cls = '' } = $props();
</script>

<section class="relative isolate text-white {cls}">
  <div class="absolute inset-x-0 top-0 -z-10 h-full">
    <div class="absolute inset-2 overflow-hidden rounded-card-lg bg-black desktop:inset-3">
      <ShaderBackdrop class="opacity-90" />
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/.18)_0%,transparent_35%,transparent_60%,rgb(0_0_0/.3)_100%)]"></div>
    </div>
  </div>
  <Container class="flex min-h-[min(100lvh,820px)] flex-col justify-between gap-12 pt-[max(112px,min(calc(112px+(148-112)*((100vw-440px)/(1440-440))),148px))] pb-[max(32px,min(calc(32px+.012*(100vw-440px)),44px))]">
    <div class="grid items-start gap-10 {side ? 'desktop:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : ''}">
      <div class="flex flex-col items-start gap-6">
        {#if top}<div class="flex items-center gap-4">{@render top()}</div>{/if}
        {#if eyebrow}<Eyebrow>{eyebrow}</Eyebrow>{/if}
        <h1 class="mb-0 max-w-[1070px] text-[max(2.9rem,min(calc(2.9rem+.05*(100vw-27.5rem)),5.9rem))] leading-none tracking-[-.03em]" data-lines use:lines>{title}</h1>
      </div>
      {#if side}<div class="min-w-0" data-reveal>{@render side()}</div>{/if}
    </div>
    <div class="flex flex-col items-start justify-between gap-6 desktop:flex-row desktop:items-end">
      <div class="max-w-[640px]">
        {#if text}<p class="mb-0 text-lead" data-lines use:lines={{ delay: 0.2 }}>{text}</p>{/if}
        {#if note}<p class="mt-5 mb-0 font-mono text-mono normal-case text-white/70">{@render note()}</p>{/if}
      </div>
      {#if actions}<div class="flex flex-wrap items-center gap-3 max-[1024px]:w-full">{@render actions()}</div>{/if}
    </div>
  </Container>
</section>
