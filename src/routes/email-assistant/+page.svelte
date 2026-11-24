<script>
  import Seo from '#lib/components/Seo.svelte';
  import { softwareApp } from '#lib/seo.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import AskCard from '#lib/components/AskCard.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import FeatureGrid from '#lib/components/apphero/FeatureGrid.svelte';
  import Path from '#lib/components/apphero/Path.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import WhatsNew from '#lib/components/apphero/WhatsNew.svelte';
  import DownloadCta from '#lib/components/apphero/DownloadCta.svelte';
  import { APPS } from '#lib/config.js';

  const app = APPS.find((a) => a.id === 'email-assistant');
  const soon = !(app && app.status === 'available' && app.file);

  const features = [
    { title: 'Daily summary', icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', body: 'Pick a time, and a card pops up in the bottom-right corner with what came in that day.' },
    { title: 'One-click replies', icon: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v6"/>', body: 'Choose from 2 to 4 ready-made replies, or type your own in the Other box.' },
    { title: 'Never sends without you', icon: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'Every reply waits for you to press Preview &amp; Send. Nothing goes out on its own.' },
    { title: 'Flags what matters', icon: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4.5L17 13H5"/>', body: 'Emails from teachers, deadlines, and family go to the top.' },
    { title: 'Sort and clean up', icon: '<path d="M3 5h18M6.5 12h11M10 19h4"/>', body: 'Groups your inbox into School, People, and Promos, and helps clear out junk. It always asks before moving anything.' },
    { title: 'AI built into your Mac', icon: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>', body: 'Uses the Apple Intelligence built into your Mac, so your emails stay on your computer.' },
    { title: 'Optional: your own AI key', icon: '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16.5 6.5l2.5 2.5M14 9l2 2"/>', body: 'Want smarter replies? Add your own Claude API key in Settings.' },
    { title: 'Your personal email', icon: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>', body: 'Gmail, iCloud Mail, and Yahoo (Outlook soon). Personal accounts only: school and work accounts can’t be connected.' },
    { title: 'On screen, for any email', icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/>', body: 'Open any email, even school email in your browser, and click <b>On screen</b>. It reads that email and writes replies you copy and paste.' }
  ];
</script>

<Seo title="Email Assistant · Programs For You" description="A free Mac app that sums up your personal email once a day and helps you reply with one click. On screen answers any email you have open, school email too." jsonLd={[softwareApp('email-assistant')]} />

<AppHero icon="/assets/img/email-assistant.svg" title="Email Assistant" statusId="email-assistant" howHref="#how-to-use" req="Requires macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later) · On Windows 10 or 11 too · Free">
  Once a day, a little card sums up your personal email and helps you reply with one click. For school email, <b>On screen</b> reads the email you have open and writes replies for you.
  {#snippet actions()}
    <Button href="/programs-for-you"><Icon name="download" class="size-[18px]" /> Get the Programs For You App</Button>
    <Button variant="ghost" href="/programs-for-you#windows">Get it for Windows</Button>
  {/snippet}
  {#snippet visual()}
    <AskCard demo size="lg" />
    <p class="m-0 text-[.85rem] text-muted">Try it: click a reply.</p>
  {/snippet}
</AppHero>

<Section soft>
  <SectionHead eyebrow="Features" title="Your inbox, handled in minutes" />
  <FeatureGrid items={features} />
</Section>

<Section narrow id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use Email Assistant" />
  {#if soon}
    <Callout tone="info"><Icon name="info" /><p>Email Assistant is coming soon. These steps show how it will work when it launches.</p></Callout>
  {/if}

  <h3 class="mt-8">Before you start</h3>
  <ul class="checklist mb-2">
    <li><span><b>macOS 26 Tahoe or newer.</b> To check, open the Apple menu → <b>About This Mac</b>.</span></li>
    <li><span><b>A Mac with Apple silicon (M1 or later).</b> In About This Mac, look for <b>Chip: Apple M…</b></span></li>
    <li><span><b>Apple Intelligence turned on</b> in <Path>System Settings → Apple Intelligence &amp; Siri</Path>. If you can’t turn it on, you can still use the app with your own AI key (step 9).</span></li>
    <li><span><b>A personal email account</b> for the daily summary: Gmail, iCloud Mail, or Yahoo. School email works only with On screen (step 7).</span></li>
  </ul>

  <Steps class="mt-9">
    <Step n={1} title="Install it"><p>Download the app and open it the first time by following the <a href="/install">install guide</a>.</p></Step>
    <Step n={2} title="Connect your personal email">
      <p><b>Personal accounts only.</b> School and work accounts can’t be connected. To answer those, use <a href="#on-screen">On screen</a>.</p>
      <p>Open the app, click <b>Add personal email</b>, and pick your email. Gmail, iCloud, and Yahoo use an <b>app password</b>: a special password just for this app, so your real password stays private. (Outlook support is coming soon.)</p>
      <div class="mt-3.5 grid gap-2 [&_details]:rounded-xl [&_details]:border [&_details]:border-border [&_details]:bg-surface [&_details]:px-4 [&_summary]:cursor-pointer [&_summary]:py-3 [&_summary]:font-semibold [&_summary]:text-ink [&_details>div]:pb-3 [&_details>div]:text-[.95rem] [&_details_ol]:mb-2 [&_details_ol]:list-decimal [&_details_ol]:pl-[1.2em]">
        <details><summary>Gmail: make an app password</summary><div><ol>
          <li>Make sure 2-Step Verification is on at <b>myaccount.google.com/security</b>.</li>
          <li>Go to <b>myaccount.google.com/apppasswords</b>.</li>
          <li>Type a name like <b>Email Assistant</b> and click <b>Create</b>.</li>
          <li>Copy the 16-letter password and paste it into the app.</li>
        </ol><p class="text-faint text-[.9rem]">Use your personal Gmail (an address ending in @gmail.com). School Google accounts aren’t supported.</p></div></details>
        <details><summary>iCloud Mail: make an app-specific password</summary><div><ol>
          <li>Go to <b>account.apple.com</b> and sign in.</li>
          <li>Open <b>Sign-In and Security</b> → <b>App-Specific Passwords</b>.</li>
          <li>Click to make a new one and name it <b>Email Assistant</b>.</li>
          <li>Copy the password and paste it into the app.</li>
        </ol></div></details>
        <details><summary>Yahoo: make an app password</summary><div><ol>
          <li>Go to <b>login.yahoo.com/account/security</b>.</li>
          <li>Click <b>Generate app password</b> (or <b>Generate and manage app passwords</b>).</li>
          <li>Name it <b>Email Assistant</b> and click <b>Generate</b>.</li>
          <li>Copy the password and paste it into the app.</li>
        </ol></div></details>
        <details><summary>Outlook / Hotmail: coming soon</summary><div><p>Microsoft no longer allows app passwords, so Outlook will use <b>Sign in with Microsoft</b>. It’s coming in a future update.</p></div></details>
      </div>
    </Step>
    <Step n={3} title="Make sure it has access">
      <p>In <Path>Settings → Accounts</Path>, click <b>Test access</b> next to your email. You should see three green checks: the password is saved, it can read your inbox, and it can send replies. If one is red, remove the account and add it again with a new app password.</p>
      <p class="text-[.9rem]">If your Mac asks <b>“Email Assistant wants to use your confidential information stored in your keychain,”</b> type your Mac password and click <b>Always Allow</b>. That’s how it opens your saved app password. You may see this once after each update.</p>
    </Step>
    <Step n={4} title="Pick your summary time"><p>Choose when the daily card pops up, like 3:30 PM after school. You can change it anytime in Settings.</p></Step>
    <Step n={5} title="Reply from the card"><p>When the card appears in the bottom-right corner, read the summary, then pick a reply. Or choose <b>Other</b> and type your own. Press <b>Preview &amp; Send</b> to check it, then <b>Send</b>. Press <b>Skip</b> to move on to the next email. The card stays on your screen until you’re done or you click the <b>×</b>, so you won’t forget about it.</p></Step>
    <Step n={6} title="Open it anytime"><p>Click the envelope at the top of your screen to open today’s card. Right-click it and choose <b>Check Email Now</b> to get your summary early.</p></Step>
    <Step n={7} title="Answer any email with On screen" id="on-screen">
      <p>Open the email you want to answer, in any app or website. School email in Chrome or Safari works too. Click the envelope at the top of your screen, click the <b>On screen</b> tab, then <b>Read email</b>. (Or right-click the envelope and choose <b>Reply to Email on Screen</b>.)</p>
      <p>Pick a reply (or type your own under <b>Other</b>), click <b>Preview &amp; Copy</b>, then <b>Copy reply</b>. In your email, click <b>Reply</b> and press <b>⌘V</b> to paste it. Email Assistant doesn’t send these: you do.</p>
      <p class="text-[.9rem]">The first time, your Mac asks to let Email Assistant see your screen. Click <b>Open Settings</b>, turn on <b>Email Assistant</b>, and click <b>Quit &amp; Reopen</b> if asked. It only looks when you click Read email, and the picture is never saved.</p>
    </Step>
    <Step n={8} title="Clean up your inbox"><p>Right-click the envelope and choose <b>Sort &amp; Clean Inbox</b>. You’ll see your email grouped into Promos, School, and People, with newsletters already checked. Click <b>Archive</b> or <b>Move to Trash</b>, and it asks you once more before doing anything.</p></Step>
    <Step n={9} title="Optional: smarter AI"><p>In <Path>Settings → AI</Path>, turn on <b>Use my Claude API key</b> and paste a key from console.anthropic.com. (Anthropic only lets adults, 18 and older, make an account and a key, so if you’re under 18, ask a parent or guardian, or skip this and use the AI built into your Mac.) The emails being summarized (and, for On screen, the picture of the window you asked about) are then sent to Anthropic, and Anthropic charges your API account a small amount for each, so only do this if you’re OK with that.</p></Step>
  </Steps>

  <Callout class="mt-11"><Icon name="lock" /><p><b>Your privacy:</b> your email password is stored in your Mac’s Keychain, and your emails are read on your Mac. On screen takes one picture of the window you’re using only when you click Read email, and never saves it. We never see your email. <a href="/privacy">Read the Privacy Policy</a>.</p></Callout>
</Section>

<WhatsNew id="email-assistant" />

<DownloadCta title="Get Email Assistant" text="It comes inside the free Programs For You app for Mac, along with our other apps." buttons={[{ href: '/programs-for-you', label: 'Get the Programs For You App' }]} note="Requires macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later)." />
