<script>
  import Seo from '#lib/components/Seo.svelte';
  import { softwareApp } from '#lib/seo.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import FeatureGrid from '#lib/components/apphero/FeatureGrid.svelte';
  import Path from '#lib/components/apphero/Path.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import WhatsNew from '#lib/components/apphero/WhatsNew.svelte';
  import DownloadCta from '#lib/components/apphero/DownloadCta.svelte';
  import { APPS } from '#lib/config.js';

  const app = APPS.find((a) => a.id === 'screen-assistant');
  const soon = !(app && app.status === 'available' && app.file);

  const features = [
    { title: 'One shortcut, any app', icon: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>', body: 'Press <b>⌥ Space</b> anywhere, or click its button at the top of your screen. Press it again to close.' },
    { title: 'Sees what you see', icon: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M15 6.25h3"/>', body: 'It looks at the window you’re using (or your whole screen) and reads the words on it.' },
    { title: 'Six quick buttons', icon: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>', body: 'Summarize, Explain, What’s next?, Make to-dos, Write a reply, and Quiz me.' },
    { title: 'Ask anything', icon: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v6"/>', body: 'Ask about your screen, or about anything at all, and keep the conversation going.' },
    { title: 'To-dos and reminders', icon: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0"/>', body: 'Turn an assignment into a to-do list in one click, and get a reminder before it’s due.' },
    { title: 'Spots dates and links', icon: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>', body: 'Due dates, links, and email addresses on your screen become buttons: remind me, open, or write an email.' },
    { title: 'Only looks when you ask', icon: '<path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', body: 'It never watches or records your screen, and it doesn’t save pictures.' },
    { title: 'AI built into your Mac', icon: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>', body: 'Uses Apple Intelligence, so what’s on your screen stays on your computer.' },
    { title: 'Optional: your own AI key', icon: '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16.5 6.5l2.5 2.5M14 9l2 2"/>', body: 'Add a Claude API key and it sees the actual picture, which is great for charts, diagrams, and math.' }
  ];
</script>

<Seo title="Screen Assistant · Programs For You" description="A free Mac app: press Option-Space and an assistant looks at your screen to summarize, explain, make to-dos, or quiz you, using the AI built into your Mac." jsonLd={[softwareApp('screen-assistant')]} />

<AppHero icon="/assets/img/screen-assistant.svg" title="Screen Assistant" statusId="screen-assistant" howHref="#how-to-use" req="Part of Programs For You · Requires macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later) · Free">
  Press <kbd>⌥</kbd> <kbd>Space</kbd> and your personal assistant looks at what you’re working on. Ask it to sum it up, explain it, make a to-do list, write a reply, or quiz you.
  {#snippet actions()}
    <Button href="/download"><Icon name="download" class="size-[18px]" /> Download Programs For You</Button>
  {/snippet}
  {#snippet visual()}
    <img class="mx-auto block h-auto w-full max-w-[560px]" src="/assets/img/screen-assistant-panel.png" width="680" height="636" alt="Screen Assistant reading a biology assignment and turning it into a to-do list">
  {/snippet}
</AppHero>

<Section soft>
  <SectionHead eyebrow="Features" title="A helper that sees what you see" />
  <FeatureGrid items={features} />
</Section>

<Section narrow id="how-to-use">
  <SectionHead center={false} eyebrow="Instructions" title="How to use Screen Assistant" />
  {#if soon}
    <Callout tone="info"><Icon name="info" /><p>Screen Assistant is coming soon. These steps show how it will work when it launches.</p></Callout>
  {/if}

  <h3 class="mt-8">Before you start</h3>
  <ul class="checklist mb-2">
    <li><span><b>macOS 26 Tahoe or newer</b> on a <b>Mac with Apple silicon (M1 or later)</b>. To check, open the Apple menu → <b>About This Mac</b>.</span></li>
    <li><span><b>Apple Intelligence turned on</b> in <Path>System Settings → Apple Intelligence &amp; Siri</Path>. If you can’t turn it on, you can still use the app with your own AI key (step 9).</span></li>
  </ul>

  <Steps class="mt-9">
    <Step n={1} title="Install Programs For You"><p>Download <b>Programs For You</b> (Screen Assistant is inside it) and open it the first time by following the <a href="/install">install guide</a>.</p></Step>
    <Step n={2} title="Let it see your screen">
      <p>The first time, your Mac asks whether Screen Assistant can record your screen. Click <b>Open System Settings</b>, turn on <b>Screen Assistant</b> under <Path>Privacy &amp; Security → Screen &amp; System Audio Recording</Path>, then click <b>Quit &amp; Reopen</b>.</p>
      <p class="text-[.9rem]">“Record” sounds scary, but it only takes one picture each time you open it. It never records video.</p>
    </Step>
    <Step n={3} title="Open it from anywhere"><p>Press <kbd>⌥</kbd> <kbd>Space</kbd> (Option and Space together). It looks at the window you’re using and shows a small picture of it, so you know what it sees. Press <kbd>⌥</kbd> <kbd>Space</kbd> again or <kbd>Esc</kbd> to close it.</p></Step>
    <Step n={4} title="Click a quick button"><p><b>Summarize</b> gives you the key points. <b>Explain</b> puts it in simple words. <b>What’s next?</b> tells you what to do now. <b>Make to-dos</b> pulls out the tasks. <b>Write a reply</b> answers a message. <b>Quiz me</b> makes practice questions.</p></Step>
    <Step n={5} title="Ask a follow-up"><p>Type in the box and press <b>Return</b>. It remembers the conversation until you close it or click <b>New chat</b>. To ask something that has nothing to do with your screen, click <b>Using it</b> to turn the screen off for that chat.</p></Step>
    <Step n={6} title="Make to-dos and reminders"><p>After <b>Make to-dos</b>, click <b>Add to my to-dos</b>. Open the <b>To-dos</b> tab to check things off, and click the bell to get a reminder. The first time, your Mac asks to allow notifications: click <b>Allow</b>. Dates on your screen also show up as <b>Remind me</b> buttons.</p></Step>
    <Step n={7} title="Look again"><p>Switched windows? Click the round arrow next to the picture to look at the window again or at your whole screen. You can also copy all the words on the screen from there.</p></Step>
    <Step n={8} title="Make it yours"><p>Click the gear (or right-click the button at the top of your screen and choose <b>Settings</b>) to change the shortcut, look at your whole screen instead of one window, pick short or detailed answers, and open it when you log in.</p></Step>
    <Step n={9} title="Optional: smarter AI"><p>In Settings, turn on <b>Use my Claude API key</b> and paste a key from console.anthropic.com. Claude sees the actual picture of your screen, so it’s better with charts and math. The picture is sent to Anthropic, and Anthropic charges your API account a small amount for each answer, so only do this if you’re OK with that.</p></Step>
  </Steps>

  <Callout tone="info" class="mt-11"><Icon name="info" /><p><b>Using it for school:</b> Screen Assistant is great for understanding lessons, studying, and staying organized. Follow your teacher’s and school’s rules about using AI on assignments and tests, and double-check important answers, because AI can make mistakes.</p></Callout>
  <Callout class="mt-4"><Icon name="lock" /><p><b>Your privacy:</b> Screen Assistant only looks when you open it, never records video, and doesn’t save pictures. With Apple Intelligence, everything stays on your Mac. <a href="/privacy">Read the Privacy Policy</a>.</p></Callout>

  <h2 class="mt-16 text-2xl">Questions</h2>
  <div class="mt-4 grid gap-2.5">
    <FaqItem q="It says it can’t see my screen."><p>Open <Path>System Settings → Privacy &amp; Security → Screen &amp; System Audio Recording</Path> and turn on <b>Screen Assistant</b>, then quit it and open it again. If it’s already on but still doesn’t work, select Screen Assistant in that list, click <b>−</b> to remove it, then open Screen Assistant and allow it again.</p></FaqItem>
    <FaqItem q="Pressing ⌥ Space doesn’t open it."><p>Another app may already use that shortcut. Settings shows a message if so. Pick a different shortcut in Settings, or click the button at the top of your screen.</p></FaqItem>
    <FaqItem q="It says Apple Intelligence isn’t available."><p>Turn it on in <Path>System Settings → Apple Intelligence &amp; Siri</Path>. If it was just turned on, it may still be downloading, so try again later. Macs that can’t run Apple Intelligence can use a Claude API key instead (step 9).</p></FaqItem>
    <FaqItem q="My Mac sometimes asks again if Screen Assistant can see my screen."><p>That’s normal. macOS checks in now and then about apps that can see your screen. Click <b>Allow</b> to keep using it.</p></FaqItem>
  </div>
</Section>

<WhatsNew id="screen-assistant" />

<DownloadCta title="Get Screen Assistant" text="It’s part of Programs For You, one free Mac app. Download it, then follow the install guide." buttons={[{ href: '/download', label: 'Download Programs For You' }]} note="Requires macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later)" />
