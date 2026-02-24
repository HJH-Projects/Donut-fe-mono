import { NextResponse, type NextRequest } from 'next/server';
import { verifyAuth } from '@/features/auth/verifyAuth';
import { getSetCookieHeaders } from '@/shared/model/utils/set-cookie';

const PUBLIC_PATHS = ['/login', '/share'];
const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname === '/'
  if (isPublic) return NextResponse.next();

  // 토큰 검증
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const status = await verifyAuth(accessToken, refreshToken);

  if (status === 'authenticated') {
    return NextResponse.next();
  }

  if (status === 'refresh_needed') {
    const backendResponse = await fetch(`${API_SOURCE_URL}/auth/refresh`, {
      method: 'GET',
      headers: { Cookie: `refreshToken=${refreshToken}` },
    });

    if (backendResponse.ok) {
      const response = NextResponse.next();
      for (const setCookie of getSetCookieHeaders(backendResponse)) {
        response.headers.append('set-cookie', setCookie);
      }
      return response;
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)'],
};
