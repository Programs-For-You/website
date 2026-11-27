<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  import { onMount } from 'svelte';
  import SubscribeForm from './SubscribeForm.svelte';
  import { SCHEDULE_LAUNCH } from '#lib/config.js';
  /** Countdown to the School Schedule 1.0.0 launch (Mac and Windows). Set the date in config.js → SCHEDULE_LAUNCH. */
  const target = new Date(SCHEDULE_LAUNCH.at).getTime();
  let left = $state(null); // null until mounted, so the server and browser render the same thing

  onMount(() => {
    const tick = () => (left = Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  });

  const parts = $derived(
    left === null ? [] : [
      ['Days', Math.floor(left / 864e5)],
      ['Hours', Math.floor(left / 36e5) % 24],
      ['Minutes', Math.floor(left / 6e4) % 60],
      ['Seconds', Math.floor(left / 1e3) % 60]
    ]
  );
</script>

<section class="pb-4">
  <div class="mx-auto w-full max-w-[1100px] px-5 max-[400px]:px-4">
    <div class="rounded-[20px] border border-border bg-surface p-6 text-center">
      <p class="m-0 font-mono text-mono uppercase text-muted">School Schedule {SCHEDULE_LAUNCH.version} · Mac and Windows</p>
      {#if left === 0}
        <p class="mt-3 mb-0 text-subheading">It’s here. Version {SCHEDULE_LAUNCH.version} is out now.</p>
      {:else}
        <p class="mt-1 mb-4 text-muted">Launches {SCHEDULE_LAUNCH.label}</p>
        <div class="flex justify-center gap-3 max-[400px]:gap-2" role="timer" aria-label="Time until School Schedule {SCHEDULE_LAUNCH.version} launches">
          {#each parts as [label, n]}
            <div class="min-w-[72px] rounded-xl border border-border bg-bg-soft px-3 py-3 max-[400px]:min-w-[60px]">
              <div class="text-[clamp(1.6rem,5vw,2.2rem)] font-semibold tabular-nums leading-none">{String(n).padStart(2, '0')}</div>
              <div class="mt-1.5 text-[.75rem] uppercase text-faint">{label}</div>
            </div>
          {/each}
        </div>
      {/if}
      <div class="mt-6 border-t border-border pt-5"><SubscribeForm label="Get an email when it launches" /></div>
    </div>
  </div>
</section>
