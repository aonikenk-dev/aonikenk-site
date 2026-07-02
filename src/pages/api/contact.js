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

async function verifyTurnstile(token, secret, remoteIp) {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
  });
  const result = await res.json();
  return result.success === true;
}

export async function POST({ request, clientAddress }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_body' }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success so bots don't learn.
  if ((body.website || '').trim()) {
    return json({ ok: true });
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

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY;
  const turnstileToken = body['cf-turnstile-response'];
  if (!turnstileSecret) {
    return json({ error: 'server_misconfigured' }, 500);
  }
  if (!turnstileToken) {
    return json({ error: 'turnstile_missing' }, 400);
  }
  const humanVerified = await verifyTurnstile(turnstileToken, turnstileSecret, clientAddress);
  if (!humanVerified) {
    return json({ error: 'turnstile_failed' }, 400);
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
