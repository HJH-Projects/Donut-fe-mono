'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Cloud, CloudRain, Droplets, Sun, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { HomeWeatherState, HomeLocationOption } from './home.types';
import LocationDialog from './locationDialog';
const TEMPERATURE_UNIT_KEY = 'temperatureUnit';
type TemperatureUnit = 'celsius' | 'fahrenheit';

interface LocationWeatherProps {
  weather: HomeWeatherState;
  isLoading: boolean;
  showWeatherDetail: boolean;
  onToggleWeatherDetail: () => void;
  locations: HomeLocationOption[];
  onSelectLocation: (loc: HomeLocationOption) => void;
  onLocationAliasUpdated: (prevAlias: string, nextAlias: string) => void;
  setLocations: Dispatch<SetStateAction<HomeLocationOption[]>>;
}

const renderWeatherIcon = (condition: HomeWeatherState['condition']) => {
  switch (condition) {
    case 'sunny':
      return <Sun size={20} color="#000" strokeWidth={1.5} />;
    case 'cloudy':
      return <Cloud size={20} color="#000" strokeWidth={1.5} />;
    case 'rainy':
      return <CloudRain size={20} color="#000" strokeWidth={1.5} />;
    case 'windy':
      return <Wind size={20} color="#000" strokeWidth={1.5} />;
    default:
      return <Cloud size={20} color="#000" strokeWidth={1.5} />;
  }
};

function formatTodayInKst(language: string): string {
  const date = new Date();

  if (language.startsWith('ko')) {
    const parts = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';

    return `${year}년 ${month}월 ${day}일`;
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);

  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = (parts.find((part) => part.type === 'month')?.value ?? '').toUpperCase();
  const year = parts.find((part) => part.type === 'year')?.value ?? '';

  return `${day} ${month} ${year}`;
}

function convertTemperature(tempInCelsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((tempInCelsius * 9) / 5 + 32);
  }
  return Math.round(tempInCelsius);
}

function renderTempWithUnit(value: number, unitLabel: string, unitSizePx: number) {
  return (
    <>
      {value}
      <span
        style={{
          fontSize: `${unitSizePx}px`,
          verticalAlign: 'top',
          marginLeft: '1px',
        }}
      >
        {unitLabel}
      </span>
    </>
  );
}

const LocationWeather = ({
  weather,
  isLoading,
  showWeatherDetail,
  onToggleWeatherDetail,
  locations,
  onSelectLocation,
  onLocationAliasUpdated,
  setLocations,
}: LocationWeatherProps) => {
  const { i18n } = useTranslation();
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const todayLabel = formatTodayInKst(i18n.language);
  const unitLabel = temperatureUnit === 'fahrenheit' ? '°F' : '°C';
  const currentTemp = convertTemperature(weather.temp, temperatureUnit);
  const maxTemp = convertTemperature(weather.maxTemp, temperatureUnit);
  const minTemp = convertTemperature(weather.minTemp, temperatureUnit);

  useEffect(() => {
    const savedUnit = localStorage.getItem(TEMPERATURE_UNIT_KEY);
    if (savedUnit === 'celsius' || savedUnit === 'fahrenheit') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemperatureUnit(savedUnit);
    }
  }, []);

  return (
    <div className="shrink-0 px-6 pb-1">
      <div className="flex items-center justify-between relative overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded skeleton-shimmer"
              style={{ borderRadius: '4px', backgroundColor: '#F5F5F5' }}
            />
            <div>
              <div
                className="w-12 h-6 rounded mb-1 skeleton-shimmer"
                style={{ borderRadius: '4px', backgroundColor: '#F5F5F5' }}
              />
              <div
                className="w-16 h-3 rounded skeleton-shimmer"
                style={{ borderRadius: '4px', backgroundColor: '#F5F5F5' }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleWeatherDetail}
            className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity z-10"
          >
            {renderWeatherIcon(weather.condition)}
            <div className="text-left">
              <p
                className="text-black"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: '1',
                  letterSpacing: '-0.01em',
                }}
              >
                {renderTempWithUnit(currentTemp, unitLabel, 14)}
              </p>
              <p
                className="text-[#555555] mt-1"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {weather.location}
              </p>
            </div>
          </button>
        )}

        <div className="relative h-[60px] flex-1 flex justify-end">
          <AnimatePresence mode="wait">
            {!showWeatherDetail ? (
              <motion.div
                key="date-settings"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-right absolute right-0 flex items-start gap-2"
              >
                <div>
                  <LocationDialog
                    locations={locations}
                    selectedLocation={weather.location}
                    onSelectLocation={onSelectLocation}
                    onLocationAliasUpdated={onLocationAliasUpdated}
                    setLocations={setLocations}
                  />
                  <p
                    className="text-[#555555]"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {todayLabel}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="weather-detail"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-right absolute right-0 space-y-1"
              >
                <div className="flex items-center justify-end gap-2">
                  <p
                    className="text-[#555555]"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    최고
                  </p>
                  <p
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {renderTempWithUnit(maxTemp, unitLabel, 9)}
                  </p>
                  <p
                    className="text-[#555555] mx-1"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    최저
                  </p>
                  <p
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {renderTempWithUnit(minTemp, unitLabel, 9)}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="flex items-center gap-1">
                    <CloudRain size={12} color="#555555" strokeWidth={1.5} />
                    <p
                      className="text-black"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {weather.precipitation}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind size={12} color="#555555" strokeWidth={1.5} />
                    <p
                      className="text-black"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {weather.windSpeed}m/s
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets size={12} color="#555555" strokeWidth={1.5} />
                    <p
                      className="text-black"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {weather.humidity}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LocationWeather;
