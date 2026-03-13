'use client';

import { type ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

type AnnouncementDetail = {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrls?: string[];
};

interface AnnouncementDetailPageProps {
  initialAnnouncement?: AnnouncementDetail | null;
  header?: ReactNode;
}

export function AnnouncementDetailPage({ initialAnnouncement = null, header }: AnnouncementDetailPageProps) {
  const { t } = useTranslation();
  const announcement = initialAnnouncement;

  if (!announcement) {
    return (
      <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <p
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#737373",
          }}
        >
          {t('announcements.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {header}

      <div className="flex-1 px-6">
        <h2
          className="text-black mb-3"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "1.4",
          }}
        >
          {announcement.title}
        </h2>

        <p
          className="mb-6 pb-6"
          style={{
            color: "#A3A3A3",
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            borderBottom: "1px solid #F5F5F5",
          }}
        >
          {announcement.date}
        </p>

        <div
          style={{
            color: "#525252",
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "1.8",
            whiteSpace: "pre-line",
          }}
        >
          {announcement.content}
        </div>

        {announcement.imageUrls && announcement.imageUrls.length > 0 ? (
          <section className="mt-8">
            <h3
              className="text-black mb-3"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {t('announcements.images')}
            </h3>
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-3 w-max">
                {announcement.imageUrls.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="w-24 h-24 overflow-hidden bg-[#F5F5F5] shrink-0"
                    style={{ borderRadius: "12px", border: "1px solid #EAEAEA" }}
                  >
                    <ImageWithFallback
                      src={imageUrl}
                      alt={t('announcements.imageAlt', {
                        title: announcement.title,
                        index: index + 1,
                      })}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
