<script>
  import { page } from '$app/state';
  import Button from '#lib/components/Button.svelte';
  import Container from '#lib/components/Container.svelte';
  import Seo from '#lib/components/Seo.svelte';
</script>

<Seo title="Page not found · Programs For You" noindex />
<section class="py-30 text-center">
  <Container narrow>
    {#if page.status === 404}
      <p class="mb-3 text-[.78rem] font-semibold tracking-[.09em] text-accent uppercase">404</p>
      <h1>This page wandered off.</h1>
      <p class="mx-auto max-w-[620px] text-[1.15rem] text-muted">The link might be old, or the address might have a typo.</p>
    {:else}
      <h1>Something went wrong.</h1>
      <p class="mx-auto max-w-[620px] text-[1.15rem] text-muted">{page.error?.message}</p>
    {/if}
    <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Button href="/">Go home</Button>
      <Button href="/email-assistant" variant="ghost">Apps</Button>
    </div>
  </Container>
</section>
