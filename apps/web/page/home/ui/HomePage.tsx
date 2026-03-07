'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WeatherResponseDto } from '@/shared/model/orvalSchemas';
import type { HomeLocation } from '@/app/(메인기능)/(home)/fetchHomeData';
import type { HomeRecommendation } from './home.types';
import type { Gender } from '@/shared/model/gender';
import LocationWeather from './locationWeather';
import RecommendBasicLook from './recommendBasicLook';
import { useHomeData } from '../model/useHomeData';
import { BellAction } from '@/shared/ui/BellAction';

interface HomePageProps {
  header?: ReactNode;
  isLoggedIn: boolean;
  gender?: Gender;
  initialWeather?: WeatherResponseDto | null;
  initialRecommendation?: HomeRecommendation | null;
  initialLocations: HomeLocation[];
}

const HomePage = ({
  header,
  isLoggedIn = false,
  gender,
  initialWeather = null,
  initialRecommendation = null,
  initialLocations = [],
}: HomePageProps) => {
  const {
    weather,
    recommendation,
    locations,
    isLoading,
    selectedLocation,
    setSelectedLocation,
    selectLocation,
    updateDisplayedLocationAlias,
    setLocations,
  } = useHomeData({
    isLoggedIn,
    gender,
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
      <div className="shrink-0 relative">
        {header}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <BellAction />
        </div>
      </div>

      <LocationWeather
        weather={weather}
        isLoading={isLoading}
        showWeatherDetail={showWeatherDetail}
        onToggleWeatherDetail={() => setShowWeatherDetail((prev) => !prev)}
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
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
};
export default HomePage;
