import { useTranslation } from 'react-i18next';
import { MapPin, Check, Trash2 } from 'lucide-react';
import type { HomeLocationOption } from './home.types';

const FONT = "var(--font-inter), 'Inter', sans-serif";

// --- 삭제 확인 ---
interface ConfirmDeleteContentProps {
  deletingAlias: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteContent = ({
  deletingAlias,
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
          className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
          style={{
            borderRadius: '24px',
            border: '1.5px solid #E5E5E5',
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 600,
          }}
          onClick={onCancel}
        >
          {t('common.cancel')}
        </button>
        <button
          className="flex-1 bg-red-500 text-white px-4 py-3 hover:opacity-90 transition-opacity"
          style={{ borderRadius: '24px', fontFamily: FONT, fontSize: '14px', fontWeight: 600 }}
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
  onAliasChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const AddLocationContent = ({
  alias,
  onAliasChange,
  onSave,
  onCancel,
}: AddLocationContentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="text-black mb-4"
        style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 600 }}
      >
        {t('home.addCurrentLocation')}
      </h2>
      <p
        className="text-[#555555] mb-6"
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
          if (e.key === 'Enter') onSave();
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
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
          style={{ borderRadius: '24px', fontFamily: FONT, fontSize: '14px', fontWeight: 600 }}
        >
          {t('common.save')}
        </button>
      </div>
    </>
  );
};

// --- 지역 목록 (select | edit) ---
interface LocationListContentProps {
  mode: 'select' | 'edit';
  locations: HomeLocationOption[];
  selectedLocation: string;
  editingId: string | null;
  editAlias: string;
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
          className="text-[#555555] hover:opacity-70 transition-opacity"
          style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500 }}
          onClick={headerAction.onClick}
        >
          {headerAction.label}
        </button>
      </div>
      <div className="space-y-2 mb-6" onClick={(e) => e.stopPropagation()}>
        {locations.map((loc) => (
          <div key={loc.locationId}>
            <LocationItem
              loc={loc}
              mode={mode}
              editingId={editingId}
              editAlias={editAlias}
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
          className="w-full bg-black text-white px-4 py-3 hover:opacity-90 transition-opacity"
          style={{ borderRadius: '24px', fontFamily: FONT, fontSize: '14px', fontWeight: 600 }}
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
  selectedLocation: string;
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
  selectedLocation,
  onEditAliasChange,
  onSelect,
  onEdit,
  onUpdateAlias,
  onRequestDelete,
}: LocationItemProps) => {
  if (mode === 'edit') {
    if (!loc.id) {
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') onUpdateAlias();
            }}
            autoFocus
          />
          <button
            className="hover:opacity-70 transition-opacity"
            onClick={onUpdateAlias}
            aria-label="확인"
          >
            <Check size={16} color="#555555" strokeWidth={1.5} />
          </button>
          <button
            className="hover:opacity-70 transition-opacity"
            onClick={() => onRequestDelete(loc.id!)}
            aria-label="삭제"
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
        border: selectedLocation === loc.alias ? '1.5px solid #000' : '1.5px solid #E5E5E5',
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
