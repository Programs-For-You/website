<script>
  import { cn } from '#lib/cn.js';
  /** A pretend button in the mock-ups. hl = the one to click (highlighted). */
  let { hl = false, class: cls = '', children } = $props();
</script>

<span
  class={cn(
    'grid h-[30px] place-items-center rounded-lg bg-surface-2 text-[.82rem] font-semibold text-ink',
    hl && 'bg-accent text-accent-ink shadow-[0_0_0_3px_var(--accent-soft)]',
    cls
  )}>{@render children?.()}</span>
