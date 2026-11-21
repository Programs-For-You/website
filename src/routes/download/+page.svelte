<script>
  import { onMount } from 'svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Section from '#lib/components/Section.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Card from '#lib/components/Card.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import { check } from '#lib/ui.js';
  import { cn } from '#lib/cn.js';
  import AppCard from '#lib/components/download/AppCard.svelte';
  import GameCard from '#lib/components/download/GameCard.svelte';
  import { APP, GAMES } from '#lib/config.js';
  import { termsAgreed, agreeTerms } from '#lib/emaillist.js';

  // The Downloads page: check "I'm 13 or older and I agree to the Terms" once, and the download buttons open up.
  // No email, no password, no account. Nothing is sent anywhere; the browser just remembers the checkbox.

  let view = $state('loading'); // 'loading' | 'gate' | 'in'
  let agreed = $state(false);
  let msg = $state('');
  let isComputer = $state(true); // only phones and tablets see the "use your computer" note

  function showGate() { view = 'gate'; }
  function enter(e) {
    e.preventDefault();
    if (!agreed) { msg = 'Please check the box first.'; return; }
    agreeTerms();
    view = 'in';
  }

  onMount(() => {
    const ua = navigator.userAgent;
    const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua) && (navigator.maxTouchPoints || 0) < 2;
    isComputer = isMac || /Windows|Linux|CrOS/i.test(ua) && !/Android/i.test(ua);

    // Already agreed on this browser? Go straight to the apps.
    if (termsAgreed()) view = 'in'; else showGate();
  });
</script>

<Seo title="Downloads · Programs For You" description="Download Programs For You for Mac, with School Calendar, Email Assistant, and Screen Assistant inside, plus free TI-84 Evo games. No email, no password, no account." type="CollectionPage" />

<section class="pt-16 pb-7">
  <Container narrow>
    <h1>Downloads</h1>
    <Lead class="m-0">Simple apps that make your day easier. Free, with no email and no account.</Lead>
  </Container>
</section>
<Section tight narrow>
  <Card hidden={view !== 'loading'} class="p-10 text-center text-muted">Loading…</Card>

  <Card hidden={view !== 'gate'} class="mx-auto max-w-[560px] px-7 py-10 text-center">
    <div class="mx-auto mb-[18px] grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent"><svg class="size-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg></div>
    <h2 class="text-[1.5rem]">Get Programs For You free</h2>
    <p class="text-muted">No email, no password, and no account.</p>
    <form class="mx-auto max-w-[460px] text-left" onsubmit={enter} novalidate>
      <label class={cn(check, 'mb-3 justify-center text-left')}><input type="checkbox" bind:checked={agreed} onchange={() => (msg = '')}><span>I’m 13 or older, and I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</span></label>
      <FormMessage text={msg} kind="error" class="mb-3 text-center" />
      <div class="flex justify-center"><Button variant="primary" type="submit" class="h-[46px] max-[480px]:w-full">Show the download</Button></div>
    </form>
    <p class="mt-[18px] mb-4 text-[.9rem] text-muted">Want to look first? See <a href="/school-calendar">School Calendar</a>, <a href="/email-assistant">Email Assistant</a>, and <a href="/screen-assistant">Screen Assistant</a>.</p>
  </Card>

  <div hidden={view !== 'in'}>
    <Callout tone="warn" class="mb-5" hidden={isComputer}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg><p>Programs For You is a Mac app. To download it, open <b>programsforyou.com</b> on your Mac.</p></Callout>
    <p class="m-0 text-[1.15rem] font-semibold">Here’s your app!</p>
    <p class="m-0 mt-1 text-[.95rem] text-muted">One download gets you everything. Turn each tool on or off in its Settings.</p>
    <div class="mt-[18px] mb-7 grid gap-4" id="app-list">
      <AppCard app={APP} />
    </div>
    <h3 class="mt-9 mb-1" id="games">TI-84 Evo games</h3>
    <p class="text-[.9rem] text-muted">For your graphing calculator. <a href="/ti-84-evo-games#how-to-install">How to put them on your calculator</a></p>
    <div class="mt-[18px] mb-7 grid gap-4" id="game-list">
      {#each GAMES as game (game.id)}
        <GameCard {game} />
      {/each}
    </div>
    <Card class="px-[26px] py-6">
      <h3 class="mb-2.5">Opening an app for the first time?</h3>
      <ol class="mb-3 list-decimal pl-[1.25em] text-muted [&_li]:mb-1">
        <li>Double-click the downloaded <b>.zip</b> file, then drag <b>Programs For You</b> into your <b>Applications</b> folder.</li>
        <li>Double-click the app. When your Mac says it couldn’t check it, click <b>Done</b>.</li>
        <li>Open <span class="font-semibold text-ink">System Settings → Privacy &amp; Security</span>, scroll down, and click <b>Open Anyway</b>.</li>
        <li>Programs For You opens its window, and each tool adds a button to the top of your screen.</li>
      </ol>
      <a href="/install">Full install guide with pictures →</a>
    </Card>
  </div>

</Section>
