'use client';

import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
import { Text } from '@/shared/ui/Text';
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
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) openGlobalDialog('closet:detail');
      }}
      popupClassName="max-w-[340px] rounded-[var(--radius-xl)]"
      zIndexClassName="z-[60]"
      bodyClassName="p-8"
      title="옷을 삭제할까요?"
      titleSpacing="none"
      titleClassName="mb-3 text-[20px] font-bold"
    >
      <Text variant="body" className="mb-8 text-gray-500">
        삭제된 옷은 복구할 수 없습니다.
      </Text>
      <div className="flex gap-3">
        <Button
          onClick={() => openGlobalDialog('closet:detail')}
          disabled={isDeleting}
          variant="secondary"
          size="xl"
          className="flex-1"
        >
          취소
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isDeleting}
          variant="solid"
          size="xl"
          className="flex-1"
        >
          {isDeleting ? <LoadingButtonContent text="삭제 중..." /> : '삭제'}
        </Button>
      </div>
    </DialogShell>
  );
}
