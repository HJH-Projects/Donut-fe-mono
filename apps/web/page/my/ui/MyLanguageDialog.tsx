'use client';

import { Button } from '@/shared/ui/Button';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { Text } from '@/shared/ui/Text';
import type { Language } from '../model/useMyContentData';
import { MyDialogShell } from './MyDialogShell';

type MyLanguageDialogProps = {
  title: string;
  sectionLabel: string;
  koreanLabel: string;
  englishLabel: string;
  confirmLabel: string;
  language: Language;
  onChangeLanguage: (language: Language) => void;
};

export function MyLanguageDialog({
  title,
  sectionLabel,
  koreanLabel,
  englishLabel,
  confirmLabel,
  language,
  onChangeLanguage,
}: MyLanguageDialogProps) {
  const open = useGlobalDialogOpen('my:language');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:language') : closeGlobalDialog('my:language')
      }
      title={title}
    >
      <div className="mb-8">
        <Text as="h3" variant="sectionLabel" className="mb-4">
          {sectionLabel}
        </Text>
        <div className="flex gap-3">
          <Button
            onClick={() => onChangeLanguage('ko')}
            variant={language === 'ko' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {koreanLabel}
          </Button>
          <Button
            onClick={() => onChangeLanguage('en')}
            variant={language === 'en' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {englishLabel}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => closeGlobalDialog('my:language')}
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
