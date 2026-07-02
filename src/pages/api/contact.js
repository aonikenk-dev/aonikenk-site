import { Resend } from 'resend';
import data from '../../data/site.json';

export const prerender = false;

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_body' }, 400);
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const projectType = (body.project_type || '').trim();
  const message = (body.message || '').trim();

  if (!name || !email || !message) {
    return json({ error: 'missing_fields' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'invalid_email' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
  const domain = process.env.RESEND_EMAIL_DOMAIN ?? import.meta.env.RESEND_EMAIL_DOMAIN;
  if (!apiKey || !domain) {
    return json({ error: 'server_misconfigured' }, 500);
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `aonikenk.dev <contact@${domain}>`,
    to: [data.site.auxEmail],
    replyTo: email,
    subject: `Nuevo contacto: ${name}${projectType ? ` — ${projectType}` : ''}`,
    html: `
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${projectType ? `<p><strong>Tipo de proyecto:</strong> ${escapeHtml(projectType)}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    return json({ error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}
