'use client';

import { Heart } from 'lucide-react';
import { useRef } from 'react';

type ClosetCategoryFilterBarProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showFavoriteOnly: boolean;
  onToggleFavoriteOnly: () => void;
};

export function ClosetCategoryFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  showFavoriteOnly,
  onToggleFavoriteOnly,
}: ClosetCategoryFilterBarProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = categoryScrollRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    container.scrollBy({ left: e.deltaY, behavior: 'smooth' });
  };

  return (
    <div className="shrink-0 px-6 pb-3">
      <div
        ref={categoryScrollRef}
        onWheel={handleCategoryWheel}
        className="flex gap-2 overflow-x-auto scrollbar-hide items-center scroll-smooth"
      >
        <button
          onClick={onToggleFavoriteOnly}
          className="flex-shrink-0 p-2 transition-all flex items-center justify-center rounded-full"
          style={{
            backgroundColor: showFavoriteOnly ? '#000' : 'transparent',
          }}
        >
          <Heart
            size={18}
            color={showFavoriteOnly ? '#fff' : '#000'}
            fill={showFavoriteOnly ? '#fff' : 'none'}
            strokeWidth={2}
          />
        </button>

        <div className="w-px h-5 bg-[#D9D9D9] flex-shrink-0" />

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="flex-shrink-0 px-5 py-1.5 transition-all rounded-full border-2 border-black text-sm font-semibold"
            style={{
              backgroundColor: selectedCategory === category ? '#000' : '#fff',
              color: selectedCategory === category ? '#fff' : '#000',
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
