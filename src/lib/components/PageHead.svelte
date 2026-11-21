<script>
  import Eyebrow from './Eyebrow.svelte';
  import Lead from './Lead.svelte';
  import { lines } from '#lib/motion/actions.js';
  /**
   * The top of a plain page: label chip on the left, big headline and intro on the right (stacked on phones).
   * Put extra content (stats, buttons) inside as children; it goes under the intro.
   * center = one centered column instead (label, then headline, then intro), like the Founders and Team pages.
   */
  let { eyebrow = '', title, lead = '', center = false, children } = $props();
  const tab = "relative pt-12 before:absolute before:top-0 before:left-0 before:h-3 before:w-full before:rounded-t-lg before:border-x before:border-t before:border-ink before:opacity-10 before:content-['']";
</script>

<section class="pb-[max(40px,min(calc(40px+.04*(100vw-440px)),72px))]">
  {#if center}
  <div class="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-[max(20px,min(calc(20px+.04*(100vw-440px)),40px))] px-gutter pt-12 text-center">
    {#if eyebrow}<Eyebrow>{eyebrow}</Eyebrow>{/if}
    <h1 class="mb-0 text-[max(2.6rem,min(calc(2.6rem+.05*(100vw-27.5rem)),5.5rem))] leading-none tracking-[-.03em]" data-lines use:lines>{title}</h1>
    {#if lead}<Lead center data-reveal>{lead}</Lead>{/if}
    {@render children?.()}
  </div>
  {:else}
  <div class="mx-auto grid w-full max-w-[1524px] gap-11 px-gutter desktop:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
    <div class={tab}>{#if eyebrow}<Eyebrow>{eyebrow}</Eyebrow>{/if}</div>
    <div class="{tab} flex flex-col items-start gap-[max(20px,min(calc(20px+.04*(100vw-440px)),48px))] max-desktop:before:hidden max-desktop:pt-0">
      <h1 class="mb-0 text-[max(2.6rem,min(calc(2.6rem+.05*(100vw-27.5rem)),5.5rem))] leading-none tracking-[-.03em]" data-lines use:lines>{title}</h1>
      {#if lead}<Lead data-reveal>{lead}</Lead>{/if}
      {@render children?.()}
    </div>
  </div>
  {/if}
</section>
