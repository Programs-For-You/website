<script>
  import { cn } from '#lib/cn.js';
  /** A numbered how-to list. Put <Step n={1} title="...">…</Step> inside. */
  let { class: cls = '', children, ...rest } = $props();
</script>

<ol class={cn('m-0 grid list-none gap-7 p-0', cls)} {...rest}>{@render children?.()}</ol>
