import { json } from '@sveltejs/kit';
import { getDb, bad, str, EMAIL_OK } from '#lib/server.js';

export const prerender = false;

export async function POST({ request }) {
  const f = await request.formData();
  if (f.get('company')) return json({ ok: true }); // honeypot: pretend it worked
  const a = {
    name: str(f.get('name'), 200), email: str(f.get('email'), 320), grade: str(f.get('grade'), 20),
    role: str(f.get('role'), 50), department: str(f.get('department'), 50),
    why: str(f.get('why'), 2000), skills: str(f.get('skills'), 1500)
  };
  if (!a.name || !EMAIL_OK.test(a.email) || !a.grade || !a.role || !a.department || a.why.length < 20 || f.get('guardian-ok') !== 'yes') return bad('Invalid application.');
  await getDb().prepare('INSERT INTO applications (name, email, grade, role, department, why, skills) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(a.name, a.email, a.grade, a.role, a.department, a.why, a.skills || null).run();
  return json({ ok: true });
}
