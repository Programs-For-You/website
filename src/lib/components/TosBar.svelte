<script>
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import { acceptTos } from '#lib/tos.svelte.js';

  /** The "I Agree" bar at the bottom of the Terms / Privacy / Founders' Agreement pages (only until accepted). The layout renders it. */
  let checked = $state(false);
</script>

<div class="print:hidden sticky bottom-0 z-50 hidden border-t border-border bg-surface py-3.5 shadow-[0_-10px_30px_rgba(0,0,0,.08)] tos-unaccepted:block" role="region" aria-label="Accept the Terms">
  <Container class="flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-stretch">
    <label class="flex cursor-pointer items-start gap-2.5 text-left text-[.95rem] leading-[1.45]"><input class="mt-0.5 size-[18px] flex-none accent-accent" type="checkbox" bind:checked> <span>I am 18 or older, and I have read and agree to the Terms of Service and Privacy Policy.</span></label>
    <Button size="sm" disabled={!checked} onclick={() => checked && acceptTos({ gated: false })} class="max-[600px]:flex-1">I Agree</Button>
  </Container>
</div>
