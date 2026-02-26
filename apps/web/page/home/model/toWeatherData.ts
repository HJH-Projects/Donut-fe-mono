import type { HomeWeatherState } from "../ui/home.types";
import type { WeatherResponseDto } from '@/shared/model/orvalSchemas';

export const toWeatherCondition = (snapshot: WeatherResponseDto): "sunny" | "cloudy" | "rainy" | "windy" => {
  if (snapshot.precipitationTypeCode && snapshot.precipitationTypeCode > 0) return "rainy";
  if (snapshot.precipitationProbability >= 60) return "rainy";
  if (snapshot.windSpeed >= 8) return "windy";
  if (snapshot.skyCode === 1) return "sunny";
  return "cloudy";
};

export const toWeatherTips = (snapshot: WeatherResponseDto): string[] => {
  if (snapshot.precipitationProbability >= 60) {
    return ["강수 확률이 높아요. 방수 아우터나 우산을 챙겨보세요."];
  }
  if (snapshot.tempCurrent <= 5) {
    return ["기온이 낮아요. 이너 + 아우터 레이어링을 추천해요."];
  }
  if (snapshot.tempCurrent >= 28) {
    return ["더운 날씨예요. 통풍이 좋은 가벼운 소재를 추천해요."];
  }
  if (snapshot.windSpeed >= 6) {
    return ["바람이 강해요. 바람막이나 얇은 겉옷을 챙겨보세요."];
  }
  return ["가벼운 니트와 데님으로 레이어링하기 좋은 날씨예요."];
};

export const toWeatherState = (snapshot: WeatherResponseDto, locationName?: string): HomeWeatherState => ({
  temp: snapshot.tempCurrent,
  condition: toWeatherCondition(snapshot),
  location: locationName || "서울",
  maxTemp: snapshot.tempMax,
  minTemp: snapshot.tempMin,
  windSpeed: snapshot.windSpeed,
  precipitation: snapshot.precipitationProbability,
  humidity: 0,
  tips: toWeatherTips(snapshot),
});
