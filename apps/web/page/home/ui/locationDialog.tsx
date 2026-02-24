'use client';

import { useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Dialog } from "@base-ui/react/dialog";
import { MapPin, Settings } from "lucide-react";
import { postLocationsApi } from "@/shared/api/endpointTags/locations";
import { clientKy } from "@/features/api/clientKy";
import { authGuard } from "@/features/auth/authGuard";
import type { HomeLocationOption } from "./home.types";

const DEFAULT_COORDS = { latitude: 37.5665, longitude: 126.978 };

function getCoords(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ lat: DEFAULT_COORDS.latitude, lon: DEFAULT_COORDS.longitude });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: DEFAULT_COORDS.latitude, lon: DEFAULT_COORDS.longitude }),
    );
  });
}

function toLocationOption(dto: { id: string; alias: string; location: { id: string; lat: number; lon: number } }): HomeLocationOption {
  return {
    id: dto.id,
    locationId: dto.location.id,
    alias: dto.alias,
    lat: dto.location.lat,
    lon: dto.location.lon,
  };
}

interface LocationDialogProps {
  locations: HomeLocationOption[];
  selectedLocation: string;
  onSelectLocation: (location: HomeLocationOption) => void;
  setLocations: Dispatch<SetStateAction<HomeLocationOption[]>>;
}

const LocationDialog = ({
  locations,
  selectedLocation,
  onSelectLocation,
  setLocations,
}: LocationDialogProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [alias, setAlias] = useState("");

  const handleAddNewLocation = async () => {
    const status = await authGuard();
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'refresh_needed') {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
    }
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!alias.trim()) return;
    const name = alias.trim();
    setAlias("");
    setIsAdding(false);

    try {
      const coords = await getCoords();
      const created = await postLocationsApi(clientKy, {
        name,
        lat: coords.lat,
        lon: coords.lon,
        timezone: 'Asia/Seoul',
        alias: name,
        isDefault: false,
      });
      const newLoc = toLocationOption(created);
      setLocations((prev) => [...prev, newLoc]);
    } catch {
      /* 오프라인 또는 API 에러 시 무시 */
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setAlias("");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="mt-1 hover:opacity-70 transition-opacity"
        aria-label="지역 설정"
      >
        <Settings size={14} color="#555555" strokeWidth={1.5} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 z-50 w-[90%] max-w-[400px]"
          style={{ borderRadius: "24px" }}
        >
          {!isAdding ? (
            <>
              <h2 className="text-black mb-4" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "18px", fontWeight: 600 }}>
                {t('home.location')}
              </h2>
              <p className="text-[#555555] mb-6" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "1.5" }}>
                {t('home.selectLocation')}
              </p>
              <div className="space-y-2 mb-6">
                {locations.map((loc) => (
                  <button
                    key={loc.locationId}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: "16px",
                      border: selectedLocation === loc.alias ? "1.5px solid #000" : "1.5px solid #E5E5E5",
                    }}
                    onClick={() => onSelectLocation(loc)}
                  >
                    <MapPin size={16} color="#555555" strokeWidth={1.5} />
                    <span className="text-black" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                      {loc.alias}
                    </span>
                  </button>
                ))}
              </div>
              <button
                className="w-full bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
                style={{ borderRadius: "24px", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                onClick={handleAddNewLocation}
              >
                {t('home.addNewLocation')}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-black mb-4" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "18px", fontWeight: 600 }}>
                {t('home.addCurrentLocation')}
              </h2>
              <p className="text-[#555555] mb-6" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "1.5" }}>
                {t('home.enterLocationAlias')}
              </p>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder={t('home.locationAliasPlaceholder')}
                className="w-full px-4 py-3 mb-6 outline-none"
                style={{ borderRadius: "16px", border: "1.5px solid #E5E5E5", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 400 }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
                  style={{ borderRadius: "24px", border: "1.5px solid #E5E5E5", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                  onClick={handleCancel}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
                  style={{ borderRadius: "24px", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                >
                  {t('common.save')}
                </button>
              </div>
            </>
          )}
          <Dialog.Close
            className="absolute top-4 right-4 text-[#555555] hover:opacity-70 transition-opacity"
            aria-label="닫기"
            style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "24px" }}
            onClick={handleCancel}
          >
            ×
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default LocationDialog;
