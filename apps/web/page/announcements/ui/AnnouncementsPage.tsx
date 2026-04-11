'use client';

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

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
            <Text variant="captionStrong" className="text-[14px] text-[#999999]">{t('announcements.empty')}</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                onClick={() => router.push(`/announcements/${announcement.id}`)}
                variant="outlined"
                interactive
                className="flex w-full items-center justify-between gap-3 px-5 py-4 active:scale-[0.98]"
              >
                <div className="flex-1 min-w-0 text-left">
                  <Text as="h3" variant="bodyStrong" className="mb-1 truncate text-[16px] font-bold">
                    {announcement.title}
                  </Text>
                  <Text variant="captionStrong" className="text-[#A3A3A3]">
                    {announcement.date}
                  </Text>
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
