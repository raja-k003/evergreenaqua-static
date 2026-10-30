import type { Request, Response } from 'express';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+]?[\d\s()-]{8,16}$/;
const KINDS = new Set(['contact', 'career', 'question']);
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * POST /api/enquiry — validates and accepts enquiries.
 * Wire up delivery (email via SES/Nodemailer, CRM, WhatsApp Business API)
 * in `deliver()`. Kept dependency-free on purpose.
 */
export async function handleEnquiry(req: Request, res: Response): Promise<void> {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    res.status(429).json({ ok: false, error: 'rate_limited' });
    return;
  }
  hits.set(ip, [...recent, now]);

  const body = (req.body ?? {}) as Record<string, unknown>;
  // Honeypot filled → silently accept so bots learn nothing.
  if (str(body['website'], 200)) {
    res.status(202).json({ ok: true });
    return;
  }

  const enquiry = {
    kind: str(body['kind'], 20),
    name: str(body['name'], 80),
    email: str(body['email'], 120),
    phone: str(body['phone'], 20),
    position: str(body['position'], 80),
    message: str(body['message'], 2000),
  };
  const valid =
    KINDS.has(enquiry.kind) &&
    enquiry.name.length >= 2 &&
    EMAIL.test(enquiry.email) &&
    PHONE.test(enquiry.phone) &&
    enquiry.message.length >= 10 &&
    (enquiry.kind !== 'career' || enquiry.position.length > 0);

  if (!valid) {
    res.status(400).json({ ok: false, error: 'invalid' });
    return;
  }

  try {
    await deliver(enquiry);
    res.status(202).json({ ok: true });
  } catch (err) {
    console.error('[enquiry] delivery failed', err);
    res.status(502).json({ ok: false, error: 'delivery_failed' });
  }
}

async function deliver(enquiry: Record<string, string>): Promise<void> {
  // TODO: send email / push to CRM. Logged for now.
  console.log('[enquiry]', new Date().toISOString(), JSON.stringify(enquiry));
}
