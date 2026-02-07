import { getAnnouncementDetailServer } from '@/shared/api/announcements.server';
import { AnnouncementDetailPage } from '@/page/announcements/ui/AnnouncementDetailPage';
import type { AnnouncementDetail } from '@/shared/api/announcements.types';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let announcement: AnnouncementDetail | null = null;

  try {
    announcement = await getAnnouncementDetailServer(id);
  } catch { /* API 미연동 시 null */ }

  return <AnnouncementDetailPage initialAnnouncement={announcement} />;
}
