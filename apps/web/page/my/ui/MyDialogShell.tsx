'use client';

import type { ReactNode } from 'react';
import { DialogShell } from '@/shared/ui/DialogShell';

type MyDialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

export function MyDialogShell({ open, onOpenChange, title, children }: MyDialogShellProps) {
  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      popupClassName="max-w-[420px] rounded-[var(--radius-xl)]"
      bodyClassName="p-8"
      titleSpacing="default"
    >
      {children}
    </DialogShell>
  );
}
