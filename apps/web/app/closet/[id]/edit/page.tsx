import { getClothesDetailServer } from '@/shared/api/clothes.server';
import { ClosetEditPage } from '@/page/closet/ui/ClosetEditPage';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const detail = await getClothesDetailServer(id);

  if (!detail) {
    notFound();
  }

  return <ClosetEditPage detail={detail} />;
}
