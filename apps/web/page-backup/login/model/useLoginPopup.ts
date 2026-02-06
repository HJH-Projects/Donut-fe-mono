import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGoogleAuthUrl, getKakaoAuthUrl } from '@/shared/api/auth';
import { getMeClient } from '@/shared/api/users.client';

export const useLoginPopup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';

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
        getMeClient()
          .catch(() => {
            alert('로그인 정보를 확인하지 못했습니다.');
          })
          .finally(() => {
            const target = storedNext || nextPath;
            window.location.assign(target);
          });
      } else if (event.data?.type === 'LOGIN_FAIL') {
        alert(event.data?.error || '로그인에 실패했습니다.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, nextPath]);

  const openPopup = (provider: 'google' | 'kakao') => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const url = provider === 'google' ? getGoogleAuthUrl() : getKakaoAuthUrl();
    sessionStorage.setItem('login:next', nextPath);
    
    window.open(
      url,
      'loginPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return { openPopup };
};
