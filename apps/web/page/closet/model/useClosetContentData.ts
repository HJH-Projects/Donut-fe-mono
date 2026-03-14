'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteClothesApi,
  deleteClothesFavoriteApi,
  getClothesApi,
  getClothesDetailApi,
  patchClothesApi,
  postClothesApi,
  postClothesEnrichApi,
  postClothesFavoriteApi,
  postClothesImagePreviewApi,
} from '@/shared/api/endpointTags/clothes';
import { invalidateClothes } from '@/shared/api/invalidations/clothes';
import { clientKy } from '@/features/api/clientKy';
import { toApiError } from '@/shared/api/error';
import type {
  CreateClothesDtoColorItem,
  CreateClothesDtoMaterialItem,
  CreateClothesDtoSeasonItem,
  CreateClothesDtoSize,
  CreateClothesDtoSubCategory,
  UpdateClothesDtoColorItem,
  UpdateClothesDtoMaterialItem,
  UpdateClothesDtoSeasonItem,
  UpdateClothesDtoSize,
  UpdateClothesDtoSubCategory,
} from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import { mapDetailToClothingItem, mapEnrichToForm } from '../ui/closet.mapper';
import { SUBCATEGORY_TO_API } from '../ui/closet.constants';
import {
  CATEGORY_REVERSE_MAP,
  EMPTY_CLOTHING_FORM,
  dtoToClothingItem,
  isClosetMainCategory,
} from './closetContent.primitives';
import {
  closeGlobalDialog,
  openGlobalDialog,
} from '@/shared/model/globalDialogStore';
import type {
  ClothingItem,
  UseClosetContentDataOptions,
} from './clothing.types';

export function useClosetContentData({
  initialClothes,
  selectedCategory,
  showFavoriteOnly,
}: UseClosetContentDataOptions) {
  const router = useRouter();
  const toast = useToast();

  // 1) 데이터 소스(옷 CRUD/즐겨찾기)
  const initialMappedClothes = useMemo(
    () => initialClothes.map(dtoToClothingItem),
    [initialClothes],
  );
  const needsClientFetch = initialMappedClothes.length === 0;
  const [fetchedClothes, setFetchedClothes] = useState<ClothingItem[] | null>(null);
  const [hasBootstrappedFetch, setHasBootstrappedFetch] = useState(false);
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const baseClothes = needsClientFetch
    ? (fetchedClothes ?? initialMappedClothes)
    : initialMappedClothes;
  const activeFavoriteOverrides = useMemo(() => {
    const next: Record<string, boolean> = {};
    for (const [id, optimisticValue] of Object.entries(favoriteOverrides)) {
      const serverItem = baseClothes.find((item) => item.id === id);
      if (serverItem && serverItem.isFavorite !== optimisticValue) {
        next[id] = optimisticValue;
      }
    }
    return next;
  }, [baseClothes, favoriteOverrides]);

  const clothes = useMemo(
    () =>
      baseClothes.map((item) => {
        const nextFavorite = activeFavoriteOverrides[item.id];
        return nextFavorite === undefined ? item : { ...item, isFavorite: nextFavorite };
      }),
    [activeFavoriteOverrides, baseClothes],
  );

  useEffect(() => {
    if (!needsClientFetch || hasBootstrappedFetch) return;

    getClothesApi(clientKy)
      .then((items) => {
        setFetchedClothes(items.map(dtoToClothingItem));
      })
      .catch(async (e) => {
        toast.apiError(await toApiError(e), '옷 목록을 불러오는 데 실패했습니다.');
      })
      .finally(() => setHasBootstrappedFetch(true));
  }, [needsClientFetch, hasBootstrappedFetch, toast]);

  const runClothesMutation = useCallback(
    async (action: () => Promise<unknown>, errorMessage: string) => {
      try {
        await action();
        await invalidateClothes();
        router.refresh();
      } catch (e) {
        toast.apiError(await toApiError(e), errorMessage);
        throw e;
      }
    },
    [router, toast],
  );

  const toApiCategory = (category1: string) =>
    isClosetMainCategory(category1) ? CATEGORY_REVERSE_MAP[category1] : 'TOP';

  const addClothing = async (item: ClothingItem, uploadDraftId: string) => {
    await runClothesMutation(
      () =>
        postClothesApi(clientKy, {
          title: item.name,
          category: toApiCategory(item.category1),
          color: item.color.length ? (item.color as CreateClothesDtoColorItem[]) : undefined,
          draftId: uploadDraftId,
          subCategory: (SUBCATEGORY_TO_API[item.subCategory] as CreateClothesDtoSubCategory) || undefined,
          season: item.season.length ? (item.season as CreateClothesDtoSeasonItem[]) : undefined,
          brand: item.brand || undefined,
          size: (item.size as CreateClothesDtoSize) || undefined,
          material: item.material ? [item.material as CreateClothesDtoMaterialItem] : undefined,
          memo: item.memo || undefined,
        }),
      '옷을 추가하는 데 실패했습니다.',
    );
  };

  const updateClothing = async (item: ClothingItem) => {
    await runClothesMutation(
      () =>
        patchClothesApi(clientKy, item.id, {
          title: item.name,
          category: toApiCategory(item.category1),
          color: item.color.length ? (item.color as UpdateClothesDtoColorItem[]) : undefined,
          subCategory: (SUBCATEGORY_TO_API[item.subCategory] as UpdateClothesDtoSubCategory) || undefined,
          season: item.season.length ? (item.season as UpdateClothesDtoSeasonItem[]) : undefined,
          brand: item.brand || undefined,
          size: (item.size as UpdateClothesDtoSize) || undefined,
          material: item.material ? [item.material as UpdateClothesDtoMaterialItem] : undefined,
          memo: item.memo || undefined,
        }),
      '옷 정보를 수정하는 데 실패했습니다.',
    );
  };

  const removeClothing = async (id: string) => {
    await runClothesMutation(() => deleteClothesApi(clientKy, id), '옷을 삭제하는 데 실패했습니다.');
  };

  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const toggleFavorite = useCallback(
    async (id: string, isFavorite: boolean) => {
      const nextFavorite = !isFavorite;
      setFavoriteOverrides((prev) => ({ ...prev, [id]: nextFavorite }));
      setSelectedItem((prev) => (prev && prev.id === id ? { ...prev, isFavorite: nextFavorite } : prev));

      try {
        await runClothesMutation(
          () =>
            isFavorite
              ? deleteClothesFavoriteApi(clientKy, id)
              : postClothesFavoriteApi(clientKy, id),
          '즐겨찾기 처리에 실패했습니다.',
        );
      } catch {
        setFavoriteOverrides((prev) => ({ ...prev, [id]: isFavorite }));
        setSelectedItem((prev) => (prev && prev.id === id ? { ...prev, isFavorite } : prev));
      }
    },
    [runClothesMutation],
  );

  // 2) 그리드 섹션에서 사용하는 상태/핸들러
  const filteredClothes =
    selectedCategory === '전체'
      ? clothes
      : clothes.filter((item) => item.category1 === selectedCategory);
  const displayedClothes = showFavoriteOnly
    ? filteredClothes.filter((item) => item.isFavorite)
    : filteredClothes;

  // 3) 다이얼로그 섹션에서 사용하는 상태
  const [isProcessing, setIsProcessing] = useState(false);
  const [newClothing, setNewClothing] = useState<Partial<ClothingItem>>(EMPTY_CLOTHING_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadFileRef = useRef<File | null>(null);
  const [hasPendingFile, setHasPendingFile] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [bgPreviewUrl, setBgPreviewUrl] = useState<string | null>(null);

  const resetAddFormState = () => {
    setIsProcessing(false);
    pendingUploadFileRef.current = null;
    setHasPendingFile(false);
    setDraftId(null);
    setBgPreviewUrl(null);
    setNewClothing(EMPTY_CLOTHING_FORM);
  };

  const runPreviewAndEnrich = useCallback(
    async (file: File, options?: { revokeObjectUrl?: string }) => {
      try {
        const { draftId: newDraftId, previewUrl } = await postClothesImagePreviewApi(clientKy, file);
        if (options?.revokeObjectUrl) {
          URL.revokeObjectURL(options.revokeObjectUrl);
        }
        setDraftId(newDraftId);
        setBgPreviewUrl(previewUrl);
        setNewClothing((prev) => ({ ...prev, imageUrl: previewUrl }));

        try {
          const result = await postClothesEnrichApi(clientKy, { imageUrl: previewUrl });
          if (!result.success || !result.data) return;
          setNewClothing((prev) => mapEnrichToForm(result.data, prev));
        } catch {}
      } catch (error) {
        toast.apiError(await toApiError(error), '배경 제거에 실패했습니다. 다시 시도해주세요.');
        throw error;
      }
    },
    [toast],
  );

  // 4) 다이얼로그 이벤트 핸들러
  const handleItemClick = useCallback(
    async (item: ClothingItem) => {
      setSelectedItem(item);
      openGlobalDialog('closet:detail');
      setEditMode(false);
      setIsEditingImage(false);
    },
    [setEditMode, setIsEditingImage, setSelectedItem],
  );

  const loadSelectedItemDetail = useCallback(async (itemId: string) => {
    try {
      const detail = await getClothesDetailApi(clientKy, itemId);
      setSelectedItem((prev) => {
        if (!prev || prev.id !== itemId) return prev;
        return mapDetailToClothingItem(detail, prev);
      });
    } catch {
      // 상세 조회 실패 시 목록 카드 데이터 유지
    }
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    pendingUploadFileRef.current = file;
    setHasPendingFile(true);
    setDraftId(null);
    setBgPreviewUrl(null);

    if (isEditingImage && selectedItem) {
      setIsProcessing(true);
      setSelectedItem((prev) => (prev ? { ...prev, imageUrl: blobUrl } : prev));

      postClothesImagePreviewApi(clientKy, file)
        .then(({ previewUrl }) => {
          URL.revokeObjectURL(blobUrl);
          setSelectedItem((prev) => (prev ? { ...prev, imageUrl: previewUrl } : prev));
        })
        .catch(() => {
          // blob URL 유지
        })
        .finally(() => {
          setIsProcessing(false);
          resetAddFormState();
          closeGlobalDialog();
        });
      return;
    }

    setNewClothing((prev) => ({ ...prev, imageUrl: blobUrl }));
    openGlobalDialog('closet:addForm');
    setIsProcessing(true);

    runPreviewAndEnrich(file, { revokeObjectUrl: blobUrl })
      .catch(() => {})
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleRefreshBgRemoval = () => {
    const file = pendingUploadFileRef.current;
    if (!file) return;

    setIsProcessing(true);
    setDraftId(null);

    runPreviewAndEnrich(file)
      .catch(() => {})
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleAddClothing = async () => {
    if (!newClothing.name || !newClothing.category1 || !draftId) return;

    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name: newClothing.name || '',
      category1: newClothing.category1 || '상의',
      subCategory: newClothing.subCategory || '',
      season: newClothing.season || [],
      color: newClothing.color || [],
      brand: newClothing.brand || '',
      material: newClothing.material || '',
      size: newClothing.size || '',
      memo: newClothing.memo || '',
      imageUrl: bgPreviewUrl || newClothing.imageUrl || '',
      isFavorite: false,
    };

    try {
      await addClothing(newItem, draftId);
      resetAddFormState();
      closeGlobalDialog();
    } catch {
      // addClothing 내부에서 toast 처리
    }
  };

  const handleUpdateClothing = async () => {
    if (!selectedItem) return;

    try {
      await updateClothing(selectedItem);
      closeGlobalDialog();
      setSelectedItem(null);
      setEditMode(false);
    } catch {
      // updateClothing 내부에서 toast 처리
    }
  };

  const handleDeleteClick = () => openGlobalDialog('closet:deleteConfirm');

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      await removeClothing(selectedItem.id);
      closeGlobalDialog();
      setSelectedItem(null);
    } catch {
      // removeClothing 내부에서 toast 처리
    }
  };

  const handleCancelAdd = () => {
    resetAddFormState();
    closeGlobalDialog();
  };

  const handleCancelDetail = () => {
    closeGlobalDialog();
    setSelectedItem(null);
    setEditMode(false);
    setIsEditingImage(false);
  };

  const handleStartImageEdit = () => {
    if (!selectedItem) return;
    setIsEditingImage(true);
    setNewClothing({
      name: selectedItem.name,
      category1: selectedItem.category1,
      subCategory: selectedItem.subCategory,
      season: selectedItem.season,
      color: selectedItem.color,
      brand: selectedItem.brand,
      material: selectedItem.material,
      size: selectedItem.size,
      memo: selectedItem.memo,
      imageUrl: '',
      isFavorite: selectedItem.isFavorite,
    });
    openGlobalDialog('closet:addMethod');
  };

  const openAddMethodDialog = () => {
    openGlobalDialog('closet:addMethod');
  };

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter((v) => v !== value);
    }
    return [...array, value];
  };

  // 5) 섹션별 조립 결과
  return {
    // 데이터
    clothes,
    displayedClothes,

    // 그리드
    toggleFavorite,

    // 다이얼로그
    openAddMethodDialog,
    loadSelectedItemDetail,
    selectedItem,
    setSelectedItem,
    editMode,
    setEditMode,
    isProcessing,
    newClothing,
    setNewClothing,
    fileInputRef,
    cameraInputRef,
    hasPendingFile,
    draftId,
    handleItemClick,
    handleImageUpload,
    handleRefreshBgRemoval,
    handleAddClothing,
    handleUpdateClothing,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCancelAdd,
    handleCancelDetail,
    handleStartImageEdit,
    toggleArrayValue,
  };
}
