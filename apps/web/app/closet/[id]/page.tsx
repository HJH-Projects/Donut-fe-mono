import { getClothesDetailServer } from '@/shared/api/clothes.server';
import { ClosetDetailPage } from '@/page/closet/ui/ClosetDetailPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id === 'undefined') {
    notFound();
  }
  const detail = await getClothesDetailServer(id);
  return <ClosetDetailPage detail={detail} />;
}
