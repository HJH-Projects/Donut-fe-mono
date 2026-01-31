export type WeatherDisplay = {
  locationName?: string;
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

export type Gender = 'MALE' | 'FEMALE';
