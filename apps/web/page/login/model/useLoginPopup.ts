import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGoogleAuthUrl, getKakaoAuthUrl } from '@/shared/api/auth';

export const useLoginPopup = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 보안상 Origin 체크 (배포 시 필수)
      // if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'LOGIN_SUCCESS') {
        router.push('/');
      } else if (event.data?.type === 'LOGIN_FAIL') {
        alert(event.data?.error || '로그인에 실패했습니다.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const openPopup = (provider: 'google' | 'kakao') => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const url = provider === 'google' ? getGoogleAuthUrl() : getKakaoAuthUrl();
    
    window.open(
      url,
      'loginPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return { openPopup };
};
