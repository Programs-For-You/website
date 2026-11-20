<script>
  import { onMount, tick } from 'svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Section from '#lib/components/Section.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Card from '#lib/components/Card.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import EmailForm from '#lib/components/EmailForm.svelte';
  import AppCard from '#lib/components/download/AppCard.svelte';
  import GameCard from '#lib/components/download/GameCard.svelte';
  import { APPS, GAMES } from '#lib/config.js';
  import { savedEmail, forgetEmail } from '#lib/emaillist.js';

  // The Downloads page: type your email (no password) and the download buttons open up.
  // Every email goes to the email list.

  let view = $state('loading'); // 'loading' | 'gate' | 'in'
  let userEmail = $state('');
  let isWindows = $state(false);
  let isComputer = $state(true); // only phones and tablets see the "use your computer" note
  let emailForm;

  function unlock(email) {
    userEmail = email;
    view = 'in';
  }
  function showGate() { view = 'gate'; }

  onMount(() => {
    const ua = navigator.userAgent;
    const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua) && (navigator.maxTouchPoints || 0) < 2;
    isWindows = /Windows/i.test(ua);
    isComputer = isMac || isWindows || /Linux|CrOS/i.test(ua) && !/Android/i.test(ua);

    // Already gave us their email on this browser? Go straight to the apps.
    const email = savedEmail();
    if (email) unlock(email); else showGate();
  });

  async function otherEmail() {
    forgetEmail();
    emailForm?.reset();
    showGate();
    await tick();
    emailForm?.focus();
  }

  const linkBtn = 'cursor-pointer border-0 bg-transparent p-0 text-accent hover:underline hover:underline-offset-[3px]';
</script>

<Seo title="Downloads · Programs For You" description="Download free Mac apps from Programs For You. Just type your email to get them, no password needed." type="CollectionPage" />

<section class="pt-16 pb-7">
  <Container narrow>
    <h1>Downloads</h1>
    <Lead class="m-0">Simple apps that make your day easier. Just your email, no password.</Lead>
  </Container>
</section>
<Section tight narrow>
  <Card hidden={view !== 'loading'} class="p-10 text-center text-muted">Loading…</Card>

  <Card hidden={view !== 'gate'} class="mx-auto max-w-[560px] px-7 py-10 text-center">
    <div class="mx-auto mb-[18px] grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent"><svg class="size-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg></div>
    <h2 class="text-[1.5rem]">Get the apps free</h2>
    <p class="text-muted">Just type your email. No password and no account.</p>
    <EmailForm bind:this={emailForm} source="download" terms submitLabel="Get the apps" onjoined={({ email }) => unlock(email)} />
    <p class="mt-[18px] mb-4 text-[.9rem] text-muted">Want to look first? See <a href="/school-schedule">School Schedule</a> and <a href="/email-assistant">Email Assistant</a>.</p>
  </Card>

  <div hidden={view !== 'in'}>
    <Callout tone="warn" class="mb-5" hidden={isComputer}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg><p>These apps are for Mac and Windows computers. To download, open <b>programsforyou.com</b> on your computer, not your Mac.</p></Callout>
    <p class="m-0 text-[1.15rem] font-semibold">Here are your apps!</p>
    <div class="mt-[18px] mb-7 grid gap-4" id="app-list">
      {#each APPS as app (app.id)}
        <AppCard {app} {isWindows} />
      {/each}
    </div>
    <!-- Netlify finds this form in the built HTML. The agreement is sent by the script, not by this form. -->
    <form name="windows-terms" method="POST" data-netlify="true" netlify-honeypot="company" hidden>
      <input type="hidden" name="form-name" value="windows-terms">
      <input name="email"><input name="app"><input name="terms"><input name="version"><input name="agreed_at"><input name="company">
    </form>
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
        <li>Double-click the downloaded <b>.zip</b> file, then drag the app into your <b>Applications</b> folder.</li>
        <li>Double-click the app. When your Mac says it couldn’t check it, click <b>Done</b>.</li>
        <li>Open <span class="font-semibold text-ink">System Settings → Privacy &amp; Security</span>, scroll down, and click <b>Open Anyway</b>.</li>
        <li>Look for the app’s new button in the top-right of your screen.</li>
      </ol>
      <a href="/install">Full install guide with pictures →</a>
      <a class="ml-3.5" href="/install#windows">Installing on Windows →</a>
    </Card>
    <div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-[.92rem] text-muted">
      <span>On the email list as <b>{userEmail}</b></span>
      <button class={linkBtn} type="button" onclick={otherEmail}>Use a different email</button>
    </div>
  </div>

  <Card id="schoology" class="mt-7 px-[26px] py-6">
    <h3 class="mb-2.5">Link your Schoology calendar to School Schedule</h3>
    <p class="mb-3 text-[.9rem] text-muted">School Schedule for Mac (version 1.3.7 or newer) can bring in your homework from Schoology. It shows up in the <b>Homework</b> and <b>Plan</b> tabs, and you check things off as you finish them.</p>
    <ol class="mb-3 list-decimal pl-[1.25em] text-muted [&_li]:mb-1">
      <li>On your computer, sign in to <b>Schoology</b> in your web browser.</li>
      <li>Click <b>Calendar</b> at the top of the page.</li>
      <li>Click <b>Export</b> in the top right of the calendar.</li>
      <li>Copy the link it shows. It starts with <b>webcal://</b></li>
      <li>In School Schedule, right-click the clock at the top of your screen and choose <b>Settings</b>, then open the <b>Schoology</b> tab.</li>
      <li>Paste the link and click <b>Link Schoology</b>. Your homework shows up in a few seconds.</li>
      <li>Click the clock, open <b>Homework</b>, and click the circle next to an assignment when it’s done.</li>
    </ol>
    <p class="mb-3 text-[.9rem] text-muted">It syncs every 30 minutes, or click <b>Sync now</b> in the Homework tab. Right-click an assignment to change its class or open it in Schoology. Your link works like a password, so don’t share it. It stays on your Mac and is only used to download your calendar from Schoology. Don’t see an Export button? Your school may have turned it off; ask your teacher or school tech help.</p>
    <a href="/school-schedule#how-to-use">All School Schedule instructions →</a>
  </Card>
</Section>
