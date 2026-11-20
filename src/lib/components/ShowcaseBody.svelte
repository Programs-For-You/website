<script>
  import { cn } from '#lib/cn.js';
  /** Holds the schedule panel under the pretend menu bar, pushed to the right (centered on small screens). */
  let { class: cls = '', children } = $props();
</script>

<div class={cn('flex justify-end px-7 pt-2 pb-8 max-[900px]:justify-center max-[480px]:px-3.5 max-[480px]:pb-6', cls)}>{@render children?.()}</div>
