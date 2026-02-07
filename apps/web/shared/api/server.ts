import ky from 'ky';
import { cookies } from 'next/headers';

const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Server Actions 등 캐시 밖에서 사용하는 ky 인스턴스.
 * 매 요청마다 cookies()를 읽어서 백엔드에 전달.
 */
export const serverKy = ky.create({
  prefixUrl: API_SOURCE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        if (cookieString) {
          request.headers.set('Cookie', cookieString);
        }
      },
    ],
  },
});

/**
 * unstable_cache 안에서 사용하는 ky 인스턴스를 생성.
 * cookies()를 캐시 밖에서 미리 읽어 전달해야 캐시가 정상 동작함.
 */
export const createCachedKy = (cookieString: string) =>
  ky.create({
    prefixUrl: API_SOURCE_URL,
    headers: { Cookie: cookieString },
  });

/**
 * 현재 요청의 쿠키 문자열을 반환. 페이지(RSC)에서 호출 후 캐시 함수에 전달.
 */
export const getRequestCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};
