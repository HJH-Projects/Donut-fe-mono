import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSetCookieHeaders } from '@/shared/model/utils/set-cookie';

const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const backendResponse = await fetch(`${API_SOURCE_URL}/auth/logout`, {
    method: 'POST',
    headers: accessToken ? { Cookie: `accessToken=${accessToken}` } : undefined,
    cache: 'no-store',
  });

  const response = new NextResponse(null, { status: backendResponse.status });
  for (const setCookie of getSetCookieHeaders(backendResponse)) {
    response.headers.append('set-cookie', setCookie);
  }

  return response;
}
