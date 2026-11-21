import { SITE, APPS, GAMES } from '#lib/config.js';
import { HOME_FAQ } from '#lib/faq-home.js';
import { MAC_STEPS } from '#lib/howto-install.js';

export const prerender = true;

// llms-full.txt: everything an assistant needs to answer questions about the apps, in one Markdown document.
export function GET() {
  const u = (p) => SITE.url + p;
  const apps = APPS.map((a) => {
    const ready = a.status === 'available' && a.file;
    const notes = (a.history || []).filter((h) => h.fixed || h.added).slice(0, 3)
      .map((h) => `  - ${h.version}${h.fixed ? `. Fixed: ${h.fixed}` : ''}${h.added ? ` Added: ${h.added}` : ''}`).join('\n');
    return `### ${a.name}\n${a.blurb}\n\n- Page: ${u(a.page)}\n- Platforms: Mac${a.windows?.status === 'available' ? `, Windows (${a.windows.requires}, version ${a.windows.version})` : ' (Windows coming soon)'}${a.requires ? `\n- Requires: ${a.requires}` : ''}\n- Status: ${ready ? `available, version ${a.version}, ${a.size}` : 'coming soon'}\n- Price: free${a.license ? `\n- License: ${a.license} (source code is offered next to the download)` : ''}${notes ? `\n- Recent updates:\n${notes}` : ''}`;
  }).join('\n\n');
  const games = GAMES.map((g) => `- **${g.name}**: ${g.blurb} (${g.size}, ${g.requires})`).join('\n');
  const steps = (list) => list.map((s, i) => `${i + 1}. **${s.name}.** ${s.text}`).join('\n');
  const faq = HOME_FAQ.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');
  const text = `# ${SITE.name}: full reference

${SITE.name} (${SITE.url}) makes free, simple apps that save students time. It was founded by Brady Krupa and Arjun Bhanderi. Contact: ${SITE.contactEmail}.

## Apps
${apps}

## TI-84 Evo games (Python)
${games}
Install: download the .py file, open TI Connect Evo, connect the calculator by USB-C, choose Send files, then run it from the Python App. Page: ${u('/ti-84-evo-games')}

## Install on a Mac
${steps(MAC_STEPS)}

## Frequently asked questions
${faq}

## People
- Brady Krupa: CEO & Founder
- Arjun Bhanderi: Co-Founder & CFO
- Sid Agrawal: Head of Website Development & CTO
- Ethan Krishna: Head of App Development & CAIO
- Adam Johnson: Head of Hospitality & CMO

Legal: ${u('/terms')} · ${u('/privacy')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
