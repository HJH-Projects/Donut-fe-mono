import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { getCachedLooks } from '@/page/look/model/getCachedLooks';
import { LookPage } from '@/page/look/ui/LookPage';
import { PageHeader } from '@/shared/ui/PageHeader';

export default async function Page() {
  const looksPromise = getCachedLooks().catch(() => []);
  const clothesPromise = getCachedClothes().catch(() => []);

  return (
    <LookPage
      looksPromise={looksPromise}
      clothesPromise={clothesPromise}
      header={<PageHeader title="Looks" titleHref="/look" />}
    />
  );
}
