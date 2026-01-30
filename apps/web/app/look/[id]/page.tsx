import { getLookDetailServer } from '@/shared/api/looks';
import { LookDetailPage } from '@/page/look/ui/LookDetailPage';

export default async function Page({ params }: { params: { id: string } }) {
  const detail = await getLookDetailServer(params.id);
  return <LookDetailPage detail={detail} />;
}
