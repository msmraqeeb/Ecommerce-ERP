import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // These paths don't require authentication
  const publicPaths = ['/login'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for the session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the session
  const session = await decrypt(sessionCookie);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based access control for edit pages
  if (session.user?.role !== 'admin' && pathname.includes('/edit')) {
     return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Prevent viewers from accessing the data-sync page
  if (session.user?.role === 'viewer' && pathname === '/data-sync') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
