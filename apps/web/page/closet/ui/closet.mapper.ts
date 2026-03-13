import type { ClothesResponseDto, EnrichClothesResponseDtoData } from '@/shared/model/orvalSchemas';
import type { ClothingItem } from '../model/clothing.types';
import {
  CATEGORIES,
  CATEGORY_ALIASES,
  CATEGORY_FROM_API,
  COLORS,
  MATERIAL_CODES,
  SEASONS,
  SUBCATEGORY_FROM_API,
} from './closet.constants';

function toArray(value?: string[] | string): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function mapEnrichToForm(enrich: EnrichClothesResponseDtoData, prev: Partial<ClothingItem>) {
  const mappedCategory =
    CATEGORY_ALIASES[enrich.mainCategory as keyof typeof CATEGORY_ALIASES] ??
    prev.category1 ??
    '상의';
  const allowedSubCategories = Array.from(
    CATEGORIES[mappedCategory as keyof typeof CATEGORIES] ?? [],
  ) as string[];
  const mappedSubCategory = toArray(enrich.subCategory)
    .map((sub) => SUBCATEGORY_FROM_API[sub as keyof typeof SUBCATEGORY_FROM_API] ?? sub)
    .find((sub) => allowedSubCategories.includes(sub));
  const mappedColors = toArray(enrich.color)
    .filter((color) =>
      COLORS.some((option) => option.name === color as typeof option.name),
  );
  const mappedSeasons = toArray(enrich.season)
    .filter((season) =>
      SEASONS.includes(season as (typeof SEASONS)[number]),
  );
  const mappedMaterial = toArray(enrich.material)
    .find((material) => MATERIAL_CODES.includes(material as (typeof MATERIAL_CODES)[number]));

  return {
    ...prev,
    category1: mappedCategory,
    subCategory: mappedSubCategory ?? '',
    color: mappedColors,
    season: mappedSeasons,
    material: mappedMaterial ?? '',
  };
}

export function mapDetailToClothingItem(detail: ClothesResponseDto, fallback: ClothingItem): ClothingItem {
  return {
    ...fallback,
    name: detail.title,
    category1: CATEGORY_FROM_API[detail.category] ?? fallback.category1,
    subCategory: detail.subCategory ? SUBCATEGORY_FROM_API[detail.subCategory] ?? '' : '',
    season: (detail.season ?? []) as string[],
    color: (detail.color ?? []) as string[],
    brand: detail.brand ?? '',
    material: (detail.material?.[0] ?? '') as string,
    size: (detail.size ?? '') as string,
    memo: detail.memo ?? '',
    imageUrl:
      detail.imageVariants?.detail?.webpUrl ??
      detail.imageVariants?.detail?.jpegUrl ??
      detail.imageVariants?.card?.webpUrl ??
      detail.imageVariants?.card?.jpegUrl ??
      fallback.imageUrl,
  };
}
