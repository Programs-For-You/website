<script>
  import { page } from '$app/state';
  import { SITE } from '#lib/config.js';
  import { abs, breadcrumbs, webPage } from '#lib/seo.js';

  /**
   * Everything a search engine, social card or AI assistant reads from <head>. Use once per page.
   * title / description: required (title is the <title> and share title).
   * type: schema.org page type: WebPage | AboutPage | ContactPage | CollectionPage.
   * jsonLd: extra structured data objects (SoftwareApplication, FAQPage, HowTo ...).
   * image: share picture path (default /og.png, 1200x630).   noindex: keep it out of search results.
   */
  let { title, description = '', noindex = false, type = 'WebPage', jsonLd = [], image = '/og.png' } = $props();

  const path = $derived(page.url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/');
  const url = $derived(abs(path));
  const img = $derived(image.startsWith('http') ? image : SITE.url + image);
  const data = $derived(noindex ? [] : [webPage({ path, title, description, type }), breadcrumbs(path, title.split(' · ')[0]), ...jsonLd.filter(Boolean)]);
  // "<" is escaped so the JSON can never close the script tag early.
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}<\/script>`;
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}<meta name="description" content={description}>{/if}
  <link rel="canonical" href={url}>
  <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}>

  <meta property="og:type" content="website">
  <meta property="og:site_name" content={SITE.name}>
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content={url}>
  <meta property="og:title" content={title}>
  {#if description}<meta property="og:description" content={description}>{/if}
  <meta property="og:image" content={img}>
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Programs For You: simple apps that make your day easier">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  {#if description}<meta name="twitter:description" content={description}>{/if}
  <meta name="twitter:image" content={img}>

  {#each data as o}{@html ld(o)}{/each}
</svelte:head>
