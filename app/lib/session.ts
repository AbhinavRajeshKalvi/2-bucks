import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'session';
const SIGNUP_COOKIE = 'signup_draft';

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000; // 7 days

const secretKey =
  process.env.SESSION_SECRET ||
  'dev-only-insecure-secret-change-me';

const encodedKey =
  new TextEncoder().encode(secretKey);

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export type SignupDraftPayload = {
  draftId: string;

  name: string;
  email: string;
  passwordHash: string;

  phone?: string;
  phoneVerifiedAt?: number;

  aadhaarLast4?: string;
  aadhaarSubmittedAt?: number;

  aadhaarFrontPublicId?: string;
  aadhaarBackPublicId?: string;

  selfieSubmittedAt?: number;
  selfiePublicId?: string;
};

// ─────────────────────────────────────────────
// PERMANENT SESSION
// ─────────────────────────────────────────────

export async function encrypt(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(
      session,
      encodedKey,
      {
        algorithms: ['HS256'],
      }
    );

    if (typeof payload.userId !== 'string') {
      return null;
    }

    return {
      userId: payload.userId,
      expiresAt: (payload.exp ?? 0) * 1000,
    };
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS
  );

  const session = await encrypt({
    userId,
    expiresAt: expiresAt.getTime(),
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    session,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    }
  );
}

export async function getSessionCookie(): Promise<
  string | undefined
> {
  const cookieStore = await cookies();

  return cookieStore.get(
    SESSION_COOKIE
  )?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}

// ─────────────────────────────────────────────
// TEMPORARY SIGNUP DRAFT
// ─────────────────────────────────────────────

export async function encryptSignupDraft(
  payload: SignupDraftPayload
): Promise<string> {
  return new SignJWT({
    draftId: payload.draftId,

    name: payload.name,
    email: payload.email,
    passwordHash: payload.passwordHash,

    phone: payload.phone,
    phoneVerifiedAt: payload.phoneVerifiedAt,

    aadhaarLast4: payload.aadhaarLast4,
    aadhaarSubmittedAt:
      payload.aadhaarSubmittedAt,

    aadhaarFrontPublicId:
      payload.aadhaarFrontPublicId,

    aadhaarBackPublicId:
      payload.aadhaarBackPublicId,

    selfieSubmittedAt:
      payload.selfieSubmittedAt,

    selfiePublicId:
      payload.selfiePublicId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(encodedKey);
}

export async function decryptSignupDraft(
  token: string | undefined = ''
): Promise<SignupDraftPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      encodedKey,
      {
        algorithms: ['HS256'],
      }
    );

    if (
      typeof payload.draftId !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.passwordHash !== 'string'
    ) {
      return null;
    }

    return {
      draftId: payload.draftId,

      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,

      phone:
        typeof payload.phone === 'string'
          ? payload.phone
          : undefined,

      phoneVerifiedAt:
        typeof payload.phoneVerifiedAt === 'number'
          ? payload.phoneVerifiedAt
          : undefined,

      aadhaarLast4:
        typeof payload.aadhaarLast4 === 'string'
          ? payload.aadhaarLast4
          : undefined,

      aadhaarSubmittedAt:
        typeof payload.aadhaarSubmittedAt === 'number'
          ? payload.aadhaarSubmittedAt
          : undefined,

      aadhaarFrontPublicId:
        typeof payload.aadhaarFrontPublicId ===
        'string'
          ? payload.aadhaarFrontPublicId
          : undefined,

      aadhaarBackPublicId:
        typeof payload.aadhaarBackPublicId ===
        'string'
          ? payload.aadhaarBackPublicId
          : undefined,

      selfieSubmittedAt:
        typeof payload.selfieSubmittedAt === 'number'
          ? payload.selfieSubmittedAt
          : undefined,

      selfiePublicId:
        typeof payload.selfiePublicId === 'string'
          ? payload.selfiePublicId
          : undefined,
    };
  } catch {
    return null;
  }
}

export async function createSignupDraft(
  payload: SignupDraftPayload
): Promise<void> {
  const token =
    await encryptSignupDraft(payload);

  const cookieStore = await cookies();

  cookieStore.set(
    SIGNUP_COOKIE,
    token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === 'production',

      maxAge: 30 * 60,

      sameSite: 'lax',

      path: '/',
    }
  );
}

export async function getSignupDraft(): Promise<
  SignupDraftPayload | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SIGNUP_COOKIE
  )?.value;

  return decryptSignupDraft(token);
}

export async function updateSignupDraft(
  patch: Partial<SignupDraftPayload>
): Promise<SignupDraftPayload | null> {
  const current =
    await getSignupDraft();

  if (!current) {
    return null;
  }

  const updated: SignupDraftPayload = {
    ...current,
    ...patch,
  };

  await createSignupDraft(updated);

  return updated;
}

export async function deleteSignupDraft(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SIGNUP_COOKIE);
}