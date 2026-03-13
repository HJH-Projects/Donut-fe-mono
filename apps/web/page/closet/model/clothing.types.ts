import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';

export type ClothingItem = {
  id: string;
  name: string;
  category1: string;
  subCategory: string;
  season: string[];
  color: string[];
  brand: string;
  material: string;
  size: string;
  memo: string;
  imageUrl: string;
  isFavorite: boolean;
};

export type UseClosetContentDataOptions = {
  initialClothes: ClothesListItemResponseDto[];
  selectedCategory: string;
  showFavoriteOnly: boolean;
};
