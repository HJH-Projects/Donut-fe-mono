'use client';

import { ChevronLeft, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import type { NotificationItem } from "@/shared/api/notifications.types";
import { markNotificationReadAction } from "@/shared/api/actions/notifications.action";

const fallbackNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "날씨 알림",
    message: "오늘은 추운 날씨가 예상됩니다.",
    date: "2026-02-04",
    isRead: false,
    detail: "오늘 최저 기온은 -5도, 최고 기온은 3도로 예상됩니다. 두꺼운 코트와 목도리를 착용하시는 것을 추천드립니다. 바람이 강하게 불 예정이니 외출 시 유의하세요.",
    imageUrl: "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=400&h=200&fit=crop",
  },
  {
    id: "2",
    title: "룩 추천",
    message: "새로운 룩 조합을 확인해보세요.",
    date: "2026-02-03",
    isRead: true,
  },
  {
    id: "3",
    title: "시스템 알림",
    message: "앱이 업데이트되었습니다.",
    date: "2026-02-02",
    isRead: true,
    detail: "Donut 앱이 v2.1.0으로 업데이트되었습니다. 새로운 기능으로 룩 공유 기능이 추가되었으며, 성능이 개선되었습니다. 지금 바로 사용해보세요!",
  },
  {
    id: "4",
    title: "옷장 알림",
    message: "새로운 아이템이 추가되었습니다.",
    date: "2026-02-01",
    isRead: true,
  },
  {
    id: "5",
    title: "룩 추천",
    message: "오늘 날씨에 어울리는 룩을 확인하세요.",
    date: "2026-01-31",
    isRead: true,
  },
];

interface NotificationsPageProps {
  initialNotifications?: NotificationItem[];
}

export function NotificationsPage({ initialNotifications = [] }: NotificationsPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const isRecentView = searchParams.get("recent") === "true";
  const [openId, setOpenId] = useState<string | null>(null);

  const allNotifications = initialNotifications.length > 0
    ? initialNotifications
    : fallbackNotifications;

  const notifications = isRecentView
    ? allNotifications.slice(0, 20)
    : allNotifications;

  const [readState, setReadState] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    for (const n of allNotifications) {
      state[n.id] = n.isRead;
    }
    return state;
  });

  const toggleNotification = async (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      if (!readState[id]) {
        setReadState((prev) => ({ ...prev, [id]: true }));
        try {
          await markNotificationReadAction(id);
        } catch { /* 오프라인 시 로컬 상태만 업데이트 */ }
      }
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="flex-shrink-0 px-6 pt-6 pb-6 flex items-center justify-center relative">
        <button
          onClick={() => router.push("/my")}
          className="absolute left-6 p-2 hover:bg-gray-50 transition-colors -ml-2"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <ChevronLeft size={24} color="#000" strokeWidth={2} />
        </button>
        <h1
          className="text-black text-center"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {t('notifications.title')}
        </h1>
      </div>

      <div className="flex-1 px-6">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isOpen = openId === notification.id;
            const isRead = readState[notification.id] ?? notification.isRead;

            return (
              <div
                key={notification.id}
                className="transition-all relative"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                {notification.detail && (
                  <div className="absolute -top-3 right-6 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotification(notification.id);
                      }}
                      className="w-6 h-6 flex items-center justify-center"
                      style={{
                        backgroundColor: isOpen ? "#000" : "#F5F5F5",
                        borderRadius: "var(--radius-sm)",
                        transition: "all 0.2s",
                      }}
                    >
                      {isOpen ? (
                        <Minus size={14} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <Plus size={14} color="#000" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => notification.detail && toggleNotification(notification.id)}
                  disabled={!notification.detail}
                  className={`w-full px-6 py-5 flex items-start gap-4 text-left ${notification.detail ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'} transition-colors`}
                >
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-black text-left"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        {notification.title}
                      </h3>
                      {!isRead && (
                        <div
                          className="flex-shrink-0 w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#000" }}
                        />
                      )}
                    </div>
                    <p
                      className="text-left"
                      style={{
                        color: "#525252",
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "1.5",
                      }}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {notification.imageUrl && !isOpen && (
                    <div
                      className="flex-shrink-0"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#F5F5F5",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={notification.imageUrl}
                        alt={notification.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="px-6 pb-6"
                        style={{
                          borderTop: "1px solid #F5F5F5",
                          paddingTop: "20px",
                        }}
                      >
                        {notification.detail && (
                          <p
                            className="mb-3"
                            style={{
                              color: "#525252",
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "1.7",
                            }}
                          >
                            {notification.detail}
                          </p>
                        )}
                        {notification.imageUrl && (
                          <div
                            className="w-full mb-3"
                            style={{
                              height: "200px",
                              backgroundColor: "#F5F5F5",
                              borderRadius: "var(--radius-md)",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={notification.imageUrl}
                              alt={notification.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p
                          style={{
                            color: "#A3A3A3",
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: "12px",
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
      </div>
    </div>
  );
}
