'use client';

import { useState, Suspense, type ReactNode } from 'react';
import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';
import { PlusAction } from '@/shared/ui/PlusAction';
import { ClosetGridSkeleton } from './ClosetGridSkeleton';
import { ClosetCategoryFilterBar } from './ClosetCategoryFilterBar';
import { ClosetContent } from './ClosetContent';
import { CATEGORIES } from './closet.constants';
import { openGlobalDialog } from '@/shared/model/globalDialogStore';

interface ClosetPageProps {
  clothesPromise?: Promise<ClothesListItemResponseDto[]>;
  initialClothes?: ClothesListItemResponseDto[];
  header?: ReactNode;
}

export function ClosetPage({ clothesPromise, initialClothes = [], header }: ClosetPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const effectiveClothesPromise = clothesPromise ?? Promise.resolve(initialClothes);

  return (
    <div className="flex-1 min-h-0 w-full bg-white flex flex-col overflow-hidden">
      <div className="shrink-0 relative">
        {header}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <PlusAction onClick={() => openGlobalDialog('closet:addMethod')} />
        </div>
      </div>

      <ClosetCategoryFilterBar
        categories={Object.keys(CATEGORIES)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showFavoriteOnly={showFavoriteOnly}
        onToggleFavoriteOnly={() => setShowFavoriteOnly((prev) => !prev)}
      />

      <Suspense fallback={<ClosetGridSkeleton />}>
        <ClosetContent
          clothesPromise={effectiveClothesPromise}
          selectedCategory={selectedCategory}
          showFavoriteOnly={showFavoriteOnly}
        />
      </Suspense>
    </div>
  );
}
