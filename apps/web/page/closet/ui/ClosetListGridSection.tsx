'use client';

import { useTranslation } from 'react-i18next';
import type { ClothingItem } from '../model/clothing.types';
import { ClosetGridEmptyState } from './ClosetGridEmptyState';
import { ClosetGridItems } from './ClosetGridItems';

type ClosetListGridSectionProps = {
  clothes: ClothingItem[];
  displayedClothes: ClothingItem[];
  onAddClick: () => void;
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

export function ClosetListGridSection({
  clothes,
  displayedClothes,
  onAddClick,
  onItemClick,
  onToggleFavorite,
}: ClosetListGridSectionProps) {
  const { t } = useTranslation();
  const isCompletelyEmpty = clothes.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-24">
      {displayedClothes.length === 0 ? (
        <ClosetGridEmptyState
          isCompletelyEmpty={isCompletelyEmpty}
          onAddClick={onAddClick}
          addFirstLabel={t('closet.addFirst')}
          title={isCompletelyEmpty ? t('closet.emptyTitle') : t('closet.noResults')}
          description={
            isCompletelyEmpty ? t('closet.emptyDescription') : t('closet.noResultsDescription')
          }
        />
      ) : (
        <ClosetGridItems
          items={displayedClothes}
          noImageLabel={t('closet.noImage')}
          onItemClick={onItemClick}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}
