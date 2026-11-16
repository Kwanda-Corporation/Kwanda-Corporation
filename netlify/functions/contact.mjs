import nodemailer from 'nodemailer';

/**
 * Contact form endpoint for kwandacorporation.org.
 *
 * SMTP settings mirror the Katisha project. The password is intentionally
 * never committed — set SMTP_PASS (and optionally the other SMTP_* values)
 * in Netlify → Site configuration → Environment variables.
 */

const CONTACT_TO = process.env.CONTACT_TO || 'manzialpe@gmail.com';
const SMTP_USER = process.env.SMTP_USER || 'manzialpe@gmail.com';
const SMTP_FROM = process.env.SMTP_FROM || `Kwanda Corporations <${SMTP_USER}>`;

const LIMITS = {
  name: 120,
  email: 200,
  phone: 60,
  topic: 80,
  message: 5000,
};

const TOPICS = new Set([
  'General enquiry',
  'Katisha support',
  'Gerayo',
  'Partnership',
  'Media & press',
  'Careers',
]);

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const pass = process.env.SMTP_PASS;
  if (!pass) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass },
  });

  return transporter;
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(payload),
  };
}

function single(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseBody(event) {
  if (!event.body) return {};

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  const contentType = String(event.headers?.['content-type'] || '').toLowerCase();

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return Object.fromEntries(new URLSearchParams(raw));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { Allow: 'POST, OPTIONS' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  const body = parseBody(event);
  if (!body || typeof body !== 'object') {
    return json(400, { ok: false, error: 'Invalid request body.' });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (single(body['company-website'], 200)) {
    return json(200, { ok: true });
  }

  const name = single(body.name, LIMITS.name);
  const email = single(body.email, LIMITS.email);
  const phone = single(body.phone, LIMITS.phone);
  const requestedTopic = single(body.topic, LIMITS.topic);
  const message = single(body.message, LIMITS.message);

  const topic = TOPICS.has(requestedTopic) ? requestedTopic : 'General enquiry';

  if (!name || !email || !message) {
    return json(400, {
      ok: false,
      error: 'Please add your name, email address and a message.',
    });
  }

  if (!isValidEmail(email)) {
    return json(400, { ok: false, error: 'Please enter a valid email address.' });
  }

  if (message.length < 10) {
    return json(400, {
      ok: false,
      error: 'Please write a little more detail in your message.',
    });
  }

  const mailer = getTransporter();
  if (!mailer) {
    return json(503, {
      ok: false,
      error:
        'The contact form is not configured yet. Please email manzialpe@gmail.com directly.',
      fallbackEmail: CONTACT_TO,
    });
  }

  const subject = `[Kwanda website] ${topic} — ${name}`;

  const text = [
    `New message from the Kwanda Corporations website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    `Topic: ${topic}`,
    ``,
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.55;">
      <h2 style="margin: 0 0 4px;">New website message</h2>
      <p style="margin: 0 0 20px; color: #666;">Kwanda Corporations · kwandacorporation.org</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Name</td><td style="padding: 4px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Email</td><td style="padding: 4px 0;">${escapeHtml(email)}</td></tr>
        ${phone ? `<tr><td style="padding: 4px 16px 4px 0; color: #666;">Phone</td><td style="padding: 4px 0;">${escapeHtml(phone)}</td></tr>` : ''}
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Topic</td><td style="padding: 4px 0;">${escapeHtml(topic)}</td></tr>
      </table>
      <div style="border-left: 2px solid #e87532; padding: 4px 0 4px 16px; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    await mailer.sendMail({
      from: SMTP_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      text,
      html,
    });

    return json(200, { ok: true });
  } catch (error) {
    console.error('[contact] Failed to send message', error);

    return json(502, {
      ok: false,
      error:
        'We could not send your message right now. Please email manzialpe@gmail.com directly.',
      fallbackEmail: CONTACT_TO,
    });
  }
}
