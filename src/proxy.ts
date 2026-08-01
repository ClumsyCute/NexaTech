import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt-utils';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the cookie token
  const token = request.cookies.get('token')?.value;
  const session = token ? await verifyToken(token) : null;

  // Define route classifications
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  const isCandidateApiRoute = pathname.startsWith('/api/candidate');

  // Protect Admin UI routes
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect Admin API routes
  if (isAdminApiRoute) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }
  }

  // Protect Candidate UI dashboard routes
  if (isDashboardRoute) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Candidate API routes
  if (isCandidateApiRoute) {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Login required.' }, { status: 401 });
    }
  }

  // Redirect logged-in users away from /login and /signup
  if (isAuthRoute && session) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware runs on
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/api/admin/:path*',
    '/api/candidate/:path*',
  ],
};
