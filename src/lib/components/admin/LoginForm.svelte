<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import { input, field, fieldLabel } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  let { error = '' } = $props();
</script>

<form class={card} method="POST" action="?/login" use:enhance>
  <div class={field}><label class={fieldLabel} for="pw">Password</label>
    <input class={input} id="pw" name="password" type="password" autocomplete="current-password" required></div>
  <FormMessage text={error} />
  <Button type="submit">Log in</Button>
</form>
