'use client';

import { Edit2, Trash2, X } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';
import type { Look } from '../model/useLooks';
import { closeGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';
import { LookDetailGridImageItem } from './LookDetailGridImageItem';

type LookDetailDialogProps = {
  selectedLook: Look | null;
  clothesImageMap: Map<string, string>;
  includedItemsLabel: string;
  deleteLabel: string;
  editLabel: string;
  onDeleteClick: () => void;
  onEditClick: () => void;
};

export function LookDetailDialog({
  selectedLook,
  clothesImageMap,
  includedItemsLabel,
  deleteLabel,
  editLabel,
  onDeleteClick,
  onEditClick,
}: LookDetailDialogProps) {
  const open = useGlobalDialogOpen('look:detail');

  return (
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:detail');
      }}
      popupClassName="max-w-[400px] max-h-[85vh] flex flex-col rounded-[24px]"
      bodyClassName="flex flex-1 flex-col"
      backdropClassName="bg-black/30"
      showCloseButton={false}
    >
      {selectedLook ? (
        <>
          <div className="flex shrink-0 items-start justify-between p-6 pb-4">
            <div className="flex-1">
              <Text as="h2" variant="titleMd" className="mb-2 font-semibold">
                {selectedLook.name}
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {selectedLook.tags.map((tag) => (
                  <Badge key={tag} className="px-3 py-1 text-[11px] font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <IconButton onClick={() => closeGlobalDialog('look:detail')} tone="subtle" size="md">
              <X size={20} color="#000" strokeWidth={1.5} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <Text as="h4" variant="bodyStrong" className="mb-3">
              {includedItemsLabel}
            </Text>
            <div className="grid grid-cols-2 gap-3 pb-4">
              {selectedLook.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <LookDetailGridImageItem
                    imageUrl={item.imageUrl || clothesImageMap.get(item.id) || ''}
                    name={item.name}
                  />
                  <div>
                    <Text variant="bodyStrong" className="mb-0.5 text-[13px]">
                      {item.name}
                    </Text>
                    <Text variant="meta" className="text-[#666]">
                      {item.category}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 gap-3 p-6 pt-4">
            <Button onClick={onDeleteClick} variant="secondary" size="lg" className="flex-1">
              <Trash2 size={16} strokeWidth={1.5} />
              {deleteLabel}
            </Button>
            <Button onClick={onEditClick} variant="solid" size="lg" className="flex-1">
              <Edit2 size={16} strokeWidth={1.5} />
              {editLabel}
            </Button>
          </div>
        </>
      ) : null}
    </DialogShell>
  );
}
