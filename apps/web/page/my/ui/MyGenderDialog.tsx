'use client';

import type { Gender } from '@/shared/model/gender';
import { Button } from '@/shared/ui/Button';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { Text } from '@/shared/ui/Text';
import { MyDialogShell } from './MyDialogShell';

type MyGenderDialogProps = {
  title: string;
  sectionLabel: string;
  maleLabel: string;
  femaleLabel: string;
  confirmLabel: string;
  gender: Gender;
  onChangeGender: (gender: Gender) => void;
};

export function MyGenderDialog({
  title,
  sectionLabel,
  maleLabel,
  femaleLabel,
  confirmLabel,
  gender,
  onChangeGender,
}: MyGenderDialogProps) {
  const open = useGlobalDialogOpen('my:gender');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:gender') : closeGlobalDialog('my:gender')
      }
      title={title}
    >
      <div className="mb-8">
        <Text as="h3" variant="sectionLabel" className="mb-4">
          {sectionLabel}
        </Text>
        <div className="flex gap-3">
          <Button
            onClick={() => onChangeGender('MALE')}
            variant={gender === 'MALE' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {maleLabel}
          </Button>
          <Button
            onClick={() => onChangeGender('FEMALE')}
            variant={gender === 'FEMALE' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {femaleLabel}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => closeGlobalDialog('my:gender')}
        variant="solid"
        size="xl"
        fullWidth
        className="text-[16px] font-bold"
      >
        {confirmLabel}
      </Button>
    </MyDialogShell>
  );
}
