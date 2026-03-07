'use client';

import { Plus } from 'lucide-react';

type ClosetGridEmptyStateProps = {
  isCompletelyEmpty: boolean;
  onAddClick: () => void;
  addFirstLabel: string;
  title: string;
  description: string;
};

export function ClosetGridEmptyState({
  isCompletelyEmpty,
  onAddClick,
  addFirstLabel,
  title,
  description,
}: ClosetGridEmptyStateProps) {
  return (
    <div className="fixed left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-48px)] max-w-[320px] flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={onAddClick}
        aria-label={addFirstLabel}
        className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 hover:bg-gray-200 transition-colors"
      >
        <Plus size={28} color="#999" strokeWidth={1.5} />
      </button>
      <p className="text-black mb-1 text-base font-semibold">
        {title}
      </p>
      <p className="text-[#999] text-center mb-6 text-[13px] font-normal">
        {description}
      </p>
      {isCompletelyEmpty && (
        <button
          onClick={onAddClick}
          className="px-6 py-3 text-white hover:opacity-90 transition-opacity flex items-center gap-2 rounded-xl bg-black text-sm font-semibold"
        >
          <Plus size={18} color="#fff" strokeWidth={2} />
          {addFirstLabel}
        </button>
      )}
    </div>
  );
}
