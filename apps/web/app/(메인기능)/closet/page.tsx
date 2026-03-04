import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { ClosetPage } from '@/page/closet/ui/ClosetPage';
import { PageHeader } from '@/shared/ui/PageHeader';

export default async function Page() {
  const clothesPromise = getCachedClothes().catch(() => []);

  return (
    <ClosetPage
      clothesPromise={clothesPromise}
      header={<PageHeader title="Closet" titleHref="/closet" />}
    />
  );
}
