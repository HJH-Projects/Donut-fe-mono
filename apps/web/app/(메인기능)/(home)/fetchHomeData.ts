import type { KyInstance } from '@/shared/api/endpointTags/_types';
import type { UserLocationResponseDto, LocationDto, WeatherResponseDto } from '@/shared/model/orvalSchemas';
import type { HomeRecommendation } from '@/page/home/ui/home.types';
import { getLocationsApi, getLocationWeatherApi } from '@/shared/api/endpointTags/locations';
import { getRecommendationsLookApi } from '@/shared/api/endpointTags/recommendations';
import type { Gender } from '@/shared/model/gender';

/** UserLocationResponseDto를 확장하여 id를 nullable로 허용 (비로그인 정규화용) */
export type HomeLocation = Omit<UserLocationResponseDto, 'id'> & { id: string | null };

export interface HomeInitialData {
  initialWeather: WeatherResponseDto | null;
  initialRecommendation: HomeRecommendation | null;
  initialLocations: HomeLocation[];
}

function toRecommendation(
  result: Awaited<ReturnType<typeof getRecommendationsLookApi>> | null,
): HomeRecommendation | null {
  if (!result) return null;
  return {
    imageUrl: result.recommendation?.lookImageUrl ?? null,
    description: result.recommendation?.description ?? null,
  };
}

function toHomeLocation(dto: LocationDto): HomeLocation {
  return {
    id: null,
    alias: dto.name,
    isDefault: true,
    location: dto,
  };
}

export async function fetchHomeDataLoggedIn(ky: KyInstance, gender: Gender): Promise<HomeInitialData> {
  const locations = await getLocationsApi(ky).catch(() => []);

  if (!Array.isArray(locations)) {
    return { initialWeather: null, initialRecommendation: null, initialLocations: [] };
  }

  const defaultLocation = locations.find((loc) => loc.isDefault) || null;
  if (!defaultLocation) {
    return {
      initialWeather: null,
      initialRecommendation: toRecommendation(
        await getRecommendationsLookApi(ky, { gender }, { cache: 'no-store' }).catch(() => null),
      ),
      initialLocations: locations,
    };
  }

  const [weather, recommendation] = await Promise.all([
    getLocationWeatherApi(ky, defaultLocation.id).catch(() => null),
    getRecommendationsLookApi(ky, {
      latitude: defaultLocation.location.lat,
      longitude: defaultLocation.location.lon,
      gender,
    }, { cache: 'no-store' }).catch(() => null),
  ]);

  return {
    initialWeather: weather,
    initialRecommendation: toRecommendation(recommendation),
    initialLocations: locations,
  };
}

const randomGender = (): Gender => (Math.random() < 0.5 ? 'MALE' : 'FEMALE');

export async function fetchHomeDataGuest(ky: KyInstance, gender?: Gender): Promise<HomeInitialData> {
  const resolvedGender = gender ?? randomGender();
  const result = await getLocationsApi(ky).catch(() => null);

  const defaultLocation = result && !Array.isArray(result) ? result : null;
  if (!defaultLocation) {
    return { initialWeather: null, initialRecommendation: null, initialLocations: [] };
  }

  const [weather, recommendation] = await Promise.all([
    getLocationWeatherApi(ky, defaultLocation.id).catch(() => null),
    getRecommendationsLookApi(ky, {
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lon,
      gender: resolvedGender,
    }, { cache: 'no-store' }).catch(() => null),
  ]);

  return {
    initialWeather: weather,
    initialRecommendation: toRecommendation(recommendation),
    initialLocations: [toHomeLocation(defaultLocation)],
  };
}
