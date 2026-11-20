<script>
  import { onMount, tick } from 'svelte';
  import { afterNavigate, replaceState } from '$app/navigation';
  import { SITE } from '#lib/config.js';
  import Seo from '#lib/components/Seo.svelte';
  import { howTo } from '#lib/seo.js';
  import { MAC_STEPS, WINDOWS_STEPS } from '#lib/howto-install.js';
  import Container from '#lib/components/Container.svelte';
  import Section from '#lib/components/Section.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Button from '#lib/components/Button.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import Path from '#lib/components/install/Path.svelte';
  import StepNote from '#lib/components/install/StepNote.svelte';
  import StepVisual from '#lib/components/install/StepVisual.svelte';
  import PairItem from '#lib/components/install/PairItem.svelte';
  import MockDialog from '#lib/components/install/MockDialog.svelte';
  import MockSettings from '#lib/components/install/MockSettings.svelte';
  import MockDownload from '#lib/components/install/MockDownload.svelte';
  import MockSmartScreen from '#lib/components/install/MockSmartScreen.svelte';
  import MockUac from '#lib/components/install/MockUac.svelte';
  import MockInstaller from '#lib/components/install/MockInstaller.svelte';
  import MockDesktop from '#lib/components/install/MockDesktop.svelte';

  const YEAR_CODE = 'Year:2026;Adv:3;Limit:C286;NoS:CFD9EBECF0FDGFGGGHI5I6I9IAIBIC010I262728292A4855565758597F;Short:CHFCHAI40D0J103C50848586';
  const contactHref = `mailto:${SITE.contactEmail}`;

  // The Mac / Windows switch. Without JavaScript (or before it runs) both guides show, each with its heading.
  let tabbed = $state(false);
  let os = $state('mac');
  let tabEls = $state([]);
  const tabs = ['mac', 'windows'];

  function show(next, focus) {
    os = next;
    if (focus) tabEls[tabs.indexOf(next)]?.focus();
  }

  // Which guide holds the part of the page the link points to (#windows, #run-anyway, #open-anyway, ...).
  function guideFor(hash) {
    let id = '';
    try { id = decodeURIComponent((hash || '').slice(1)); } catch { /* bad escape: no target */ }
    const el = id ? document.getElementById(id) : null;
    const panel = el?.closest('[data-os-panel]');
    return panel ? { os: panel.id, el } : null;
  }

  function choose(next, focus) {
    show(next, focus);
    try { replaceState('#' + next, {}); } catch { /* not allowed here: the guide still switches */ }
  }

  function onKey(e, i) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    choose(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
  }

  // A link on this page to the other guide (like "see the Windows guide") switches to it.
  async function followHash() {
    const target = guideFor(location.hash);
    if (!target) return;
    show(target.os);
    await tick();
    const at = target.el.id === target.os ? document.querySelector('[data-os-tabs]') : target.el;
    at?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  onMount(() => {
    document.documentElement.classList.add('os-tabbed');
    tabbed = true;
    const linked = guideFor(location.hash);
    show(linked ? linked.os : /Windows/i.test(navigator.userAgent) ? 'windows' : 'mac');
    if (linked) followHash();
    window.addEventListener('hashchange', followHash);
    return () => {
      window.removeEventListener('hashchange', followHash);
      document.documentElement.classList.remove('os-tabbed');
    };
  });

  afterNavigate((nav) => { if (nav.type !== 'enter' && tabbed) followHash(); });

  // Copy button (the Windows calendar code)
  let copyLabel = $state('Copy code');
  let codeEl = $state();
  async function copyCode() {
    let ok = false;
    try { await navigator.clipboard.writeText(YEAR_CODE); ok = true; } catch {
      if (codeEl) getSelection()?.selectAllChildren(codeEl);   // fall back: select the code to copy by hand
    }
    copyLabel = ok ? 'Copied!' : 'Press Ctrl+C to copy';
    setTimeout(() => { copyLabel = 'Copy code'; }, 2000);
  }
</script>

<Seo
  title="How to install · Programs For You"
  description="Step-by-step with pictures: install our free apps on a Mac, or School Schedule on a Windows PC." jsonLd={[howTo({ name: 'How to install Programs For You apps on a Mac', description: 'Install a free Programs For You app on a Mac and allow it the first time.', steps: MAC_STEPS, path: '/install' }), howTo({ name: 'How to install School Schedule on Windows', description: 'Install School Schedule on a Windows 10 or 11 PC.', steps: WINDOWS_STEPS, path: '/install' })]} />

{#snippet warnIcon()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5L2.5 20h19L12 3.5z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/></svg>
{/snippet}

{#snippet tabIcon(kind)}
  <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if kind === 'mac'}<rect x="4.5" y="5" width="15" height="10.5" rx="1.5"/><path d="M2 19h20"/>{:else}<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/>{/if}
  </svg>
{/snippet}

{#snippet osTab(id, label, i)}
  {@const on = os === id}
  <button
    bind:this={tabEls[i]}
    type="button"
    role="tab"
    id="tab-{id}"
    aria-controls={id}
    aria-selected={on ? 'true' : 'false'}
    tabindex={on ? 0 : -1}
    class="inline-flex h-10 items-center justify-center gap-2 rounded-full border-0 bg-transparent px-[22px] text-[.95rem] font-semibold whitespace-nowrap text-muted hover:text-ink aria-selected:bg-surface aria-selected:text-ink aria-selected:shadow-[0_1px_3px_rgb(0_0_0/.14)] max-[480px]:px-2.5"
    onclick={() => choose(id)}
    onkeydown={(e) => onKey(e, i)}>{@render tabIcon(id)} {label}</button>
{/snippet}

<section class="pt-16 pb-7">
  <Container narrow>
    <Eyebrow>Help</Eyebrow>
    <h1>How to install</h1>
    <Lead class="mb-0">Get our apps onto your computer in a few minutes. Pick your computer:</Lead>
    <div
      class="mt-[22px] hidden scroll-mt-[90px] grid-cols-2 gap-1 rounded-full border border-border bg-surface-2 p-1 os-tabbed:inline-grid max-[480px]:os-tabbed:grid max-[480px]:w-full"
      role="tablist"
      aria-label="Your computer"
      data-os-tabs>
      {@render osTab('mac', 'Mac', 0)}
      {@render osTab('windows', 'Windows PC', 1)}
    </div>
  </Container>
</section>

<Section tight narrow>
  <div class="scroll-mt-[170px]" id="mac" role="tabpanel" aria-labelledby="tab-mac" data-os-panel hidden={tabbed && os !== 'mac'}>
    <h2 class="mb-2 text-[1.5rem] os-tabbed:hidden">On a Mac</h2>
    <p class="mb-6 text-muted">All three apps work on a Mac. You only do the security step once per app.</p>
    <Callout tone="warn">
      {@render warnIcon()}
      <p><b>Why does my Mac say it can’t check the app?</b> Apple only “verifies” apps from developers who pay for its $99/year developer program. Ours are free and we haven’t paid for that yet, so macOS warns you and asks you to approve the app once. That warning shows up for any unverified app, not because something is wrong with ours. Only approve apps you downloaded from programsforyou.com.</p>
    </Callout>

    <Steps class="mt-10">
      <Step n={1} title="Type your email and download"><p>Go to <a href="/download">Downloads</a>, type your email (no password needed), and click <b>Download</b> next to the app you want.</p></Step>
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
      <Step n={6} title="Find the button at the top of your screen"><p>Look in the top-right of your screen for the app’s new button. Click it to get started. Each app page has instructions: <a href="/school-schedule#how-to-use">School Schedule</a> · <a href="/email-assistant#how-to-use">Email Assistant</a> · <a href="/screen-assistant#how-to-use">Screen Assistant</a>.</p></Step>
    </Steps>

    <h2 class="mt-16 mb-0 text-[1.5rem]">Mac troubleshooting</h2>
    <div class="mt-4 grid gap-2.5">
      <FaqItem q="I can’t see the button at the top of my screen."><p>When the menu bar is full, macOS hides some icons, especially on MacBooks with a notch. Quit a few other menu-bar apps, or hold <kbd>⌘</kbd> and drag icons to make room. On macOS 26, also check <Path>System Settings → Menu Bar</Path> and make sure the app is allowed.</p></FaqItem>
      <FaqItem q="It says the app “is damaged and can’t be opened.”"><p>Drag the app to the Trash, download it again, and open the .zip with a normal double-click (not a different unzip app). If it still happens, <a href={contactHref}>contact us</a>.</p></FaqItem>
      <FaqItem q="There’s no Open Anyway button."><p>Double-click the app once more and click <b>Done</b>, then go straight back to <Path>System Settings → Privacy &amp; Security</Path> and scroll all the way down. If it still isn’t there, a school or work Mac may be managed by an IT team that blocks outside apps. Ask them, or use a personal Mac.</p>
        <p>Comfortable with Terminal? This does the same thing as Open Anyway (change the name for the other app):</p>
        <p><code>xattr -dr com.apple.quarantine "/Applications/School Schedule.app"</code></p></FaqItem>
      <FaqItem q="My Mac asks for my password to use the “keychain.”"><p>That’s Email Assistant opening the app password it saved in your Mac’s Keychain. Type your Mac password and click <b>Always Allow</b>. You may see this once after each update.</p></FaqItem>
      <FaqItem q="Screen Assistant says it can’t see my screen."><p>Open <Path>System Settings → Privacy &amp; Security → Screen &amp; System Audio Recording</Path> and turn on <b>Screen Assistant</b>, then quit it and open it again. If it’s already on but still doesn’t work, select Screen Assistant in that list, click <b>−</b> to remove it, then open Screen Assistant and allow it again.</p></FaqItem>
      <FaqItem q="How do I update an app?"><p>You don’t have to do anything. Our apps update themselves: they check for new versions now and then, download them quietly, and install them the next time you step away from your computer for a couple of minutes (or when you quit the app). It only takes a second, and all your settings stay. You can turn this off in the app’s Settings under <b>Install updates automatically</b>, and then it asks you first.</p>
        <p>Automatic updates work in School Schedule 1.3.2, Email Assistant 1.2.1, Screen Assistant 1.1.1, and newer. If you have an older version, download the app once more from <a href="/download">Downloads</a>, drag it into Applications, and choose <b>Replace</b>. After that, you’ll never need to download it again. Keep the app in your Applications folder so it can update itself.</p></FaqItem>
      <FaqItem q="How do I uninstall an app?"><p>Click the app’s button at the top of your screen and choose <b>Quit</b>. Then drag the app from Applications to the Trash.</p></FaqItem>
      <FaqItem q="Does it work on Windows, iPhone, iPad, or Chromebook?"><p>School Schedule works on Windows: see the <a href="#windows">Windows guide</a>. Windows versions of Email Assistant and Screen Assistant are coming soon. iPhone, iPad, and Chromebook aren’t supported right now.</p></FaqItem>
    </div>
  </div>

  <div class="scroll-mt-[170px] mt-[72px] os-tabbed:mt-0" id="windows" role="tabpanel" aria-labelledby="tab-windows" data-os-panel hidden={tabbed && os !== 'windows'}>
    <h2 class="mb-2 text-[1.5rem] os-tabbed:hidden">On a Windows PC</h2>
    <p class="mb-6 text-muted">School Schedule works on Windows 10 and 11. Its Windows version is Owen Wang’s <b>School Schedule Manager</b>: a small bar in the corner of your screen with your class, the time left, and what’s next. Windows versions of Email Assistant and Screen Assistant are coming soon.</p>
    <Callout tone="warn">
      {@render warnIcon()}
      <p><b>Why does Windows warn me about it?</b> Windows warns you about any app whose maker hasn’t paid for a code-signing certificate, which costs hundreds of dollars a year. School Schedule Manager is safe, and its code is public on <a href="https://github.com/un-undefined/school-schedule-manager">GitHub</a> for anyone to check. You only see the warnings while installing.</p>
    </Callout>

    <Steps class="mt-10">
      <Step n={1} title="Download the Setup file">
        <p>Go to <a href="/download">Downloads</a> and type your email. Next to School Schedule, check the box to agree to <a href="https://github.com/un-undefined/school-schedule-manager/blob/main/TermsOfService.md">Owen Wang’s Terms of Service</a> (the Windows version is his app), then click <b>Windows Download</b>. You’ll get <b class="[overflow-wrap:anywhere]">SchoolSchedule-Windows-1.1.0-Setup.exe</b> (34.7 MB).</p>
        <p>If your browser says the file <b>isn’t commonly downloaded</b>, choose <b>Keep</b>. In Microsoft Edge, point at the download, click <b>•••</b> and choose <b>Keep</b>, then <b>Show more</b> and <b>Keep anyway</b>.</p>
        <StepVisual note="Only if you see this: click Keep"><MockDownload /></StepVisual>
      </Step>
      <Step n={2} title="Open the Setup file"><p>Click the file in your browser’s download list. Or open <b>File Explorer</b>, click <b>Downloads</b>, and double-click the file.</p></Step>
      <Step n={3} title="Click More info, then Run anyway" id="run-anyway">
        <p>Windows shows a blue box that says <b>“Windows protected your PC.”</b> Don’t click Don’t run. Click <b>More info</b>, and a <b>Run anyway</b> button appears. Click it.</p>
        <StepVisual pair>
          <PairItem note="1. Click More info"><MockSmartScreen step={1} /></PairItem>
          <PairItem note="2. Click Run anyway"><MockSmartScreen step={2} /></PairItem>
        </StepVisual>
      </Step>
      <Step n={4} title="Let it make changes">
        <p>If Windows asks <b>“Do you want to allow this app from an unknown publisher to make changes to your device?”</b>, click <b>Yes</b>. If the installer asks who to install it for, choose <b>Install for me only</b>.</p>
        <StepVisual note="Click Yes"><MockUac /></StepVisual>
        <StepNote class="mt-3">Asked for an administrator password you don’t have? That happens on school and work computers, and only the people who manage the computer can type it.</StepNote>
      </Step>
      <Step n={5} title="Click through the installer">
        <p>Click <b>Next</b> on each page. The choices it already picked are fine. On the <b>Select Additional Tasks</b> page, you can tick two extras:</p>
        <ul>
          <li><b>Create a desktop shortcut</b> puts an icon on your desktop.</li>
          <li><b>Create a shortcut to launch the app on computer startup</b> opens it by itself every time you turn on your computer. We recommend it.</li>
        </ul>
        <p>Then click <b>Install</b>, and <b>Finish</b> when it’s done.</p>
        <StepVisual note="Tick what you want, then click Next"><MockInstaller /></StepVisual>
      </Step>
      <Step n={6} title="Open it from the Start menu">
        <p>Click <b>Start</b>, type <b>School Schedule</b>, and open <b>WHS School Schedule Manager</b>. Its bar shows up in the <b>bottom-left corner</b> of your screen, just above the taskbar, with your class, how far through it you are, the time left, and your next class.</p>
        <StepVisual note="Your bar, in the bottom-left corner"><MockDesktop /></StepVisual>
        <StepNote class="mt-3">Its icon also sits by the clock (click the <b>^</b> arrow if you don’t see it). Right-click the icon to show, hide, or quit the app.</StepNote>
      </Step>
      <Step n={7} title="Fix the calendar (one time)" id="win-code">
        <p>The Windows version thinks November 19, 20, 23 and 24 are short days, but those are only for grades K-8. This code fixes it.</p>
        <p>In School Schedule Manager, click <b>Settings</b>, then <b>Edit Yearly Info</b>. Paste this code where it says “Paste import code here,” then click <b>Save and Close</b>:</p>
        <p><code bind:this={codeEl} class="block rounded-[10px] border border-border bg-surface-2 px-3 py-2.5 text-[.82rem] break-all select-all">{YEAR_CODE}</code></p>
        <p>
          <Button variant="ghost" size="sm" type="button" onclick={copyCode}>
            <svg class="size-4!" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>
            <span>{copyLabel}</span>
          </Button>
        </p>
      </Step>
    </Steps>

    <h2 class="mt-16 mb-0 text-[1.5rem]">Windows troubleshooting</h2>
    <div class="mt-4 grid gap-2.5">
      <FaqItem q="There’s no Run anyway button."><p>Click <b>More info</b> first. Run anyway only shows up after that, next to Don’t run.</p><p>Still no button? The computer is set to only allow apps from the Microsoft Store. On your own computer, open <b>Settings</b>, search for <b>Choose where to get apps</b>, and set it to <b>Anywhere</b>. On a school or work computer, only the people who manage it can change this.</p></FaqItem>
      <FaqItem q="Windows says “Smart App Control blocked an app.”"><p>Smart App Control is a setting on some Windows 11 computers that blocks every app that isn’t signed, with no Run anyway button. It’s in <Path>Windows Security → App &amp; browser control</Path>. On many computers, once it’s turned off it can’t be turned back on without resetting Windows, so ask a parent before changing it, or <a href="/contact?app=school-schedule">contact us</a>.</p></FaqItem>
      <FaqItem q="My browser or antivirus deleted the file."><p>Some browsers and antivirus apps are extra careful with new apps that aren’t signed. Download it again and choose <b>Keep</b> (see step 1). If your antivirus keeps removing it, you can tell it to allow the file, or call us and we’ll help.</p></FaqItem>
      <FaqItem q="I can’t find the bar."><p>Look in the bottom-left corner of your screen, just above the taskbar. If it’s hidden, find the app’s icon by the clock (click the <b>^</b> arrow), right-click it, and choose <b>Show Window</b>. If the app isn’t running, open it from the Start menu.</p></FaqItem>
      <FaqItem q="It says it’s a short day when it isn’t."><p>Do <a href="#win-code">step 7</a> to fix the calendar. You only need to do it once.</p></FaqItem>
      <FaqItem q="How do I make it open when my computer starts?"><p>Run the Setup file again and tick <b>Create a shortcut to launch the app on computer startup</b>. Running Setup again resets the app’s settings, so you may need to add your classes again and redo <a href="#win-code">step 7</a>.</p></FaqItem>
      <FaqItem q="How do I update it?"><p>The Windows version doesn’t update itself yet. When there’s a new version, it’ll be on our <a href="/download">Downloads</a> page: download the new Setup file and run it, just like the first time. Installing it resets the app’s settings, so you may need to add your classes again.</p></FaqItem>
      <FaqItem q="How do I uninstall it?"><p>Right-click the app’s icon by the clock and choose <b>Quit Application</b>. Then open <Path>Settings → Apps → Installed apps</Path> (on Windows 10, <Path>Settings → Apps → Apps &amp; features</Path>), find <b>WHS School Schedule Manager</b>, and choose <b>Uninstall</b>.</p></FaqItem>
      <FaqItem q="Is the Windows version the same as the Mac version?"><p>Not quite. The Windows version is Owen Wang’s original <b>School Schedule Manager</b>, and the Mac version is built from it with extras. Both show your classes, the time left, and your day’s schedule. Only the Mac version has the homework list and tonight’s plan, the quick homework box with AI, the “Got homework?” reminder after class, the Short day and Advisory buttons, and automatic updates. New Windows versions show up on our <a href="/download">Downloads</a> page and <a href="https://github.com/un-undefined/school-schedule-manager/releases">Owen’s GitHub page</a>.</p></FaqItem>
      <FaqItem q="What about Email Assistant and Screen Assistant?"><p>They’re Mac only for now. Windows versions are coming soon. Join our email list on the <a href="/download">Downloads</a> page and we’ll tell you when they’re ready.</p></FaqItem>
    </div>
  </div>

  <Callout tone="info" class="mt-8">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg>
    <p><b>Still need help?</b> Call <a href="tel:+14752661457">(475) 266-1457</a>, or email <a href={contactHref}>{SITE.contactEmail}</a>. We’re happy to walk you through it.</p>
  </Callout>
</Section>
