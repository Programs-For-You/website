<script>
  import Seo from '#lib/components/Seo.svelte';
  import { gamesList } from '#lib/seo.js';
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Callout from '#lib/components/Callout.svelte';
  import Steps from '#lib/components/Steps.svelte';
  import Step from '#lib/components/Step.svelte';
  import FaqItem from '#lib/components/FaqItem.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import AppHero from '#lib/components/apphero/AppHero.svelte';
  import Icon from '#lib/components/apphero/Icon.svelte';
  import DownloadCta from '#lib/components/apphero/DownloadCta.svelte';
  import { GAMES, SITE } from '#lib/config.js';

  const g = (id) => GAMES.find((x) => x.id === id);
  const soon = !(g('gridpop') && g('gridpop').status === 'available' && g('gridpop').file);

  const games = [
    { id: 'gridpop', name: 'Grid Pop', shot: '/assets/img/games/gridpop.png', alt: 'Grid Pop being played on the calculator', icon: '/assets/img/gridpop.svg', file: 'GRIDPOP.py',
      text: 'You get three shapes at a time. Place them on the 8 by 8 board, and fill a whole row or column to clear it. Clear more than one at once for bonus points. The game ends when none of your shapes fit.',
      controls: [['Arrows', 'Move the shape'], ['2nd', 'Place it'], ['enter', 'Pick another shape'], ['clear', 'Quit']] },
    { id: 'blockbop', name: 'Block Bop', shot: '/assets/img/games/blockbop.png', alt: 'Block Bop being played on the calculator', icon: '/assets/img/blockbop.svg', file: 'BLOCKBOP.py',
      text: 'Bounce the ball off your paddle to break every brick. Where the ball hits the paddle sets its angle. Silver bricks take two hits, and each level brings a new pattern and a faster ball.',
      controls: [['Left / Right', 'Move paddle'], ['2nd or Up', 'Launch ball'], ['enter', 'Pause'], ['clear', 'Quit']] },
    { id: 'blackjack', name: 'Blackjack', shot: '/assets/img/games/blackjack.png', alt: 'Blackjack being played on the calculator', icon: '/assets/img/blackjack.svg', file: 'BLACKJAK.py',
      text: 'Get closer to 21 than the dealer without going over. You start with 100 chips: pick your bet, then hit, stand, or double down. Blackjack pays 3 to 2, and the dealer hits until 17.',
      controls: [['Left / Right', 'Change your bet'], ['2nd', 'Deal / Hit'], ['enter', 'Stand'], ['Down', 'Double down'], ['clear', 'Quit']] }
  ];
  const calc = 'rounded-[22px] bg-[#1b1f2a] p-3.5 shadow-[0_24px_50px_-24px_rgb(0_0_0/.6),inset_0_0_0_2px_rgb(255_255_255/.06)] [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md [&_img]:[image-rendering:pixelated]';
</script>

<Seo title="TI-84 Evo Games · Programs For You" description="Free games for the TI-84 Evo graphing calculator: Grid Pop, Block Bop, and Blackjack. Made by Programs For You." jsonLd={[gamesList()]} />

<AppHero icon="/assets/img/ti-games.svg" title="TI-84 Evo Games" statusId="gridpop" req="Requires a TI-84 Evo · Free">
  Free games for your TI-84 Evo graphing calculator. Three originals we made ourselves, and they run right on your calculator in its Python app.
  {#snippet actions()}
    <Button href="/download#games"><Icon name="download" class="size-[18px]" /> Get them free</Button>
    <Button variant="ghost" href="#how-to-install">How to install</Button>
  {/snippet}
  {#snippet visual()}
    <div class="{calc} mx-auto w-full max-w-[460px]"><img src="/assets/img/games/gridpop-title.png" width="642" height="422" alt="The Grid Pop title screen"></div>
  {/snippet}
</AppHero>

<Section soft id="games">
  <SectionHead eyebrow="The games" title="Three games, made by us" />
  <div class="grid grid-cols-3 gap-[22px] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
    {#each games as gm}
      <article class="flex flex-col gap-4 rounded-card-lg border border-border bg-surface p-[18px]">
        <div class="{calc} p-2.5! rounded-2xl!"><img src={gm.shot} width="642" height="422" alt={gm.alt} loading="lazy"></div>
        <div class="[&_p]:mb-3">
          <div class="mb-2.5 flex items-center gap-3">
            <img class="rounded-[11px]" src={gm.icon} width="44" height="44" alt="">
            <div><h3 class="mb-[3px]">{gm.name}</h3><StatusBadge id={gm.id} /></div>
          </div>
          <p class="text-muted">{gm.text}</p>
          <ul class="mb-3 grid gap-[7px]">
            {#each gm.controls as [k, d]}
              <li class="flex items-center gap-2.5 text-[.92rem]"><kbd class="min-w-[104px] text-center">{k}</kbd><span>{d}</span></li>
            {/each}
          </ul>
          <p class="text-[.8rem] text-faint">File: {gm.file}</p>
          <Button href="/download#games" variant="ghost" size="sm"><Icon name="download" class="size-[18px]" /> Download {gm.name}</Button>
        </div>
      </article>
    {/each}
  </div>
  <p class="mt-[22px] text-center text-[.9rem] text-faint">Screenshots are from our test simulator, so the letters on your calculator will look a little different.</p>
</Section>

<Section narrow id="how-to-install">
  <SectionHead center={false} eyebrow="Instructions" title="How to put a game on your TI-84 Evo" />
  {#if soon}
    <Callout tone="info"><Icon name="info" /><p>The games are coming soon. These steps show how it will work when they launch.</p></Callout>
  {/if}

  <h3 class="mt-8">What you need</h3>
  <ul class="checklist mb-2">
    <li><span>A <b>TI-84 Evo</b> graphing calculator.</span></li>
    <li><span>Its <b>USB-C cable</b>.</span></li>
    <li><span>A computer with internet. <b>TI Connect Evo</b>, Texas Instruments’ free tool for sending files to the calculator, runs in your web browser, so there’s nothing to install.</span></li>
  </ul>

  <Steps class="mt-9">
    <Step n={1} title="Download the game"><p>Go to <a href="/download#games">Downloads</a>, check the box to agree to the Terms, and click <b>Download</b> next to the game. You’ll get a file like <b>GRIDPOP.py</b>. Don’t rename it: calculator program names can only be 1 to 8 letters.</p></Step>
    <Step n={2} title="Open TI Connect Evo"><p>Go to <a href="https://education.ti.com/en/products/calculators/graphing-calculators/ti-84-evo/ti-connect-evo" rel="noopener">TI Connect Evo</a> on Texas Instruments’ website and open it in your browser.</p></Step>
    <Step n={3} title="Connect your calculator"><p>Plug your TI-84 Evo into the computer with the USB-C cable and turn it on. If your browser asks to let the page connect to your calculator, pick your calculator and click <b>Connect</b>.</p></Step>
    <Step n={4} title="Send the game"><p>In TI Connect Evo, choose <b>Send files</b>, pick the <b>.py</b> file you downloaded, and send it to your calculator. Do the same for each game you want.</p></Step>
    <Step n={5} title="Play"><p>On your calculator, press <kbd>prgm</kbd>, choose the <b>Python App</b>, then pick the game (like <b>GRIDPOP</b>) from the list and run it. Each game shows its controls on the first screen. Press <kbd>clear</kbd> to quit.</p></Step>
  </Steps>

  <h2 class="mt-16 text-2xl">Troubleshooting</h2>
  <div class="mt-4 grid gap-2.5">
    <FaqItem q="I don’t see the Python App."><p>If your calculator’s memory was fully reset, the Python App can disappear. Open TI Connect Evo, connect your calculator, and choose <b>Install OS</b>. Then send the games again.</p></FaqItem>
    <FaqItem q="The game isn’t in the list."><p>Make sure you sent the <b>.py</b> file and didn’t rename it. Program names have to be 1 to 8 letters, like GRIDPOP, BLOCKBOP, or BLACKJAK. Then try sending it again.</p></FaqItem>
    <FaqItem q="My calculator says it’s out of memory."><p>Delete programs you don’t use anymore, then send the game again.</p></FaqItem>
    <FaqItem q="The game disappeared from my calculator."><p>Calculators are often reset before tests, which removes games. Just send them again with TI Connect Evo.</p></FaqItem>
    <FaqItem q="Can I play at school?"><p>Only when your teacher says it’s OK, and never during a test.</p></FaqItem>
    <FaqItem q="Will it work on a TI-84 Plus CE or another calculator?"><p>These games are made for the TI-84 Evo. Other calculators may not be able to run them.</p></FaqItem>
    <FaqItem q="Still stuck?"><p>Call <a href="tel:+14752661457">(475) 266-1457</a> or email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p></FaqItem>
  </div>

  <Callout class="mt-11"><Icon name="info" /><p>Programs For You isn’t affiliated with Texas Instruments. TI-84 Evo is a trademark of Texas Instruments. Our games are © 2026 Programs For You. All rights reserved.</p></Callout>
</Section>

<DownloadCta title="Get the games" text="Free for your TI-84 Evo. Pick a game on the Downloads page and download it. No email needed." buttons={[{ href: '/download#games', label: 'Get them free' }, ...games.map((x) => ({ href: '/download#games', label: x.name }))]} note="Requires a TI-84 Evo" />
