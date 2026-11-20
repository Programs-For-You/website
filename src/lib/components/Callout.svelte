<script>
  import { cn } from '#lib/cn.js';
  /** tone: 'neutral' | 'info' (lime wash) | 'warn' (amber wash). Put an <svg> first inside for an icon. */
  let { tone = 'neutral', class: cls = '', children, ...rest } = $props();
</script>

<div
  class={cn(
    'flex items-start gap-3 rounded-card px-5 py-4 text-body text-ink [&_p]:m-0 [&_svg]:mt-0.5 [&_svg]:size-5 [&_svg]:shrink-0',
    tone === 'info' ? 'bg-lime-soft/60' : tone === 'warn' ? 'bg-warn-soft [&_svg]:text-warn' : 'bg-surface',
    cls
  )}
  {...rest}>
  {@render children?.()}
</div>
