<script>
  import Seo from '#lib/components/Seo.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Button from '#lib/components/Button.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import DeptCard from '#lib/components/team/DeptCard.svelte';

  const dev = {
    g1: '#0d9488', g2: '#0284c7', initials: 'EK', dept: 'Development', name: 'Ethan Krishna', role: 'Head of Development', note: 'Leads the building of our apps.', icon: devIcon,
    co: { g1: '#16a34a', g2: '#0d9488', initials: 'OW', name: 'Owen Wang', role: 'Co-Head of Development', note: 'Created the original School Schedule Manager for Windows.' }
  };
  // Marketing is one branch: Adam Johnson heads it, and Social Media, Advertising and Hospitality all sit under it.
  const marketing = {
    g1: '#d97706', g2: '#dc2626', initials: 'AJ', dept: 'Marketing', name: 'Adam Johnson', role: 'Head of Marketing', note: 'Leads Marketing, and the Social Media, Advertising and Hospitality teams under it.', icon: marketIcon
  };
  const marketingTeams = [
    { g1: '#e11d48', g2: '#f97316', initials: 'RP', dept: 'Social Media', name: 'Riya Pendse', role: 'Head of Social Media', note: 'Runs our social media.', icon: social,
      co: { g1: '#2563eb', g2: '#06b6d4', initials: 'CD', name: 'Carter Dobson', role: 'Co-Head of Social Media' } },
    { g1: '#7c3aed', g2: '#db2777', initials: 'SS', dept: 'Advertising', name: 'Serafim Spetsaris', role: 'Head of Advertising', note: 'Spreads the word about our apps.', icon: ads,
      co: { g1: '#c026d3', g2: '#7c3aed', initials: 'BC', name: 'Brooks Carrington', role: 'Co-Head of Advertising' } },
    { g1: '#d97706', g2: '#dc2626', initials: 'AJ', dept: 'Hospitality', name: 'Adam Johnson', role: 'Head of Hospitality', note: 'Makes sure everyone feels welcome.', icon: host,
      co: { g1: '#4f46e5', g2: '#9333ea', initials: 'SS', name: 'Spencer Skott', role: 'Co-Head of Hospitality' } }
  ];
</script>

{#snippet devIcon()}<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>{/snippet}
{#snippet social()}<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>{/snippet}
{#snippet ads()}<path d="M3 10.5v3a1 1 0 0 0 1 1h3l6 4.5v-14L7 9.5H4a1 1 0 0 0-1 1z"/><path d="M16.5 9a4.5 4.5 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/>{/snippet}
{#snippet marketIcon()}<path d="M3 11l15-6v14L3 13z"/><path d="M7 13.5V19a1.5 1.5 0 0 0 3 0v-4"/>{/snippet}
{#snippet host()}<path d="M4 9h12v4.5A5.5 5.5 0 0 1 10.5 19h-1A5.5 5.5 0 0 1 4 13.5V9z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1.5 1 2.5M12 3.5c0 1 1 1.5 1 2.5"/>{/snippet}

<Seo title="Team · Programs For You" description="Meet the Programs For You team: our department heads, co-heads, employees, and interns." type="AboutPage" />

<PageHead eyebrow="About us" title="Meet the team" lead="We’re a team of high school freshmen from Wilton, Connecticut. We build free, simple apps that save time, first for students at our school and then for anyone who wants their day to run smoother. Our goal is to help our community be more efficient, more organized, and a little less stressed.">
  <div class="flex flex-wrap gap-2.5" data-reveal>
    {#each [['3', 'free apps'], ['10', 'people on the team'], ['Wilton, CT', 'where we’re from']] as [n, label]}
      <div class="flex items-baseline gap-2.5 rounded-xl bg-surface px-4 py-3"><b class="text-title font-normal">{n}</b><span class="font-mono text-mono leading-none text-faint uppercase">{label}</span></div>
    {/each}
  </div>
</PageHead>

<Section tight>
  <SectionHead eyebrow="Leadership" title="Heads of Departments" />
  <div class="max-w-[calc(50%-10px)] max-[900px]:max-w-none"><DeptCard {...dev} /></div>

  <!-- The Marketing branch: the head on top, a stem down to a bar, and three teams hanging off it -->
  <div class="mt-5">
    <div class="mx-auto max-w-[calc(33.333%-14px)] max-[900px]:max-w-none"><DeptCard {...marketing} /></div>
    <div class="mx-auto hidden h-10 w-px bg-border-strong desktop:block" aria-hidden="true"></div>
    <div class="relative grid grid-cols-3 gap-5 max-[900px]:ml-5 max-[900px]:grid-cols-1 max-[900px]:border-l max-[900px]:border-border-strong max-[900px]:pt-5 max-[900px]:pl-5 desktop:before:absolute desktop:before:top-0 desktop:before:left-[16.666%] desktop:before:h-px desktop:before:w-[66.666%] desktop:before:bg-border-strong desktop:before:content-['']">
      {#each marketingTeams as t}
        <div class="relative desktop:pt-10 desktop:before:absolute desktop:before:top-0 desktop:before:left-1/2 desktop:before:h-10 desktop:before:w-px desktop:before:bg-border-strong desktop:before:content-['']"><DeptCard {...t} /></div>
      {/each}
    </div>
  </div>
</Section>

<Section tight sectionClass="pt-0"><p class="m-0 max-w-[90ch] font-mono text-mono leading-[1.5] text-faint uppercase">Programs For You, Email Assistant and Screen Assistant are © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved. School Schedule is © 2026 Owen Wang &amp; Brady Krupa and free software under the GNU AGPL v3, based on Owen Wang’s School Schedule Manager.</p></Section>
