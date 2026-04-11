'use client';

import { Link2, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
import { IconButton } from '@/shared/ui/IconButton';
import { Input } from '@/shared/ui/Input';
import Spinner from '@/shared/ui/Spinner';
import { Text } from '@/shared/ui/Text';
import type { Look } from '../model/useLooks';
import { closeGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type LookCreateLinkDialogProps = {
  selectedLook: Look | null;
  linkName: string;
  titleCreateNewLink: string;
  placeholder: string;
  cancelLabel: string;
  confirmLabel: string;
  isCreating: boolean;
  onLinkNameChange: (value: string) => void;
  onCreateLink: () => void;
};

export function LookCreateLinkDialog({
  selectedLook,
  linkName,
  titleCreateNewLink,
  placeholder,
  cancelLabel,
  confirmLabel,
  isCreating,
  onLinkNameChange,
  onCreateLink,
}: LookCreateLinkDialogProps) {
  const open = useGlobalDialogOpen('look:createLink');

  return (
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:createLink');
      }}
      popupClassName="max-w-[400px] rounded-[24px]"
      bodyClassName=""
      backdropClassName="bg-black/30"
      showCloseButton={false}
    >
      {selectedLook ? (
        <>
          <div className="flex shrink-0 items-start justify-between p-6 pb-4">
            <Text as="h2" variant="titleMd" className="font-semibold">
              {selectedLook.name}
            </Text>
            <IconButton
              onClick={() => closeGlobalDialog('look:createLink')}
              tone="subtle"
              size="md"
            >
              <X size={20} color="#000" strokeWidth={1.5} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <Text as="h4" variant="bodyStrong" className="mb-3 text-[13px]">
              {titleCreateNewLink}
            </Text>
            <Input
              type="text"
              value={linkName}
              onChange={(e) => onLinkNameChange(e.target.value)}
              intent="subtle"
              className="mb-4"
              placeholder={placeholder}
            />
          </div>

          <div className="flex shrink-0 gap-3 p-6 pt-4">
            <Button
              onClick={() => closeGlobalDialog('look:createLink')}
              disabled={isCreating}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onCreateLink}
              disabled={isCreating}
              variant="solid"
              size="lg"
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  생성 중...
                </>
              ) : (
                <>
                  <Link2 size={16} strokeWidth={2} />
                  {confirmLabel}
                </>
              )}
            </Button>
          </div>
        </>
      ) : null}
    </DialogShell>
  );
}
