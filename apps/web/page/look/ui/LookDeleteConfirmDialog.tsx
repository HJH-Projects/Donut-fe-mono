'use client';

import Spinner from '@/shared/ui/Spinner';
import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
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
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:deleteConfirm');
      }}
      popupClassName="max-w-[340px] rounded-[var(--radius-xl)]"
      backdropClassName="bg-black/40"
      zIndexClassName="z-[70]"
      bodyClassName="p-8"
      title="룩을 삭제할까요?"
      titleSpacing="none"
      titleClassName="mb-3 text-[20px] font-bold"
    >
      <p className="mb-8 text-sm font-normal text-gray-500">삭제된 룩은 복구할 수 없습니다.</p>
      <div className="flex gap-3">
        <Button
          onClick={() => closeGlobalDialog('look:deleteConfirm')}
          disabled={isDeleting}
          variant="secondary"
          size="xl"
          className="flex-1"
        >
          취소
        </Button>
        <Button onClick={onConfirm} disabled={isDeleting} variant="solid" size="xl" className="flex-1">
          {isDeleting ? (
            <>
              <Spinner size="sm" className="text-white" />
              삭제 중...
            </>
          ) : (
            '삭제'
          )}
        </Button>
      </div>
    </DialogShell>
  );
}
