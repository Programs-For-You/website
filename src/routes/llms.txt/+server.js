import { PAGES } from '#lib/pages.js';
import { SITE, APPS, GAMES } from '#lib/config.js';

export const prerender = true;

// llms.txt: a short, plain-Markdown map of the site for language models (see llmstxt.org). Built from config.js.
export function GET() {
  const u = (p) => SITE.url + (p === '/' ? '/' : p);
  const appLines = APPS.map((a) => {
    const win = a.windows?.status === 'available' ? ' and Windows' : '';
    const ready = a.status === 'available' && a.file ? `version ${a.version}, free download` : 'coming soon';
    return `- [${a.name}](${u(a.page)}): ${a.blurb} Mac${win}; ${ready}.${a.requires ? ` Requires ${a.requires}.` : ''}`;
  });
  const text = `# ${SITE.name}

> ${SITE.name} makes free, simple apps that save students time: Email Assistant and Screen Assistant for Mac, plus free Python games for the TI-84 Evo graphing calculator. School Schedule is coming soon. Everything is free, with no email, password or account needed to download.

Key facts:
- Price: free. No email, password or account; downloads open after agreeing to the Terms (13 or older).
- Privacy: schedule and homework stay on the user's computer. Email Assistant and Screen Assistant use the AI built into the Mac, so the company does not see the user's email or screen.
- Not affiliated with Apple Inc. Mac apps are not yet notarized, so macOS asks the user to approve them once (see the install guide).
- Support: ${SITE.contactEmail}, or a support ticket at ${u('/contact')}.

## Apps
${appLines.join('\n')}
- [TI-84 Evo Games](${u('/ti-84-evo-games')}): ${GAMES.map((g) => g.name).join(', ')}. Free Python games for the TI-84 Evo calculator.

## Get started
- [How to install](${u('/install')}): step-by-step for Mac, with pictures.
- [Contact](${u('/contact')}): send a support ticket.

## Company
- [Team](${u('/team')}): Brady Krupa (CEO & Founder) and Arjun Bhanderi (Co-Founder & CFO), why we started, and the rest of the team.
- [Join the team](${u('/apply')}): apply to volunteer.

## Legal
- [Terms of Service](${u('/terms')})
- [Privacy Policy](${u('/privacy')})

## Optional
- [Full version of this file](${u('/llms-full.txt')}): app details, FAQ and install steps in one document.
- [Sitemap](${u('/sitemap.xml')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
