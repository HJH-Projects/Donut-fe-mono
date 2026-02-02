import { getClothesServer } from '@/shared/api/clothes.server';
import { ClosetPage } from '@/page/closet/ui/ClosetPage';

export default async function Page() {
  const clothes = await getClothesServer();
  return <ClosetPage clothes={clothes} />;
}
