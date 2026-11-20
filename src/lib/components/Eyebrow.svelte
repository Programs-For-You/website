<script>
  import { cn } from '#lib/cn.js';
  /** The small label chip: white tile, lime square, mono caps. Used above headings and as a tag. */
  let { class: cls = '', children, ...rest } = $props();
</script>

<p class={cn('mb-0 inline-flex w-fit items-center rounded-lg bg-surface py-2 pr-3 pl-2 font-mono text-mono leading-none text-ink uppercase before:mr-3 before:size-2.5 before:bg-lime before:content-[\'\']', cls)} {...rest}>{@render children?.()}</p>
