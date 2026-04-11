'use client';
import { useLoginPopup } from '../model/useLoginPopup';
import { Button } from '@/shared/ui/Button';

export const SocialLoginList = () => {
  const { openPopup } = useLoginPopup();

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Button
        onClick={() => openPopup('kakao')}
        variant="kakao"
        fullWidth
        className="h-12 rounded-md text-sm font-semibold"
      >
        <span className="text-sm">카카오로 시작하기</span>
      </Button>

      <Button
        onClick={() => openPopup('google')}
        variant="secondary"
        fullWidth
        className="h-12 rounded-md border text-sm font-semibold text-gray-700"
      >
        <span className="text-sm">Google로 시작하기</span>
      </Button>

      <Button
        disabled
        variant="solid"
        fullWidth
        className="h-12 rounded-md text-sm font-semibold"
      >
        <span className="text-sm">Apple로 시작하기</span>
      </Button>
    </div>
  );
};
