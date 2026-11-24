<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  import Seo from '#lib/components/Seo.svelte';
  import { SITE, MAC_APP, WINDOWS_APP } from '#lib/config.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import FeatureGrid from '#lib/components/apphero/FeatureGrid.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import DownloadCta from '#lib/components/apphero/DownloadCta.svelte';
  import HubMenuMock from '#lib/components/HubMenuMock.svelte';
  import AgreeBox from '#lib/components/AgreeBox.svelte';
  import { gate } from '#lib/agree.svelte.js';

  const app = MAC_APP;
  const ready = app.status === 'available' && Boolean(app.file);
  const win = WINDOWS_APP;
  const winReady = win.status === 'available' && Boolean(win.fileX64);
  const onWindows = [
    { name: 'School Schedule', text: 'Works the same as on Mac: your classes, the countdown, homework, and your Schoology calendar. The class and minutes left show in a small bar in a corner of the screen.' },
    { name: 'Email Assistant', text: 'Uses Microsoft Copilot, free on Windows 11. Open an email, press Alt + Space, share the window, and ask for a summary or replies.' },
    { name: 'Screen Assistant', text: 'Also uses Copilot: press Alt + Space in any app and share your screen to summarize, explain, make to-dos, or quiz you.' },
  ];

  const inside = [
    { name: 'School Schedule', href: '/school-schedule', icon: '/assets/img/school-schedule.svg', text: 'What period it is, how many minutes are left, and what homework is due. The countdown sits next to the icon in the bar at the top of your screen.', req: 'macOS 14 or newer' },
    { name: 'Email Assistant', href: '/email-assistant', icon: '/assets/img/email-assistant.svg', text: 'Once a day, a short summary of your personal email, with replies written for you. It can also reply to an email you have open on screen.', req: 'macOS 26 Tahoe, Apple silicon' },
    { name: 'Screen Assistant', href: '/screen-assistant', icon: '/assets/img/screen-assistant.svg', text: 'Press Option-Space in any app. It looks at your screen and can summarize, explain, make to-dos, or quiz you.', req: 'macOS 26 Tahoe, Apple silicon' },
  ];

  // What the app keeps, and where. Matches the Privacy Policy.
  const stores = [
    { title: 'Your school day', icon: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>', body: 'Classes, bell times, homework, and settings are saved <b>on your Mac only</b>. A Schoology calendar link, if you add one, stays on your Mac too.' },
    { title: 'Email passwords', icon: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', body: 'The app password for your email is kept in your Mac’s <b>Keychain</b>. Your emails go straight from your provider to your Mac, never through us.' },
    { title: 'Your screen', icon: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', body: 'Screen Assistant looks only when you open it. It <b>never records</b> and doesn’t save pictures of your screen. To-dos stay on your Mac.' },
    { title: 'The AI', icon: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/>', body: 'Apple Intelligence runs <b>on your Mac</b>. Only if you add your own Claude API key are emails or screen pictures sent to Anthropic.' },
    { title: 'No account', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/><path d="M4 4l16 16"/>', body: 'No email, no password, and no sign-up to download or use it. We don’t use ads or trackers.' },
    { title: 'Updates', icon: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>', body: 'Only when you click <b>Check for Updates</b> does the app ask programsforyou.com for a newer version. Nothing about you is sent.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Programs For You',
    description: winReady ? 'One free app for Mac and Windows with School Schedule, Email Assistant, and Screen Assistant inside.' : 'One free Mac app with School Schedule, Email Assistant, and Screen Assistant inside.',
    url: SITE.url + '/programs-for-you',
    image: SITE.url + app.icon,
    applicationCategory: 'EducationalApplication',
    operatingSystem: winReady ? 'macOS, Windows' : 'macOS',
    softwareRequirements: app.requires,
    ...(ready ? { softwareVersion: app.version, fileSize: app.size, downloadUrl: SITE.url + app.file } : {}),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
</script>

<Seo title={winReady ? 'Programs For You for Mac and Windows · Free download' : 'Programs For You for Mac · Free download'} description={winReady ? 'One free app for Mac and Windows with School Schedule, Email Assistant, and Screen Assistant inside. Everything lives in one icon by the clock.' : 'One free Mac app with School Schedule, Email Assistant, and Screen Assistant inside. Everything lives in one icon at the top of your screen.'} jsonLd={[jsonLd]} />

<AppHero icon={app.icon} title="Programs For You" statusId="programs-for-you" howHref="#how-to-use" req={ready ? `Version ${app.version} · ${app.size} · Free · ${app.requires}` : app.requires}>
  {#if winReady}One free app for Mac and Windows with School Schedule, Email Assistant, and Screen Assistant inside. Install it once and it lives in one icon by the clock.{:else}One free Mac app with School Schedule, Email Assistant, and Screen Assistant inside. Install it once and it lives in one icon at the top of your screen.{/if}
  {#snippet actions()}
    {#if ready}
      <Button href={app.file} download onclick={gate}><Icon name="download" class="size-[18px]" /> Download for Mac</Button>
      {#if winReady}<Button variant="ghost" href="#windows">Download for Windows</Button>{/if}
      <Button variant="ghost" href="/install">How to install</Button>
      <AgreeBox />
    {:else}
      <Button tag="span" variant="ghost" aria-disabled="true">Coming soon</Button>
    {/if}
  {/snippet}
  {#snippet visual()}
    <HubMenuMock />
  {/snippet}
</AppHero>

<Section soft id="what-it-is">
  <SectionHead eyebrow="What it is" title="Three apps, one icon" />
  <ul class="m-0 grid list-none grid-cols-3 gap-[18px] p-0 max-[900px]:grid-cols-1">
    {#each inside as a}
      <li class="flex flex-col gap-3 rounded-card-lg border border-border bg-bg-soft p-6">
        <img class="size-14 rounded-2xl" src={a.icon} alt="" width="56" height="56">
        <h3 class="m-0 text-[1.25rem]">{a.name}</h3>
        <p class="m-0 text-muted">{a.text}</p>
        <p class="m-0 mt-auto font-mono text-[.72rem] text-faint uppercase">{a.req}</p>
        <a class="font-semibold text-accent" href={a.href}>More about {a.name} →</a>
      </li>
    {/each}
  </ul>
</Section>

<Section id="windows">
  <SectionHead eyebrow="Windows" title="Programs For You for Windows" />
  <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start gap-8 max-[900px]:grid-cols-1">
    <div class="flex flex-col gap-4">
      <p class="m-0 text-lead text-muted">The same app for Windows PCs, in one icon next to the clock. No API key and no account: the assistants use Microsoft Copilot, which comes free with Windows 11.</p>
      <div class="flex flex-wrap items-center gap-3">
        {#if winReady}
          <Button href={win.fileX64} download onclick={gate}><Icon name="download" class="size-[18px]" /> Download for Windows</Button>
          {#if win.fileArm64}<Button variant="ghost" href={win.fileArm64} download onclick={gate}>Windows on ARM</Button>{/if}
          <AgreeBox />
        {:else}
          <Button tag="span" variant="ghost" aria-disabled="true">Windows: coming soon</Button>
        {/if}
      </div>
      <p class="m-0 text-[.85rem] text-faint">{winReady ? `Version ${win.version} · ${win.size} · Free · ` : ''}{win.requires} Most PCs need the regular download; pick Windows on ARM only for a Snapdragon PC.</p>
    </div>
    <ul class="m-0 grid list-none gap-3 p-0">
      {#each onWindows as a}
        <li class="rounded-xl border border-border bg-bg-soft p-4"><h3 class="mb-1 text-[1.05rem]">{a.name}</h3><p class="m-0 text-[.92rem] text-muted">{a.text}</p></li>
      {/each}
    </ul>
  </div>
  {#if winReady}
    <div class="mt-10">
      <h3 class="mb-4 text-[1.25rem]">Install it on Windows</h3>
      <Steps>
        <Step n={1} title="Unzip it"><p>Open your Downloads folder, right-click the .zip, and choose <b>Extract All…</b>, then <b>Extract</b>. Move the folder somewhere you’ll keep it, like Documents.</p></Step>
        <Step n={2} title="Open Programs For You"><p>In the folder, double-click <b>Programs For You</b> (Programs For You.exe).</p></Step>
        <Step n={3} title="If Windows warns you"><p>Windows may say <b>“Windows protected your PC.”</b> Click <b>More info</b>, then <b>Run anyway</b>. It shows up because the app isn’t registered with Microsoft yet, not because something is wrong with it. Only do this for apps you downloaded from programsforyou.com.</p></Step>
        <Step n={4} title="Find the icon by the clock"><p>The Programs For You icon is in the bottom-right corner, next to the clock. If you can’t see it, click the <b>^</b> arrow there. Click the icon for School Schedule and Email Assistant; right-click it for Settings and Check for Updates. It starts with Windows from now on.</p></Step>
      </Steps>
    </div>
  {/if}
</Section>

<Section id="what-it-stores">
  <SectionHead eyebrow="What it stores" title="Your stuff stays on your Mac" />
  <FeatureGrid items={stores} />
  <p class="mt-8 mb-0 text-muted">The full details are in our <a href="/privacy">Privacy Policy</a>.</p>
</Section>

<Section narrow soft id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use it" />
  <Steps>
    <Step n={1} title="Download and install"><p>Click <b>Download for Mac</b>, open the .zip, and drag <b>Programs For You</b> into your Applications folder. The first time, your Mac asks you to allow it: the <a href="/install">install guide</a> shows how.</p></Step>
    <Step n={2} title="Find the icon at the top"><p>The Programs For You icon shows up in the bar at the top of your screen, next to the clock. Click it to open the menu. Right-click it for more, like <b>Check for Updates</b>.</p></Step>
    <Step n={3} title="School Schedule tab"><p>The first tab shows today’s classes and the countdown. Click <b>Set Up</b> to type your bell times and classes, or <b>Open in Programs For You</b> for the full calendar and homework.</p></Step>
    <Step n={4} title="Email Assistant tab"><p>The second tab shows today’s email summary. Click <b>Add Email…</b> to connect Gmail, iCloud Mail, or Yahoo with an app password, or <b>Reply to Email on Screen</b> for any email you have open.</p></Step>
    <Step n={5} title="Screen Assistant: Option-Space"><p>Press <b>⌥ Option + Space</b> in any app (or click Screen Assistant in the menu). Ask it to summarize, explain, make to-dos, or quiz you on what’s on your screen.</p></Step>
    <Step n={6} title="Turn things on or off"><p>Open the app and go to <b>Settings</b> to turn each tool on or off, pick Dark or Light, and choose an accent color.</p></Step>
  </Steps>
</Section>

{#if ready}
  <DownloadCta title="Get Programs For You" text={winReady ? 'Free for Mac and Windows. One download with all three apps inside.' : 'Free for Mac. One download with all three apps inside.'} buttons={[{ href: app.file, label: 'Download for Mac', download: true }, ...(winReady ? [{ href: win.fileX64, label: 'Download for Windows', download: true }] : [])]} note={app.requires} />
{/if}
