import { cookies } from 'next/headers';
import { PageHeader } from '@/shared/ui/PageHeader';
import { BellAction } from '@/shared/ui/BellAction';
import HomePage from '@/page/home/ui/HomePage';
import { serverKy } from '@/features/api/serverKy';
import { fetchHomeDataLoggedIn, fetchHomeDataGuest } from './fetchHomeData';

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');

  const { initialWeather, initialRecommendation, initialLocations } = isLoggedIn
    ? await fetchHomeDataLoggedIn(serverKy)
    : await fetchHomeDataGuest(serverKy);

  return (
    <>
      <PageHeader title="Donut" titleHref="/" right={<BellAction />} />
      <HomePage
        isLoggedIn={isLoggedIn}
        initialWeather={initialWeather}
        initialRecommendation={initialRecommendation}
        initialLocations={initialLocations}
      />
    </>
  );
}
