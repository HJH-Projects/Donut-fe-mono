import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';
import { SUBCATEGORY_FROM_API } from '../ui/closet.constants';
import type { ClothingItem } from './clothing.types';

type ApiCategory = ClothesListItemResponseDto['category'];
export type ClosetMainCategory =
  | '상의'
  | '하의'
  | '아우터'
  | '드레스/스커트'
  | '신발'
  | '악세사리';

export const CATEGORY_GROUP_MAP: Record<ApiCategory, ClosetMainCategory> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

export const CATEGORY_REVERSE_MAP: Record<ClosetMainCategory, ApiCategory> = {
  상의: 'TOP',
  하의: 'BOTTOM',
  아우터: 'OUTER',
  '드레스/스커트': 'DRESS_SKIRT',
  신발: 'SHOES',
  악세사리: 'ACCESSORY',
};

export function isClosetMainCategory(value: string): value is ClosetMainCategory {
  return value in CATEGORY_REVERSE_MAP;
}

export const EMPTY_CLOTHING_FORM: Partial<ClothingItem> = {
  name: '',
  category1: '상의',
  subCategory: '',
  season: [],
  color: [],
  brand: '',
  material: '',
  size: '',
  memo: '',
  imageUrl: '',
  isFavorite: false,
};

export const dtoToClothingItem = (item: ClothesListItemResponseDto): ClothingItem => ({
  id: item.id,
  name: item.alias,
  category1: CATEGORY_GROUP_MAP[item.category],
  subCategory: item.subCategory ? SUBCATEGORY_FROM_API[item.subCategory] ?? '' : '',
  season: [],
  color: [],
  brand: '',
  material: '',
  size: '',
  memo: '',
  imageUrl: item.cardImage?.webpUrl ?? '',
  isFavorite: item.isLiked,
});
