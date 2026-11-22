<script>
  let { data } = $props();
  import { WHY_WE_STARTED } from '#lib/team.js';
  import Seo from '#lib/components/Seo.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Avatar from '#lib/components/team/Avatar.svelte';
  import ShaderBackdrop from '#lib/components/ShaderBackdrop.svelte';

  // Team page: "Why we started", then a big card for every member. The people come from the D1 `people`
  // table (see +page.server.js); the quote is in src/lib/team.js.
  const founders = $derived(data.members.filter((m) => m.founder && m.name));
</script>

<Seo title="Team · Programs For You" description="Meet the team behind Programs For You: our founders, our Board of Trustees, and why we started." type="AboutPage" />

{#snippet card(m)}
  <article class="relative overflow-hidden rounded-card-lg border border-border bg-surface px-[26px] pt-[42px] pb-8 text-center" style="--g1:{m.g1};--g2:{m.g2}" data-reveal>
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[100px] bg-[linear-gradient(135deg,var(--g1),var(--g2))] opacity-[.16]"></div>
    <Avatar initials={m.initials ?? ''} g1={m.g1} g2={m.g2} size="xl" open={m.soon} class="relative mx-auto mb-4 grid" />
    <span class="relative mb-3 inline-block rounded-full bg-accent-soft px-[11px] py-1 font-mono text-[.72rem] font-semibold tracking-[.06em] text-accent uppercase">{m.soon ? 'Open spot' : m.founder ? 'Founder' : 'Board member'}</span>
    <h2 class="relative mb-1 text-[1.6rem] {m.soon ? 'text-muted' : ''}">{m.soon ? 'Coming soon' : m.name}</h2>
    <p class="relative mb-2.5 font-semibold">{m.title}</p>
    {#if m.note}<p class="relative m-0 text-[.96rem] text-muted">{m.note}</p>{/if}
  </article>
{/snippet}

<!-- Top half: the page heading and the "Why we started" quote over the dark flowing backdrop (same one as the footer). -->
<div class="relative isolate mb-2 desktop:mb-3">
  <div class="pointer-events-none absolute inset-x-2 -top-24 bottom-0 -z-10 overflow-hidden rounded-card-lg border border-border bg-bg desktop:inset-x-3 desktop:-top-30" aria-hidden="true">
    <div class="absolute inset-0 opacity-80"><ShaderBackdrop tone="night" scale={0.4} /></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_17_16/.6)_100%)]"></div>
  </div>
  <PageHead center eyebrow="About us" title="Our team" lead="Programs For You makes simple, free apps that save people time. Meet the people who started it and lead everything we build." />

  <Section tight>
    <figure class="relative my-0 mx-auto flex max-w-[760px] flex-col rounded-card-lg px-8 pt-[34px] pb-7 border border-border text-white shadow-lift bg-(image:--desk)" data-reveal>
      <span class="pointer-events-none absolute -top-1 right-[22px] font-serif text-[7.5rem] leading-none font-bold text-accent opacity-40" aria-hidden="true">“</span>
      <p class="mb-3 font-mono text-mono text-white/80 uppercase">Why we started</p>
      <blockquote class="m-0 mb-[22px] flex-1 text-[1.08rem] leading-[1.65]">{WHY_WE_STARTED}</blockquote>
      {#if founders.length}
        <figcaption class="flex items-center font-semibold">
          {#each founders as f, i}<Avatar initials={f.initials} g1={f.g1} g2={f.g2} size="sm" class="border-2 border-white/90 shadow-none {i ? '-ml-2.5' : ''}" />{/each}
          <span class="ml-3">{founders.map((f) => f.name.split(' ')[0]).join(' & ')}, {founders.length === 1 ? 'founder' : 'founders'}</span>
        </figcaption>
      {/if}
    </figure>
  </Section>
</div>

<Section>
  <div class="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px]">
    {#each data.members as m}{@render card(m)}{/each}
  </div>
</Section>
