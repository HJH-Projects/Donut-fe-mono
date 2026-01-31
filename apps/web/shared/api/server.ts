import ky from 'ky';
import { cookies } from 'next/headers';

const API_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const serverKy = ky.create({
  prefixUrl: API_SOURCE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        // Server Component에서 요청 시, 클라이언트로부터 받은 쿠키(세션 등)를 백엔드로 전달
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        
        if (cookieString) {
          request.headers.set('Cookie', cookieString);
        }
      },
    ],
  },
});
