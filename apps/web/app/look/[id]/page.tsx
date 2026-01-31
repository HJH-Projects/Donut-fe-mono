import { getLookDetailServer } from '@/shared/api/looks.server';
import { LookDetailPage } from '@/page/look/ui/LookDetailPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id === 'undefined') {
    notFound();
  }
  const detail = await getLookDetailServer(id);
  return <LookDetailPage detail={detail} />;
}
