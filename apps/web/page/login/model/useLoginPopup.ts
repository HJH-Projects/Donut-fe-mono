import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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

    // 백엔드가 redirect_uri를 지원한다면 아래처럼 보낼 수 있음.
    // 지원하지 않는다면 백엔드 설정에서 직접 수정해야 함.
    const redirectUri = encodeURIComponent(`${window.location.origin}/login/callback`);
    const url = `${API_BASE_URL}/auth/${provider}?redirect_uri=${redirectUri}`;
    
    window.open(
      url,
      'loginPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return { openPopup };
};
