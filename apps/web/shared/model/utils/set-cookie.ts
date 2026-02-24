export const getSetCookieHeaders = (response: Response): string[] => {
  // getSetCookie로 멀티 Set-Cookie 헤더를 지원하는 환경과 그렇지 않은 환경 모두에서 동작하도록 처리
  // getSetCookie는 배열로 Set-Cookie 헤더를 반환하지만, 일부 환경에서는 get('set-cookie')로 단일 문자열만 반환할 수 있음
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  const single = response.headers.get('set-cookie');
  return single ? [single] : [];
};

