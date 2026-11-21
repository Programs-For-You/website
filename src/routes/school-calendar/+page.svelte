<script>
  import Seo from '#lib/components/Seo.svelte';
  import { softwareApp } from '#lib/seo.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import MenuBar from '#lib/components/MenuBar.svelte';
  import SchedPanel from '#lib/components/SchedPanel.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import FeatureGrid from '#lib/components/apphero/FeatureGrid.svelte';
  import Path from '#lib/components/apphero/Path.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import WhatsNew from '#lib/components/apphero/WhatsNew.svelte';
  import DownloadCta from '#lib/components/apphero/DownloadCta.svelte';

  // School Calendar is one of the tools inside Programs For You (it replaced School Schedule).
  const features = [
    { title: 'Live class countdown', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', body: 'A big timer counts down the minutes and seconds left in class, with how much is done. The menu bar shows it too, like “Biology · 12m”.' },
    { title: 'The whole year on a calendar', icon: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>', body: 'Every school day shows its rotation day. Days off, short days, and special days like testing days are marked, so you can plan ahead.' },
    { title: 'Bell times built in', icon: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>', body: 'Comes set up with our high school’s 2026–27 calendar: regular days, Advisory, shortened days, and 1-, 2-, and 3-hour delays.' },
    { title: 'Lunch waves and minis', icon: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/>', body: 'Pick your lunch wave for each day and it shows up in your schedule. Two minis in one block? It shows the first, then lunch, then the second.' },
    { title: 'Homework that knows your classes', icon: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>', body: 'Type it in and pick the class. It’s due the next time that class meets, and you can change the date.' },
    { title: 'Reminders the night before', icon: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>', body: 'Get a notification the evening before something is due. Pick the time in Setup.' },
    { title: 'Snow days and delays', icon: '<path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5"/>', body: 'Right-click the calendar icon and pick today’s bell times, or mark a surprise day off on the calendar. The rotation fixes itself.' },
    { title: 'Any school works', icon: '<path d="M2.5 9.5L12 4.5l9.5 5-9.5 5-9.5-5z"/><path d="M6.5 11.8v4.7c0 1.2 2.5 3 5.5 3s5.5-1.8 5.5-3v-4.7"/>', body: 'Different school? Type its bell times and days off once, then share a setup code with friends so they don’t have to.' },
    { title: 'Stays on your Mac', icon: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Your classes and homework are saved on your Mac only. Nothing is sent to us.' },
  ];
</script>

<Seo title="School Calendar · Programs For You" description="A free Mac tool in Programs For You: a live countdown to the end of class, the whole school year on one calendar, and your homework with reminders." jsonLd={[softwareApp('school-calendar')]} />

<AppHero icon="/assets/img/school-schedule.svg" title="School Calendar" statusId="school-calendar" howHref="#how-to-use" req="Part of Programs For You · Requires macOS 14 Sonoma or newer · Free">
  Always know what class you’re in and how many minutes are left, see the whole school year at a glance, and keep track of your homework.
  {#snippet actions()}
    <Button href="/download"><Icon name="download" class="size-[18px]" /> Download Programs For You</Button>
  {/snippet}
  {#snippet visual()}
    <MenuBar />
    <SchedPanel full fluid />
  {/snippet}
</AppHero>

<Section soft>
  <SectionHead eyebrow="Features" title="Everything for your school day" />
  <FeatureGrid items={features} />
</Section>

<Section narrow id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use School Calendar" />
  <Steps class="mt-7">
    <Step n={1} title="Install Programs For You"><p>Download <b>Programs For You</b> (School Calendar is inside it) and open it the first time by following the <a href="/install">install guide</a>.</p></Step>
    <Step n={2} title="Open School Calendar"><p>Click <b>School Calendar</b> in the Programs For You window, or click the calendar icon at the top of your screen. It’s already set up with our high school’s 2026–27 bell times and calendar.</p></Step>
    <Step n={3} title="Type your classes"><p>Go to <Path>Setup → Your classes</Path> and type the class you have in each block on each rotation day. Under the block with lunch, pick your lunch wave for each day. Two minis in one block? Type both, like “Bio Mini / Speech”.</p></Step>
    <Step n={4} title="Watch the countdown"><p>The menu bar shows your class and the time left, like “Biology · 12m”. Click it for today’s schedule, a big countdown, and your homework.</p></Step>
    <Step n={5} title="Add homework"><p>Type it in the homework box, pick the class, and press Return. It’s due the next time that class meets. Click the circle when you’re done.</p></Step>
    <Step n={6} title="Check the calendar"><p>Open the <b>Calendar</b> tab to see every school day with its rotation day, days off, short days, and when homework is due. Click a day to see its schedule.</p></Step>
    <Step n={7} title="Snow day or delay?"><p>Right-click the calendar icon at the top of your screen and choose <Path>Today’s Bell Times</Path>, then pick the delay. For a surprise day off, click that day on the Calendar and set it to <b>No school</b>.</p></Step>
  </Steps>
  <Callout class="mt-11"><Icon name="info" /><p><b>Always check your school’s official schedule</b> for anything important. School Calendar uses the bell times and dates the school published, but schedules can change.</p></Callout>
</Section>

<WhatsNew id="school-calendar" />

<DownloadCta title="Get School Calendar" text="It’s part of Programs For You, one free Mac app. Download it, then follow the install guide." buttons={[{ href: '/download', label: 'Download Programs For You' }]} note="Requires macOS 14 Sonoma or newer" />
