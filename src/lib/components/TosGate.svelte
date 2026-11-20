<script>
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import { tos, acceptTos, rememberReturn } from '#lib/tos.svelte.js';

  /**
   * The "I Agree" screen shown on every page until the Terms are accepted (not on the legal pages).
   * It is in the built HTML but hidden by CSS unless <html> has the tos-unaccepted class, which app.html sets before paint.
   * The inert page behind it is handled in +layout.svelte.
   */
  let checked = $state(false);
  let msg = $state('');
  let box = $state();

  onMount(() => { if (tos.unaccepted) box?.focus({ preventScroll: true }); });
  function decline() {
    checked = false;
    msg = 'You need to accept the Terms of Service to use programsforyou.com. You can still read the Terms and Privacy Policy.';
  }
</script>

<div class="print:hidden fixed inset-0 z-[1000] hidden items-center justify-center bg-[rgba(12,12,14,.5)] p-5 backdrop-blur-[12px] tos-unaccepted:flex" role="dialog" aria-modal="true" aria-labelledby="tos-title">
  <div class="max-h-[calc(100vh-40px)] w-full max-w-[480px] overflow-auto rounded-[22px] border border-border bg-surface px-7 pt-8 pb-[26px] text-center text-ink shadow-[0_30px_80px_rgba(0,0,0,.3)]">
    <img class="mx-auto mb-3.5" src="/assets/img/logo.svg" alt="" width="48" height="48">
    <h2 id="tos-title" class="mb-2.5 text-[1.45rem]">Welcome to Programs For You</h2>
    <p class="mb-5 text-muted">Before you continue, please read and accept our <a href="/terms" onclick={rememberReturn}>Terms of Service</a> and <a href="/privacy" onclick={rememberReturn}>Privacy Policy</a>. They’re a binding agreement between you and Programs For You. Serious violations, like copying our code, cost at least $5,000 each and can lead to legal action.</p>
    <label class="flex cursor-pointer items-start gap-2.5 text-left text-[.95rem] leading-[1.45]"><input class="mt-0.5 size-[18px] flex-none accent-accent" type="checkbox" bind:this={box} bind:checked onchange={() => (msg = '')}> <span>I am 18 or older, and I have read and agree to the Terms of Service and Privacy Policy.</span></label>
    <div class="mt-5 flex flex-wrap justify-center gap-2.5 max-[600px]:[&_a]:flex-1 max-[600px]:[&_button]:flex-1">
      <Button class="min-w-[140px]" disabled={!checked} onclick={() => checked && acceptTos({ gated: true })}>I Agree</Button>
      <Button variant="ghost" class="min-w-[140px]" onclick={decline}>I Don’t Agree</Button>
    </div>
    <p class="mt-3.5 mb-0 min-h-[1.2em] text-[.9rem] text-muted" role="status">{msg}</p>
  </div>
</div>
