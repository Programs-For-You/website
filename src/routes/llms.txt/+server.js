import { PAGES } from '#lib/pages.js';
import { SITE, APP, APPS, GAMES } from '#lib/config.js';

export const prerender = true;

// llms.txt: a short, plain-Markdown map of the site for language models (see llmstxt.org). Built from config.js.
export function GET() {
  const u = (p) => SITE.url + (p === '/' ? '/' : p);
  const appLines = [
    `- [${APP.name}](${u('/download')}): ${APP.blurb} Version ${APP.version}, free download for Mac. Requires ${APP.requires}`,
    ...APPS.map((a) => `- [${a.name}](${u(a.page)}) (inside Programs For You): ${a.blurb} Requires ${a.requires}.`),
  ];
  const text = `# ${SITE.name}

> ${SITE.name} makes free, simple tools that save students time: one Mac app, Programs For You, with School Calendar, Email Assistant, and Screen Assistant inside, plus free Python games for the TI-84 Evo graphing calculator. Everything is free, with no email, password or account needed to download. The app updates only when the user clicks Check for Updates.

Key facts:
- Price: free. No email, password or account; downloads open after agreeing to the Terms (13 or older).
- Privacy: schedule and homework stay on the user's computer. Email Assistant and Screen Assistant use the AI built into the Mac, so the company does not see the user's email or screen.
- Not affiliated with Apple Inc. Mac apps are not yet notarized, so macOS asks the user to approve them once (see the install guide).
- Support: ${SITE.contactEmail}, phone +1 (475) 266-1457, or a support ticket at ${u('/contact')}.

## The app
${appLines.join('\n')}
- [TI-84 Evo Games](${u('/ti-84-evo-games')}): ${GAMES.map((g) => g.name).join(', ')}. Free Python games for the TI-84 Evo calculator.

## Get started
- [Downloads](${u('/download')}): download Programs For You (no email needed).
- [How to install](${u('/install')}): step-by-step for Mac, with pictures.
- [Contact](${u('/contact')}): send a support ticket.

## Company
- [Founders](${u('/founders')}): Brady Krupa (CEO & Founder) and Arjun Bhanderi (Co-Founder & CFO), why we started, and the Board of Trustees.
- [Team](${u('/team')}): department heads and co-heads.
- [Join the team](${u('/apply')}): apply as an intern or employee.

## Legal
- [Terms of Service](${u('/terms')})
- [Privacy Policy](${u('/privacy')})

## Optional
- [Full version of this file](${u('/llms-full.txt')}): app details, FAQ and install steps in one document.
- [Sitemap](${u('/sitemap.xml')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
