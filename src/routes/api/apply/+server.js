import { json } from '@sveltejs/kit';
import { bad, str, notify, confirmToSender, mayConfirm, getDb, EMAIL_OK } from '#lib/server.js';
import { pushAdmins } from '#lib/push.js';
import { SITE } from '#lib/config.js';

export const prerender = false;

export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot: pretend it worked
  const a = {
    name: str(f.get('name'), 200), email: str(f.get('email'), 320).toLowerCase(), grade: str(f.get('grade'), 20),
    role: 'Volunteer', department: str(f.get('department'), 50),
    why: str(f.get('why'), 2000), skills: str(f.get('skills'), 1500)
  };
  if (!a.name || !EMAIL_OK.test(a.email) || !a.grade || !a.role || !a.department || a.why.length < 20 || f.get('guardian-ok') !== 'yes') return bad('Invalid application.');
  const confirm = await mayConfirm(a.email);
  const { meta } = await getDb().prepare('INSERT INTO applications (name, email, grade, role, department, why, skills) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(a.name, a.email, a.grade, a.role, a.department, a.why, a.skills || null).run();
  const row = { id: meta.last_row_id };
  await Promise.all([
    confirm && confirmToSender({
      name: a.name, email: a.email, key: `apply-confirm-${row.id}`,
      subject: `We got your application, ${a.name.split(/\s+/)[0]}`,
      lead: `Thanks for applying to ${SITE.name} as ${a.role} in ${a.department}. We got your application and a real person on the team will read it. We will email you back at this address once we have decided on next steps.`,
      rows: [['Role', a.role], ['Team', a.department]]
    }),
    notify(`New application from ${a.name}`, [['Applicant', `${a.name} <${a.email}>`], ['Grade', a.grade], ['Role', `${a.role} · ${a.department}`], ['Why', a.why], ...(a.skills ? [['Skills', a.skills]] : [])], { replyTo: a.email, key: `apply-notify-${row.id}` }),
    pushAdmins({ title: `New application from ${a.name}`, body: `${a.role} · ${a.department}`, url: '/admin?tab=applications' })
  ]);
  return json({ ok: true });
}
