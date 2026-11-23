<script>
  import { SITE } from '#lib/config.js';
  import Seo from '#lib/components/Seo.svelte';
  import { howTo } from '#lib/seo.js';
  import { MAC_STEPS } from '#lib/howto-install.js';
  import Container from '#lib/components/Container.svelte';
  import Section from '#lib/components/Section.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import Path from '#lib/components/install/Path.svelte';
  import StepNote from '#lib/components/install/StepNote.svelte';
  import StepVisual from '#lib/components/install/StepVisual.svelte';
  import MockDialog from '#lib/components/install/MockDialog.svelte';
  import MockSettings from '#lib/components/install/MockSettings.svelte';

  // Mac only for now. (The Windows guide comes back when a Windows version is ready.)
  const contactHref = `mailto:${SITE.contactEmail}`;
</script>

<Seo
  title="How to install · Programs For You"
  description="Step-by-step with pictures: install our free apps on a Mac." jsonLd={[howTo({ name: 'How to install Programs For You apps on a Mac', description: 'Install a free Programs For You app on a Mac and allow it the first time.', steps: MAC_STEPS, path: '/install' })]} />

{#snippet warnIcon()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5L2.5 20h19L12 3.5z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/></svg>
{/snippet}


<section class="pt-16 pb-7">
  <Container narrow>
    <Eyebrow>Help</Eyebrow>
    <h1>How to install</h1>
    <Lead class="mb-0">Get our apps onto your Mac in a few minutes.</Lead>
  </Container>
</section>

<Section tight narrow>
  <div class="scroll-mt-[170px]" id="mac">
    <p class="mb-6 text-muted">You only do the security step once per app.</p>
    <Callout tone="warn">
      {@render warnIcon()}
      <p><b>Why does my Mac say it can’t check the app?</b> Apple only “verifies” apps from developers who pay for its $99/year developer program. Ours are free and we haven’t paid for that yet, so macOS warns you and asks you to approve the app once. That warning shows up for any unverified app, not because something is wrong with ours. Only approve apps you downloaded from programsforyou.com.</p>
    </Callout>

    <Steps class="mt-10">
      <Step n={1} title="Agree and download"><p>Go to the <a href="/#download">Programs For You download</a> on the home page and click <b>Download for Mac</b>. It has School Schedule, Email Assistant, and Screen Assistant inside. By downloading, you agree to the <a href="/terms">Terms</a> (you need to be 13 or older). No email needed.</p></Step>
      <Step n={2} title="Open the download"><p>Open your <b>Downloads</b> folder (in Finder, or click the download arrow in your browser). Double-click the <b>.zip</b> file and it turns into the app.</p></Step>
      <Step n={3} title="Move it to Applications"><p>Drag the app into the <b>Applications</b> folder in Finder’s sidebar. Keeping it there means it works properly and updates cleanly.</p></Step>
      <Step n={4} title="Open it, then click Done" id="open-anyway">
        <p>Double-click the app. Your Mac shows a message saying it couldn’t check the app. Click <b>Done</b>. Don’t click Move to Trash.</p>
        <StepVisual note="Click Done"><MockDialog /></StepVisual>
      </Step>
      <Step n={5} title="Allow it in System Settings">
        <p>Open the Apple menu → <Path>System Settings → Privacy &amp; Security</Path>. Scroll down to <b>Security</b>. Next to the message about the app, click <b>Open Anyway</b>. Type your Mac password, then click <b>Open Anyway</b> one more time.</p>
        <StepVisual note="Click Open Anyway"><MockSettings /></StepVisual>
        <StepNote class="mt-3">Tip: the Open Anyway button only shows for about an hour after you try to open the app. If it’s gone, double-click the app again, then come back here.</StepNote>
        <StepNote>On macOS 14 Sonoma there’s a shortcut: in Applications, <b>right-click</b> (or Control-click) the app, choose <b>Open</b>, then click <b>Open</b> again.</StepNote>
      </Step>
      <Step n={6} title="Find the button at the top of your screen"><p>Look in the top-right of your screen for the app’s new button. Click it to get started. Each app page has instructions: <a href="/email-assistant#how-to-use">Email Assistant</a> · <a href="/screen-assistant#how-to-use">Screen Assistant</a>.</p></Step>
    </Steps>

    <h2 class="mt-16 mb-0 text-[1.5rem]">Mac troubleshooting</h2>
    <div class="mt-4 grid gap-2.5">
      <FaqItem q="I can’t see the button at the top of my screen."><p>When the menu bar is full, macOS hides some icons, especially on MacBooks with a notch. Quit a few other menu-bar apps, or hold <kbd>⌘</kbd> and drag icons to make room. On macOS 26, also check <Path>System Settings → Menu Bar</Path> and make sure the app is allowed.</p></FaqItem>
      <FaqItem q="It says the app “is damaged and can’t be opened.”"><p>Drag the app to the Trash, download it again, and open the .zip with a normal double-click (not a different unzip app). If it still happens, <a href={contactHref}>contact us</a>.</p></FaqItem>
      <FaqItem q="There’s no Open Anyway button."><p>Double-click the app once more and click <b>Done</b>, then go straight back to <Path>System Settings → Privacy &amp; Security</Path> and scroll all the way down. If it still isn’t there, a school or work Mac may be managed by an IT team that blocks outside apps. Ask them, or use a personal Mac.</p>
        <p>Comfortable with Terminal? This does the same thing as Open Anyway (change the name for the other app):</p>
        <p><code>xattr -dr com.apple.quarantine "/Applications/Screen Assistant.app"</code></p></FaqItem>
      <FaqItem q="My Mac asks for my password to use the “keychain.”"><p>That’s Email Assistant opening the app password it saved in your Mac’s Keychain. Type your Mac password and click <b>Always Allow</b>. You may see this once after each update.</p></FaqItem>
      <FaqItem q="Screen Assistant says it can’t see my screen."><p>Open <Path>System Settings → Privacy &amp; Security → Screen &amp; System Audio Recording</Path> and turn on <b>Screen Assistant</b>, then quit it and open it again. If it’s already on but still doesn’t work, select Screen Assistant in that list, click <b>−</b> to remove it, then open Screen Assistant and allow it again.</p></FaqItem>
      <FaqItem q="How do I update an app?"><p>Open the app and click <b>Check for Updates</b>. If there’s a newer version, the app downloads it and installs it, and all your settings stay. Nothing updates in the background without you. If you have an older version that doesn’t have this button, download the app again from the home page, drag it into Applications, and choose <b>Replace</b>. Keep the app in your Applications folder.</p></FaqItem>
      <FaqItem q="How do I uninstall an app?"><p>Click the app’s button at the top of your screen and choose <b>Quit</b>. Then drag the app from Applications to the Trash.</p></FaqItem>
      <FaqItem q="Does it work on Windows, iPhone, iPad, or Chromebook?"><p>Not yet. Windows versions are coming soon. iPhone, iPad, and Chromebook aren’t supported right now.</p></FaqItem>
    </div>
  </div>

  <Callout tone="info" class="mt-8">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg>
    <p><b>Still need help?</b> Email <a href={contactHref}>{SITE.contactEmail}</a>. We’re happy to walk you through it.</p>
  </Callout>
</Section>
