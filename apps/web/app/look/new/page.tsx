import { getClothesServer } from '@/shared/api/clothes';
import { LookCreatePage } from '@/page/look/ui/LookCreatePage';

export default async function Page() {
  const clothes = await getClothesServer();
  return <LookCreatePage clothes={clothes} />;
}
