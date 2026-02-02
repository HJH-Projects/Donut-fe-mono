'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export const LoginCallbackPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');
  const isSuccess = status === 'success' || status === 'ok' || (!status && !error && !errorMessage);

  useEffect(() => {
    // 팝업이 아니면 메인으로 이동
    if (!window.opener) {
      window.location.replace('/');
      return;
    }

    const notifyFail = (message: string) => {
      window.opener.postMessage(
        { type: 'LOGIN_FAIL', error: message },
        window.location.origin
      );
      window.close();
    };

    const notifySuccess = () => {
      window.opener.postMessage(
        { type: 'LOGIN_SUCCESS', payload: { user: {} } },
        window.location.origin
      );
      window.close();
    };

    // 약간의 딜레이를 주어 스피너가 보이게 함 (UX)
    const timer = setTimeout(() => {
      if (isSuccess) {
        notifySuccess();
      } else {
        notifyFail(errorMessage || error || 'Login failed');
      }
    }, 800);

    const onError = () => {
      notifyFail('사용자 정보를 처리할 수 없습니다.');
    };
    window.addEventListener('error', onError);

    return () => clearTimeout(timer);
  }, [status, error, errorMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-sm font-medium">로그인 처리 중입니다...</p>
    </div>
  );
};
