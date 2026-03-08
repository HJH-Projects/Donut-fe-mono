'use client';

import { Heart, Share2 } from 'lucide-react';
import type { Look } from '../model/useLooks';
import { LookScrollableImageGallery } from './LookScrollableImageGallery';

type LookListCardProps = {
  look: Look;
  items: Look['items'];
  onClick: (e: React.MouseEvent, look: Look) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onToggleFavorite: (id: string) => void;
  onOpenShare: (look: Look) => void;
};

export function LookListCard({
  look,
  items,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onToggleFavorite,
  onOpenShare,
}: LookListCardProps) {
  return (
    <div
      onClick={(e) => onClick(e, look)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className="cursor-pointer transition-all relative rounded-2xl p-4 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(look.id);
          }}
          className="p-1.5 hover:bg-gray-50 transition-all rounded-lg"
        >
          <Heart
            size={18}
            color={look.isFavorite ? '#000' : '#999'}
            fill={look.isFavorite ? '#000' : 'none'}
            strokeWidth={1.5}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(look);
          }}
          className="p-1.5 hover:bg-gray-50 transition-all rounded-lg"
        >
          <Share2 size={18} color="#000" strokeWidth={1.5} />
        </button>
      </div>

      <LookScrollableImageGallery items={items} lookId={look.id} />

      <div className="px-4 pt-2 mb-2">
        <h3 className="text-black text-[18px] font-bold tracking-[-0.01em]">{look.name}</h3>
      </div>

      <div className="px-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {look.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-white rounded-full bg-black text-[11px] font-medium">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-[#999] text-[11px] font-normal">아이템 {look.items.length}개</p>
      </div>
    </div>
  );
}
