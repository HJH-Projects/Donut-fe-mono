'use client';

import { Heart } from 'lucide-react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import type { ClothingItem } from '../model/clothing.types';

type ClosetGridItemCardProps = {
  item: ClothingItem;
  noImageLabel: string;
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

export function ClosetGridItemCard({
  item,
  noImageLabel,
  onItemClick,
  onToggleFavorite,
}: ClosetGridItemCardProps) {
  return (
    <div className="relative">
      <div
        onClick={() => onItemClick(item)}
        className="aspect-square bg-gray-100 overflow-hidden relative cursor-pointer rounded-2xl"
      >
        {item.imageUrl ? (
          <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#999] text-[11px] font-medium">
              {noImageLabel}
            </p>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id, item.isFavorite);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white transition-all rounded-xl"
        >
          <Heart
            size={16}
            color={item.isFavorite ? '#000' : '#999'}
            fill={item.isFavorite ? '#000' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="mt-2">
        <p className="text-black truncate text-[13px] font-semibold">
          {item.name}
        </p>
        <p className="text-[#555555] truncate text-[11px] font-normal">
          {item.category2 || item.category1}
        </p>
      </div>
    </div>
  );
}
