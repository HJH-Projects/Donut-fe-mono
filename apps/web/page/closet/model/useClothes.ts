'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ClothesResponseDto } from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import {
  postClothesApi,
  getClothesApi,
  patchClothesApi,
  deleteClothesApi,
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
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

const CATEGORY_REVERSE_MAP: Record<string, ClothesResponseDto['category']> = {
  '상의': 'TOP',
  '하의': 'BOTTOM',
  '아우터': 'OUTER',
  '신발': 'SHOES',
  '악세사리': 'ACCESSORY',
};

function dtoToClothingItem(item: ClothesResponseDto): ClothingItem {
  return {
    id: item.id,
    name: item.title,
    category1: CATEGORY_GROUP_MAP[item.category] || '전체',
    category2: '',
    season: [],
    color: [item.color],
    brand: '',
    material: '',
    size: '',
    memo: '',
    imageUrl: item.imageUrl,
    isFavorite: false,
  };
}

interface UseClothesOptions {
  initialClothes?: ClothesResponseDto[];
}

export function useClothes({ initialClothes = [] }: UseClothesOptions = {}) {
  const router = useRouter();
  const toast = useToast();

  const [clothes, setClothes] = useState<ClothingItem[]>(() =>
    initialClothes.map(dtoToClothingItem),
  );
  const [isBootstrapped, setIsBootstrapped] = useState(initialClothes.length > 0);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (isBootstrapped) return;

    getClothesApi(clientKy)
      .then((items) => {
        setClothes(items.map(dtoToClothingItem));
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setIsBootstrapped(true));
  }, [isBootstrapped]);

  const addClothing = async (item: ClothingItem, imageUrl: string) => {
    setClothes((prev) => [...prev, item]);

    try {
      await postClothesApi(clientKy, {
        title: item.name,
        category: CATEGORY_REVERSE_MAP[item.category1] || 'TOP',
        color: item.color[0] || '',
        imageUrl,
      });
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷을 추가하는 데 실패했습니다.');
    }
  };

  const updateClothing = async (item: ClothingItem) => {
    setClothes((prev) =>
      prev.map((c) => (c.id === item.id ? item : c)),
    );

    try {
      await patchClothesApi(clientKy, item.id, {
        title: item.name,
        category: CATEGORY_REVERSE_MAP[item.category1] || 'TOP',
        color: item.color[0] || '',
        imageUrl: item.imageUrl,
      });
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷 정보를 수정하는 데 실패했습니다.');
    }
  };

  const removeClothing = async (id: string) => {
    setClothes((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteClothesApi(clientKy, id);
      await invalidateClothes();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '옷을 삭제하는 데 실패했습니다.');
    }
  };

  const toggleFavorite = (id: string) => {
    setClothes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c,
      ),
    );
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
