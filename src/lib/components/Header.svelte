<script>
  import { page } from '$app/state';
  import Button from './Button.svelte';

  // Grouped nav: dropdowns inside the frosted pill on desktop, a full-screen dark menu on phones.
  const GROUPS = [
    { label: 'Apps', links: [
      ['/school-schedule', 'School Schedule', 'Coming soon'],
      ['/email-assistant', 'Email Assistant', 'Daily summary and replies'],
      ['/screen-assistant', 'Screen Assistant', 'Help with what is on screen'],
      ['/ti-84-evo-games', 'TI-84 Evo Games', 'Games for your calculator']
    ] },
    { label: 'Get started', links: [
      ['/download', 'Downloads', 'Get every app'],
      ['/install', 'How to install', 'Step by step for Mac']
    ] },
    { label: 'About', links: [
      ['/founders', 'Founders', 'Our founders and board'],
      ['/team', 'Team', 'Department heads'],
      ['/apply', 'Join the team', 'Open roles']
    ] }
  ];
  import { DARK_HERO } from '#lib/chrome.js';

  let open = $state(false); // phone menu
  let openGroup = $state(null); // which desktop dropdown is open
  let scrolled = $state(false);

  const here = $derived(page.url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/');
  const lightLogo = $derived(DARK_HERO.includes(here) && !scrolled);
  const groupActive = (g) => g.links.some(([href]) => href === here);

  $effect(() => { here; open = false; openGroup = null; });
  const closeAll = () => { openGroup = null; };

  const item = 'inline-flex h-[39px] cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-[17px] font-mono text-mono leading-none whitespace-nowrap text-ink uppercase no-underline transition-colors duration-[600ms] ease-out-expo hover-fine:bg-bg aria-expanded:bg-bg aria-[current=true]:bg-bg';
  const menuLink = 'block rounded-card-sm px-3 py-2.5 text-ink no-underline transition-colors duration-300 hover:bg-bg aria-[current=page]:bg-bg';
</script>

<svelte:window onscroll={() => (scrolled = scrollY > 10)} />
<svelte:document onclick={closeAll} onkeydown={(e) => e.key === 'Escape' && (closeAll(), (open = false))} />

<header class="print:hidden pointer-events-none fixed inset-x-0 top-5 z-100 mx-auto h-16 w-[calc(100%-40px)] max-w-none desktop:top-[30px] desktop:h-[54px] desktop:w-full desktop:px-gutter">
  <div class="relative flex size-full items-center justify-between gap-5 rounded-2xl bg-(--header-bg) pr-2 pl-3 backdrop-blur-[8px] desktop:rounded-none desktop:bg-transparent desktop:p-0 desktop:backdrop-blur-none">
    <!-- logo -->
    <a href="/" aria-label="Programs For You home"
      class="pointer-events-auto relative flex h-full items-center gap-2.5 whitespace-nowrap no-underline transition-[color,background-color,padding,border-color] duration-[600ms] ease-out-expo desktop:rounded-xl desktop:border desktop:pr-3.5 desktop:pl-3 {scrolled ? 'desktop:border-border desktop:bg-(--header-bg) desktop:backdrop-blur-[14px]' : 'desktop:border-transparent'} text-ink">
      <img class="size-[30px] flex-none" src="/assets/img/logo.svg" alt="" width="30" height="30">
      <span class="text-[1.3rem] leading-none tracking-[-.03em]">Programs For You</span>
    </a>

    <div class="pointer-events-auto flex items-center gap-2">
      <!-- desktop pill -->
      <nav id="site-nav" aria-label="Main" class="hidden h-[54px] items-center gap-3 rounded-xl border border-border bg-(--header-bg) py-1 pr-1 pl-3 backdrop-blur-[14px] desktop:flex">
        <div class="flex items-center gap-px">
          {#each GROUPS as g}
            <div class="relative">
              <button type="button" class={item} aria-haspopup="true" aria-expanded={openGroup === g.label} aria-current={groupActive(g)}
                onclick={(e) => { e.stopPropagation(); openGroup = openGroup === g.label ? null : g.label; }}>
                {g.label}
                <svg class="size-3 transition-transform duration-300 {openGroup === g.label ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {#if openGroup === g.label}
                <div class="absolute top-[calc(100%+16px)] left-0 w-[300px] rounded-card-lg border border-border bg-surface p-2 shadow-lift" onclick={(e) => e.stopPropagation()} role="presentation">
                  {#each g.links as [href, label, hint]}
                    <a {href} aria-current={here === href ? 'page' : undefined} class={menuLink}>
                      <span class="block text-[1.0625rem] leading-tight tracking-[-.02em]">{label}</span>
                      <span class="mt-1 block font-mono text-[.72rem] leading-none text-faint uppercase">{hint}</span>
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <Button href="/contact" size="sm" class="h-[39px] rounded-lg">Contact</Button>
      </nav>

      <!-- phone menu button -->
      <button type="button" aria-controls="site-menu" aria-expanded={open} aria-label={open ? 'Close menu' : 'Menu'}
        class="relative z-[101] size-12 cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-2 desktop:hidden"
        onclick={(e) => { e.stopPropagation(); open = !open; }}>
        <span class="absolute inset-x-3 top-1/2 h-px bg-lime transition-transform duration-[600ms] ease-out-expo {open ? 'rotate-45' : '-translate-y-[3px]'}"></span>
        <span class="absolute inset-x-3 top-1/2 h-px bg-lime transition-transform duration-[600ms] ease-out-expo {open ? '-rotate-45' : 'translate-y-[3px]'}"></span>
      </button>
    </div>
  </div>
</header>

<!-- phone menu: grows out of the top bar -->
<div id="site-menu" class="print:hidden fixed inset-x-5 top-5 z-99 overflow-hidden rounded-2xl border border-border bg-surface text-ink transition-[height,opacity,visibility] duration-[600ms] ease-out-expo desktop:hidden {open ? 'visible h-[calc(100dvh-40px)] opacity-100' : 'invisible pointer-events-none h-16 opacity-0'}" aria-hidden={!open} inert={!open}>
  <div class="absolute inset-0 overflow-y-auto px-6 pt-[88px] pb-8">
    {#each GROUPS as g}
      <p class="mt-7 mb-3 font-mono text-mono text-faint uppercase first:mt-0">{g.label}</p>
      <div class="flex flex-col gap-1">
        {#each g.links as [href, label]}
          <a {href} class="w-fit text-[2rem] leading-[1.15] tracking-[-.02em] text-ink no-underline {here === href ? '' : 'opacity-90'}" aria-current={here === href ? 'page' : undefined}>{label}</a>
        {/each}
      </div>
    {/each}
    <div class="mt-10 flex flex-wrap items-center gap-3">
      <Button href="/contact" variant="notch">Contact</Button>
    </div>
  </div>
</div>
