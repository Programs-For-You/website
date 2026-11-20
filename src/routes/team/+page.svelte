<script>
  import { defaultMembers } from '#lib/team.js';
  import Seo from '#lib/components/Seo.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Avatar from '#lib/components/team/Avatar.svelte';

  const members = defaultMembers; // edit the list in src/lib/team.js
</script>

<Seo title="Team · Programs For You" description="Meet the Programs For You founders, board members, and department heads." type="AboutPage" />

<PageHead eyebrow="About us" title="Meet the team" lead="We’re a team of high school freshmen from Wilton, Connecticut. We build free, simple apps that save time, first for students at our school and then for anyone who wants their day to run smoother." />

<Section tight>
  <div class="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
    {#each members as m}
      <article class="group relative flex flex-col gap-6 overflow-hidden rounded-card-lg bg-surface p-6 desktop:p-8" style="--g1:{m.g1};--g2:{m.g2}" data-reveal>
        <div class="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(circle,var(--g1),transparent_65%)] opacity-[.18] transition-opacity duration-[600ms] ease-out-expo group-hover-fine:opacity-35"></div>
        <div class="relative flex items-start justify-between gap-4">
          <Avatar initials={m.initials} g1={m.g1} g2={m.g2} size="lg" />
          {#if m.founder}<span class="inline-flex h-7 items-center rounded-lg bg-lime px-2.5 font-mono text-mono leading-none text-ink uppercase">Founder</span>{/if}
        </div>
        <div class="relative">
          <h3 class="mb-1 text-[1.75rem] leading-[1.1]">{m.name}</h3>
          <p class="mb-3 font-mono text-mono leading-[1.3] text-faint uppercase">{m.title}</p>
          {#if m.note}<p class="m-0 text-body text-ink/80">{m.note}</p>{/if}
        </div>
      </article>
    {/each}
  </div>
  <p class="mt-8 mb-0 font-mono text-mono text-faint uppercase">Programs For You is founded and owned by Brady Krupa and Arjun Bhanderi.</p>
</Section>

<Section tight sectionClass="pt-0"><p class="m-0 max-w-[90ch] font-mono text-mono leading-[1.5] text-faint uppercase">Programs For You, Email Assistant and Screen Assistant are © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved. School Schedule is © 2026 Owen Wang &amp; Brady Krupa and free software under the GNU AGPL v3, based on Owen Wang’s School Schedule Manager.</p></Section>
