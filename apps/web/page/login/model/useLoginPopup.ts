import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getUsersMeApi } from '@/shared/api/endpointTags/users';
import { clientKy } from '@/features/api/clientKy';
import { useToast } from '@/shared/model/useToast';

export const useLoginPopup = () => {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const toast = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const apiOrigin = process.env.NEXT_PUBLIC_API_URL
        ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
        : null;
      const allowedOrigins = [window.location.origin, apiOrigin].filter(Boolean) as string[];
      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === 'LOGIN_SUCCESS') {
        const storedNext = sessionStorage.getItem('login:next');
        sessionStorage.removeItem('login:next');
        getUsersMeApi(clientKy)
          .catch(() => {
            toastRef.current.error('로그인 정보를 확인하지 못했습니다.');
          })
          .finally(() => {
            const target = storedNext || nextPath;
            window.location.assign(target);
          });
      } else if (event.data?.type === 'LOGIN_FAIL') {
        toastRef.current.error(event.data?.error || '로그인에 실패했습니다.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nextPath]);

  const openPopup = (provider: 'google' | 'kakao') => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const url =
      provider === 'google'
        ? `${apiBase}/auth/google`
        : `${apiBase}/auth/kakao`;
    sessionStorage.setItem('login:next', nextPath);

    window.open(
      url,
      'loginPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return { openPopup };
};
