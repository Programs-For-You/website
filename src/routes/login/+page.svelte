<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import { input, field, fieldLabel, fine } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  let { data, form } = $props();
</script>

<svelte:head><title>Log in · Programs For You</title><meta name="robots" content="noindex, nofollow"></svelte:head>

<PageHead eyebrow="Account" title="Log in" lead="For Programs For You admins. Accounts are made by an Admin 1, who emails you an invite." />

<section class="pt-2 pb-18">
  <Container class="max-w-[520px]">
    <form class={card} method="POST" use:enhance>
      <FormMessage kind="ok" text={data.reset ? 'Password saved. Log in with it below.' : ''} />
      <div class={field}><label class={fieldLabel} for="email">Email</label>
        <input class={input} id="email" name="email" type="email" autocomplete="username" value={form?.email ?? ''} required></div>
      <div class={field}><label class={fieldLabel} for="pw">Password</label>
        <input class={input} id="pw" name="password" type="password" autocomplete="current-password" required></div>
      <FormMessage text={form?.error ?? ''} />
      <Button type="submit">Log in</Button>
      <p class={fine}><a href="/forgot">Forgot your password?</a></p>
    </form>
  </Container>
</section>
