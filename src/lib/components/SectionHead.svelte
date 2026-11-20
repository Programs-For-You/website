<script>
  import Eyebrow from './Eyebrow.svelte';
  import Lead from './Lead.svelte';
  import { cn } from '#lib/cn.js';
  /**
   * The headline group. Label on the left, big heading and intro on the right (stacked on phones),
   * each column with a faint rounded tab on top.  split={false} puts everything in one column.
   * Extra content (a button) can go inside as children, under the intro.
   * lines = animate the heading line by line when it scrolls into view (default on).
   */
  let { eyebrow = '', title, lead = '', split = true, lines: animate = true, class: cls = '', children } = $props();
  import { lines } from '#lib/motion/actions.js';
  const tab = "relative before:absolute before:top-0 before:left-0 before:h-3 before:w-full before:rounded-t-lg before:border-x before:border-t before:border-ink before:opacity-10 before:content-[''] pt-12";
</script>

<div class={cn('mb-[max(40px,min(calc(40px+.04*(100vw-440px)),72px))] grid gap-11', split && eyebrow && 'desktop:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]', cls)}>
  {#if eyebrow}<div class={cn(tab, !split && 'pt-0 before:hidden')}><Eyebrow>{eyebrow}</Eyebrow></div>{/if}
  <div class={cn('flex flex-col items-start gap-[max(20px,min(calc(20px+.04*(100vw-440px)),60px))] max-desktop:pt-0', tab, !eyebrow && 'pt-0 before:hidden', eyebrow && 'max-desktop:before:hidden')}>
    {#if animate}<h2 class="mb-0 text-heading" data-lines use:lines={{ onScroll: true }}>{title}</h2>{:else}<h2 class="mb-0 text-heading">{title}</h2>{/if}
    {#if lead}<Lead data-reveal>{lead}</Lead>{/if}
    {@render children?.()}
  </div>
</div>
