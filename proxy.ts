import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';

// Routes a logged-in user shouldn't see (they'd just be re-signing-up/in).
const authRoutes = ['/auth'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(path);

  if (!isAuthRoute) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (req.method === 'GET' && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

// Skip static assets — no need to run this on every request.
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.ico$).*)'],
};