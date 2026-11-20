<script>
  import Seo from '#lib/components/Seo.svelte';
  import { softwareApp } from '#lib/seo.js';
  import Button from '#lib/components/Button.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import Section from '#lib/components/Section.svelte';
  import Container from '#lib/components/Container.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Feature from '#lib/components/Feature.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import Showcase from '#lib/components/Showcase.svelte';
  import ShowcaseBody from '#lib/components/ShowcaseBody.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import SchedPanel from '#lib/components/SchedPanel.svelte';
  import { APPS } from '#lib/config.js';

  const grid3 = 'grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1';
  const app = APPS.find((a) => a.id === 'school-schedule');
  const soon = !(app && app.status === 'available' && app.file);

  const YEAR_CODE = 'Year:2026;Adv:3;Limit:C286;NoS:CFD9EBECF0FDGFGGGHI5I6I9IAIBIC010I262728292A4855565758597F;Short:CHFCHAI40D0J103C50848586';
  let copyLabel = $state('Copy code');
  let codeEl;
  async function copyCode() {
    let ok = false;
    try { await navigator.clipboard.writeText(YEAR_CODE); ok = true; } catch {
      if (codeEl) getSelection().selectAllChildren(codeEl);
    }
    copyLabel = ok ? 'Copied!' : 'Press Ctrl+C to copy';
    setTimeout(() => { copyLabel = 'Copy code'; }, 2000);
  }

  const features = [
    { title: 'Live class timer', paths: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', body: 'A timer counts down exactly what’s left in class, like 11:42. It’s in the menu bar too, with seconds if you want them.' },
    { title: 'WHS built in, any school works', paths: '<path d="M2.5 9.5L12 4.5l9.5 5-9.5 5-9.5-5z"/><path d="M6.5 11.8v4.7c0 1.2 2.5 3 5.5 3s5.5-1.8 5.5-3v-4.7"/><path d="M21.5 9.5v5"/>', body: 'Comes with the WHS bell schedule, the Day 1–4 rotation, and advisory. Different school? Change the times and classes in a few steps.' },
    { title: 'Just type your homework', paths: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>', body: 'After class, type something like “bio worksheet due Fri, math test Thursday.” It figures out the class, the due date, and how long it’ll take.' },
    { title: 'A homework plan for you', paths: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>', body: 'The Plan tab spreads your homework over the nights before it’s due, and gives tests study time on the nights right before.' },
    { title: 'Homework from Schoology', paths: '<path d="M20 12a8 8 0 0 1-14.3 4.9"/><path d="M4 12a8 8 0 0 1 14.3-4.9"/><path d="M18.5 3v4.2h-4.2"/><path d="M5.5 21v-4.2h4.2"/>', body: 'Link your Schoology calendar and your assignments show up by themselves. Check them off as you finish. <a href="/download#schoology">How to link it</a>' },
    { title: 'Overlay bar or floating card', paths: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M15 6.25h3"/>', body: 'Keep it on top of your windows. The overlay bar sits in a corner, see-through, and opens with your timeline and homework when you hover on it.' },
    { title: 'Asks after every class', paths: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>', body: 'When a class ends, a notification asks if you got homework. Type it right into the notification. Reminders come the night before, too.' },
    { title: 'After-school events', paths: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>', body: 'Add practices and clubs. It counts down your free time until they start.' },
    { title: 'Make it yours', paths: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.5-1.9-.3-1.1.4-2.1 1.6-2.1H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.8" r="1"/>', body: 'Six themes or your own colors, an icon for every class, 12- or 24-hour time, sharp or round corners, and a code-style font.' },
    { title: 'Stays on your Mac', paths: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Your classes and homework are saved on your Mac only. No sign-in inside the app.' }
  ];

  const wrench = '<path d="M14.5 5.5a4.2 4.2 0 0 0-5.3 5.3l-5.9 5.9a1.6 1.6 0 0 0 2.3 2.3l5.9-5.9a4.2 4.2 0 0 0 5.3-5.3l-2.6 2.6-2.3-.4-.4-2.3z"/>';
  const sparkle = '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>';
  const dl = '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>';
</script>

{#snippet path(t)}<span class="font-semibold text-ink">{t}</span>{/snippet}
{#snippet chg(kind, text)}
  <p class="mb-2 grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 text-muted last:mb-0 max-[480px]:grid-cols-1 max-[480px]:gap-0.5">
    <span class="inline-flex items-center gap-[5px] text-[.8rem] font-bold {kind === 'fixed' ? 'text-warn' : 'text-accent'}"><svg class="size-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html kind === 'fixed' ? wrench : sparkle}</svg> {kind === 'fixed' ? 'Fixed' : 'Added'}</span><span>{text}</span>
  </p>
{/snippet}

<Seo
  title="School Schedule · Programs For You"
  description="A free Mac app that shows your current class and a live countdown in the menu bar, with homework, reminders, and WHS built in." jsonLd={[softwareApp('school-schedule')]} />

<section class="pt-16 pb-10">
  <Container class="grid grid-cols-2 items-center gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-9">
    <div>
      <img class="size-[84px] rounded-[21px]" src="/assets/img/school-schedule.svg" alt="" width="84" height="84">
      <h1 class="mt-[18px] text-[clamp(2.2rem,4.6vw,3.1rem)]">School Schedule</h1>
      <Lead class="mb-[18px]">Always know what period it is, right from the top of your screen.</Lead>
      <StatusBadge id="school-schedule" />
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="primary" href="/download" class="min-w-[214px] max-[480px]:w-full"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html dl}</svg> Mac Download</Button>
        <Button variant="ghost" href="/download" class="min-w-[214px] max-[480px]:w-full"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html dl}</svg> Windows Download</Button>
      </div>
      <p class="mt-3.5 mb-0 font-semibold"><a href="#how-to-use">How to use it →</a></p>
      <p class="mt-3.5 mb-0 text-[.86rem] text-faint">Mac: macOS 14 Sonoma or newer · Windows: Windows 10 or 11 · Free</p>
      <p class="mt-3.5 mb-0 text-[.86rem] text-faint">By Owen Wang &amp; Brady Krupa · <a href="/downloads/SchoolSchedule-source.zip">Open source (GNU AGPL v3)</a></p>
    </div>
    <Showcase aria-hidden="true">
      <MenuBar />
      <ShowcaseBody><SchedPanel full fluid /></ShowcaseBody>
    </Showcase>
  </Container>
</section>

<Section soft>
  <SectionHead eyebrow="Features" title="Everything for your school day" />
  <div class={grid3}>
    {#each features as f}
      <Feature title={f.title}>
        {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html f.paths}</svg>{/snippet}
        <p>{@html f.body}</p>
      </Feature>
    {/each}
  </div>
</Section>

<Section narrow id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use School Schedule" />
  {#if soon}
    <Callout tone="info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg><p>School Schedule is coming soon. These steps show how it will work when it launches.</p></Callout>
  {/if}
  <Steps class="mt-7">
    <Step n={1} title="Install it"><p>Download the app and open it the first time by following the <a href="/install">install guide</a>. It only takes a few clicks.</p></Step>
    <Step n={2} title="Pick your school"><p>The first time it opens, choose <b>WHS</b> to use the built-in schedule, or <b>My school is different</b> to type in your own times.</p></Step>
    <Step n={3} title="Different school? Enter your times"><p>Type the start and end time for each period. If your school rotates days (like Day 1–4 or A/B days), pick how many days are in the rotation and which classes meet on each day.</p></Step>
    <Step n={4} title="Add your classes"><p>Type the name of each class, like Biology or Algebra II. You can change them anytime in Settings.</p></Step>
    <Step n={5} title="Click the clock at the top of your screen"><p>The button shows your current class and a timer with what’s left. Click it to see today’s schedule, your homework plan, and your homework list. Right-click it for more options.</p></Step>
    <Step n={6} title="Type your homework after class"><p>When a class ends, a notification asks <b>“Got homework?”</b> Click <b>Add Homework</b> and type it, like <b>worksheet due Friday</b>. Or click the clock and type in the <b>Got homework? Type it here</b> box at the bottom. You can put several things in one line: <b>bio worksheet due fri, math test thursday, read ch 5</b>. Press <b>Return</b>.</p>
      <p class="text-[.9rem]">If you don’t say the class, it uses the class you’re in or just left. Say “test” or “quiz” and it plans study time. Made a mistake? Click <b>Undo</b>.</p></Step>
    <Step n={7} title="Follow your plan"><p>Open the <b>Plan</b> tab. <b>Tonight</b> shows what to do, how long each thing should take, and when to start (after school and practice). Check things off as you finish. Big projects and test studying are split over a few nights.</p>
      <p class="text-[.9rem]">Something will take longer? Right-click it in the <b>Homework</b> tab and choose <b>How long will it take?</b> To change how much homework time you get each night, go to {@render path('Settings → Reminders → Homework plan')}.</p></Step>
    <Step n={8} title="Link Schoology (optional)"><p>In Schoology on the web, click <b>Calendar</b>, then <b>Export</b>, and copy the link (it starts with <b>webcal://</b>). In School Schedule, open {@render path('Settings → Schoology')}, paste it, and click <b>Link Schoology</b>. Your Schoology homework shows up in the <b>Homework</b> and <b>Plan</b> tabs. Click the circle next to one when you’re done. <a href="/download#schoology">Step-by-step instructions</a></p>
      <p class="text-[.9rem]">It syncs every 30 minutes, or click <b>Sync now</b> in the Homework tab. Right-click an assignment to change its class or open it in Schoology. Needs version 1.3.7 or newer.</p></Step>
    <Step n={9} title="Keep it on your screen"><p>Click the <b>pin</b> at the top of the panel (or right-click the clock → <b>Keep on Screen</b>). A small window stays on top of your other windows with your class timer and tonight’s homework. Drag it by the top to move it. Click the arrows to make it smaller, or the pin again to put it away.</p></Step>
    <Step n={10} title="Try the overlay bar"><p>Right-click the clock → <b>On Screen → Overlay Bar</b>. A bar shows up in the bottom-left corner with your class, a progress bar, the percent done, the time left, and what’s next. Clicks go right through it. <b>Hover over it for a second</b> and it opens with today’s timeline, your plan, your homework, and the homework box. <b>Hide (10s)</b> gets it out of the way for ten seconds. Change its corner, see-through amount, and size in {@render path('Settings → Look → On screen')}.</p></Step>
    <Step n={11} title="Make it yours"><p>In {@render path('Settings → Look')}, pick a theme or <b>Custom</b> colors, 24-hour time, sharp corners, and a code-style font. In {@render path('Settings → Classes')}, click a class’s circle to pick its icon. Right-click the clock → <b>Show Seconds</b> for a timer like 11:42 in the menu bar. You can also add after-school events (on weekdays or one date), change reminders, and pick your advisory day.</p>
      <p class="text-[.9rem]">New school year? Paste the <b>yearly info code</b> (the same one the Windows app uses) in {@render path('Settings → School')}, or click <b>Copy this year’s code</b> to share yours.</p></Step>
  </Steps>

  <h3 class="mt-14">Tips and fixes</h3>
  <div class="mt-3.5 grid gap-2.5">
    <FaqItem q="I can’t see the button at the top of my screen."><p>When the menu bar is full, macOS hides some icons, especially on MacBooks with a notch. Quit a few other menu-bar apps, or hold <kbd>⌘</kbd> and drag icons to make room. On macOS 26, also check {@render path('System Settings → Menu Bar')} and make sure School Schedule is allowed.</p></FaqItem>
    <FaqItem q="I don’t get the “Got homework?” notification."><p>Open {@render path('System Settings → Notifications → School Schedule')} and turn on <b>Allow Notifications</b>. Choose <b>Alerts</b> so it stays until you answer. Also check that {@render path('Settings → Reminders → After class')} is on in the app.</p></FaqItem>
    <FaqItem q="Today’s schedule is wrong (it says short day or advisory when it isn’t)."><p>Use the <b>Short day</b> and <b>Advisory</b> buttons right under the date in School Schedule’s window to turn either one on or off for today. You can also right-click the button at the top of your screen and choose <b>Short Day Today</b> or <b>Advisory Day Today</b>. Click <b>Reset</b> to go back to the school calendar. It only changes that one day.</p></FaqItem>
    <FaqItem q="On Windows, it says November 19, 20, 23 or 24 is a short day.">
      <p>Those early-release days are only for grades K-8. The Mac version is already fixed. To fix the Windows version:</p>
      <p>In School Schedule Manager, click <b>Settings</b>, then <b>Edit Yearly Info</b>. Paste this code where it says “Paste import code here,” then click <b>Save and Close</b>:</p>
      <p><code bind:this={codeEl} class="block rounded-card-sm border border-border bg-surface-2 px-3 py-2.5 font-mono text-[.82rem] break-all select-all">{YEAR_CODE}</code></p>
      <p><Button variant="ghost" size="sm" onclick={copyCode} class="[&_svg]:size-4!"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg> <span>{copyLabel}</span></Button></p>
    </FaqItem>
    <FaqItem q="Can I get it for Windows?"><p>Yes, for School Schedule! Its Windows version is Owen Wang’s original <b>School Schedule Manager</b>. Get it on our <a href="/download">Downloads</a> page: check the box to agree to <a href="https://github.com/un-undefined/school-schedule-manager/blob/main/TermsOfService.md">Owen Wang’s Terms of Service</a>, click <b>Windows Download</b>, open the Setup file, and follow the steps. Its source code is on GitHub: <a href="https://github.com/un-undefined/school-schedule-manager">github.com/un-undefined/school-schedule-manager</a>. Windows versions of Email Assistant and Screen Assistant are coming soon.</p></FaqItem>
    <FaqItem q="Is the Windows version the same as the Mac version?"><p>Not quite. The Windows version is Owen Wang’s original <b>School Schedule Manager</b>, and the Mac version is built from it with extras. Both show your classes, the time left, and your day’s schedule. Only the Mac version has the homework list and tonight’s plan, the quick homework box with AI, the “Got homework?” reminder after class, the Short day and Advisory buttons, and automatic updates. New Windows versions show up on our <a href="/download">Downloads</a> page and <a href="https://github.com/un-undefined/school-schedule-manager/releases">Owen’s GitHub page</a>.</p></FaqItem>
    <FaqItem q="Does it use AI? Is my homework sent anywhere?"><p>On Macs with Apple Intelligence turned on, it uses the AI built into your Mac to estimate how long things take. Everything stays on your Mac. On other Macs, it reads your note with its own built-in rules.</p></FaqItem>
    <FaqItem q="The day number is wrong today."><p>Snow days and special schedules can throw off the rotation. Open Settings and set today’s day number. It will count from there.</p></FaqItem>
    <FaqItem q="How do I quit it?"><p>Click its button at the top of your screen and choose <b>Quit</b>.</p></FaqItem>
    <FaqItem q="Where is my information saved?"><p>On your Mac only. Nothing about your classes or homework is sent to us. If you link Schoology, the app downloads your calendar straight from Schoology.</p></FaqItem>
    <FaqItem q="My Schoology homework isn’t showing up."><p>Open {@render path('Settings → Schoology')} and click <b>Sync now</b>. If it says the link didn’t work, copy it again from Schoology (<b>Calendar → Export</b>) and paste the whole link. Only assignments due today or later come in. If you can’t find <b>Export</b>, your school may have turned it off.</p></FaqItem>
  </div>
</Section>

<Section soft narrow id="updates">
  <div class="mb-11">
    <Eyebrow>Updates</Eyebrow>
    <h2>What’s new on Mac</h2>
    <p class="text-muted">The app updates itself, so you always have the newest version. Here’s what recent updates fixed and added. The Windows version doesn’t get these updates.</p>
  </div>
  <div class="grid gap-3.5">
    <article class="rounded-card border border-border bg-surface px-5 py-[18px]">
      <h3 class="mb-2.5 flex items-center gap-2.5 text-[1.05rem]">Version 1.3.8 <Badge tone="ok" class="h-[22px] text-[.74rem]">Newest</Badge></h3>
      {@render chg('fixed', 'Automatic updates work again. Version 1.3.7 couldn’t install itself on most Macs, so this update brings everyone to the newest version.')}
      {@render chg('added', 'Everything from 1.3.7, including your Schoology calendar: link it in Settings → Schoology and your homework shows up by itself.')}
    </article>
    <article class="rounded-card border border-border bg-surface px-5 py-[18px]">
      <h3 class="mb-2.5 flex items-center gap-2.5 text-[1.05rem]">Version 1.3.7</h3>
      {@render chg('added', 'Link your Schoology calendar in Settings → Schoology and your homework shows up by itself in the Homework and Plan tabs. Check things off as you finish them.')}
    </article>
    <article class="rounded-card border border-border bg-surface px-5 py-[18px]">
      <h3 class="mb-2.5 flex items-center gap-2.5 text-[1.05rem]">Version 1.3.6</h3>
      {@render chg('fixed', 'After an update, the app now always tells you what changed, even if its notifications are turned off.')}
      {@render chg('added', 'A short What’s New card after each update that shows what was fixed and what was added. You can open it anytime from Settings.')}
    </article>
  </div>
</Section>

<!-- Repeat download call to action (new; the legacy page had none). -->
<Section center id="get-it">
  <h2>Get School Schedule</h2>
  <Lead center class="mb-0">Free for Mac and Windows. Just type your email to download.</Lead>
  <div class="mt-[26px] flex flex-wrap items-center justify-center gap-3">
    <Button variant="primary" href="/download"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html dl}</svg> Mac Download</Button>
    <Button variant="ghost" href="/download"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html dl}</svg> Windows Download</Button>
  </div>
</Section>
