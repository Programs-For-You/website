<script>
  import Container from '#lib/components/Container.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  /** The top band of the contact, apply and admin pages (eyebrow, h1, lead). center = centered text. */
  let { eyebrow, title, lead, center = false } = $props();
</script>

<section class="pt-16 pb-7">
  <Container class={center ? 'flex flex-col items-center text-center' : ''}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1>{title}</h1>
    <Lead {center} class={center ? 'mx-auto mb-0' : 'm-0'}>{lead}</Lead>
  </Container>
</section>
