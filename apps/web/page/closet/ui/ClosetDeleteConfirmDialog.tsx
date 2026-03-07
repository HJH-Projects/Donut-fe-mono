'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useState } from 'react';
import { LoadingButtonContent } from './ClosetDialogLoadingUi';
import { openGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type ClosetDeleteConfirmDialogProps = {
  onConfirm: () => Promise<void>;
};

export function ClosetDeleteConfirmDialog({ onConfirm }: ClosetDeleteConfirmDialogProps) {
  const open = useGlobalDialogOpen('closet:deleteConfirm');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) openGlobalDialog('closet:detail');
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-[60]" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[60] w-[90%] max-w-[340px] p-8 rounded-[var(--radius-xl)]"
          aria-describedby={undefined}
        >
          <h2 className="text-black mb-3 text-[20px] font-bold">
            옷을 삭제할까요?
          </h2>
          <p className="text-gray-500 mb-8 text-sm font-normal">
            삭제된 옷은 복구할 수 없습니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => openGlobalDialog('closet:detail')}
              disabled={isDeleting}
              className="flex-1 py-4 disabled:opacity-60 border-[1.5px] border-[#E5E5E5] rounded-[var(--radius-pill)] text-sm font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 py-4 text-white inline-flex items-center justify-center gap-2 disabled:opacity-60 bg-black rounded-[var(--radius-pill)] text-sm font-semibold"
            >
              {isDeleting ? (
                <LoadingButtonContent text="삭제 중..." />
              ) : (
                '삭제'
              )}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
