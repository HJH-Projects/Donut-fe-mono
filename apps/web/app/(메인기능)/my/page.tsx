import { MyPage } from '@/page/my/ui/MyPage';
import { serverKy } from '@/features/api/serverKy';
import { getUsersMeApi } from '@/shared/api/endpointTags/users';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';
import { getLooksApi } from '@/shared/api/endpointTags/looks';

export default async function Page() {
  const initialProfile = await getUsersMeApi(serverKy);

  const [clothes, looks] = await Promise.all([
    getClothesApi(serverKy).catch(() => []),
    getLooksApi(serverKy).catch(() => []),
  ]);

  const initialStats = {
    closetCount: clothes.length,
    lookCount: looks.length,
  };

  return <MyPage initialProfile={initialProfile} initialStats={initialStats} />;
}
