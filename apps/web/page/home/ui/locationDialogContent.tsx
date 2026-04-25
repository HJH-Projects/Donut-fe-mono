import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Check, Trash2 } from 'lucide-react';
import KakaoMapPicker, { type KakaoMapPickerRef } from '@/features/map/KakaoMapPicker';
import KakaoMapSearch from '@/features/map/KakaoMapSearch';
import Spinner from '@/shared/ui/Spinner';
import { isKakaoMapSdkReady, loadKakaoMapSdk } from '@/shared/lib/kakaoMapSdk';
import type { HomeLocationOption } from './home.types';

const FONT = "var(--font-inter), 'Inter', sans-serif";

// --- 삭제 확인 ---
interface ConfirmDeleteContentProps {
  deletingAlias: string;
  isMutating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteContent = ({
  deletingAlias,
  isMutating,
  onCancel,
  onConfirm,
}: ConfirmDeleteContentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="text-black mb-4"
        style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 600 }}
      >
        {t('common.delete')}
      </h2>
      <p
        className="text-black text-center mb-6"
        style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500 }}
      >
        {t('home.deleteLocationConfirm', { alias: deletingAlias })}
      </p>
      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderRadius: '24px',
            border: '1.5px solid #E5E5E5',
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 600,
          }}
          disabled={isMutating}
          onClick={onCancel}
        >
          {t('common.cancel')}
        </button>
        <button
          className="flex-1 bg-red-500 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: '24px', fontFamily: FONT, fontSize: '14px', fontWeight: 600 }}
          disabled={isMutating}
          onClick={onConfirm}
        >
          {t('common.delete')}
        </button>
      </div>
    </>
  );
};

// --- 새 지역 추가 ---
interface AddLocationContentProps {
  alias: string;
  isSaving: boolean;
  onAliasChange: (value: string) => void;
  onSave: (coords: { lat: number; lon: number; name: string }) => void;
  onCancel: () => void;
}

export const AddLocationContent = ({
  alias,
  isSaving,
  onAliasChange,
  onSave,
  onCancel,
}: AddLocationContentProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<KakaoMapPickerRef>(null);
  const [isMapReady, setIsMapReady] = useState(() => isKakaoMapSdkReady());
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (isMapReady) return;

    let cancelled = false;
    void loadKakaoMapSdk()
      .then(() => {
        if (!cancelled) setIsMapReady(true);
      })
      .catch(() => {
        if (!cancelled) setIsMapReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isMapReady]);

  const handleLocationSelect = (location: { lat: number; lon: number; name: string }) => {
    setSelectedCoords(location);
  };

  const handleSearchSelect = (place: { lat: number; lon: number; name: string }) => {
    mapRef.current?.moveTo(place.lat, place.lon);
  };

  const handleSave = () => {
    if (!selectedCoords || !alias.trim()) return;
    onSave(selectedCoords);
  };

  const canSave = Boolean(selectedCoords && alias.trim()) && !isSaving;

  return (
    <>
      <h2
        className="text-black mb-4"
        style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 600 }}
      >
        {t('home.addNewLocation')}
      </h2>
      {isMapReady ? (
        <>
          <KakaoMapSearch onSelect={handleSearchSelect} />
          <KakaoMapPicker ref={mapRef} onLocationSelect={handleLocationSelect} />
        </>
      ) : (
        <div
          className="mb-4 flex h-[250px] flex-col items-center justify-center gap-2"
          style={{
            borderRadius: '16px',
            border: '1.5px solid #E5E5E5',
            backgroundColor: '#FAFAFA',
          }}
        >
          <Spinner size="sm" className="text-black" />
          <p className="text-[#777]" style={{ fontFamily: FONT, fontSize: '13px' }}>
            {t('home.tapToSelectLocation')}
          </p>
        </div>
      )}
      <p
        className="text-[#555555] mb-2"
        style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 400, lineHeight: '1.5' }}
      >
        {t('home.enterLocationAlias')}
      </p>
      <input
        type="text"
        value={alias}
        onChange={(e) => onAliasChange(e.target.value)}
        placeholder={t('home.locationAliasPlaceholder')}
        className="w-full px-4 py-3 mb-6 outline-none"
        style={{
          borderRadius: '16px',
          border: '1.5px solid #E5E5E5',
          fontFamily: FONT,
          fontSize: '14px',
          fontWeight: 400,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
        }}
      />
      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
          style={{
            borderRadius: '24px',
            border: '1.5px solid #E5E5E5',
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 600,
          }}
          onClick={onCancel}
          disabled={isSaving}
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
          style={{
            borderRadius: '24px',
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 600,
            opacity: canSave ? 1 : 0.5,
            cursor: canSave ? 'pointer' : 'not-allowed',
          }}
        >
          {isSaving ? (
            <Spinner size="sm" className="inline-flex text-white" />
          ) : (
            t('common.save')
          )}
        </button>
      </div>
    </>
  );
};

// --- 지역 목록 (select | edit) ---
interface LocationListContentProps {
  mode: 'select' | 'edit';
  locations: HomeLocationOption[];
  selectedLocation: HomeLocationOption | null;
  editingId: string | null;
  editAlias: string;
  isUpdatingAlias: boolean;
  isMutating: boolean;
  headerAction: { label: string; onClick: () => void };
  onEditAliasChange: (value: string) => void;
  onSelectLocation: (loc: HomeLocationOption) => void;
  onEditLocation: (loc: HomeLocationOption) => void;
  onUpdateAlias: () => void;
  onRequestDelete: (id: string) => void;
  onAddNewLocation: () => void;
}

export const LocationListContent = ({
  mode,
  locations,
  selectedLocation,
  editingId,
  editAlias,
  isUpdatingAlias,
  isMutating,
  headerAction,
  onEditAliasChange,
  onSelectLocation,
  onEditLocation,
  onUpdateAlias,
  onRequestDelete,
  onAddNewLocation,
}: LocationListContentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="text-black mb-4"
        style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 600 }}
      >
        {t('home.location')}
      </h2>
      <div className="flex items-center justify-between mb-6">
        <p
          className="text-[#555555]"
          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 400, lineHeight: '1.5' }}
        >
          {mode === 'edit' ? t('home.selectLocationToEdit') : t('home.selectLocation')}
        </p>
        <button
          className="text-[#555555] hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500 }}
          disabled={isMutating}
          onClick={headerAction.onClick}
        >
          {headerAction.label}
        </button>
      </div>
      <div
        className={`space-y-2 mb-6 ${isMutating ? 'pointer-events-none opacity-50' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {locations.map((loc) => (
          <div key={loc.alias}>
            <LocationItem
              loc={loc}
              mode={mode}
              editingId={editingId}
              editAlias={editAlias}
              isUpdatingAlias={isUpdatingAlias}
              selectedLocation={selectedLocation}
              onEditAliasChange={onEditAliasChange}
              onSelect={onSelectLocation}
              onEdit={onEditLocation}
              onUpdateAlias={onUpdateAlias}
              onRequestDelete={onRequestDelete}
            />
          </div>
        ))}
      </div>
      {mode === 'select' && (
        <button
          className="w-full bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: '24px', fontFamily: FONT, fontSize: '14px', fontWeight: 600 }}
          disabled={isMutating}
          onClick={onAddNewLocation}
        >
          {t('home.addNewLocation')}
        </button>
      )}
    </>
  );
};

// --- 지역 항목 ---
interface LocationItemProps {
  loc: HomeLocationOption;
  mode: 'select' | 'edit';
  editingId: string | null;
  editAlias: string;
  isUpdatingAlias: boolean;
  selectedLocation: HomeLocationOption | null;
  onEditAliasChange: (value: string) => void;
  onSelect: (loc: HomeLocationOption) => void;
  onEdit: (loc: HomeLocationOption) => void;
  onUpdateAlias: () => void;
  onRequestDelete: (id: string) => void;
}

const LocationItem = ({
  loc,
  mode,
  editingId,
  editAlias,
  isUpdatingAlias,
  selectedLocation,
  onEditAliasChange,
  onSelect,
  onEdit,
  onUpdateAlias,
  onRequestDelete,
}: LocationItemProps) => {
  const { t } = useTranslation();
  if (mode === 'edit') {
    if (loc.isDefault) {
      return (
        <button
          className="w-full flex items-center gap-2 px-4 py-3 pointer-events-none"
          style={{ borderRadius: '16px', border: '1.5px solid #E5E5E5' }}
        >
          <MapPin size={16} color="#ccc" strokeWidth={1.5} />
          <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500, color: '#ccc' }}>
            {loc.alias}
          </span>
        </button>
      );
    }

    if (editingId === loc.id) {
      const canUpdateAlias = Boolean(editAlias.trim() && editAlias.trim() !== loc.alias);
      const canSubmit = canUpdateAlias && !isUpdatingAlias;

      return (
        <div
          className="w-full flex items-center gap-2 px-4 py-3"
          style={{ borderRadius: '16px', border: '1.5px solid #000' }}
        >
          <input
            type="text"
            value={editAlias}
            onChange={(e) => onEditAliasChange(e.target.value)}
            className="flex-1 outline-none text-black"
            style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500 }}
            disabled={isUpdatingAlias}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) onUpdateAlias();
            }}
            autoFocus
          />
          <button
            disabled={!canSubmit}
            className="inline-flex items-center justify-center w-5 h-5 hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={onUpdateAlias}
            aria-label={t('common.confirm')}
          >
            {isUpdatingAlias ? (
              <Spinner size="sm" className="inline-flex text-[#555555]" />
            ) : (
              <Check size={16} color="#555555" strokeWidth={1.5} />
            )}
          </button>
          <button
            className="hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isUpdatingAlias}
            onClick={() => onRequestDelete(loc.id!)}
            aria-label={t('common.delete')}
          >
            <Trash2 size={16} color="#ef4444" strokeWidth={1.5} />
          </button>
        </div>
      );
    } else {
      return (
        <button
          className="w-full flex items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
          style={{ borderRadius: '16px', border: '1.5px solid #E5E5E5' }}
          onClick={() => onEdit(loc)}
        >
          <MapPin size={16} color="#555555" strokeWidth={1.5} />
          <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500, color: '#000' }}>
            {loc.alias}
          </span>
        </button>
      );
    }
  }

  return (
    <button
      className="w-full flex items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
      style={{
        borderRadius: '16px',
        border: selectedLocation?.alias === loc.alias ? '1.5px solid #000' : '1.5px solid #E5E5E5',
      }}
      onClick={() => onSelect(loc)}
    >
      <MapPin size={16} color="#555555" strokeWidth={1.5} />
      <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 500, color: '#000' }}>
        {loc.alias}
      </span>
    </button>
  );
};
