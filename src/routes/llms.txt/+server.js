import { PAGES } from '#lib/pages.js';
import { SITE, APPS, GAMES } from '#lib/config.js';

export const prerender = true;

// llms.txt: a short, plain-Markdown map of the site for language models (see llmstxt.org). Built from config.js.
export function GET() {
  const u = (p) => SITE.url + (p === '/' ? '/' : p);
  const appLines = APPS.map((a) => {
    const win = a.windows?.status === 'available' ? ' and Windows' : '';
    const ready = a.status === 'available' && a.file ? `version ${a.version}, free download` : 'coming soon';
    return `- [${a.name}](${u(a.page)}): ${a.blurb} Mac${win}; ${ready}. Requires ${a.requires}.`;
  });
  const text = `# ${SITE.name}

> ${SITE.name} makes free, simple apps that save students time: School Schedule, Email Assistant and Screen Assistant for Mac (School Schedule also for Windows), plus free Python games for the TI-84 Evo graphing calculator. Everything is free; you only type your email to download. It was started by high school students in Wilton, Connecticut, and the company is owned 50/50 by Brady Krupa and Arjun Bhanderi.

Key facts:
- Price: free. No password or account; downloads open after typing an email address.
- Privacy: schedule and homework stay on the user's computer. Email Assistant and Screen Assistant use the AI built into the Mac, so the company does not see the user's email or screen.
- Not affiliated with Apple Inc. Mac apps are not yet notarized, so macOS asks the user to approve them once (see the install guide).
- Support: ${SITE.contactEmail}, phone +1 (475) 266-1457, or a support ticket at ${u('/contact')}.

## Apps
${appLines.join('\n')}
- [TI-84 Evo Games](${u('/ti-84-evo-games')}): ${GAMES.map((g) => g.name).join(', ')}. Free Python games for the TI-84 Evo calculator.

## Get started
- [Downloads](${u('/download')}): download every app (type your email).
- [How to install](${u('/install')}): step-by-step for Mac and Windows, with pictures.
- [Contact](${u('/contact')}): send a support ticket.

## Company
- [Founders](${u('/founders')}): Brady Krupa (CEO & Founder), Arjun Bhanderi (Co-Founder, CFO & Developer) and the Board of Trustees.
- [Team](${u('/team')}): department heads, co-heads, and the Marketing branch (Social Media, Advertising, Hospitality).
- [Join the team](${u('/apply')}): apply as an intern or employee.

## Legal
- [Terms of Service](${u('/terms')})
- [Privacy Policy](${u('/privacy')})
- [Founders’ Agreement](${u('/founders-agreement')})

## Optional
- [Full version of this file](${u('/llms-full.txt')}): app details, FAQ and install steps in one document.
- [Sitemap](${u('/sitemap.xml')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
