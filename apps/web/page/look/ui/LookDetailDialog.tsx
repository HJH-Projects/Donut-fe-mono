'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Edit2, Trash2, X } from 'lucide-react';
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
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:detail');
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col rounded-[24px]"
          aria-describedby={undefined}
        >
          {selectedLook && (
            <>
              <div className="shrink-0 p-6 pb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-black mb-2 text-[20px] font-semibold">{selectedLook.name}</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLook.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-white rounded-full bg-black text-[11px] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => closeGlobalDialog('look:detail')} className="p-1.5 hover:bg-[#F3F4F6] transition-colors rounded-lg">
                  <X size={20} color="#000" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6">
                <h4 className="text-black mb-3 text-sm font-semibold">{includedItemsLabel}</h4>
                <div className="grid grid-cols-2 gap-3 pb-4">
                  {selectedLook.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                      <LookDetailGridImageItem
                        imageUrl={item.imageUrl || clothesImageMap.get(item.id) || ''}
                        name={item.name}
                      />
                      <div>
                        <p className="text-black mb-0.5 text-[13px] font-semibold">{item.name}</p>
                        <p className="text-[#666] text-[11px] font-normal">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 p-6 pt-4 flex gap-3">
                <button
                  onClick={onDeleteClick}
                  className="flex-1 px-5 py-3 flex items-center justify-center gap-2 hover:bg-[#F3F4F6] transition-colors rounded-xl border-[1.5px] border-[#E5E5E5] text-sm font-semibold text-black"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                  {deleteLabel}
                </button>
                <button
                  onClick={onEditClick}
                  className="flex-1 px-5 py-3 flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity rounded-xl bg-black text-sm font-semibold"
                >
                  <Edit2 size={16} strokeWidth={1.5} />
                  {editLabel}
                </button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
