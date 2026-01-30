import { getMeServer, getUserStatsServer } from '@/shared/api/users.server';
import { MyPage } from '@/page/my/ui/MyPage';

export default async function Page() {
  const profile = await getMeServer();
  const stats = await getUserStatsServer();

  return <MyPage profile={profile} stats={stats} />;
}
