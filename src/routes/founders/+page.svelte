<script>
  import { FOUNDERS, BOARD, WHY_WE_STARTED } from '#lib/team.js';
  import Seo from '#lib/components/Seo.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Button from '#lib/components/Button.svelte';
  import Avatar from '#lib/components/team/Avatar.svelte';

  // Founders page: the founders with "Why we started" between them, then the Board of Trustees.
  // The people are listed in src/lib/team.js.
  const [first, ...rest] = FOUNDERS;
  const named = FOUNDERS.filter((f) => f.name);
</script>

<Seo title="Founders · Programs For You" description="Meet Brady Krupa and Arjun Bhanderi, the founders of Programs For You, why we started, and our Board of Trustees." type="AboutPage" />

{#snippet founder(f)}
  <article class="relative overflow-hidden rounded-card-lg border border-border bg-surface px-[26px] pt-[42px] pb-8 text-center" style="--g1:{f.g1};--g2:{f.g2}" data-reveal>
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[100px] bg-[linear-gradient(135deg,var(--g1),var(--g2))] opacity-[.16]"></div>
    <Avatar initials={f.initials} g1={f.g1} g2={f.g2} size="xl" open={f.soon} class="relative mx-auto mb-4 grid" />
    <span class="relative mb-3 inline-block rounded-full bg-accent-soft px-[11px] py-1 font-mono text-[.72rem] font-semibold tracking-[.06em] text-accent uppercase">{f.soon ? 'Open spot' : 'Founder'}</span>
    <h2 class="relative mb-1 text-[1.6rem] {f.soon ? 'text-muted' : ''}">{f.soon ? 'Coming soon' : f.name}</h2>
    <p class="relative mb-2.5 font-semibold">{f.title}</p>
    {#if f.note}<p class="relative m-0 text-[.96rem] text-muted">{f.note}</p>{/if}
  </article>
{/snippet}

<PageHead center eyebrow="About us" title="Our founders" lead="Programs For You makes simple, free apps that save people time. Meet the people who started it and lead everything we build." />

<Section tight>
  <div class="grid grid-cols-[1fr_1.25fr_1fr] items-stretch gap-[22px] max-[1000px]:grid-cols-1 max-[1000px]:mx-auto max-[1000px]:max-w-[560px]">
    {#if first}{@render founder(first)}{/if}
    <figure class="relative m-0 flex flex-col rounded-card-lg px-8 pt-[34px] pb-7 text-white shadow-[0_26px_60px_-28px_rgba(124,58,237,.75)] bg-[radial-gradient(130%_120%_at_0%_0%,#6366f1_0%,#7c3aed_48%,#db2777_100%)]" data-reveal>
      <span class="pointer-events-none absolute -top-1 right-[22px] font-serif text-[7.5rem] leading-none font-bold opacity-20" aria-hidden="true">“</span>
      <p class="mb-3 font-mono text-mono text-white/80 uppercase">Why we started</p>
      <blockquote class="m-0 mb-[22px] flex-1 text-[1.08rem] leading-[1.65]">{WHY_WE_STARTED}</blockquote>
      <figcaption class="flex items-center font-semibold">
        {#each named as f, i}<Avatar initials={f.initials} g1={f.g1} g2={f.g2} size="sm" class="border-2 border-white/90 shadow-none {i ? '-ml-2.5' : ''}" />{/each}
        <span class="ml-3">{named.map((f) => f.name.split(' ')[0]).join(' & ')}, {named.length === 1 ? 'founder' : 'founders'}</span>
      </figcaption>
    </figure>
    {#each rest as f}{@render founder(f)}{/each}
  </div>
</Section>

{#if BOARD.length}
  <Section soft center>
    <Eyebrow class="mx-auto">Governance</Eyebrow>
    <h2 class="mt-4 mb-3">Board of Trustees</h2>
    <Lead center class="mx-auto">Our Board of Trustees gives advice on the big decisions.</Lead>
    <div class="mx-auto mt-10 max-w-[980px]">
      <div class="flex flex-wrap justify-center gap-x-[30px] gap-y-[26px]">
        {#each BOARD as b}
          <div class="w-[132px] text-center" data-reveal>
            <Avatar initials={b.initials} g1={b.g1} g2={b.g2} size="lg" open={b.soon} class="mb-2.5 outline-4 outline-surface" />
            <b class="block text-[.98rem] {b.soon ? 'font-semibold text-faint' : ''}">{b.soon ? 'Coming soon' : b.name}</b>
            <span class="mt-0.5 block text-[.84rem] leading-[1.35] text-muted">{b.title}</span>
          </div>
        {/each}
      </div>
      <div class="mx-auto mt-[22px] h-3 max-w-[780px] rounded-full bg-[linear-gradient(90deg,transparent,var(--border)_12%,var(--border)_88%,transparent)]" aria-hidden="true"></div>
    </div>
  </Section>
{/if}

<Section tight sectionClass="pt-[max(56px,min(calc(56px+.04*(100vw-440px)),96px))]">
  <div class="mx-auto flex max-w-[740px] flex-wrap items-center justify-center gap-x-[18px] gap-y-3 rounded-card-lg border border-border bg-surface px-6 py-[22px] text-center">
    <p class="m-0 text-muted">Meet the people who build, share, and support our apps.</p>
    <Button variant="ghost" href="/team">Meet the team</Button>
  </div>
</Section>
