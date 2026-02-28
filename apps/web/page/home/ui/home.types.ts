export type HomeWeatherState = {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "windy";
  location: string;
  maxTemp: number;
  minTemp: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  tips?: string[];
};

export type HomeRecommendation = {
  imageUrl: string | null;
  description: string | null;
};

export type HomeLocationOption = {
  id: string | null;
  locationId: string;
  alias: string;
  lat: number;
  lon: number;
  isDefault: boolean;
};
