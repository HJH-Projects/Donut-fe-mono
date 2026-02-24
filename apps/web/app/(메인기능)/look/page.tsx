import { LookPage } from '@/page/look/ui/LookPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { serverKy } from '@/features/api/serverKy';
import { getLooksApi } from '@/shared/api/endpointTags/looks';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';

export default async function Page() {
  const [initialLooks, initialClothes] = await Promise.all([
    getLooksApi(serverKy).catch(() => []),
    getClothesApi(serverKy).catch(() => []),
  ]);

  return (
    <LookPage
      initialLooks={initialLooks}
      initialClothes={initialClothes}
      header={<PageHeader title="Looks" titleHref="/look" />}
    />
  );
}
