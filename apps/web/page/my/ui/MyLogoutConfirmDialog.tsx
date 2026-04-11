'use client';

import { Button } from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import { Text } from '@/shared/ui/Text';
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
      <Text variant="body" className="mb-8 leading-[1.6] text-[#666666]">
        {description}
      </Text>

      <div className="flex gap-3">
        <Button
          onClick={() => closeGlobalDialog('my:logoutConfirm')}
          disabled={isLoggingOut}
          variant="secondary"
          size="xl"
          className="flex-1 text-[15px] font-bold"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoggingOut}
          variant="solid"
          size="xl"
          className="flex-1 text-[15px] font-bold"
        >
          {isLoggingOut ? (
            <>
              <Spinner size="sm" className="text-white" />
              {confirmLabel}
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </div>
    </MyDialogShell>
  );
}
