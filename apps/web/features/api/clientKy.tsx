import ky from 'ky';

// TODO: 환경변수 설정 필요 (예: process.env.NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const RETRY_HEADER = 'x-auth-retried';
const DEFAULT_TIMEOUT_MS = 30_000;

const isAuthMaintenanceRequest = (request: Request) => {
  try {
    const pathname = new URL(request.url, window.location.origin).pathname;
    return pathname.endsWith('/api/auth/refresh') || pathname.endsWith('/api/auth/logout');
  } catch {
    return request.url.includes('/api/auth/refresh') || request.url.includes('/api/auth/logout');
  }
};

export const clientKy = ky.create({
  prefixUrl: API_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  // 쿠키 기반 인증이므로 credentials: 'include' 필수
  // same-origin인 경우 브라우저가 자동으로 쿠키를 보내지만,
  // API 도메인이 다를 경우를 대비해 명시적으로 설정
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (
          response.status === 401 &&
          request.headers.get(RETRY_HEADER) !== '1' &&
          !isAuthMaintenanceRequest(request)
        ) {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            const retryHeaders = new Headers(options.headers as HeadersInit | undefined);
            retryHeaders.set(RETRY_HEADER, '1');
            return clientKy(request, {
              ...options,
              headers: retryHeaders,
            });
          }

          if (refreshResponse.status === 401 || refreshResponse.status === 403) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            });
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.assign('/login');
            }
          }
        }

        if (!response.ok) {
          // Global Error Handling (Toast 등)
          // console.error('API Error:', response.status);
        }
      },
    ],
  },
});
