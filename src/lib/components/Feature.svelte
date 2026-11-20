<script>
  import { cn } from '#lib/cn.js';
  /** A white card with a lime icon tile, a title and a sentence. Pass the <svg> through the `icon` snippet. */
  let { title, icon, class: cls = '', children } = $props();
</script>

<div class={cn('rounded-card bg-surface p-6', cls)} data-reveal>
  <div class="mb-6 grid size-11 place-items-center rounded-card-sm bg-lime-soft text-ink [&_svg]:size-5">{@render icon?.()}</div>
  <h3 class="mb-2">{title}</h3>
  <div class="text-body text-ink/80 [&_p]:m-0">{@render children?.()}</div>
</div>
