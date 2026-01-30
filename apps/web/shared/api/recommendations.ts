import { clientKy } from './client';
import { serverKy } from './server';

export type WeatherDisplay = {
  sky: string;
  precipitationType: string;
  tempCurrent: number;
  tempMin: number;
  tempMax: number;
  wind: string;
  precipitationProbability: string;
  message?: string | null;
};

export type LookRecommendation = {
  description?: string | null;
  lookImageUrl?: string | null;
};

export type RecommendationResponse = {
  weather: {
    display: WeatherDisplay;
  };
  recommendation: LookRecommendation;
};

export type RecommendationParams = {
  latitude?: number;
  longitude?: number;
};

type Gender = 'MALE' | 'FEMALE';

const mockRecommendation: RecommendationResponse = {
  weather: {
    display: {
      sky: '맑음',
      precipitationType: '없음',
      tempCurrent: 4,
      tempMin: -2,
      tempMax: 7,
      wind: '2.1m/s',
      precipitationProbability: '20%',
      message: '맑지만 쌀쌀해요. 도톰한 아우터를 추천해요.',
    },
  },
  recommendation: {
    description: '날씨에 맞는 캐주얼 코디를 추천해요.',
    lookImageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop',
  },
};

const pickRandomGender = (): Gender => (Math.random() < 0.5 ? 'MALE' : 'FEMALE');

const buildSearchParams = (params?: RecommendationParams) => {
  const searchParams: Record<string, string> = {
    gender: pickRandomGender(),
  };

  if (typeof params?.latitude === 'number') {
    searchParams.latitude = params.latitude.toString();
  }
  if (typeof params?.longitude === 'number') {
    searchParams.longitude = params.longitude.toString();
  }

  return searchParams;
};

export const recommendLookServer = async (params?: RecommendationParams) => {
  try {
    return await serverKy
      .get('recommendations/look', { searchParams: buildSearchParams(params) })
      .json<RecommendationResponse>();
  } catch {
    return mockRecommendation;
  }
};

export const recommendLookClient = async (params?: RecommendationParams) => {
  try {
    return await clientKy
      .get('recommendations/look', { searchParams: buildSearchParams(params) })
      .json<RecommendationResponse>();
  } catch {
    return mockRecommendation;
  }
};
