'use client';

import { Heart, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type LookFilterBarProps = {
  showFavoriteOnly: boolean;
  onShowFavoriteOnlyChange: (next: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (next: string) => void;
};

export function LookFilterBar({
  showFavoriteOnly,
  onShowFavoriteOnlyChange,
  searchQuery,
  onSearchQueryChange,
}: LookFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0 px-6 pb-4 pt-4 flex items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onShowFavoriteOnlyChange(false)}
          className={`transition-all text-[12px] whitespace-nowrap ${!showFavoriteOnly ? 'font-semibold text-black' : 'font-medium text-[#999]'}`}
        >
          {t('looks.all')}
        </button>
        <div className="w-px h-3 bg-[#D9D9D9]" />
        <button
          onClick={() => onShowFavoriteOnlyChange(true)}
          className={`transition-all flex items-center gap-1 text-[12px] whitespace-nowrap ${showFavoriteOnly ? 'font-semibold text-black' : 'font-medium text-[#999]'}`}
        >
          <Heart
            size={12}
            color={showFavoriteOnly ? '#000' : '#999'}
            fill={showFavoriteOnly ? '#000' : 'none'}
            strokeWidth={2}
          />
          {t('looks.favorite')}
        </button>
        <div className="w-px h-3 bg-[#D9D9D9]" />
        <div className="relative w-full max-w-[170px] min-w-0">
          <Search
            size={12}
            color="#999"
            strokeWidth={2}
            className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t('looks.searchPlaceholder')}
            className="w-full pl-7 pr-2 py-1 transition-all rounded-full bg-[#F5F5F5] border border-transparent text-[12px] font-normal text-black outline-none focus:bg-white focus:border-[#E5E5E5]"
          />
        </div>
      </div>
    </div>
  );
}
