<script>
  import Seo from '#lib/components/Seo.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';

  const logos = [
    { name: 'Logo', note: 'The mark on its own. Works on dark or light backgrounds.', svg: '/brand/programs-for-you-logo.svg', png: '/brand/programs-for-you-logo.png', bg: 'bg-bg', img: 'h-40' },
    { name: 'App icon', note: 'The mark on the dark teal rounded tile.', svg: '/brand/programs-for-you-app-icon.svg', png: '/brand/programs-for-you-app-icon.png', bg: 'bg-surface-2', img: 'size-40' },
    { name: 'Logo on light', note: 'Same mark, shown on cream so you can see it works there too.', svg: '/brand/programs-for-you-logo.svg', png: '/brand/programs-for-you-logo.png', bg: 'bg-[#f1f1ec]', img: 'h-40' }
  ];

  const colors = [
    ['Background', '#0b1110', 'Page background'],
    ['Surface', '#151f1e', 'Cards'],
    ['Raised', '#1d2b29', 'Raised surfaces'],
    ['Cream', '#f1f1ec', 'Text'],
    ['Muted', '#a3bab6', 'Secondary text'],
    ['Lime', '#a7e26e', 'The one accent']
  ];
  const logoColors = [['Green', '#34d27b'], ['Deep green', '#139a52'], ['Light green', '#c4f08a'], ['Mid green', '#7fd35a']];

  const fonts = [
    { name: 'Aspekta', use: 'Everything: headings and body text.', sample: 'Free apps that save you time', cls: 'text-[2rem] tracking-[-.02em]', file: '/fonts/AspektaVF.woff2', license: '/fonts/Aspekta-LICENSE.txt', licenseName: 'SIL Open Font License 1.1' },
    { name: 'Roboto Mono', use: 'Labels, eyebrows and tags, in uppercase.', sample: 'DOWNLOAD FOR MAC', cls: 'font-mono text-[1.25rem] uppercase', file: '/fonts/RobotoMono-Regular.woff2', license: 'https://www.apache.org/licenses/LICENSE-2.0', licenseName: 'Apache License 2.0' }
  ];

  let copied = $state('');
  async function copy(hex) {
    try { await navigator.clipboard.writeText(hex); copied = hex; setTimeout(() => (copied = ''), 1500); } catch {}
  }
</script>

<Seo title="Brand kit · Programs For You" description="Logos, colors and fonts for Programs For You." noindex />

<section class="pt-16 pb-7"><Container><Eyebrow>Brand</Eyebrow><h1>Brand kit</h1><Lead class="m-0">Our logo, colors and fonts, free to download</Lead></Container></section>

<section class="pt-2 pb-12"><Container>
  <h2 class="mb-6">Logo</h2>
  <div class="grid gap-5 desktop:grid-cols-3">
    {#each logos as l}
      <div class="flex flex-col overflow-hidden rounded-card-lg bg-surface">
        <div class="grid h-64 place-items-center {l.bg}"><img src={l.svg} alt="{l.name} preview" class={l.img} /></div>
        <div class="flex flex-1 flex-col gap-4 p-6">
          <div><h3 class="mb-1 text-title">{l.name}</h3><p class="m-0 text-muted">{l.note}</p></div>
          <div class="mt-auto flex flex-wrap gap-3">
            <Button href={l.svg} download size="sm" variant="outline">SVG</Button>
            <Button href={l.png} download size="sm" variant="outline">PNG</Button>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <p class="mt-5 text-muted">Please don’t stretch, recolor, rotate or add effects to the logo. Give it some empty space around it.</p>
</Container></section>

<section class="pb-12"><Container>
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4"><h2 class="m-0">Colors</h2><Button href="/brand/programs-for-you-colors.css" download size="sm" variant="outline">Download CSS</Button></div>
  <p class="mt-0 mb-6 text-muted">Dark and calm, with one lime accent. Use lime sparingly. Click a color to copy its code.</p>
  <div class="grid grid-cols-2 gap-4 desktop:grid-cols-6">
    {#each colors as [name, hex, use]}
      <button type="button" onclick={() => copy(hex)} class="cursor-pointer overflow-hidden rounded-card-lg border border-border bg-surface text-left text-inherit">
        <span class="block h-24 border-b border-border" style="background:{hex}"></span>
        <span class="block p-4"><span class="block font-medium">{name}</span><span class="block font-mono text-mono uppercase">{copied === hex ? 'Copied' : hex}</span><span class="block text-[.875rem] text-muted">{use}</span></span>
      </button>
    {/each}
  </div>
  <h3 class="mt-10 mb-4 text-title">Logo greens</h3>
  <div class="grid grid-cols-2 gap-4 desktop:grid-cols-4">
    {#each logoColors as [name, hex]}
      <button type="button" onclick={() => copy(hex)} class="flex cursor-pointer items-center gap-4 rounded-card-lg border border-border bg-surface p-3 text-left text-inherit">
        <span class="size-12 shrink-0 rounded-card-sm" style="background:{hex}"></span>
        <span><span class="block font-medium">{name}</span><span class="block font-mono text-mono uppercase">{copied === hex ? 'Copied' : hex}</span></span>
      </button>
    {/each}
  </div>
</Container></section>

<section class="pb-18"><Container>
  <h2 class="mb-6">Fonts</h2>
  <div class="grid gap-5 desktop:grid-cols-2">
    {#each fonts as f}
      <div class="flex flex-col gap-5 rounded-card-lg bg-surface p-7">
        <div><h3 class="mb-1 text-title">{f.name}</h3><p class="m-0 text-muted">{f.use}</p></div>
        <p class="m-0 rounded-card bg-bg p-5 {f.cls}">{f.sample}</p>
        <div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button href={f.file} download size="sm" variant="outline">Download font</Button>
          <a class="link-draw text-muted" href={f.license} rel="noopener">{f.licenseName}</a>
        </div>
      </div>
    {/each}
  </div>
  <p class="mt-5 text-muted">Both fonts are free to use. Headings use tight spacing, about -0.02em.</p>
</Container></section>
