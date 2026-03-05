'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type {
  ClothesListItemResponseDto,
  CreateClothesDtoColorItem,
  CreateClothesDtoSeasonItem,
  CreateClothesDtoSize,
  CreateClothesDtoMaterialItem,
  CreateClothesDtoSubCategory,
  UpdateClothesDtoColorItem,
  UpdateClothesDtoSeasonItem,
  UpdateClothesDtoSize,
  UpdateClothesDtoMaterialItem,
  UpdateClothesDtoSubCategory,
} from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import {
  postClothesApi,
  getClothesApi,
  patchClothesApi,
  deleteClothesApi,
  postClothesFavoriteApi,
  deleteClothesFavoriteApi,
} from '@/shared/api/endpointTags/clothes';
import { clientKy } from '@/features/api/clientKy';
import { toApiError, type ApiError } from '@/shared/api/error';
import { invalidateClothes } from '@/shared/api/invalidations/clothes';

export type ClothingItem = {
  id: string;
  name: string;
  category1: string;
  category2: string;
  season: string[];
  color: string[];
  brand: string;
  material: string;
  size: string;
  memo: string;
  imageUrl: string;
  isFavorite: boolean;
};

const CATEGORY_GROUP_MAP: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

const CATEGORY_REVERSE_MAP: Record<string, ClothesListItemResponseDto['category']> = {
  '상의': 'TOP',
  '하의': 'BOTTOM',
  '아우터': 'OUTER',
  '드레스/스커트': 'DRESS_SKIRT',
  '신발': 'SHOES',
  '악세사리': 'ACCESSORY',
};

function dtoToClothingItem(item: ClothesListItemResponseDto): ClothingItem {
  return {
    id: item.id,
    name: item.alias,
    category1: CATEGORY_GROUP_MAP[item.category] || '전체',
    category2: '',
    season: [],
    color: [],
    brand: '',
    material: '',
    size: '',
    memo: '',
    imageUrl: item.cardImage?.webpUrl ?? '',
    isFavorite: item.isLiked,
  };
}

interface UseClothesOptions {
  initialClothes?: ClothesListItemResponseDto[];
}

export function useClothes({ initialClothes = [] }: UseClothesOptions = {}) {
  const router = useRouter();
  const toast = useToast();

  const initialMappedClothes = useMemo(
    () => initialClothes.map(dtoToClothingItem),
    [initialClothes],
  );
  const needsClientFetch = initialMappedClothes.length === 0;
  const [fetchedClothes, setFetchedClothes] = useState<ClothingItem[] | null>(null);
  const [hasBootstrappedFetch, setHasBootstrappedFetch] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clothes = needsClientFetch
    ? (fetchedClothes ?? initialMappedClothes)
    : initialMappedClothes;
  const isBootstrapped = !needsClientFetch || hasBootstrappedFetch;

  useEffect(() => {
    if (!needsClientFetch || hasBootstrappedFetch) return;

    getClothesApi(clientKy)
      .then((items) => {
        setFetchedClothes(items.map(dtoToClothingItem));
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setHasBootstrappedFetch(true));
  }, [needsClientFetch, hasBootstrappedFetch]);

  const addClothing = async (item: ClothingItem, draftId: string) => {
    try {
      await postClothesApi(clientKy, {
        title: item.name,
        category: CATEGORY_REVERSE_MAP[item.category1] || 'TOP',
        color: item.color.length ? (item.color as CreateClothesDtoColorItem[]) : undefined,
        draftId,
        subCategory: (item.category2 as CreateClothesDtoSubCategory) || undefined,
        season: item.season.length ? (item.season as CreateClothesDtoSeasonItem[]) : undefined,
        brand: item.brand || undefined,
        size: (item.size as CreateClothesDtoSize) || undefined,
        material: item.material ? [item.material as CreateClothesDtoMaterialItem] : undefined,
        memo: item.memo || undefined,
      });
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷을 추가하는 데 실패했습니다.');
      throw e;
    }
  };

  const updateClothing = async (item: ClothingItem) => {
    try {
      await patchClothesApi(clientKy, item.id, {
        title: item.name,
        category: CATEGORY_REVERSE_MAP[item.category1] || 'TOP',
        color: item.color.length ? (item.color as UpdateClothesDtoColorItem[]) : undefined,
        subCategory: (item.category2 as UpdateClothesDtoSubCategory) || undefined,
        season: item.season.length ? (item.season as UpdateClothesDtoSeasonItem[]) : undefined,
        brand: item.brand || undefined,
        size: (item.size as UpdateClothesDtoSize) || undefined,
        material: item.material ? [item.material as UpdateClothesDtoMaterialItem] : undefined,
        memo: item.memo || undefined,
      });
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷 정보를 수정하는 데 실패했습니다.');
      throw e;
    }
  };

  const removeClothing = async (id: string) => {
    try {
      await deleteClothesApi(clientKy, id);
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷을 삭제하는 데 실패했습니다.');
      throw e;
    }
  };

  const toggleFavorite = async (id: string) => {
    const item = clothes.find((c) => c.id === id);
    if (!item) return;

    try {
      if (item.isFavorite) {
        await deleteClothesFavoriteApi(clientKy, id);
      } else {
        await postClothesFavoriteApi(clientKy, id);
      }
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '즐겨찾기 처리에 실패했습니다.');
    }
  };

  return {
    clothes,
    isBootstrapped,
    error,
    addClothing,
    updateClothing,
    removeClothing,
    toggleFavorite,
  };
}
