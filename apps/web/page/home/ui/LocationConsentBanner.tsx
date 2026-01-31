'use client';

import { useEffect, useState } from 'react';

type Props = {
  initialHasGeo: boolean;
};

const SESSION_KEY = 'geo-consent';

export const LocationConsentBanner = ({ initialHasGeo }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionValue = window.sessionStorage.getItem(SESSION_KEY);
    if (sessionValue || initialHasGeo) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [initialHasGeo]);

  const handleAccept = () => {
    if (!navigator.geolocation) {
      window.sessionStorage.setItem(SESSION_KEY, 'denied');
      setVisible(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        document.cookie = `geo=${lat},${lon}; path=/; samesite=lax`;
        console.log('[geo] cookie set:', document.cookie);
        window.sessionStorage.setItem(SESSION_KEY, 'granted');
        setVisible(false);
        window.location.reload();
      },
      () => {
        window.sessionStorage.setItem(SESSION_KEY, 'denied');
        setVisible(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleDismiss = () => {
    window.sessionStorage.setItem(SESSION_KEY, 'denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 top-4 z-50 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg">
      <p className="font-medium">현재 위치를 사용하시겠어요?</p>
      <p className="mt-1 text-xs text-gray-500">
        위치 정보로 더 정확한 날씨와 코디를 추천해드려요.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleAccept}
          className="rounded-full bg-black px-4 py-2 text-xs text-white"
        >
          동의하고 사용
        </button>
        <button
          onClick={handleDismiss}
          className="rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-600"
        >
          나중에
        </button>
      </div>
    </div>
  );
};
