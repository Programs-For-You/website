<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  import Button from './Button.svelte';
  import FormMessage from './FormMessage.svelte';
  import { input } from '#lib/ui.js';
  /** "Get updates by email" signup. Posts to /api/subscribe. */
  let { label = 'Get an email when there’s news' } = $props();
  let state = $state('idle'), error = $state('');

  async function submit(e) {
    e.preventDefault();
    state = 'busy'; error = '';
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', body: new FormData(e.currentTarget) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
      state = 'done';
    } catch (err) { error = err.message; state = 'idle'; }
  }
</script>

{#if state === 'done'}
  <p class="m-0 font-semibold">You’re on the list. Check your inbox.</p>
{:else}
  <form class="mx-auto max-w-[460px]" onsubmit={submit}>
    <label class="mb-2 block text-[.9rem] font-semibold" for="sub-email">{label}</label>
    <div class="flex gap-2 max-[420px]:flex-col">
      <input class={input} id="sub-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required>
      <Button type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'Signing up…' : 'Sign up'}</Button>
    </div>
    <p class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true"><label>Leave this empty <input name="company" tabindex="-1" autocomplete="off"></label></p>
    <p class="mt-2 mb-0 text-[.8rem] text-faint">Only news about our apps. Unsubscribe any time.</p>
    <FormMessage class="mt-3 mb-0" text={error} />
  </form>
{/if}
