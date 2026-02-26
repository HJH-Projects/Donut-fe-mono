import { MyPage } from '@/page/my/ui/MyPage';
import { getCachedProfile } from '@/page/my/model/getCachedProfile';
import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { getCachedLooks } from '@/page/look/model/getCachedLooks';

export const PROFILE_CACHE_TAG = 'profile';

export default async function Page() {
  const [initialProfile, clothes, looks] = await Promise.all([
    getCachedProfile().catch(() => null),
    getCachedClothes().catch(() => []),
    getCachedLooks().catch(() => []),
  ]);

  const initialStats = {
    closetCount: clothes.length,
    lookCount: looks.length,
  };

  return <MyPage initialProfile={initialProfile} initialStats={initialStats} />;
}
