<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import { input, field, fieldLabel, fieldHint } from '#lib/ui.js';
  import { card, ROLE_LABEL } from '#lib/admin.js';

  let { data, form } = $props();
</script>

<svelte:head><title>Your account · Programs For You</title><meta name="robots" content="noindex, nofollow"></svelte:head>

<PageHead eyebrow="Account" title={`Hi, ${data.user.name.split(' ')[0]}`} lead={`You’re logged in as ${data.user.email} (${ROLE_LABEL[data.user.role]}).`} />

<section class="pt-2 pb-18">
  <Container class="grid max-w-[520px] gap-5">
    {#if data.user.role.startsWith('admin')}<div class={card}><a href="/admin">Open the admin dashboard →</a></div>{/if}
    <form class={card} method="POST" action="?/password" use:enhance>
      <h2 class="mb-4 text-[1.1rem]">Change your password</h2>
      <div class={field}><label class={fieldLabel} for="cur">Current password</label>
        <input class={input} id="cur" name="current" type="password" autocomplete="current-password" required></div>
      <div class={field}><label class={fieldLabel} for="pw">New password</label>
        <input class={input} id="pw" name="password" type="password" autocomplete="new-password" minlength="10" required>
        <span class={fieldHint}>At least 10 characters.</span></div>
      <div class={field}><label class={fieldLabel} for="again">Type it again</label>
        <input class={input} id="again" name="again" type="password" autocomplete="new-password" minlength="10" required></div>
      <FormMessage kind="ok" text={form?.message ?? ''} />
      <FormMessage text={form?.error ?? ''} />
      <Button type="submit">Change password</Button>
    </form>
    <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline">Log out</Button></form>
  </Container>
</section>
