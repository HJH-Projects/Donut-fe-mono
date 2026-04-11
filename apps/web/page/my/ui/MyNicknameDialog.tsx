'use client';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import Spinner from '@/shared/ui/Spinner';
import { Text } from '@/shared/ui/Text';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { MyDialogShell } from './MyDialogShell';

type MyNicknameDialogProps = {
  title: string;
  nicknameLabel: string;
  tempNickname: string;
  setTempNickname: (value: string) => void;
  isResettingNickname: boolean;
  isSavingNickname: boolean;
  resetLabel: string;
  applyLabel: string;
  onReset: () => void;
  onSave: () => void;
};

export function MyNicknameDialog({
  title,
  nicknameLabel,
  tempNickname,
  setTempNickname,
  isResettingNickname,
  isSavingNickname,
  resetLabel,
  applyLabel,
  onReset,
  onSave,
}: MyNicknameDialogProps) {
  const open = useGlobalDialogOpen('my:nickname');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:nickname') : closeGlobalDialog('my:nickname')
      }
      title={title}
    >
      <div className="mb-8">
        <Text as="h3" variant="sectionLabel" className="mb-4">
          {nicknameLabel}
        </Text>
        <Input
          type="text"
          value={tempNickname}
          onChange={(e) => setTempNickname(e.target.value)}
          className="rounded-lg border border-gray-300 text-[15px] focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onReset}
          disabled={isResettingNickname || isSavingNickname}
          variant="secondary"
          size="xl"
          className="flex-1 text-[16px] font-bold"
        >
          {isResettingNickname ? (
            <>
              <Spinner size="sm" className="text-[#555555]" />
              {resetLabel}
            </>
          ) : (
            resetLabel
          )}
        </Button>
        <Button
          onClick={onSave}
          disabled={isSavingNickname || isResettingNickname}
          variant="solid"
          size="xl"
          className="flex-1 text-[16px] font-bold"
        >
          {isSavingNickname ? (
            <>
              <Spinner size="sm" className="text-white" />
              {applyLabel}
            </>
          ) : (
            applyLabel
          )}
        </Button>
      </div>
    </MyDialogShell>
  );
}
