import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Lightbulb,
  Droplets,
  Settings,
  MapPin,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import outfitImage from "figma:asset/a107a1459f5dbb360818b6e6885e4de75671ad63.png";

// Home page with weather details slide animation
export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Mock 날씨 데이터
  const [weather, setWeather] = useState({
    temp: 18,
    condition: "cloudy", // sunny, cloudy, rainy, windy
    location: "서울",
    maxTemp: 22,
    minTemp: 14,
    windSpeed: 2.5,
    precipitation: 20,
    humidity: 65,
    tips: [
      "가벼운 니트와 데님으로 레이어링하기 좋은 날씨예요",
      "바람이 불 수 있으니 가디건을 챙겨보세요",
      "편안한 스니커즈와 함께 스타일리시하게",
    ],
  });

  const [outfits] = useState([
    {
      id: 1,
      imageUrl: outfitImage,
      description: "캐주얼 데일리룩",
    },
    {
      id: 2,
      imageUrl: outfitImage,
      description: "캐주얼 데일리룩",
    },
    {
      id: 3,
      imageUrl: outfitImage,
      description: "캐주얼 데일리룩",
    },
  ]);

  const [currentOutfitIndex, setCurrentOutfitIndex] =
    useState(0);
  const [showWeatherDetail, setShowWeatherDetail] =
    useState(false);
  const [showLocationDialog, setShowLocationDialog] =
    useState(false);
  const [isAddingLocation, setIsAddingLocation] =
    useState(false);
  const [newLocationAlias, setNewLocationAlias] =
    useState("");
  const [locations, setLocations] = useState([
    "서울",
    "부산",
    "제주",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 날씨 상세정보 표시 후 5초 뒤 자동으로 숨김
  useEffect(() => {
    if (showWeatherDetail) {
      const timer = setTimeout(() => {
        setShowWeatherDetail(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWeatherDetail]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun size={20} color="#000" strokeWidth={1.5} />;
      case "cloudy":
        return (
          <Cloud size={20} color="#000" strokeWidth={1.5} />
        );
      case "rainy":
        return (
          <CloudRain size={20} color="#000" strokeWidth={1.5} />
        );
      case "windy":
        return (
          <Wind size={20} color="#000" strokeWidth={1.5} />
        );
      default:
        return (
          <Cloud size={20} color="#000" strokeWidth={1.5} />
        );
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentOutfitIndex(
        (prev) => (prev + 1) % outfits.length,
      );
    } else {
      setCurrentOutfitIndex(
        (prev) => (prev - 1 + outfits.length) % outfits.length,
      );
    }
  };

  const handleAddLocation = () => {
    if (newLocationAlias.trim()) {
      // 현재 위치를 별칭과 함께 저장 (실제로는 geolocation API 사용)
      setLocations([...locations, newLocationAlias.trim()]);
      setNewLocationAlias("");
      setIsAddingLocation(false);
    }
  };

  const handleSelectLocation = (location: string) => {
    // 로딩 시작
    setIsLoading(true);
    
    // 선택된 지역으로 업데이트
    setWeather({ ...weather, location });
    
    // 다이얼로그 닫기
    setShowLocationDialog(false);
    
    // 2초 후 로딩 종료
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const currentOutfit = outfits[currentOutfitIndex];

  return (
    <div className="h-screen w-full max-w-[500px] mx-auto bg-white flex flex-col overflow-hidden">
      {/* 최상단 브랜드 네임 */}
      <div className="flex-shrink-0 px-6 pt-6 pb-6 flex items-center justify-between">
        <div className="flex-1" />
        <h1
          className="text-black text-center flex-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Donut
        </h1>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => navigate("/notifications?recent=true")}
            className="relative p-2 hover:opacity-70 transition-opacity"
            aria-label="알림"
          >
            <Bell size={22} color="#000" strokeWidth={2} />
            {/* 알림 배지 */}
            <span
              className="absolute top-2 right-2 w-1 h-1 bg-red-500 rounded-full"
              style={{
                boxShadow: "0 0 0 1.5px white",
              }}
            />
          </button>
        </div>
      </div>

      {/* 상단 날씨 정보 */}
      <div className="flex-shrink-0 px-6 pb-1">
        <div className="flex items-center justify-between relative overflow-hidden">
          {/* 왼쪽: 날씨 정보 (클릭 가능) */}
          {isLoading ? (
            // 날씨 스켈레톤
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded skeleton-shimmer"
                style={{ borderRadius: "4px", backgroundColor: "#F5F5F5" }}
              />
              <div>
                <div
                  className="w-12 h-6 rounded mb-1 skeleton-shimmer"
                  style={{ borderRadius: "4px", backgroundColor: "#F5F5F5" }}
                />
                <div
                  className="w-16 h-3 rounded skeleton-shimmer"
                  style={{ borderRadius: "4px", backgroundColor: "#F5F5F5" }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() =>
                setShowWeatherDetail(!showWeatherDetail)
              }
              className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity z-10"
            >
              {getWeatherIcon()}
              <div>
                <p
                  className="text-black"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    lineHeight: "1",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {weather.temp}°
                </p>
                <p
                  className="text-[#555555] mt-1"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {weather.location}
                </p>
              </div>
            </button>
          )}

          {/* 오른쪽: 날짜 + 설정 아콘 / 날씨 상세정보 슬라이드 */}
          <div className="relative h-[60px] flex-1 flex justify-end">
            <AnimatePresence mode="wait">
              {!showWeatherDetail ? (
                <motion.div
                  key="date-settings"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="text-right absolute right-0 flex items-start gap-2"
                >
                  <div>
                    <Dialog.Root open={showLocationDialog} onOpenChange={setShowLocationDialog}>
                      <Dialog.Trigger asChild>
                        <button 
                          className="mt-1 hover:opacity-70 transition-opacity"
                          aria-label="지역 설정"
                        >
                          <Settings size={14} color="#555555" strokeWidth={1.5} />
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
                        <Dialog.Popup
                          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 z-50 w-[90%] max-w-[400px]"
                          style={{
                            borderRadius: "24px",
                          }}
                        >
                          {!isAddingLocation ? (
                            <>
                              {/* 지역 목록 뷰 */}
                              <h2
                                className="text-black mb-4"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 600,
                                }}
                              >
                                {t('home.location')}
                              </h2>
                              <p
                                className="text-[#555555] mb-6"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 400,
                                  lineHeight: "1.5",
                                }}
                              >
                                {t('home.selectLocation')}
                              </p>
                              
                              {/* 지역 목록 */}
                              <div className="space-y-2 mb-6">
                                {locations.map((location) => (
                                  <button
                                    key={location}
                                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    style={{
                                      borderRadius: "16px",
                                      border: weather.location === location ? "1.5px solid #000" : "1.5px solid #E5E5E5",
                                    }}
                                    onClick={() => handleSelectLocation(location)}
                                  >
                                    <MapPin size={16} color="#555555" strokeWidth={1.5} />
                                    <span
                                      className="text-black"
                                      style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {location}
                                    </span>
                                  </button>
                                ))}
                              </div>
                              
                              {/* 새 지역 추가 버튼 */}
                              <button
                                className="w-full bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
                                style={{
                                  borderRadius: "24px",
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "14px",
                                  fontWeight: 600,
                                }}
                                onClick={() => setIsAddingLocation(true)}
                              >
                                {t('home.addNewLocation')}
                              </button>
                            </>
                          ) : (
                            <>
                              {/* 위치 추가 폼 뷰 */}
                              <h2
                                className="text-black mb-4"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 600,
                                }}
                              >
                                {t('home.addCurrentLocation')}
                              </h2>
                              <p
                                className="text-[#555555] mb-6"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 400,
                                  lineHeight: "1.5",
                                }}
                              >
                                {t('home.enterLocationAlias')}
                              </p>
                              
                              {/* 별칭 입력 */}
                              <input
                                type="text"
                                value={newLocationAlias}
                                onChange={(e) => setNewLocationAlias(e.target.value)}
                                placeholder={t('home.locationAliasPlaceholder')}
                                className="w-full px-4 py-3 mb-6 outline-none"
                                style={{
                                  borderRadius: "16px",
                                  border: "1.5px solid #E5E5E5",
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddLocation();
                                  }
                                }}
                              />
                              
                              {/* 버튼 */}
                              <div className="flex gap-2">
                                <button
                                  className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
                                  style={{
                                    borderRadius: "24px",
                                    border: "1.5px solid #E5E5E5",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                  }}
                                  onClick={() => {
                                    setIsAddingLocation(false);
                                    setNewLocationAlias("");
                                  }}
                                >
                                  {t('common.cancel')}
                                </button>
                                <button
                                  onClick={handleAddLocation}
                                  className="flex-1 bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
                                  style={{
                                    borderRadius: "24px",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t('common.save')}
                                </button>
                              </div>
                            </>
                          )}
                          
                          <Dialog.Close asChild>
                            <button
                              className="absolute top-4 right-4 text-[#555555] hover:opacity-70 transition-opacity"
                              aria-label="닫기"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "24px",
                              }}
                              onClick={() => {
                                setIsAddingLocation(false);
                                setNewLocationAlias("");
                              }}
                            >
                              ×
                            </button>
                          </Dialog.Close>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>
                                        <p
                      className="text-[#555555]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      2 FEB 2026
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="weather-detail"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="text-right absolute right-0 space-y-1"
                >
                  <div className="flex items-center justify-end gap-2">
                    <p
                      className="text-[#555555]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      최고
                    </p>
                    <p
                      className="text-black"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {weather.maxTemp}°
                    </p>
                    <p
                      className="text-[#555555] mx-1"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      최저
                    </p>
                    <p
                      className="text-black"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {weather.minTemp}°
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-1">
                      <CloudRain
                        size={12}
                        color="#555555"
                        strokeWidth={1.5}
                      />
                      <p
                        className="text-black"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {weather.precipitation}%
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Wind
                        size={12}
                        color="#555555"
                        strokeWidth={1.5}
                      />
                      <p
                        className="text-black"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {weather.windSpeed}m/s
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Droplets
                        size={12}
                        color="#555555"
                        strokeWidth={1.5}
                      />
                      <p
                        className="text-black"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
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

      {/* 중앙 코디 이미지 - 최소 50vh */}
      <div className="flex-1 px-6 relative min-h-[50vh] flex items-center">
        {isLoading ? (
          // 코디 이미지 스켈레톤
          <div
            className="relative w-full h-full overflow-hidden flex items-center justify-center skeleton-shimmer"
            style={{ borderRadius: "32px", backgroundColor: "#FAFAFA" }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-32 h-32 rounded-full"
                style={{ backgroundColor: "#F5F5F5" }}
              />
              <div
                className="w-40 h-4"
                style={{ borderRadius: "8px", backgroundColor: "#F5F5F5" }}
              />
            </div>
          </div>
        ) : (
          <div
            className="relative w-full h-full overflow-hidden bg-white"
            style={{ borderRadius: "32px" }}
          >
            <img
              src={currentOutfit.imageUrl}
              alt={currentOutfit.description}
              className="w-full h-full object-contain"
            />

            {/* 좌우 스와이프 영역 (투명) */}
            <button
              onClick={() => handleSwipe("right")}
              className="absolute left-0 top-0 bottom-0 w-1/3"
              aria-label="이전 코디"
            />
            <button
              onClick={() => handleSwipe("left")}
              className="absolute right-0 top-0 bottom-0 w-1/3"
              aria-label="다음 코디"
            />
          </div>
        )}
      </div>

      {/* 하단 코디 팁 */}
      <div className="flex-shrink-0 px-6 pb-24 pt-2">
        {isLoading ? (
          // 팁 스켈레톤
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <div
                className="w-3 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: "#F5F5F5" }}
              />
              <div
                className="w-8 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <div
                className="w-64 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: "#F5F5F5" }}
              />
              <div
                className="w-56 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Lightbulb
                size={12}
                color="#555555"
                strokeWidth={1.5}
              />
              <p
                className="text-[#555555]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                TIP
              </p>
            </div>
            <p
              className="text-[#555555] text-center px-8"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                lineHeight: "1.3",
              }}
            >
              {weather.tips.join(" · ")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}