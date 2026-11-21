<script>
  import Seo from '#lib/components/Seo.svelte';
  import { faqPage, softwareApp } from '#lib/seo.js';
  import { HOME_FAQ } from '#lib/faq-home.js';
  import Button from '#lib/components/Button.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import Section from '#lib/components/Section.svelte';
  import Container from '#lib/components/Container.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Card from '#lib/components/Card.svelte';
  import Feature from '#lib/components/Feature.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import SchedPanel from '#lib/components/SchedPanel.svelte';
  import AskCard from '#lib/components/AskCard.svelte';
  import HeroXL from '#lib/components/HeroXL.svelte';
  import { SITE } from '#lib/config.js';

  const grid3 = 'grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1';

  // The Mac picture is drawn 980px wide and scaled down to fit, like the legacy site.js ResizeObserver did.
  let macWidth = $state(0);
  const scale = $derived(macWidth ? Math.min(1, macWidth / 980) : 1);

  const how = [
    { title: '1. Check one box', paths: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>', body: 'No email, no password, and no account. Agree to the Terms and the downloads open right up.' },
    { title: '2. Download and open', paths: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>', body: 'Download Programs For You and follow the <a href="/install">install guide</a>. The first time, your Mac asks you to allow it.' },
    { title: '3. Click the button up top', paths: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M15 6.25h3"/>', body: 'Each tool gets a button in the bar at the top of your screen. Click it anytime.' }
  ];
  const why = [
    { title: 'Private by design', paths: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Your schedule and homework stay on your Mac. Email Assistant and Screen Assistant use the AI built into your Mac, so we never see your email or your screen.' },
    { title: 'Simple on purpose', paths: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>', body: 'Each app does one job well and stays out of your way until you need it.' },
    { title: 'Free', paths: '<path d="M12 20s-7.5-4.6-9.2-9.5C1.6 7 3.8 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.2 0 5.4 3 4.2 6.5C19.5 15.4 12 20 12 20z"/>', body: 'Every app here is free, with no email needed to download.' }
  ];
  const apps = [
    {
      id: 'school-calendar', name: 'School Calendar', icon: '/assets/img/school-schedule.svg', plat: 'Inside Programs For You', page: '/school-calendar',
      blurb: 'Always know what class you’re in, how many minutes are left, and what homework is due.',
      points: ['Live countdown at the top of your screen', 'The whole school year on one calendar', 'Homework list with reminders']
    },
    {
      id: 'email-assistant', name: 'Email Assistant', icon: '/assets/img/email-assistant.svg', plat: 'Inside Programs For You', page: '/email-assistant',
      blurb: 'Once a day, a little card sums up your email and lets you reply with one click.',
      points: ['Daily summary card in the corner of your screen', 'Pick a ready-made reply or type your own', 'On screen: replies for any email you have open']
    },
    {
      id: 'screen-assistant', name: 'Screen Assistant', icon: '/assets/img/screen-assistant.svg', plat: 'Inside Programs For You', page: '/screen-assistant',
      blurb: 'Press ⌥ Space and your personal assistant looks at what you’re working on and helps.',
      points: ['Summarize, explain, or quiz you on any page', 'Turns assignments into to-dos with reminders', 'Only looks when you ask']
    }
  ];
</script>

<Seo
  title="Programs For You: simple apps that make your day easier"
  description="Programs For You: one free Mac app for students with a school calendar and live class countdown, an email assistant that writes replies, and a helper that sees your screen." jsonLd={[faqPage(HOME_FAQ), softwareApp('programs-for-you'), softwareApp('school-calendar'), softwareApp('email-assistant'), softwareApp('screen-assistant')]} />

<HeroXL title="Simple apps that make your day easier." text="Your school schedule, your email, and a helper that can see your screen, all one click away. Free, simple, and private.">
  {#snippet note()}Free · No email needed · For Mac{/snippet}
  {#snippet actions()}
    <Button variant="notch" href="/download">Get the app</Button>
    <Button variant="outline" href="#how" class="border-white/40 text-white hover-fine:bg-white/10">How it works</Button>
  {/snippet}
</HeroXL>

<Section tight sectionClass="pt-[max(60px,min(calc(60px+.05*(100vw-440px)),110px))]">
  <div data-reveal>
    <div
      class="relative mx-auto aspect-[980/700] w-full max-w-[980px] overflow-hidden rounded-[18px] border border-border bg-(--desk) text-left shadow-lift max-[640px]:aspect-auto max-[640px]:rounded-2xl"
      style:--s={scale}
      bind:clientWidth={macWidth}
      aria-hidden="true">
      <div class="absolute top-0 left-0 h-[700px] w-[980px] origin-top-left [transform:scale(var(--s))] max-[640px]:static max-[640px]:flex max-[640px]:h-auto max-[640px]:w-auto max-[640px]:flex-col max-[640px]:items-center max-[640px]:gap-3.5 max-[640px]:pb-[18px] max-[640px]:[transform:none]">
        <MenuBar class="absolute inset-x-0 top-0 max-[640px]:static max-[640px]:self-stretch" />
        <img class="absolute top-[58px] left-[18px] h-auto w-[470px] max-[640px]:hidden" src="/assets/img/screen-assistant-panel.png" width="680" height="636" alt="">
        <SchedPanel class="absolute top-9 right-[92px] max-[640px]:static max-[640px]:w-[calc(100%-28px)]! max-[640px]:max-w-[380px]" />
        <AskCard size="md" fakeOther class="absolute right-[22px] bottom-[22px] max-[640px]:static max-[640px]:w-[calc(100%-28px)]! max-[640px]:max-w-[380px]" options={[
          { title: 'Thanks, see you Friday!', note: 'Short and friendly' },
          { title: 'Could you share a study guide?', note: 'Asks a question back' }
        ]} />
      </div>
    </div>
  </div>
</Section>

<Section id="apps">
  <SectionHead eyebrow="The app" title="One app. Three tools." lead="Download Programs For You once and you get School Calendar, Email Assistant, and Screen Assistant. Each one gets its own button at the top of your screen." />
  <div class={grid3}>
    {#each apps as a}
      <Card tag="article" class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <img class="size-[60px] flex-none rounded-[15px]" src={a.icon} alt="" width="60" height="60">
          <div><h3 class="mb-1.5 text-[1.3rem]">{a.name}</h3><StatusBadge id={a.id} /><span class="mt-[5px] block text-[.8rem] text-faint">{a.plat}</span></div>
        </div>
        <p class="m-0 text-muted">{a.blurb}</p>
        <ul class="checklist">
          {#each a.points as p}<li>{p}</li>{/each}
        </ul>
        <div class="mt-auto flex flex-wrap items-center gap-3 pt-1"><Button variant="ghost" size="sm" href={a.page}>Learn more</Button></div>
      </Card>
    {/each}
  </div>
  <Card tag="a" href="/ti-84-evo-games" class="mt-[22px] flex items-center gap-[18px] text-inherit hover:border-accent hover:no-underline max-[600px]:flex-wrap">
    <img src="/assets/img/ti-games.svg" width="56" height="56" alt="">
    <div>
      <h3 class="mb-1 flex flex-wrap items-center gap-2.5">TI-84 Evo Games <StatusBadge id="gridpop" /></h3>
      <p class="m-0 text-muted">Grid Pop, Block Bop, and Blackjack: free games we made for your graphing calculator.</p>
    </div>
    <span class="ml-auto font-semibold whitespace-nowrap text-accent max-[600px]:ml-0">See the games →</span>
  </Card>
</Section>

<Section soft id="how">
  <SectionHead eyebrow="How it works" title="Up and running in three steps" />
  <div class={grid3}>
    {#each how as f}
      <Feature title={f.title}>
        {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html f.paths}</svg>{/snippet}
        <p>{@html f.body}</p>
      </Feature>
    {/each}
  </div>
</Section>

<Section>
  <div class={grid3}>
    {#each why as f}
      <Feature title={f.title}>
        {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html f.paths}</svg>{/snippet}
        <p>{f.body}</p>
      </Feature>
    {/each}
  </div>
</Section>

<Section soft narrow id="faq">
  <SectionHead eyebrow="FAQ" title="Questions people ask" />
  <div class="grid gap-2.5">
    <FaqItem q="Is it one app or three?"><p>One. Download <b>Programs For You</b> and you get School Calendar, Email Assistant, and Screen Assistant. You can turn each one on or off in Settings.</p></FaqItem>
    <FaqItem q="I need help. Who do I contact?"><p>Call <a href="tel:+14752661457">(475) 266-1457</a> or email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. The <a href="/install">install guide</a> also answers the most common questions.</p></FaqItem>
    <FaqItem q="How do I get updates?"><p>Click <b>Check for Updates</b> in Programs For You (on its Home page, in Settings, or in the menu). It never updates by itself. If there’s a newer version, click <b>Update Now</b>: the app checks that the update really comes from us, installs it, and keeps all your settings. <a href="/install">More help</a>.</p></FaqItem>
    <FaqItem q="Is it really free?"><p>Yes. Programs For You is free to download and use, and you don’t need an email or an account.</p></FaqItem>
    <FaqItem q="Why does my Mac say it can’t check the app?"><p>Programs For You isn’t registered with Apple’s paid developer program yet, so macOS asks you to approve them once. The <a href="/install">install guide</a> shows exactly what to click.</p></FaqItem>
    <FaqItem q="What computers do they work on?"><p>Programs For You and School Calendar work on Macs with macOS 14 Sonoma or newer. Email Assistant and Screen Assistant need macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later).</p></FaqItem>
    <FaqItem q="Does the Email Assistant send my emails to a server?"><p>No. It connects straight from your Mac to your email and uses the AI built into your Mac. If you choose to add your own Claude API key, the emails being summarized go to Anthropic instead.</p></FaqItem>
    <FaqItem q="Does Screen Assistant watch everything I do?"><p>No. It only looks at your screen when you open it, it never records video, and it doesn’t save pictures. With Apple Intelligence, what it sees stays on your Mac.</p></FaqItem>
    <FaqItem q="Will it ever send an email without asking me?"><p>Never. Every reply waits for you to press <b>Preview &amp; Send</b>.</p></FaqItem>
    <FaqItem q="Is this made by Apple?"><p>No. Programs For You is an independent developer and isn’t affiliated with Apple.</p></FaqItem>
  </div>
</Section>

<Section center>
  <h2>Ready to make your day easier?</h2>
  <Lead center class="mb-0">Grab the app. No email or password needed.</Lead>
  <div class="mt-[26px] flex flex-wrap items-center justify-center gap-3">
    <Button variant="primary" href="/download"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg> Get the app</Button>
  </div>
</Section>
