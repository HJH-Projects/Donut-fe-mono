import { getAnnouncementsServer } from '@/shared/api/announcements.server';
import { AnnouncementsPage } from '@/page/announcements/ui/AnnouncementsPage';
import type { AnnouncementListItem } from '@/shared/api/announcements.types';

export default async function Page() {
  let announcements: AnnouncementListItem[] = [];

  try {
    announcements = await getAnnouncementsServer();
  } catch { /* API 미연동 시 빈 배열 */ }

  return <AnnouncementsPage initialAnnouncements={announcements} />;
}
