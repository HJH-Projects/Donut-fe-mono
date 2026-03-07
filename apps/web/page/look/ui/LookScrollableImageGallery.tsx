'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import type { LookItem } from '../model/useLooks';

type LookScrollableImageGalleryProps = {
  items: LookItem[];
  lookId: string;
};

export function LookScrollableImageGallery({ items, lookId }: LookScrollableImageGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const hasScroll = scrollWidth > clientWidth;
    setNeedsScroll(hasScroll);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft = 0;
    const timer = window.setTimeout(checkScrollButtons, 50);
    return () => window.clearTimeout(timer);
  }, [lookId, items.length]);

  useEffect(() => {
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div className="py-3 relative pb-2">
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
      >
        <div className="flex items-center gap-2 px-4">
          {items.map((item) => (
            <div key={item.id} className="shrink-0">
              <div className="w-16 h-16 bg-gray-100 overflow-hidden shadow-sm rounded-full">
                {item.imageUrl ? (
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-[#000] mb-1 text-[11px] font-semibold">{item.category}</p>
                    <p className="text-[#666] text-center px-2 text-[9px] font-normal">{item.name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {needsScroll && (
        <div
          data-navigation-buttons
          className="absolute flex items-center gap-0.5 bottom-[-32px] right-3 z-10"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            data-scroll-button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollLeft();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={!canScrollLeft}
            className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-gray-200 w-9 h-9 rounded-full"
          >
            <ArrowLeft size={14} color="#000" strokeWidth={2} />
          </button>
          <div className="w-px h-2.5 bg-[#D9D9D9]" />
          <button
            data-scroll-button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollRight();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={!canScrollRight}
            className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-gray-200 w-9 h-9 rounded-full"
          >
            <ArrowRight size={14} color="#000" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
