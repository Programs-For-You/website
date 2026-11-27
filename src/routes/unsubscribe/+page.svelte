<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  let { data, form } = $props();
  const done = $derived(form?.done || data.done);
</script>

<svelte:head><title>Unsubscribe · Programs For You</title><meta name="robots" content="noindex, nofollow"></svelte:head>

<PageHead eyebrow="Updates" title={done ? 'You’re unsubscribed' : 'Unsubscribe'} lead={!data.valid ? 'This link isn’t valid. Use the Unsubscribe link in the latest email, or write to us on the Contact page.' : done ? 'You won’t get any more update emails from us.' : 'Stop getting update emails from Programs For You?'} />

{#if data.valid && !done}
  <section class="pt-2 pb-18"><Container class="max-w-[520px]">
    <form method="POST" use:enhance><Button type="submit">Unsubscribe</Button></form>
  </Container></section>
{/if}
