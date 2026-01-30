import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMeClient } from '@/shared/api/users';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useLoginPopup = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // 보안상 Origin 체크 (배포 시 필수)
      // if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'LOGIN_SUCCESS') {
        await getMeClient();
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

    const url = `${API_BASE_URL}/auth/${provider}`;
    
    window.open(
      url,
      'loginPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return { openPopup };
};
