'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  NotificationResponseDto,
  NotificationResponseDtoType,
} from '@/shared/model/orvalSchemas';
import {
  getNotificationsApi,
  getNotificationsUnreadCountApi,
  patchNotificationsReadApi,
  patchNotificationsReadAllApi,
} from '@/shared/api/endpointTags/notifications';
import { clientKy } from '@/features/api/clientKy';
import { useToast } from '@/shared/model/useToast';

export type NotificationViewItem = {
  id: string;
  type: NotificationResponseDtoType;
  title: string;
  message: string;
  detail: string;
  date: string;
  isRead: boolean;
  link?: string;
};

const formatDate = (value: string) => {
  if (!value) return '';
  return value.slice(0, 10);
};

const mapDtoToView = (item: NotificationResponseDto): NotificationViewItem => ({
  id: item.id,
  type: item.type,
  title: item.title,
  message: item.body,
  detail: item.body,
  date: formatDate(item.createdAt),
  isRead: item.isRead,
  link: item.link ?? undefined,
});

const parseSocketPayload = (raw: string): NotificationResponseDto | null => {
  try {
    const parsed = JSON.parse(raw);
    const candidate = parsed?.data ?? parsed?.payload ?? parsed?.notification ?? parsed;
    if (
      candidate &&
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.body === 'string' &&
      typeof candidate.type === 'string'
    ) {
      return candidate as NotificationResponseDto;
    }
  } catch {
    return null;
  }
  return null;
};

type UseNotificationsDataOptions = {
  initialItems: NotificationResponseDto[];
  initialNextCursor?: string | null;
  initialUnreadCount: number;
  isRecentView: boolean;
};

export function useNotificationsData({
  initialItems,
  initialNextCursor,
  initialUnreadCount,
  isRecentView,
}: UseNotificationsDataOptions) {
  const toast = useToast();
  const [items, setItems] = useState<NotificationViewItem[]>(() => initialItems.map(mapDtoToView));
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor ?? null);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const visibleItems = useMemo(
    () => (isRecentView ? items.slice(0, 20) : items),
    [items, isRecentView],
  );

  const syncUnreadCount = useCallback(async () => {
    try {
      const result = await getNotificationsUnreadCountApi(clientKy);
      setUnreadCount(result.unreadCount);
    } catch {
      // unread count sync는 조용히 무시
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target || target.isRead) return;

      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await patchNotificationsReadApi(clientKy, id);
      } catch {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: false } : item)));
        setUnreadCount((prev) => prev + 1);
        toast.error('알림 읽음 처리에 실패했습니다.');
      }
    },
    [items, toast],
  );

  const toggleOpen = useCallback(
    (id: string) => {
      setOpenId((prev) => (prev === id ? null : id));
      markAsRead(id);
    },
    [markAsRead],
  );

  const fetchNextPage = useCallback(async () => {
    if (!nextCursor || isRecentView || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const result = await getNotificationsApi(clientKy, {
        cursor: nextCursor,
        limit: 20,
      });
      const mapped = result.items.map(mapDtoToView);
      setItems((prev) => [...prev, ...mapped.filter((item) => !prev.some((p) => p.id === item.id))]);
      setNextCursor(result.nextCursor ?? null);
    } catch {
      toast.error('알림을 더 불러오지 못했습니다.');
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, isRecentView, nextCursor, toast]);

  const markAllAsRead = useCallback(async () => {
    if (isMarkingAllRead || unreadCount <= 0) return;

    const previousItems = items;
    const previousUnreadCount = unreadCount;
    setIsMarkingAllRead(true);
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await patchNotificationsReadAllApi(clientKy);
    } catch {
      setItems(previousItems);
      setUnreadCount(previousUnreadCount);
      toast.error('전체 읽음 처리에 실패했습니다.');
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [isMarkingAllRead, unreadCount, items, toast]);

  useEffect(() => {
    const wsBase = process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/^http/, 'ws');
    if (!wsBase) return;

    const wsUrl = `${wsBase.replace(/\/+$/, '')}/notifications`;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
    } catch {
      return;
    }

    ws.onopen = () => {
      setIsSocketConnected(true);
      syncUnreadCount();
    };
    ws.onclose = () => {
      setIsSocketConnected(false);
    };
    ws.onerror = () => {
      setIsSocketConnected(false);
    };
    ws.onmessage = (event) => {
      const payload = parseSocketPayload(event.data);
      if (!payload) return;

      const incoming = mapDtoToView(payload);
      setItems((prev) => {
        if (prev.some((item) => item.id === incoming.id)) return prev;
        return [incoming, ...prev];
      });
      if (!incoming.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        syncUnreadCount();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    const pollingTimer = window.setInterval(() => {
      void syncUnreadCount();
    }, 10_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(pollingTimer);
      ws?.close();
    };
  }, [syncUnreadCount]);

  return {
    items: visibleItems,
    unreadCount,
    openId,
    isFetchingMore,
    isMarkingAllRead,
    isSocketConnected,
    hasMore: !isRecentView && !!nextCursor,
    toggleOpen,
    fetchNextPage,
    markAllAsRead,
  };
}
