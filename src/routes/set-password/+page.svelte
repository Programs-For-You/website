<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import { input, field, fieldLabel, fieldHint } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  let { data, form } = $props();
</script>

<svelte:head><title>Choose a password · Programs For You</title><meta name="robots" content="noindex, nofollow"></svelte:head>

<PageHead eyebrow="Account" title={data.invite ? 'Welcome' : 'New password'} lead={data.valid ? `Choose a password for ${data.email}.` : 'This link has expired or was already used.'} />

<section class="pt-2 pb-18">
  <Container class="max-w-[520px]">
    {#if data.valid}
      <form class={card} method="POST" use:enhance>
        <div class={field}><label class={fieldLabel} for="pw">New password</label>
          <input class={input} id="pw" name="password" type="password" autocomplete="new-password" minlength="10" required>
          <span class={fieldHint}>At least 10 characters.</span></div>
        <div class={field}><label class={fieldLabel} for="again">Type it again</label>
          <input class={input} id="again" name="again" type="password" autocomplete="new-password" minlength="10" required></div>
        <FormMessage text={form?.error ?? ''} />
        <Button type="submit">Save password</Button>
      </form>
    {:else}
      <div class={card}><p class="m-0">Ask an admin to send a new invite, or <a href="/forgot">reset your password</a>.</p></div>
    {/if}
  </Container>
</section>
