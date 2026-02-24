'use client';

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

type AnnouncementListItem = {
  id: string;
  title: string;
  date: string;
};

const fallbackAnnouncements: AnnouncementListItem[] = [
  { id: "1", title: "앱 v2.0 업데이트", date: "2026-02-05" },
  { id: "2", title: "새로운 기능 추가 안내", date: "2026-02-01" },
  { id: "3", title: "겨울 시즌 코디 팁 업데이트", date: "2026-01-28" },
  { id: "4", title: "서비스 점검 안내", date: "2026-01-25" },
  { id: "5", title: "신규 회원 이벤트 안내", date: "2026-01-20" },
];

interface AnnouncementsPageProps {
  initialAnnouncements?: AnnouncementListItem[];
  header?: ReactNode;
}

export function AnnouncementsPage({ initialAnnouncements = [], header }: AnnouncementsPageProps) {
  const router = useRouter();

  const announcements = initialAnnouncements.length > 0
    ? initialAnnouncements
    : fallbackAnnouncements;

  return (
    <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {header}

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
