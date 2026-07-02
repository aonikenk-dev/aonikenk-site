// Contact form — submits to the /api/contact serverless function
export function initContact() {
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');
  if (!form || !submit || !status) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    submit.disabled = true;
    status.dataset.state = 'sending';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('request_failed');

      status.dataset.state = 'success';
      form.reset();
    } catch {
      status.dataset.state = 'error';
    } finally {
      submit.disabled = false;
    }
  });
}
