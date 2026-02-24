import ky from 'ky';
import { getAccessTokenCookieHeader } from './kyCookieConfig';


const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Server Actions 등 캐시 밖에서 사용하는 ky 인스턴스.
 * accessToken 쿠키만 전달한다.
 */
export const serverKy = ky.create({
  prefixUrl: API_SOURCE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessTokenCookie = await getAccessTokenCookieHeader();
        if (accessTokenCookie) {
          request.headers.set('Cookie', accessTokenCookie);
        }
      },
    ],
  },
});

/**
 * unstable_cache 내부에서 사용하는 ky 인스턴스.
 * 호출 시점의 accessToken 쿠키만 주입한다.
 */
export const createCachedKy = (accessTokenCookie: string) => {
  return ky.create({
    prefixUrl: API_SOURCE_URL,
    headers: accessTokenCookie ? { Cookie: accessTokenCookie } : undefined,
  });
};
