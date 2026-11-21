<script>
  import { DEPARTMENTS, STAFF, NAMED } from '#lib/team.js';
  import { APPS, GAMES } from '#lib/config.js';
  import Seo from '#lib/components/Seo.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Button from '#lib/components/Button.svelte';
  import Avatar from '#lib/components/team/Avatar.svelte';

  // Team page: Heads of Departments (with their co-heads), Employees & Interns, and the "We're hiring" block.
  // The people are listed in src/lib/team.js.
  const icons = {
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
    share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>',
    megaphone: '<path d="M3 10.5v3a1 1 0 0 0 1 1h3l6 4.5v-14L7 9.5H4a1 1 0 0 0-1 1z"/><path d="M16.5 9a4.5 4.5 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/>',
    cup: '<path d="M4 9h12v4.5A5.5 5.5 0 0 1 10.5 19h-1A5.5 5.5 0 0 1 4 13.5V9z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1.5 1 2.5M12 3.5c0 1 1 1.5 1 2.5"/>'
  };
  const ready = (x) => x.status === 'available' && x.file;
  const stats = [
    [APPS.filter(ready).length, 'free apps'],
    [GAMES.filter(ready).length, 'calculator games'],
    [NAMED.length, NAMED.length === 1 ? 'person on the team' : 'people on the team']
  ];
  const secHead = 'mt-[72px] mb-[26px] text-center first:mt-3';
</script>

<Seo title="Team · Programs For You" description="Meet the Programs For You team: our department heads and co-heads, and how to join." type="AboutPage" />

<PageHead center eyebrow="About us" title="Meet the team" lead="We’re a small team of students. We build free, simple apps that save time for anyone who wants their day to run smoother, and help people be more organized and a little less stressed.">
  <div class="flex flex-wrap justify-center gap-2.5" data-reveal>
    {#each stats as [n, label]}
      <div class="flex items-baseline gap-2 rounded-full border border-border bg-surface px-[18px] py-2.5"><b class="text-[1.1rem]">{n}</b><span class="text-[.92rem] text-muted">{label}</span></div>
    {/each}
  </div>
</PageHead>

<Section tight>
  <div class={secHead}><Eyebrow class="mx-auto">Leadership</Eyebrow><h2 class="mt-4 mb-0 text-[1.75rem]">Heads of Departments</h2></div>
  <div class="mx-auto grid max-w-[900px] grid-cols-2 gap-4 max-[760px]:grid-cols-1">
    {#each DEPARTMENTS as d}
      {@const h = d.head}
      <article class="flex flex-col items-center gap-3.5 rounded-card border border-t-4 border-border bg-surface px-[22px] pt-6 pb-[22px] text-center transition-transform duration-150 hover-fine:-translate-y-0.5" style="--g1:{h.g1 || '#0d9488'};--g2:{h.g2 || '#0284c7'};border-top-color:var(--g1)" data-reveal>
        <Avatar initials={h.initials} g1={h.g1} g2={h.g2} size="md" open={h.soon} />
        <div class="w-full min-w-0">
          <span class="inline-flex items-center gap-1.5 font-mono text-[.72rem] font-semibold tracking-[.06em] text-(--g1) uppercase brightness-125"><svg class="size-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html icons[d.icon]}</svg> {d.dept}</span>
          <h3 class="mt-1.5 mb-0.5 text-[1.15rem] {h.soon ? 'text-muted' : ''}">{h.soon ? 'Coming soon' : h.name}</h3>
          <p class="m-0 text-muted">{h.title}</p>
          {#if h.note || d.note}<p class="m-0 mt-1.5 text-[.93rem] text-muted">{h.note || d.note}</p>{/if}
          {#if d.coHeads?.length}
            <div class="mt-3.5 grid justify-items-center gap-2.5 border-t border-dashed border-border pt-3">
              {#each d.coHeads as c}
                <div class="flex items-center gap-2.5 text-left">
                  <Avatar initials={c.initials} g1={c.g1} g2={c.g2} size="sm" open={c.soon} />
                  <div><b class="block text-[.95rem] {c.soon ? 'font-semibold text-faint' : ''}">{c.soon ? 'Coming soon' : c.name}</b><span class="block text-[.82rem] text-muted">{c.title}</span></div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </article>
    {/each}
  </div>

  {#if STAFF.length}
    <div class={secHead}><Eyebrow class="mx-auto">The crew</Eyebrow><h2 class="mt-4 mb-0 text-[1.75rem]">Employees &amp; Interns</h2></div>
    <ul class="m-0 flex list-none flex-wrap justify-center gap-3 p-0">
      {#each STAFF as s}
        <li class="flex items-center gap-3 rounded-full border border-border bg-surface py-[9px] pr-5 pl-[9px]">
          <Avatar initials={s.initials} g1={s.g1} g2={s.g2} size="sm" open={s.soon} />
          <div><b class="block text-[.98rem]">{s.soon ? 'Coming soon' : s.name}</b><span class="text-[.8rem] text-muted">{s.title}</span></div>
        </li>
      {/each}
    </ul>
  {/if}

  <div class="mx-auto mt-[72px] flex max-w-[900px] flex-col items-center gap-[18px] rounded-card-lg border border-border bg-surface px-7 py-[30px] text-center" data-reveal>
    <div class="flex max-w-[600px] flex-col items-center">
      <Eyebrow>Join us</Eyebrow>
      <h2 class="mt-3 mb-1.5 text-[1.6rem]">We’re hiring</h2>
      <p class="m-0 text-muted">We’re looking for interns and employees to help build, share, and support our apps. No experience needed, just bring your ideas.</p>
    </div>
    <Button variant="primary" href="/apply">Apply to join the team</Button>
  </div>

  <div class="mx-auto mt-14 flex max-w-[740px] flex-wrap items-center justify-center gap-x-[18px] gap-y-3 rounded-card-lg border border-border bg-surface px-6 py-[22px] text-center">
    <p class="m-0 text-muted">Who started it all?</p>
    <Button variant="ghost" href="/founders">Meet our founders</Button>
  </div>
</Section>
