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

export const recommendLookServer = async (latitude: number, longitude: number) => {
  try {
    return await serverKy
      .post('recommendations/look', { json: { latitude, longitude } })
      .json<RecommendationResponse>();
  } catch {
    return mockRecommendation;
  }
};

export const recommendLookClient = async (latitude: number, longitude: number) => {
  try {
    return await clientKy
      .post('recommendations/look', { json: { latitude, longitude } })
      .json<RecommendationResponse>();
  } catch {
    return mockRecommendation;
  }
};
