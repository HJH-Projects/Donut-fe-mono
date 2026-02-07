import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/share', '/announcements', '/faq'];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname === '/') return NextResponse.next();
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const session = request.cookies.get('accessToken');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)'],
};
