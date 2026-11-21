<script>
  import Seo from '#lib/components/Seo.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Container from '#lib/components/Container.svelte';
  import Prose from '#lib/components/prose/Prose.svelte';
  import SummaryBox from '#lib/components/prose/SummaryBox.svelte';
  import { SITE } from '#lib/config.js';

  // Third-party software used to build this website, with the notices their licenses require.
  const mit = [
    ['Svelte and SvelteKit', 'Copyright (c) 2016-2025 Svelte Contributors'],
    ['Tailwind CSS', 'Copyright (c) Tailwind Labs, Inc.'],
    ['Lenis', 'Copyright (c) 2024 darkroom.engineering'],
    ['clsx', 'Copyright (c) Luke Edwards'],
    ['tailwind-merge', 'Copyright (c) 2021 Dany Castillo']
  ];
</script>

<Seo title="Licenses · Programs For You" description="The third-party software and fonts used on the Programs For You website, and their licenses." />

<section class="pt-16 pb-7"><Container><Eyebrow>Legal</Eyebrow><h1>Licenses</h1><Lead class="m-0">Credits for the software we build on</Lead></Container></section>
<section class="pt-2 pb-18"><Container>
<Prose>
  <SummaryBox><p><b>The short version:</b> Our apps and website are free to use, but they are not open source. They’re © 2026 Programs For You, all rights reserved, under our <a href="/terms">Terms of Service</a>. We also build on some open-source tools made by other people, and this page thanks them and includes their licenses. Their licenses cover only their own code, not ours.</p></SummaryBox>

  <h2>Our software</h2>
  <p>Email Assistant, Screen Assistant, School Schedule, the TI-84 Evo games, and this website are <strong>freeware</strong>: you may use them for free, for yourself, as described in our <a href="/terms">Terms of Service</a>. You may not copy, share, change, sell, or take apart our code. We don’t release it under an open-source license such as MIT or GPL.</p>

  <h2>Open-source software on this website</h2>
  <p>This website uses the following software under the <strong>MIT License</strong>:</p>
  <ul>
    {#each mit as [name, notice]}<li><strong>{name}</strong>: {notice}</li>{/each}
  </ul>
  <pre class="overflow-x-auto rounded-card-sm border border-border bg-surface p-4 text-[.82rem] leading-relaxed whitespace-pre-wrap text-muted">MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>

  <h2>Animation</h2>
  <p><strong>GSAP</strong> (GreenSock) is used under the <a href="https://gsap.com/standard-license" rel="noopener">GSAP Standard “no charge” License</a>.</p>

  <h2>Fonts</h2>
  <ul>
    <li><strong>Aspekta</strong>, Copyright (c) 2025 Ivo Dolenc, under the <a href="https://openfontlicense.org" rel="noopener">SIL Open Font License 1.1</a>. <a href="/fonts/Aspekta-LICENSE.txt">Full license</a>.</li>
    <li><strong>Roboto Mono</strong>, Copyright Google Inc., under the <a href="https://openfontlicense.org" rel="noopener">SIL Open Font License 1.1</a>.</li>
  </ul>

  <h2>Our Mac apps</h2>
  <p>Our Mac apps may include third-party components that are licensed to us. Where a license requires a notice, we include it here or inside the app.</p>

  <h2>Trademarks</h2>
  <p>All product names, logos, and brands mentioned on this website belong to their owners. Their use here is only to say what our apps work with. See the trademark notice in our <a href="/terms">Terms of Service</a>.</p>

  <h2>Contact</h2>
  <p>Questions about a license or a credit? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
</Prose>
</Container></section>
