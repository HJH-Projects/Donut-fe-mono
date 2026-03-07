'use client';

import { Dialog } from '@base-ui/react/dialog';

type MyDialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

export function MyDialogShell({ open, onOpenChange, title, children }: MyDialogShellProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[420px]"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
          }}
          aria-describedby={undefined}
        >
          <h2
            className="text-black mb-8"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            {title}
          </h2>

          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
