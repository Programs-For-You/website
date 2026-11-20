<script>
  import { cn } from '#lib/cn.js';
  /** The soft gradient "desk" picture frame on app pages. center = content centered in a column (Email Assistant). */
  let { center = false, class: cls = '', children, ...rest } = $props();
</script>

<div
  class={cn(
    'relative min-h-[440px] overflow-hidden rounded-card-lg border border-border bg-(--desk)',
    center && 'flex flex-col items-center justify-center gap-3.5 px-5 py-10 max-[480px]:px-3.5 max-[480px]:py-6',
    cls
  )}
  {...rest}>
  {@render children?.()}
</div>
