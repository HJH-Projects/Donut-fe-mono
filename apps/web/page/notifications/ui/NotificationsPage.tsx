'use client';

import { Plus, Minus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { NotificationResponseDto } from '@/shared/model/orvalSchemas';
import { useNotificationsData } from '../model/useNotificationsData';

interface NotificationsPageProps {
  initialNotifications?: NotificationResponseDto[];
  initialNextCursor?: string | null;
  initialUnreadCount?: number;
  header?: ReactNode;
}

export function NotificationsPage({
  initialNotifications = [],
  initialNextCursor = null,
  initialUnreadCount = 0,
  header,
}: NotificationsPageProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const isRecentView = searchParams.get('recent') === 'true';
  const {
    items: notifications,
    unreadCount,
    openId,
    hasMore,
    isFetchingMore,
    isMarkingAllRead,
    toggleOpen,
    fetchNextPage,
    markAllAsRead,
  } = useNotificationsData({
    initialItems: initialNotifications,
    initialNextCursor,
    initialUnreadCount,
    isRecentView,
  });
  const canMarkAllRead = !isMarkingAllRead && unreadCount > 0;

  return (
    <div
      className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {header}

      <div className="flex-1 px-6">
        <div className="mb-3 px-1 flex items-center justify-between">
          <p className="text-[12px] text-[#666] font-medium">
            {t('notifications.unreadCount', { count: unreadCount })}
          </p>
          <button
            onClick={markAllAsRead}
            disabled={!canMarkAllRead}
            className={`text-[12px] text-[#666] font-semibold transition-colors ${
              canMarkAllRead
                ? 'cursor-pointer hover:text-[#333] hover:underline hover:underline-offset-2'
                : 'cursor-default opacity-50'
            }`}
          >
            {isMarkingAllRead ? t('notifications.processing') : t('notifications.markAllRead')}
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const isOpen = openId === notification.id;
            const isRead = notification.isRead;

            return (
              <div
                key={notification.id}
                className="transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => notification.detail && toggleOpen(notification.id)}
                  disabled={!notification.detail}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left ${notification.detail ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'} transition-colors`}
                >
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-black text-left"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '16px',
                          fontWeight: 700,
                        }}
                      >
                        {notification.title}
                      </h3>
                      {!isRead && (
                        <div
                          className="shrink-0 w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#000' }}
                        />
                      )}
                    </div>
                    <p
                      className="text-left"
                      style={{
                        color: '#525252',
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '1.5',
                      }}
                    >
                      {notification.message}
                    </p>
                  </div>
                  {notification.detail && (
                    <div
                      className="shrink-0 w-6 h-6 flex items-center justify-center"
                      style={{
                        backgroundColor: isOpen ? '#000' : '#F5F5F5',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isOpen ? (
                        <Minus size={14} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <Plus size={14} color="#000" strokeWidth={2.5} />
                      )}
                    </div>
                  )}

                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="px-6 pb-6"
                        style={{
                          borderTop: '1px solid #F5F5F5',
                          paddingTop: '20px',
                        }}
                      >
                        {notification.detail && (
                          <p
                            className="mb-3"
                            style={{
                              color: '#525252',
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '1.7',
                            }}
                          >
                            {notification.detail}
                          </p>
                        )}
                        <p
                          style={{
                            color: '#A3A3A3',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          {notification.date}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="pt-4 pb-2">
            <button
              onClick={fetchNextPage}
              disabled={isFetchingMore}
              className="w-full py-3 text-[13px] font-semibold text-[#333] border border-[#E5E5E5] rounded-xl disabled:opacity-60"
            >
              {isFetchingMore ? t('notifications.loadingMore') : t('notifications.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
