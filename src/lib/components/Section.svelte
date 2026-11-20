<script>
  import { cn } from '#lib/cn.js';
  import Container from './Container.svelte';
  /**
   * A page band with fluid spacing (60-110px above, 80-136px below).
   * soft = a white rounded panel inset from the page edge     tight = much less space above
   * narrow / center / class style the Container inside; sectionClass styles the <section> itself.
   */
  let { soft = false, tight = false, narrow = false, center = false, class: cls = '', sectionClass = '', children, ...rest } = $props();
</script>

<section
  class={cn(tight ? 'pt-2 pb-[max(64px,min(calc(64px+.05*(100vw-440px)),104px))]' : 'section-y', soft && 'mx-2 rounded-card-lg bg-surface desktop:mx-3', sectionClass)}
  {...rest}>
  <Container {narrow} class={cn(center && 'text-center', cls)}>
    {@render children?.()}
  </Container>
</section>
