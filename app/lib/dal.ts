import 'server-only';
import { cache } from 'react';
import { decrypt, getSessionCookie } from './session';
import { getUserById } from './users-db';
import type { SafeUser } from './definitions';

// Verifies the session cookie without hitting the "database".
// Cheap — safe to call from layouts/Server Components on every request.
export const verifySession = cache(async (): Promise<{ userId: string } | null> => {
  const cookie = await getSessionCookie();
  const payload = await decrypt(cookie);
  if (!payload?.userId) return null;
  return { userId: payload.userId };
});

// Looks up the full (safe) user record for the current session.
// Memoized per-request so multiple components can call this for free.
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const session = await verifySession();
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
});
