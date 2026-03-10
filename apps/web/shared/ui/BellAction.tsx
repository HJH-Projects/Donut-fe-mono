'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { clientKy } from '@/features/api/clientKy';
import { getNotificationsUnreadCountApi } from '@/shared/api/endpointTags/notifications';

const parseIncomingIsUnread = (raw: string): boolean => {
  try {
    const parsed = JSON.parse(raw);
    const payload = parsed?.data ?? parsed?.payload ?? parsed?.notification ?? parsed;
    if (typeof payload?.isRead === 'boolean') return !payload.isRead;
  } catch {
    return true;
  }
  return true;
};

export function BellAction({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const syncUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const result = await getNotificationsUnreadCountApi(clientKy);
      setUnreadCount(result.unreadCount);
    } catch {
      // 헤더 배지 동기화 실패는 조용히 무시
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const syncTimer = window.setTimeout(() => {
      void syncUnreadCount();
    }, 0);
    const pollingTimer = window.setInterval(() => {
      void syncUnreadCount();
    }, 10_000);

    const wsBase = process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/^http/, 'ws');
    if (!wsBase) return;

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${wsBase.replace(/\/+$/, '')}/notifications`);
    } catch {
      ws = null;
    }

    if (ws) {
      ws.onopen = () => {
        syncUnreadCount();
      };
      ws.onmessage = (event) => {
        if (parseIncomingIsUnread(event.data)) {
          setUnreadCount((prev) => prev + 1);
        }
      };
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        syncUnreadCount();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearTimeout(syncTimer);
      window.clearInterval(pollingTimer);
      document.removeEventListener('visibilitychange', onVisible);
      ws?.close();
    };
  }, [isLoggedIn, syncUnreadCount]);

  const visibleUnreadCount = isLoggedIn ? unreadCount : 0;

  return (
    <Link
      href="/notifications?recent=true"
      className="relative inline-flex h-10 w-10 items-center justify-center hover:opacity-70 transition-opacity"
      aria-label="알림"
    >
      <Bell size={22} color="#000" strokeWidth={2} />
      {visibleUnreadCount > 0 && (
        <span
          className="absolute right-0 top-0 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold"
          style={{ boxShadow: '0 0 0 1.5px white' }}
        >
          {visibleUnreadCount > 99 ? '99+' : visibleUnreadCount}
        </span>
      )}
    </Link>
  );
}
