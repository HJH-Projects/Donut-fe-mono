'use client';

import { useState, useEffect } from "react";
import type { WeatherResponseDto } from "@/shared/api/orvalSchema";
import type { HomeLocation } from "@/app/(메인기능)/(home)/fetchHomeData";
import type { HomeRecommendation } from "./home.types";
import LocationWeather from "./locationWeather";
import RecommendBasicLook from "./recommendBasicLook";
import { useHomeData } from "../model/useHomeData";

interface HomePageProps {
  isLoggedIn: boolean;
  initialWeather?: WeatherResponseDto | null;
  initialRecommendation?: HomeRecommendation | null;
  initialLocations?: HomeLocation[];
}

const HomePage = ({
  isLoggedIn = false,
  initialWeather = null,
  initialRecommendation = null,
  initialLocations = [],
}: HomePageProps) => {
  const {
    weather,
    recommendation,
    locations,
    isLoading,
    selectLocation,
    updateDisplayedLocationAlias,
    setLocations,
  } = useHomeData({
    isLoggedIn,
    initialWeather,
    initialRecommendation,
    initialLocations,
  });

  const [showWeatherDetail, setShowWeatherDetail] = useState(false);

  useEffect(() => {
    if (showWeatherDetail) {
      const timer = setTimeout(() => {
        setShowWeatherDetail(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWeatherDetail]);

  return (
    <div className="flex-1 min-h-0 w-full bg-white flex flex-col overflow-hidden">
      <LocationWeather
        weather={weather}
        isLoading={isLoading}
        showWeatherDetail={showWeatherDetail}
        onToggleWeatherDetail={() => setShowWeatherDetail((prev) => !prev)}
        locations={locations}
        onSelectLocation={selectLocation}
        onLocationAliasUpdated={updateDisplayedLocationAlias}
        setLocations={setLocations}
      />

      <RecommendBasicLook
        isLoading={isLoading}
        recommendation={recommendation}
        tips={weather.tips}
      />
    </div>
  );
}
export default HomePage;
