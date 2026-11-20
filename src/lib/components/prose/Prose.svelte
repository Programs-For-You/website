<script>
  import { cn } from '#lib/cn.js';
  /** Long-form legal text: the old .prose styles (740px column, muted body text, ink-coloured strong). */
  let { class: cls = '', children, ...rest } = $props();
</script>

<div
  class={cn(
    'max-w-[740px]',
    '[&_h2]:mt-[2.2em] [&_h2]:text-[1.4rem] [&_h3]:mt-[1.6em]',
    '[&_li]:mb-[.4em] [&_li]:text-muted [&_p]:text-muted',
    '[&_ol]:my-[1em] [&_ol]:list-decimal [&_ol]:pl-[1.3em] [&_ul]:my-[1em] [&_ul]:list-disc [&_ul]:pl-[1.3em]',
    '[&_strong]:text-ink',
    cls
  )}
  {...rest}
>
  {@render children?.()}
</div>
