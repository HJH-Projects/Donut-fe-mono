'use client';

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

type AnnouncementListItem = {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
};

interface AnnouncementsPageProps {
  initialAnnouncements?: AnnouncementListItem[];
  header?: ReactNode;
}

export function AnnouncementsPage({ initialAnnouncements = [], header }: AnnouncementsPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const announcements = initialAnnouncements;

  return (
    <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {header}

      <div className="flex-1 px-6">
        {announcements.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[#999999] text-[14px] font-medium">{t('announcements.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <button
                key={announcement.id}
                onClick={() => router.push(`/announcements/${announcement.id}`)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 transition-all hover:bg-gray-50 active:scale-[0.98]"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-black mb-1 truncate" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}>
                    {announcement.title}
                  </h3>
                  <p style={{ color: "#A3A3A3", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>
                    {announcement.date}
                  </p>
                </div>
                {announcement.imageUrl ? (
                  <div
                    className="shrink-0 w-14 h-14 overflow-hidden"
                    style={{ borderRadius: "10px", border: "1px solid #F0F0F0" }}
                  >
                    <ImageWithFallback
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ) : null}
                <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
