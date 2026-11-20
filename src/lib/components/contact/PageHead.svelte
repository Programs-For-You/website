<script>
  import Container from '#lib/components/Container.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  /** The top band of the contact, apply and admin pages (eyebrow, h1, lead). */
  let { eyebrow, title, lead } = $props();
</script>

<section class="pt-16 pb-7">
  <Container>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1>{title}</h1>
    <Lead class="m-0">{lead}</Lead>
  </Container>
</section>
