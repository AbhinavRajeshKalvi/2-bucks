import 'server-only';

// Dev-mode OTP store, kept in memory on the server process.
// Good enough for a single-instance dev/demo deployment — swap for
// Redis (or similar) if you ever run multiple server instances or
// need OTPs to survive a server restart.

type OtpEntry = {
  code: string;
  phone: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
};

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

const store = new Map<string, OtpEntry>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function issueOtp(userId: string, phone: string): { code: string; cooldownActive: boolean } {
  const existing = store.get(userId);
  const now = Date.now();

  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    return { code: existing.code, cooldownActive: true };
  }

  const code = generateCode();
  store.set(userId, { code, phone, expiresAt: now + OTP_TTL_MS, attempts: 0, lastSentAt: now });
  return { code, cooldownActive: false };
}

export type OtpCheckResult =
  | { ok: true; phone: string }
  | { ok: false; reason: 'no_otp' | 'expired' | 'too_many_attempts' | 'mismatch' };

export function checkOtp(userId: string, code: string): OtpCheckResult {
  const entry = store.get(userId);
  if (!entry) return { ok: false, reason: 'no_otp' };

  if (Date.now() > entry.expiresAt) {
    store.delete(userId);
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(userId);
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (entry.code !== code) {
    entry.attempts += 1;
    return { ok: false, reason: 'mismatch' };
  }

  store.delete(userId);
  return { ok: true, phone: entry.phone };
}
