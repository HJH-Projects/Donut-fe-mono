'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const [isKakaoWebView, setIsKakaoWebView] = useState(false);
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

  const openExternalBrowser = useCallback(() => {
    if (!currentUrl) return;

    clearFallbackTimer();
    setShowFallback(false);
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
    const kakaoWebView = isKakaoTalkWebView(window.navigator.userAgent);
    setIsKakaoWebView(kakaoWebView);

    if (!kakaoWebView) return;

    openExternalBrowser();

    return () => {
      clearFallbackTimer();
    };
  }, [clearFallbackTimer, openExternalBrowser]);

  if (!isKakaoWebView) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/96 px-6">
      <div className="w-full max-w-sm rounded-3xl border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-lg font-semibold text-black">
          K
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>

        {!showFallback ? (
          <p className="mt-6 text-sm font-medium text-gray-500">외부 브라우저로 이동 중입니다...</p>
        ) : (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={openExternalBrowser}
              className="w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white"
            >
              외부 브라우저로 다시 열기
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
            >
              {copied ? '링크 복사됨' : '링크 복사'}
            </button>
            <p className="text-xs leading-5 text-gray-500">
              전환이 안 되면 우측 상단 메뉴에서 브라우저로 열기를 선택해 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
