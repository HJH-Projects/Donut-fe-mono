import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';
import type { ClothingItem } from './clothing.types';

export const CATEGORY_GROUP_MAP: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

export const CATEGORY_REVERSE_MAP: Record<string, ClothesListItemResponseDto['category']> = {
  상의: 'TOP',
  하의: 'BOTTOM',
  아우터: 'OUTER',
  '드레스/스커트': 'DRESS_SKIRT',
  신발: 'SHOES',
  악세사리: 'ACCESSORY',
};

export const EMPTY_CLOTHING_FORM: Partial<ClothingItem> = {
  name: '',
  category1: '상의',
  category2: '',
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
});
