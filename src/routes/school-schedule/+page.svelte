<script>
  import Seo from '#lib/components/Seo.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import Section from '#lib/components/Section.svelte';
  import Container from '#lib/components/Container.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Feature from '#lib/components/Feature.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Showcase from '#lib/components/Showcase.svelte';
  import ShowcaseBody from '#lib/components/ShowcaseBody.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import SchedPanel from '#lib/components/SchedPanel.svelte';

  // School Schedule is coming soon: we're making a new version. When it's ready, set its status to
  // 'available' in src/lib/config.js and bring back the download buttons and instructions here.
  const grid3 = 'grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1';

  const features = [
    { title: 'Live class timer', paths: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', body: 'A timer counts down exactly what’s left in class, like 11:42. It’s in the menu bar too, with seconds if you want them.' },
    { title: 'Just type your homework', paths: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>', body: 'After class, type something like “bio worksheet due Fri, math test Thursday.” It figures out the class, the due date, and how long it’ll take.' },
    { title: 'A homework plan for you', paths: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>', body: 'The Plan tab spreads your homework over the nights before it’s due, and gives tests study time on the nights right before.' },
    { title: 'Homework from Schoology', paths: '<path d="M20 12a8 8 0 0 1-14.3 4.9"/><path d="M4 12a8 8 0 0 1 14.3-4.9"/><path d="M18.5 3v4.2h-4.2"/><path d="M5.5 21v-4.2h4.2"/>', body: 'Link your Schoology calendar and your assignments show up by themselves. Check them off as you finish.' },
    { title: 'Overlay bar or floating card', paths: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M15 6.25h3"/>', body: 'Keep it on top of your windows. The overlay bar sits in a corner, see-through, and opens with your timeline and homework when you hover on it.' },
    { title: 'Asks after every class', paths: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>', body: 'When a class ends, a notification asks if you got homework. Type it right into the notification. Reminders come the night before, too.' },
    { title: 'After-school events', paths: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>', body: 'Add practices and clubs. It counts down your free time until they start.' },
    { title: 'Make it yours', paths: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.5-1.9-.3-1.1.4-2.1 1.6-2.1H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.8" r="1"/>', body: 'Six themes or your own colors, an icon for every class, 12- or 24-hour time, sharp or round corners, and a code-style font.' },
    { title: 'Stays on your Mac', paths: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Your classes and homework are saved on your Mac only. No sign-in inside the app.' }
  ];
</script>

<Seo
  title="School Schedule · Programs For You"
  description="School Schedule is coming soon: a live class countdown at the top of your screen, with your homework and a plan for tonight." />

<section class="pt-16 pb-10">
  <Container class="grid grid-cols-2 items-center gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-9">
    <div>
      <img class="size-[84px] rounded-[21px]" src="/assets/img/school-schedule.svg" alt="" width="84" height="84">
      <h1 class="mt-[18px] text-[clamp(2.2rem,4.6vw,3.1rem)]">School Schedule</h1>
      <Lead class="mb-[18px]">Always know what period it is, right from the top of your screen.</Lead>
      <StatusBadge id="school-schedule" />
      <p class="mt-6 mb-0 text-muted">We’re making a brand-new version of School Schedule. It’ll be here soon.</p>
    </div>
    <Showcase aria-hidden="true">
      <MenuBar />
      <ShowcaseBody><SchedPanel full fluid /></ShowcaseBody>
    </Showcase>
  </Container>
</section>

<Section soft id="how-to-use">
  <SectionHead eyebrow="Coming soon" title="What it will do" />
  <div class={grid3}>
    {#each features as f}
      <Feature title={f.title}>
        {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html f.paths}</svg>{/snippet}
        <p>{@html f.body}</p>
      </Feature>
    {/each}
  </div>
  <Callout tone="info" class="mt-9"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg><p>School Schedule isn’t available to download right now. In the meantime, try <a href="/email-assistant">Email Assistant</a> and <a href="/screen-assistant">Screen Assistant</a>.</p></Callout>
</Section>
