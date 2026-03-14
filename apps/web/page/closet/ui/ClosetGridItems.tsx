'use client';

import type { ClothingItem } from '../model/clothing.types';
import { ClosetGridItemCard } from './ClosetGridItemCard';

type ClosetGridItemsProps = {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

export function ClosetGridItems({ items, onItemClick, onToggleFavorite }: ClosetGridItemsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <ClosetGridItemCard
          key={item.id}
          item={item}
          onItemClick={onItemClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
