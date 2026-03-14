'use client';

import { useState } from 'react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import type { LookItem } from '../model/useLooks';

type LookGalleryImageItemProps = {
  item: LookItem;
};

export function LookGalleryImageItem({ item }: LookGalleryImageItemProps) {
  const renderKey = `${item.id}:${item.imageUrl || 'no-src'}`;
  return <LookGalleryImageItemInner key={renderKey} item={item} />;
}

function LookGalleryImageItemInner({ item }: LookGalleryImageItemProps) {
  const hasSrc = Boolean(item.imageUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="shrink-0">
      <div className="relative w-[65px] h-[65px]">
        <div
          className={`w-[65px] h-[65px] overflow-hidden rounded-full ${
            hasSrc && !isLoaded ? 'skeleton-shimmer' : 'bg-white'
          }`}
          style={{ outline: '1px solid #F6F7F9' }}
        >
          {hasSrc ? (
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.name}
              className={`w-full h-full object-cover object-center transition-opacity duration-200 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-[#000] mb-1 text-[11px] font-semibold">{item.category}</p>
              <p className="text-[#666] text-center px-2 text-[9px] font-normal">{item.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
