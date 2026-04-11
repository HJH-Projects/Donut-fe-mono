'use client';

import { Heart, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';
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
  const { t } = useTranslation();

  return (
    <Card
      onClick={(e) => onClick(e, look)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      variant="elevated"
      className="relative cursor-pointer p-4 transition-all"
    >
      <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(look.id);
          }}
          tone="subtle"
        >
          <Heart
            size={18}
            color={look.isFavorite ? '#000' : '#999'}
            fill={look.isFavorite ? '#000' : 'none'}
            strokeWidth={1.5}
          />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(look);
          }}
          tone="subtle"
        >
          <Share2 size={18} color="#000" strokeWidth={1.5} />
        </IconButton>
      </div>

      <LookScrollableImageGallery items={items} lookId={look.id} />

      <div className="px-4 pt-2 mb-2">
        <Text as="h3" variant="titleSm" className="tracking-[-0.01em]">
          {look.name}
        </Text>
      </div>

      <div className="px-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {look.tags.map((tag) => (
            <Badge key={tag} className="px-3 py-1 text-[11px] font-medium">
              #{tag}
            </Badge>
          ))}
        </div>
        <Text variant="meta">
          {t('looks.cardItemsCount', { count: look.items.length })}
        </Text>
      </div>
    </Card>
  );
}
