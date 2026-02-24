import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSetCookieHeaders } from '@/shared/model/utils/set-cookie';

const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token is required' }, { status: 401 });
  }

  const backendResponse = await fetch(`${API_SOURCE_URL}/auth/refresh`, {
    method: 'GET',
    headers: { Cookie: `refreshToken=${refreshToken}` },
    cache: 'no-store',
  });

  const response = new NextResponse(null, { status: backendResponse.status });
  for (const setCookie of getSetCookieHeaders(backendResponse)) {
    response.headers.append('set-cookie', setCookie);
  }

  if (!backendResponse.ok && (backendResponse.status === 401 || backendResponse.status === 403)) {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
  }

  return response;
}
