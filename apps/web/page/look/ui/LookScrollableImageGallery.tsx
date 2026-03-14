'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LookItem } from '../model/useLooks';
import { LookGalleryImageItem } from './LookGalleryImageItem';

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
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        className="h-[96px] overflow-x-auto overflow-y-visible scrollbar-hide"
      >
        <div className="h-full flex items-center gap-2 px-4">
          {items.map((item) => (
            <LookGalleryImageItem key={item.id} item={item} />
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
            className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-[#E5E7EB] w-9 h-9 rounded-full"
          >
            <ArrowLeft size={14} color="#000" strokeWidth={2} />
          </button>
          <div className="w-px h-2.5 bg-[#E7CCA0]" />
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
            className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-[#E5E7EB] w-9 h-9 rounded-full"
          >
            <ArrowRight size={14} color="#000" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
