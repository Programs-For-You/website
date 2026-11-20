import { SITE, APPS, GAMES } from '#lib/config.js';
import { HOME_FAQ } from '#lib/faq-home.js';
import { MAC_STEPS, WINDOWS_STEPS } from '#lib/howto-install.js';

export const prerender = true;

// llms-full.txt: everything an assistant needs to answer questions about the apps, in one Markdown document.
export function GET() {
  const u = (p) => SITE.url + p;
  const apps = APPS.map((a) => {
    const ready = a.status === 'available' && a.file;
    const notes = (a.history || []).filter((h) => h.fixed || h.added).slice(0, 3)
      .map((h) => `  - ${h.version}${h.fixed ? `. Fixed: ${h.fixed}` : ''}${h.added ? ` Added: ${h.added}` : ''}`).join('\n');
    return `### ${a.name}\n${a.blurb}\n\n- Page: ${u(a.page)}\n- Platforms: Mac${a.windows?.status === 'available' ? `, Windows (${a.windows.requires}, version ${a.windows.version})` : ' (Windows coming soon)'}\n- Requires: ${a.requires}\n- Status: ${ready ? `available, version ${a.version}, ${a.size}` : 'coming soon'}\n- Price: free${a.license ? `\n- License: ${a.license} (source code is offered next to the download)` : ''}${notes ? `\n- Recent updates:\n${notes}` : ''}`;
  }).join('\n\n');
  const games = GAMES.map((g) => `- **${g.name}**: ${g.blurb} (${g.size}, ${g.requires})`).join('\n');
  const steps = (list) => list.map((s, i) => `${i + 1}. **${s.name}.** ${s.text}`).join('\n');
  const faq = HOME_FAQ.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');
  const text = `# ${SITE.name}: full reference

${SITE.name} (${SITE.url}) makes free, simple apps that save students time. It was started by high school freshmen in Wilton, Connecticut and was founded by Brady Krupa and Arjun Bhanderi. Contact: ${SITE.contactEmail}, +1 (475) 266-1457.

## Apps
${apps}

## TI-84 Evo games (Python)
${games}
Install: download the .py file, open TI Connect Evo, connect the calculator by USB-C, choose Send files, then run it from the Python App. Page: ${u('/ti-84-evo-games')}

## Install on a Mac
${steps(MAC_STEPS)}

## Install School Schedule on Windows
${steps(WINDOWS_STEPS)}

## Frequently asked questions
${faq}

## People
- Brady Krupa: CEO & Founder
- Arjun Bhanderi: Co-Founder, CFO & Developer
- Marketing branch: Adam Johnson is Head of Marketing; Social Media (Riya Pendse, Carter Dobson), Advertising (Serafim Spetsaris, Brooks Carrington) and Hospitality (Adam Johnson, Spencer Skott) sit under it
- Development: Ethan Krishna (Head), Owen Wang (Co-Head)
- Founders and board: Brady Krupa, Arjun Bhanderi, Adam Johnson, Riya Pendse, Ethan Krishna, Sid Agrawal

Legal: ${u('/terms')} · ${u('/privacy')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
