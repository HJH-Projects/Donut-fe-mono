'use client';

import type { TFunction } from 'i18next';
import {
  type ClothesListItemResponseDtoCategory,
  ClothesListItemResponseDtoSubCategory as ClothesListItemResponseDtoSubCategoryEnum,
  type ClothesListItemResponseDtoSubCategory,
} from '@/shared/model/orvalSchemas';

type DtoCategoryLabelKey = Lowercase<ClothesListItemResponseDtoCategory>;
type ClosetCategoryLabelKey = 'all' | DtoCategoryLabelKey;

type ClosetCategoryDisplayValue =
  | '전체'
  | '상의'
  | '하의'
  | '아우터'
  | '드레스/스커트'
  | '신발'
  | '악세사리'
  | '액세서리';

const CATEGORY_LABEL_KEY_MAP: Record<ClosetCategoryDisplayValue, ClosetCategoryLabelKey> = {
  전체: 'all',
  상의: 'top',
  하의: 'bottom',
  아우터: 'outer',
  '드레스/스커트': 'dress_skirt',
  신발: 'shoes',
  악세사리: 'accessory',
  액세서리: 'accessory',
};

export function getCategoryLabel(category: string, t: TFunction): string {
  const key = CATEGORY_LABEL_KEY_MAP[category as ClosetCategoryDisplayValue];
  if (!key) return category;
  return t(`closet.categoryLabels.${key}`, { defaultValue: category });
}

type ClothesSubCategory = Exclude<ClothesListItemResponseDtoSubCategory, null>;
export const SUBCATEGORY_LABEL_KEY_BY_VALUE = Object.fromEntries(
  Object.values(ClothesListItemResponseDtoSubCategoryEnum).map((code) => [
    code,
    code.toLowerCase(),
  ]),
) as Record<ClothesSubCategory, string>;

export function toSubCategoryLabelKey(value: string): string {
  return SUBCATEGORY_LABEL_KEY_BY_VALUE[value as ClothesSubCategory] ?? value.toLowerCase();
}

export function toOptionLabelKey(value: string): string {
  return value.toLowerCase();
}
