import ky from 'ky';

// TODO: 환경변수 설정 필요 (예: process.env.NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const clientKy = ky.create({
  prefixUrl: API_URL,
  // 쿠키 기반 인증이므로 credentials: 'include' 필수
  // same-origin인 경우 브라우저가 자동으로 쿠키를 보내지만,
  // API 도메인이 다를 경우를 대비해 명시적으로 설정
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          // Global Error Handling (Toast 등)
          // console.error('API Error:', response.status);
        }
      },
    ],
  },
});
