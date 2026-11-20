<script>
  import { cn } from '#lib/cn.js';
  /** The page column: up to 1524px wide with a 24px (48px on desktop) gutter. narrow = a ~860px reading column. */
  let { narrow = false, class: cls = '', children, ...rest } = $props();
</script>

<div class={cn('mx-auto w-full px-gutter', narrow ? 'max-w-[calc(860px+2*var(--gutter))]' : 'max-w-[1524px]', cls)} {...rest}>
  {@render children?.()}
</div>
