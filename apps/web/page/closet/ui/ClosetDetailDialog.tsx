'use client';

import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { closeGlobalDialog, openGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type ClosetDetailDialogProps = {
  onClose?: () => void;
  children: ReactNode;
};

export function ClosetDetailDialog({ onClose, children }: ClosetDetailDialogProps) {
  const open = useGlobalDialogOpen('closet:detail');

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) {
          openGlobalDialog('closet:detail');
          return;
        }
        closeGlobalDialog('closet:detail');
        onClose?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col rounded-[24px]"
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
