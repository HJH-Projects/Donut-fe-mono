'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import Spinner from '@/shared/ui/Spinner';
import { closeGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type LookDeleteConfirmDialogProps = {
  isDeleting: boolean;
  onConfirm: () => void;
};

export function LookDeleteConfirmDialog({
  isDeleting,
  onConfirm,
}: LookDeleteConfirmDialogProps) {
  const open = useGlobalDialogOpen('look:deleteConfirm');

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:deleteConfirm');
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-[70]" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[70] w-[90%] max-w-[340px] p-8 rounded-[var(--radius-xl)]"
          aria-describedby={undefined}
        >
          <button
            onClick={() => closeGlobalDialog('look:deleteConfirm')}
            className="absolute top-8 right-8 p-1 hover:bg-[#F3F4F6] transition-colors rounded-md"
            aria-label="닫기"
          >
            <X size={18} color="#000" strokeWidth={1.8} />
          </button>

          <h2 className="text-black mb-3 text-[20px] font-bold">룩을 삭제할까요?</h2>
          <p className="text-gray-500 mb-8 text-sm font-normal">삭제된 룩은 복구할 수 없습니다.</p>
          <div className="flex gap-3">
            <button
              onClick={() => closeGlobalDialog('look:deleteConfirm')}
              disabled={isDeleting}
              className="flex-1 py-4 disabled:opacity-60 border-[1.5px] border-[#E5E5E5] rounded-[var(--radius-pill)] text-sm font-semibold"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-4 text-white inline-flex items-center justify-center gap-2 disabled:opacity-60 bg-black rounded-[var(--radius-pill)] text-sm font-semibold"
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  삭제 중...
                </>
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
