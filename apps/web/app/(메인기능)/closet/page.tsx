import { ClosetPage } from '@/page/closet/ui/ClosetPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { serverKy } from '@/features/api/serverKy';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';

export default async function Page() {
  const initialClothes = await getClothesApi(serverKy).catch(() => []);

  return (
    <ClosetPage
      initialClothes={initialClothes}
      header={<PageHeader title="Closet" titleHref="/closet" />}
    />
  );
}
