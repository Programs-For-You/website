<script>
  import { cn } from '#lib/cn.js';
  /** The intro paragraph under a heading. */
  let { center = false, class: cls = '', children, ...rest } = $props();
</script>

<p class={cn('max-w-[790px] text-body text-ink/80', center && 'mx-auto', cls)} {...rest}>{@render children?.()}</p>
