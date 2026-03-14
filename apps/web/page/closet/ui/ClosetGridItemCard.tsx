'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import type { ClothingItem } from '../model/clothing.types';
import { toSubCategoryLabelKey } from './closetCategoryLabel';
import { ClosetGridSkeletonCard } from './ClosetGridSkeletonCard';

type ClosetGridItemCardProps = {
  item: ClothingItem;
  onItemClick: (item: ClothingItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

export function ClosetGridItemCard({
  item,
  onItemClick,
  onToggleFavorite,
}: ClosetGridItemCardProps) {
  const { t } = useTranslation();
  const [isCardReady, setIsCardReady] = useState(!item.imageUrl);
  return (
    <div className="relative">
      {!isCardReady && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ClosetGridSkeletonCard />
        </div>
      )}
      <div className={!isCardReady ? 'opacity-0' : 'opacity-100'}>
        <div
          onClick={() => onItemClick(item)}
          className="aspect-square bg-gray-100 overflow-hidden relative cursor-pointer rounded-2xl border border-[#F6F7F9]"
        >
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
            onLoad={() => setIsCardReady(true)}
            onError={() => setIsCardReady(true)}
          />

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
          <p className="text-black truncate text-[13px] font-semibold">{item.name}</p>
          <p className="text-[#555555] truncate text-[11px] font-normal">
            {item.subCategory
              ? t(`closet.subCategoryLabels.${toSubCategoryLabelKey(item.subCategory)}`, {
                  defaultValue: item.subCategory,
                })
              : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
