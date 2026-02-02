import { getLookDetailServer } from '@/shared/api/looks.server';
import { getClothesServer } from '@/shared/api/clothes.server';
import { LookEditPage } from '@/page/look/ui/LookEditPage';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!id || id === 'undefined') {
    notFound();
  }
  const [look, clothes] = await Promise.all([
    getLookDetailServer(id),
    getClothesServer(),
  ]);

  if (!look) {
    notFound();
  }

  return <LookEditPage look={look} clothes={clothes} />;
}
