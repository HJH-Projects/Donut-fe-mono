import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const toCookieHeader = (name: string, value?: string) => (value ? `${name}=${value}` : '');

export const getAccessTokenCookieHeader = async () => {
  const cookieStore = await cookies();
  return toCookieHeader(ACCESS_TOKEN_COOKIE, cookieStore.get(ACCESS_TOKEN_COOKIE)?.value);
};

export const getRefreshTokenCookieHeader = async () => {
  const cookieStore = await cookies();
  return toCookieHeader(REFRESH_TOKEN_COOKIE, cookieStore.get(REFRESH_TOKEN_COOKIE)?.value);
};

export const getRequestCookies = async () => {
  return getAccessTokenCookieHeader();
};
