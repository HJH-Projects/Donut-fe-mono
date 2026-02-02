import { getLooksServer } from '@/shared/api/looks.server';
import { LookPage } from '@/page/look/ui/LookPage';

export default async function Page() {
  const looks = await getLooksServer();
  return <LookPage looks={looks} />;
}
