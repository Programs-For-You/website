<script>
  import { cn } from '#lib/cn.js';
  /** The small grey tip under a step (the old "small faint"). */
  let { class: cls = '', children } = $props();
</script>

<p class={cn('text-[.9rem] text-faint!', cls)}>{@render children?.()}</p>
