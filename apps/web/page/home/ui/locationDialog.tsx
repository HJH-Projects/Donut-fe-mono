'use client';

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@base-ui/react/dialog';
import { Settings } from 'lucide-react';
import {
  postLocationsApi,
  patchLocationsApi,
  deleteLocationsApi,
} from '@/shared/api/endpointTags/locations';
import { clientKy } from '@/features/api/clientKy';
import { useAuthGuard } from '@/features/auth/useAuthGuard';
import { invalidateHomeLocations } from '@/shared/api/invalidations/homeLocations';
import { loadKakaoMapSdk } from '@/shared/lib/kakaoMapSdk';
import type { HomeLocationOption } from './home.types';
import {
  ConfirmDeleteContent,
  AddLocationContent,
  LocationListContent,
} from './locationDialogContent';

type DialogMode = 'select' | 'edit' | 'add' | 'confirmDelete';

const FONT = "var(--font-inter), 'Inter', sans-serif";

function dtoToLocationOption(dto: {
  id: string;
  alias: string;
  isDefault: boolean;
  location: { id: string; lat: number; lon: number };
}): HomeLocationOption {
  return {
    id: dto.id,
    locationId: dto.location.id,
    alias: dto.alias,
    lat: dto.location.lat,
    lon: dto.location.lon,
    isDefault: dto.isDefault,
  };
}

interface LocationDialogProps {
  locations: HomeLocationOption[];
  selectedLocation: HomeLocationOption | null;
  setSelectedLocation: Dispatch<SetStateAction<HomeLocationOption | null>>;
  onSelectLocation: (location: HomeLocationOption) => void;
  onLocationAliasUpdated: (prevAlias: string, nextAlias: string) => void;
  setLocations: Dispatch<SetStateAction<HomeLocationOption[]>>;
}

const LocationDialog = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  onSelectLocation,
  onLocationAliasUpdated,
  setLocations,
}: LocationDialogProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const checkAuth = useAuthGuard();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>('select');
  const [alias, setAlias] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlias, setEditAlias] = useState('');
  const [isUpdatingAlias, setIsUpdatingAlias] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isEnteringEdit, setIsEnteringEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const enterEditTimerRef = useRef<number | null>(null);

  const resetAll = () => {
    if (enterEditTimerRef.current) {
      window.clearTimeout(enterEditTimerRef.current);
      enterEditTimerRef.current = null;
    }
    setMode('select');
    setAlias('');
    setEditingId(null);
    setEditAlias('');
    setIsUpdatingAlias(false);
    setIsAddingLocation(false);
    setIsMutating(false);
    setIsEnteringEdit(false);
    setDeletingId(null);
  };

  const clearEditing = () => {
    if (enterEditTimerRef.current) {
      window.clearTimeout(enterEditTimerRef.current);
      enterEditTimerRef.current = null;
    }
    setEditingId(null);
    setEditAlias('');
    setIsUpdatingAlias(false);
    setIsAddingLocation(false);
    setIsEnteringEdit(false);
  };

  const handleEnterAdd = async () => {
    if (isMutating) return;
    const ok = await checkAuth();
    if (!ok) return;
    setMode('add');
  };

  const handleEnterEdit = async () => {
    if (isMutating) return;
    const ok = await checkAuth();
    if (!ok) return;
    setIsEnteringEdit(true);
    enterEditTimerRef.current = window.setTimeout(() => {
      setMode('edit');
      setIsEnteringEdit(false);
      enterEditTimerRef.current = null;
    }, 120);
  };

  const handleExitEdit = () => {
    setMode('select');
    clearEditing();
  };

  const handleSaveNewLocation = async (coords: { lat: number; lon: number; name: string }) => {
    if (!alias.trim() || isAddingLocation) return;
    const userAlias = alias.trim();
    setIsAddingLocation(true);
    setIsMutating(true);
    try {
      const created = await postLocationsApi(clientKy, {
        name: coords.name,
        lat: coords.lat,
        lon: coords.lon,
        timezone: 'Asia/Seoul',
        alias: userAlias,
        isDefault: false,
      });
      const newLoc = dtoToLocationOption(created);
      setLocations((prev) => [newLoc, ...prev]);
      await invalidateHomeLocations();
      router.refresh();
      setAlias('');
      setMode('select');
    } catch {
      /* 오프라인 또는 API 에러 시 무시 */
    } finally {
      setIsAddingLocation(false);
      setIsMutating(false);
    }
  };

  const handleEditLocation = (loc: HomeLocationOption) => {
    setEditingId(loc.id);
    setEditAlias(loc.alias);
  };

  const handleUpdateAlias = async () => {
    if (!editingId || !editAlias.trim()) return;
    const nextAlias = editAlias.trim();
    const current = locations.find((loc) => loc.id === editingId);
    if (!current || current.alias === nextAlias) return;

    setIsUpdatingAlias(true);
    setIsMutating(true);
    try {
      const updated = await patchLocationsApi(clientKy, editingId, {
        alias: nextAlias,
      });
      const updatedLoc = dtoToLocationOption(updated);
      setLocations((prev) => prev.map((loc) => (loc.id === editingId ? updatedLoc : loc)));
      if (selectedLocation?.id === editingId) setSelectedLocation(updatedLoc);
      onLocationAliasUpdated(current.alias, updatedLoc.alias);
      await invalidateHomeLocations();
      router.refresh();
      clearEditing();
    } catch {
      /* API 에러 시 무시 */
    } finally {
      setIsUpdatingAlias(false);
      setIsMutating(false);
    }
  };

  const handleRequestDelete = (id: string) => {
    setDeletingId(id);
    setMode('confirmDelete');
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsMutating(true);
    try {
      await deleteLocationsApi(clientKy, deletingId);
      const remaining = locations.filter((loc) => loc.id !== deletingId);
      setLocations(remaining);
      if (selectedLocation?.id === deletingId) {
        const systemDefault = remaining.find((loc) => loc.isDefault) ?? remaining[0] ?? null;
        if (systemDefault) {
          onSelectLocation(systemDefault);
        } else {
          setSelectedLocation(null);
        }
      }
      await invalidateHomeLocations();
      router.refresh();
      clearEditing();
    } catch {
      /* API 에러 시 무시 */
    } finally {
      setIsMutating(false);
    }
    setDeletingId(null);
    setMode('edit');
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
    setMode('edit');
  };

  const headerAction = () => {
    if (editingId) return { label: t('common.cancel'), onClick: clearEditing };
    if (mode === 'edit') return { label: t('home.editLocationsDone'), onClick: handleExitEdit };
    return { label: t('home.editLocations'), onClick: handleEnterEdit };
  };

  const renderContent = () => {
    if (mode === 'confirmDelete') {
      if (!deletingId) return undefined;
      return (
        <ConfirmDeleteContent
          deletingAlias={locations.find((l) => l.id === deletingId)?.alias ?? ''}
          isMutating={isMutating}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      );
    }

    if (mode === 'add') {
      return (
        <AddLocationContent
          alias={alias}
          isSaving={isAddingLocation}
          onAliasChange={setAlias}
          onSave={handleSaveNewLocation}
          onCancel={resetAll}
        />
      );
    }

    return (
      <LocationListContent
        mode={mode}
        locations={locations}
        selectedLocation={isEnteringEdit ? null : selectedLocation}
        editingId={editingId}
        editAlias={editAlias}
        isUpdatingAlias={isUpdatingAlias}
        isMutating={isMutating}
        headerAction={headerAction()}
        onEditAliasChange={setEditAlias}
        onSelectLocation={onSelectLocation}
        onEditLocation={handleEditLocation}
        onUpdateAlias={handleUpdateAlias}
        onRequestDelete={handleRequestDelete}
        onAddNewLocation={handleEnterAdd}
      />
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const runLoad = () => {
      if (cancelled) return;
      void loadKakaoMapSdk().catch(() => {
        // 다이얼로그 내부(AddLocationContent)에서 재시도/fallback 처리
      });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(() => {
        runLoad();
      }, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(runLoad, 250);
    }

    return () => {
      cancelled = true;
      if (idleId !== null) {
        idleWindow.cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        if (!nextOpen) resetAll();
      }}
    >
      <Dialog.Trigger
        className="mt-1 hover:opacity-70 transition-opacity"
        aria-label={t('home.locationSettingsAria')}
      >
        <Settings size={14} color="#555555" strokeWidth={1.5} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 z-50 w-[90%] max-w-[400px] max-h-[85vh] overflow-y-auto"
          style={{ borderRadius: '24px' }}
          onClick={() => {
            if (mode === 'edit' && editingId) clearEditing();
          }}
        >
          {renderContent()}
          <Dialog.Close
            className="absolute top-4 right-4 text-[#555555] hover:opacity-70 transition-opacity"
            aria-label={t('common.close')}
            style={{ fontFamily: FONT, fontSize: '24px' }}
          >
            ×
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LocationDialog;
