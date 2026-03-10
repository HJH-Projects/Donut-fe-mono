'use client';

import Spinner from '@/shared/ui/Spinner';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { MyDialogShell } from './MyDialogShell';

type MyLogoutConfirmDialogProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isLoggingOut: boolean;
  onConfirm: () => void;
};

export function MyLogoutConfirmDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  isLoggingOut,
  onConfirm,
}: MyLogoutConfirmDialogProps) {
  const open = useGlobalDialogOpen('my:logoutConfirm');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:logoutConfirm') : closeGlobalDialog('my:logoutConfirm')
      }
      title={title}
    >
      <p
        className="text-[#666666] mb-8"
        style={{
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '1.6',
        }}
      >
        {description}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => closeGlobalDialog('my:logoutConfirm')}
          disabled={isLoggingOut}
          className="flex-1 py-4 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #E5E5E5',
            color: '#000',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoggingOut}
          className="flex-1 py-4 text-white transition-all hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#000',
            borderRadius: 'var(--radius-pill)',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          {isLoggingOut ? (
            <>
              <Spinner size="sm" className="text-white" />
              {confirmLabel}
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </MyDialogShell>
  );
}

