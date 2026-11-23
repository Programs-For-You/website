<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  import Seo from '#lib/components/Seo.svelte';
  import { softwareApp } from '#lib/seo.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import SchedPanel from '#lib/components/SchedPanel.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import FeatureGrid from '#lib/components/apphero/FeatureGrid.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import { APPS } from '#lib/config.js';

  const app = APPS.find((a) => a.id === 'school-schedule');

  // Only what's in the version people can download today (config.js → school-schedule).
  const features = [
    { title: 'Countdown up top', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', body: 'The bar at the top of your screen shows your class and how many minutes are left.' },
    { title: 'Today at a glance', icon: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/>', body: 'Every class today with its times, and what’s happening right now.' },
    { title: 'Rotating schedules', icon: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>', body: 'Day A, Day B, or Day 1–4: it keeps track of which day it is, and skips days off.' },
    { title: 'Short days and lunches', icon: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 3c-2 2-2 6 0 8v10"/>', body: 'Early dismissals, special schedules, and your own lunch wave, so the times are always right.' },
    { title: 'The whole year', icon: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>', body: 'A calendar of the school year with days off and short days marked.' },
    { title: 'Homework with reminders', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', body: 'Add homework in a few words. It reminds you the evening before it’s due.' },
    { title: 'Share with classmates', icon: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>', body: 'Set up your school once and share a code, so friends don’t have to type the bell times.' },
    { title: 'Stays on your Mac', icon: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Your classes and homework are saved on your Mac only. No account, no sign-in.' },
  ];
</script>

<Seo title="School Schedule · Programs For You" description="A free Mac app: always know what period it is, how many minutes are left, and what homework is due. Part of Programs For You." jsonLd={[softwareApp('school-schedule')]} />

<AppHero icon="/assets/img/school-schedule.svg" title="School Schedule" statusId="school-schedule" howHref="#how-to-use" req="Requires macOS 14 Sonoma or newer, on a Mac with Apple silicon or Intel · Windows version coming soon · Free">
  Always know what period it is, how many minutes are left, and what homework is due. It comes in the Programs For You app, together with Email Assistant and Screen Assistant.
  {#snippet actions()}
    <Button href="/#download"><Icon name="download" class="size-[18px]" /> Get the Programs For You App</Button>
    <Button tag="span" variant="ghost" aria-disabled="true">Windows: coming soon</Button>
  {/snippet}
  {#snippet visual()}
    <SchedPanel full fluid />
  {/snippet}
</AppHero>

<Section soft>
  <SectionHead eyebrow="Features" title="Your school day, one click away" />
  <FeatureGrid items={features} />
</Section>

<Section narrow id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use School Schedule" />
  <Steps>
    <Step n={1} title="Download and install"><p>Click <b>Get the Programs For You App</b> above, download it, and follow the <a href="/install">install guide</a>. The first time, your Mac asks you to allow it.</p></Step>
    <Step n={2} title="Open School Calendar"><p>Open Programs For You and click <b>School Calendar</b> in the sidebar. Its countdown shows up in the bar at the top of your screen.</p></Step>
    <Step n={3} title="Set up your school"><p>Open <b>Setup</b> and type your bell times, your rotation days, and your days off. A classmate already set it up? Paste their setup code instead.</p></Step>
    <Step n={4} title="Type your classes"><p>Type the class you have in each period. Leave a box empty for a free period.</p></Step>
    <Step n={5} title="Add homework"><p>Type homework on the Today or Homework tab. You get a reminder the evening before it’s due.</p></Step>
  </Steps>
</Section>
