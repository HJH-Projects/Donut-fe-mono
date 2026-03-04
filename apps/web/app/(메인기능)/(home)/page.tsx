import { cookies } from 'next/headers';
import { PageHeader } from '@/shared/ui/PageHeader';
import { BellAction } from '@/shared/ui/BellAction';
import HomePage from '@/page/home/ui/HomePage';
import { fetchHomeDataLoggedIn, fetchHomeDataGuest } from './fetchHomeData';
import { GENDER_COOKIE, type Gender } from '@/shared/model/gender';

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');
  const gender = (cookieStore.get(GENDER_COOKIE)?.value as Gender) ?? 'FEMALE';
  const { initialWeather, initialRecommendation, initialLocations } = isLoggedIn
    ? await fetchHomeDataLoggedIn(gender)
    : await fetchHomeDataGuest();

  return (
    <>
      <PageHeader title="Donut" titleHref="/" right={<BellAction />} />
      <HomePage
        isLoggedIn={isLoggedIn}
        gender={isLoggedIn ? gender : undefined}
        initialWeather={initialWeather}
        initialRecommendation={initialRecommendation}
        initialLocations={initialLocations}
      />
    </>
  );
}
