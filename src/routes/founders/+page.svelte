<script>
  import Seo from '#lib/components/Seo.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Button from '#lib/components/Button.svelte';
  import Avatar from '#lib/components/team/Avatar.svelte';

  const BK = { initials: 'BK', g1: '#4f46e5', g2: '#9333ea' };
  const AB = { initials: 'AB', g1: '#0284c7', g2: '#6366f1' };
  const seats = [
    { ...BK, name: 'Brady Krupa', title: 'CEO & Founder' },
    { ...AB, name: 'Arjun Bhanderi', title: 'Co-Founder, CFO & Developer' },
    { initials: 'AJ', g1: '#d97706', g2: '#dc2626', name: 'Adam Johnson', title: 'Head of Marketing' },
    { initials: 'RP', g1: '#e11d48', g2: '#f97316', name: 'Riya Pendse', title: 'Head of Social Media' },
    { initials: 'EK', g1: '#0d9488', g2: '#0284c7', name: 'Ethan Krishna', title: 'Head of Development' },
    { initials: 'SA', g1: '#65a30d', g2: '#0d9488', name: 'Sid Agrawal', title: 'Board Member' }
  ];
</script>

{#snippet founder(p, name, role, note)}
  <article class="group relative flex flex-col overflow-hidden rounded-card-lg bg-surface px-7 pt-12 pb-9 desktop:px-8" style="--g1:{p.g1};--g2:{p.g2}" data-reveal>
    <div class="pointer-events-none absolute -top-28 left-1/2 size-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--g1),transparent_65%)] opacity-25 transition-opacity duration-[600ms] ease-out-expo group-hover-fine:opacity-45"></div>
    <Avatar initials={p.initials} g1={p.g1} g2={p.g2} size="xl" class="relative mb-8" />
    <div class="relative mt-auto">
      <Eyebrow class="mb-5">Founder · 50% owner</Eyebrow>
      <h2 class="mb-2 text-[clamp(1.75rem,2.4vw,2.4rem)]">{name}</h2>
      <p class="mb-4 font-mono text-mono leading-[1.3] text-faint uppercase">{role}</p>
      <p class="m-0 text-body text-ink/80">{note}</p>
    </div>
  </article>
{/snippet}

<Seo title="Founders · Programs For You" description="Meet Brady Krupa and Arjun Bhanderi, the founders of Programs For You, and our Board of Trustees." type="AboutPage" />

<PageHead eyebrow="About us" title="Our founders" lead="Brady Krupa and Arjun Bhanderi started Programs For You as high school freshmen in Wilton, Connecticut. They own it together, 50/50, and lead everything we build." />

<Section tight>
  <div class="grid grid-cols-[1fr_1.25fr_1fr] items-stretch gap-5 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1">
    {@render founder(BK, 'Brady Krupa', 'CEO & Founder', 'Leads the company and decides what we build next.')}
    <figure class="relative isolate m-0 flex flex-col overflow-hidden rounded-card-lg bg-[radial-gradient(130%_120%_at_0%_0%,#2f6b4f_0%,#17392c_52%,#0b1110_100%)] px-7 pt-9 pb-8 text-white max-[1100px]:order-3 max-[1100px]:col-span-full desktop:px-9" data-reveal>
      <span class="pointer-events-none absolute -top-2 right-6 -z-10 font-[Georgia,serif] text-[8rem] leading-none text-lime opacity-30" aria-hidden="true">“</span>
      <Eyebrow class="mb-6">Why we started</Eyebrow>
      <blockquote class="m-0 mb-7 flex-1 text-[max(1.0625rem,min(calc(1.0625rem+.004*(100vw-27.5rem)),1.375rem))] leading-[1.4] tracking-[-.015em]">Every school day we saw the same small problems: losing track of what period it is, homework piling up, and an inbox nobody has time for. The apps that could help were expensive, complicated, or not made for students. So we built our own: simple, free tools that each do one job well. We started with our own school, and we want to keep making things that give people a little more time and a little less stress.</blockquote>
      <figcaption class="flex items-center font-mono text-mono leading-none uppercase"><Avatar {...BK} size="sm" class="border-2 border-bg shadow-none" /><Avatar {...AB} size="sm" class="-ml-2.5 border-2 border-bg shadow-none" /><span class="ml-3">Brady &amp; Arjun, founders</span></figcaption>
    </figure>
    {@render founder(AB, 'Arjun Bhanderi', 'Co-Founder, CFO & Developer', 'Keeps track of the money, and helps build, test, and improve every app.')}
  </div>
</Section>

<Section soft>
  <SectionHead eyebrow="Governance" title="Board of Trustees" lead="Our Board of Trustees gives advice on the big decisions. Brady and Arjun keep final control, as described in the Founders’ Agreement." />
  <div class="grid grid-cols-6 gap-5 max-[1100px]:grid-cols-3 max-[560px]:grid-cols-2">
    {#each seats as s}
      <div class="flex flex-col gap-4 rounded-card bg-bg p-5" data-reveal><Avatar initials={s.initials} g1={s.g1} g2={s.g2} size="lg" /><div><b class="block font-normal text-title leading-tight">{s.name}</b><span class="mt-2 block font-mono text-[.72rem] leading-snug text-faint uppercase">{s.title}</span></div></div>
    {/each}
  </div>
  <p class="mt-8 mb-0"><a class="link-draw font-mono text-mono uppercase" href="/founders-agreement">Read the Founders’ Agreement →</a></p>
</Section>

<Section tight>
  <div class="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 rounded-card-lg border border-border px-6 py-5 desktop:px-10" data-reveal>
    <p class="m-0 text-lead">Meet the people who build, share, and support our apps.</p>
    <Button href="/team" variant="notch">Meet the team</Button>
  </div>
</Section>

<Section tight sectionClass="pt-0"><p class="m-0 max-w-[90ch] font-mono text-mono leading-[1.5] text-faint uppercase">Programs For You, Email Assistant and Screen Assistant are © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved. School Schedule is © 2026 Owen Wang &amp; Brady Krupa and free software under the GNU AGPL v3, based on Owen Wang’s School Schedule Manager.</p></Section>
