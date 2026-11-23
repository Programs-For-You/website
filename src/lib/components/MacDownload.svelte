<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  import Button from './Button.svelte';
  import Eyebrow from './Eyebrow.svelte';
  import AgreeBox from './AgreeBox.svelte';
  import Icon from './apphero/Icon.svelte';
  import { gate } from '#lib/agree.svelte.js';
  import { MAC_APP } from '#lib/config.js';
  /** The Mac app download: one app with School Schedule, Email Assistant, and Screen Assistant inside. */
  const app = MAC_APP;
  const ready = app.status === 'available' && Boolean(app.file);
  const inside = [
    { name: 'School Schedule', icon: '/assets/img/school-schedule.svg', text: 'Your classes, a live countdown, and homework.' },
    { name: 'Email Assistant', icon: '/assets/img/email-assistant.svg', text: 'A daily email summary with one-click replies.' },
    { name: 'Screen Assistant', icon: '/assets/img/screen-assistant.svg', text: 'Press ⌥ Space for help with what’s on your screen.' }
  ];
</script>

<div class="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center gap-10 rounded-[20px] border border-border bg-surface p-[max(24px,min(calc(24px+.02*(100vw-440px)),44px))] max-[900px]:grid-cols-1 max-[900px]:gap-8">
  <div class="flex flex-col gap-5">
    <Eyebrow>Download</Eyebrow>
    <div class="flex items-center gap-4">
      <img class="size-[72px] flex-none" src={app.icon} alt="" width="72" height="72">
      <div>
        <h2 class="mb-1 text-subheading">{app.name}</h2>
        {#if ready}<p class="m-0 font-mono text-mono uppercase text-muted">Version {app.version} · {app.size} · Free</p>{/if}
      </div>
    </div>
    <p class="m-0 text-lead text-muted">All three apps in one download. Install it once and everything lives in the bar at the top of your screen.</p>
    <div class="flex flex-wrap items-center gap-3">
      {#if ready}
        <Button variant="notch" href={app.file} download onclick={gate}>Download for Mac</Button>
        <Button variant="ghost" size="sm" href="/install">How to install</Button>
        <AgreeBox class="mt-1" />
      {:else}
        <Button tag="span" variant="ghost" aria-disabled="true">Coming soon</Button>
      {/if}
    </div>
    <p class="m-0 text-[.85rem] text-faint">{app.requires}</p>
  </div>
  <ul class="m-0 grid list-none gap-3 p-0">
    {#each inside as a}
      <li class="flex items-center gap-4 rounded-xl border border-border bg-bg-soft p-4">
        <img class="size-12 flex-none rounded-xl" src={a.icon} alt="" width="48" height="48">
        <div><h3 class="mb-0.5 text-[1.05rem]">{a.name}</h3><p class="m-0 text-[.9rem] text-muted">{a.text}</p></div>
      </li>
    {/each}
  </ul>
</div>
