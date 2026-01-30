import { getClothesDetailServer } from '@/shared/api/clothes';
import { ClosetDetailPage } from '@/page/closet/ui/ClosetDetailPage';

export default async function Page({ params }: { params: { id: string } }) {
  const detail = await getClothesDetailServer(params.id);
  return <ClosetDetailPage detail={detail} />;
}
