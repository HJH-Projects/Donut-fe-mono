'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { LookResponseDto } from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import {
  postLooksApi,
  getLooksApi,
  deleteLooksApi,
  patchLooksApi,
  postLooksFavoriteApi,
  deleteLooksFavoriteApi,
} from '@/shared/api/endpointTags/looks';
import { clientKy } from '@/features/api/clientKy';
import { toApiError, type ApiError } from '@/shared/api/error';
import { invalidateLooks } from '@/shared/api/invalidations/looks';

export type LookItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

export type Look = {
  id: string;
  name: string;
  tags: string[];
  items: LookItem[];
  isFavorite: boolean;
};

function dtoToLook(look: LookResponseDto): Look {
  return {
    id: look.id,
    name: look.name,
    tags: look.tags ? look.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    items: (look.items || []).map((item) => ({
      id: item.clothes.id || item.clothesId,
      name: item.clothes.title || '',
      category: item.clothes.category || '',
      imageUrl: '',
    })),
    isFavorite: look.isLiked,
  };
}

interface UseLooksOptions {
  initialLooks?: LookResponseDto[];
  skipBootstrap?: boolean;
}

export function useLooks({ initialLooks = [], skipBootstrap = false }: UseLooksOptions = {}) {
  const router = useRouter();
  const toast = useToast();

  const [looks, setLooks] = useState<Look[]>(() => initialLooks.map(dtoToLook));
  const [isBootstrapped, setIsBootstrapped] = useState(
    initialLooks.length > 0 || skipBootstrap,
  );
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (isBootstrapped) return;

    getLooksApi(clientKy)
      .then((items) => {
        setLooks(items.map(dtoToLook));
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setIsBootstrapped(true));
  }, [isBootstrapped]);

  useEffect(() => {
    setLooks(initialLooks.map(dtoToLook));
    setIsBootstrapped(initialLooks.length > 0 || skipBootstrap);
  }, [initialLooks, skipBootstrap]);

  const addLook = async (lookData: Partial<Look>) => {
    try {
      await postLooksApi(clientKy, {
        name: lookData.name || '',
        tags: (lookData.tags || []).join(','),
        items: (lookData.items || []).map((item, i) => ({
          clothesId: item.id,
          sortOrder: i,
          role: 'ITEM',
        })),
      });
      await invalidateLooks();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '룩을 추가하는 데 실패했습니다.');
      throw e;
    }
  };

  const editLook = async (lookId: string, lookData: Partial<Look>) => {
    const updatedFields = {
      name: lookData.name || '',
      tags: lookData.tags || [],
      items: lookData.items || [],
    };

    try {
      await patchLooksApi(clientKy, lookId, {
        name: updatedFields.name,
        tags: updatedFields.tags.join(','),
        items: updatedFields.items.map((item, i) => ({ clothesId: item.id, sortOrder: i, role: 'ITEM' })),
      });
      await invalidateLooks();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '룩을 수정하는 데 실패했습니다.');
      throw e;
    }
  };

  const removeLook = async (id: string) => {
    try {
      await deleteLooksApi(clientKy, id);
      await invalidateLooks();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '룩을 삭제하는 데 실패했습니다.');
      throw e;
    }
  };

  const toggleFavorite = async (id: string) => {
    const target = looks.find((look) => look.id === id);
    if (!target) return;
    const previous = target.isFavorite;

    setLooks((prev) =>
      prev.map((look) =>
        look.id === id ? { ...look, isFavorite: !previous } : look,
      ),
    );

    try {
      const response = previous
        ? await deleteLooksFavoriteApi(clientKy, id)
        : await postLooksFavoriteApi(clientKy, id);

      setLooks((prev) =>
        prev.map((look) =>
          look.id === id ? { ...look, isFavorite: response.isLiked } : look,
        ),
      );
      await invalidateLooks();
    } catch (e) {
      setLooks((prev) =>
        prev.map((look) =>
          look.id === id ? { ...look, isFavorite: previous } : look,
        ),
      );
      toast.apiError(await toApiError(e), '룩 좋아요 처리에 실패했습니다.');
    }
  };

  return {
    looks,
    isBootstrapped,
    error,
    addLook,
    editLook,
    removeLook,
    toggleFavorite,
  };
}
