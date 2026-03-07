'use client';

import { Suspense, useState, type ReactNode } from 'react';
import type { ClothesListItemResponseDto, LookResponseDto } from '@/shared/model/orvalSchemas';
import { PlusAction } from '@/shared/ui/PlusAction';
import { openGlobalDialog } from '@/shared/model/globalDialogStore';
import { LookFilterBar } from './LookFilterBar';
import { LookListSkeleton } from './LookListSkeleton';
import { LookContent } from './LookPageContent';

interface LookPageProps {
  looksPromise: Promise<LookResponseDto[]>;
  clothesPromise: Promise<ClothesListItemResponseDto[]>;
  header?: ReactNode;
}

export function LookPage({ looksPromise, clothesPromise, header }: LookPageProps) {
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-white">
      <div className="shrink-0 relative">
        {header}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <PlusAction onClick={() => openGlobalDialog('look:add')} />
        </div>
      </div>

      <LookFilterBar
        showFavoriteOnly={showFavoriteOnly}
        onShowFavoriteOnlyChange={setShowFavoriteOnly}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <Suspense fallback={<LookListSkeleton />}>
        <LookContent
          looksPromise={looksPromise}
          clothesPromise={clothesPromise}
          showFavoriteOnly={showFavoriteOnly}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}
