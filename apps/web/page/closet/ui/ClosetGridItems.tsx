'use client';

import type { ClothingItem } from '../model/clothing.types';
import { ClosetGridItemCard } from './ClosetGridItemCard';

type ClosetGridItemsProps = {
  items: ClothingItem[];
  noImageLabel: string;
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

export function ClosetGridItems({
  items,
  noImageLabel,
  onItemClick,
  onToggleFavorite,
}: ClosetGridItemsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <ClosetGridItemCard
          key={item.id}
          item={item}
          noImageLabel={noImageLabel}
          onItemClick={onItemClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
