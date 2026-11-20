<script>
  import { cn } from '#lib/cn.js';
  /** A white rounded box (20px) on the paper background. Pass tag="a" href="..." to make the whole card a link. */
  let { tag = 'div', class: cls = '', children, ...rest } = $props();
</script>

<svelte:element this={tag} class={cn('rounded-card-lg bg-surface p-7 desktop:p-8', tag === 'a' && 'no-underline transition-shadow duration-300 hover-fine:shadow-lift', cls)} {...rest}>
  {@render children?.()}
</svelte:element>
