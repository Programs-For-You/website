<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import { input, field, fieldLabel, fine } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  let { form } = $props();
</script>

<svelte:head><title>Reset password · Programs For You</title><meta name="robots" content="noindex, nofollow"></svelte:head>

<PageHead eyebrow="Account" title="Reset your password" lead="Type your email and we’ll send you a link to choose a new password." />

<section class="pt-2 pb-18">
  <Container class="max-w-[520px]">
    {#if form?.ok}
      <div class={card}><p class="m-0">If that email has an account, a reset link is on its way. It works for 1 hour.</p></div>
    {:else}
      <form class={card} method="POST" use:enhance>
        <div class={field}><label class={fieldLabel} for="email">Email</label>
          <input class={input} id="email" name="email" type="email" autocomplete="username" required></div>
        <FormMessage text={form?.error ?? ''} />
        <Button type="submit">Send reset link</Button>
        <p class={fine}><a href="/login">Back to log in</a></p>
      </form>
    {/if}
  </Container>
</section>
