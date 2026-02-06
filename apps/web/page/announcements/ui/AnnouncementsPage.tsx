'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export function AnnouncementsPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const announcements = [
    { id: "1", title: "앱 v2.0 업데이트", date: "2026-02-05" },
    { id: "2", title: "새로운 기능 추가 안내", date: "2026-02-01" },
    { id: "3", title: "겨울 시즌 코디 팁 업데이트", date: "2026-01-28" },
    { id: "4", title: "서비스 점검 안내", date: "2026-01-25" },
    { id: "5", title: "신규 회원 이벤트 안내", date: "2026-01-20" },
  ];

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
          {t('announcements.title')}
        </h1>
      </div>

      <div className="flex-1 px-6">
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => router.push(`/announcements/${announcement.id}`)}
              className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50 active:scale-[0.98]"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div className="flex-1 text-left">
                <h3
                  className="text-black mb-1"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  {announcement.title}
                </h3>
                <p
                  style={{
                    color: "#A3A3A3",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {announcement.date}
                </p>
              </div>
              <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
