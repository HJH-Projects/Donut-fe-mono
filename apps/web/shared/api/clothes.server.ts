import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { ClothesDetail, ClothesItem } from './clothes.types';
import { CACHE_TAGS } from './cache-tags';

export const getClothesServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('clothes').json<ClothesItem[]>();
    },
    ['clothes-list'],
    { tags: [CACHE_TAGS.CLOTHES], revalidate: 600 }
  )();
};

export const getClothesDetailServer = async (id: string) => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get(`clothes/${id}`).json<ClothesDetail>();
    },
    ['clothes-detail', id],
    { tags: [CACHE_TAGS.CLOTHES], revalidate: 1800 }
  )();
};
