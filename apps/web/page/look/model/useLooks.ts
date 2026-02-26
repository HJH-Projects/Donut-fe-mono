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
      imageUrl: item.clothes.imageUrl || '',
    })),
    isFavorite: false,
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

  const addLook = async (lookData: Partial<Look>) => {
    const newId = Date.now().toString();
    const newLook: Look = {
      id: newId,
      name: lookData.name || '',
      tags: lookData.tags || [],
      items: lookData.items || [],
      isFavorite: false,
    };
    setLooks((prev) => [...prev, newLook]);

    try {
      await postLooksApi(clientKy, {
        name: newLook.name,
        tags: newLook.tags.join(','),
        items: newLook.items.map((item, i) => ({ clothesId: item.id, sortOrder: i, role: 'ITEM' })),
      });
      await invalidateLooks();
      router.refresh();
    } catch {
      toast.error('룩을 추가하는 데 실패했습니다.');
    }
  };

  const editLook = async (lookId: string, lookData: Partial<Look>) => {
    const updatedFields = {
      name: lookData.name || '',
      tags: lookData.tags || [],
      items: lookData.items || [],
    };
    setLooks((prev) =>
      prev.map((look) =>
        look.id === lookId ? { ...look, ...updatedFields } : look,
      ),
    );

    try {
      await patchLooksApi(clientKy, lookId, {
        name: updatedFields.name,
        tags: updatedFields.tags.join(','),
        items: updatedFields.items.map((item, i) => ({ clothesId: item.id, sortOrder: i, role: 'ITEM' })),
      });
      await invalidateLooks();
      router.refresh();
    } catch {
      toast.error('룩을 수정하는 데 실패했습니다.');
    }
  };

  const removeLook = async (id: string) => {
    setLooks((prev) => prev.filter((look) => look.id !== id));

    try {
      await deleteLooksApi(clientKy, id);
      await invalidateLooks();
      router.refresh();
    } catch {
      toast.error('룩을 삭제하는 데 실패했습니다.');
    }
  };

  const toggleFavorite = (id: string) => {
    setLooks((prev) =>
      prev.map((look) =>
        look.id === id ? { ...look, isFavorite: !look.isFavorite } : look,
      ),
    );
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
