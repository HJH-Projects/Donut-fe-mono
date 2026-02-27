import { cookies } from 'next/headers';
import { PageHeader } from '@/shared/ui/PageHeader';
import { BellAction } from '@/shared/ui/BellAction';
import HomePage from '@/page/home/ui/HomePage';
import { fetchHomeDataLoggedIn, fetchHomeDataGuest } from './fetchHomeData';
import { GENDER_COOKIE, type Gender } from '@/shared/model/gender';

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');

  const { initialWeather, initialRecommendation, initialLocations } = isLoggedIn
    ? await fetchHomeDataLoggedIn((cookieStore.get(GENDER_COOKIE)?.value as Gender) ?? 'FEMALE')
    : await fetchHomeDataGuest();

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
