<script>
  import { cn } from '#lib/cn.js';
  /** The picture area inside a step. note = the accent "pointer" line under it. pair = two pictures side by side. */
  let { note = '', pair = false, class: cls = '', children } = $props();
</script>

{#snippet arrow()}
  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
{/snippet}

<div class={cn('mt-4', pair && 'grid grid-cols-2 items-start gap-4 max-[600px]:grid-cols-[minmax(0,320px)]', cls)}>
  {@render children?.()}
  {#if note}
    <p class="mt-2.5 mb-0 flex items-center gap-1.5 text-[.85rem] font-semibold text-accent!">{@render arrow()} {note}</p>
  {/if}
</div>
