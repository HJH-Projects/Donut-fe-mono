'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';
import { buildKakaoExternalUrl, isKakaoTalkWebView } from '@/shared/lib/inAppBrowser';

type OpenExternalBrowserGuardProps = {
  title: string;
  description: string;
};

export function OpenExternalBrowserGuard({
  title,
  description,
}: OpenExternalBrowserGuardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isKakaoWebView] = useState(() =>
    typeof window !== 'undefined' ? isKakaoTalkWebView(window.navigator.userAgent) : false,
  );
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  const fallbackTimerRef = useRef<number | null>(null);

  const search = searchParams.toString();
  const currentUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}${pathname}${search ? `?${search}` : ''}`;

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const openExternalBrowser = useCallback((options?: { resetFallback?: boolean }) => {
    if (!currentUrl) return;

    clearFallbackTimer();
    if (options?.resetFallback !== false) {
      setShowFallback(false);
    }
    window.location.href = buildKakaoExternalUrl(currentUrl);
    fallbackTimerRef.current = window.setTimeout(() => {
      setShowFallback(true);
    }, 1500);
  }, [clearFallbackTimer, currentUrl]);

  const copyLink = useCallback(async () => {
    if (!currentUrl) return;

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [currentUrl]);

  useEffect(() => {
    if (!isKakaoWebView) return undefined;

    if (!currentUrl) return undefined;

    clearFallbackTimer();
    window.location.href = buildKakaoExternalUrl(currentUrl);
    fallbackTimerRef.current = window.setTimeout(() => {
      setShowFallback(true);
    }, 1500);

    return () => {
      clearFallbackTimer();
    };
  }, [clearFallbackTimer, currentUrl, isKakaoWebView]);

  if (!isKakaoWebView) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/96 px-6">
      <div className="w-full max-w-sm rounded-3xl border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-lg font-semibold text-black">
          K
        </div>
        <Text as="h1" variant="titleSm" className="text-gray-900">
          {title}
        </Text>
        <Text variant="body" className="mt-2 leading-6 text-gray-600">
          {description}
        </Text>

        {!showFallback ? (
          <Text variant="bodyStrong" className="mt-6 text-gray-500">
            외부 브라우저로 이동 중입니다...
          </Text>
        ) : (
          <div className="mt-6 space-y-3">
            <Button
              onClick={openExternalBrowser}
              fullWidth
              className="rounded-2xl bg-[#111827]"
            >
              외부 브라우저로 다시 열기
            </Button>
            <Button
              onClick={copyLink}
              variant="secondary"
              fullWidth
              className="rounded-2xl border-gray-200 text-gray-700"
            >
              {copied ? '링크 복사됨' : '링크 복사'}
            </Button>
            <Text variant="meta" className="leading-5 text-gray-500">
              전환이 안 되면 우측 상단 메뉴에서 브라우저로 열기를 선택해 주세요.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
