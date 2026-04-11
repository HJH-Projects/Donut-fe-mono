'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Camera, Upload } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/shared/ui/Card';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';
import { ClosetAddDialog } from './ClosetAddDialog';
import { ClosetDialogTitle } from './ClosetDialogTitle';

type ClosetAddMethodDialogProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  cameraInputRef: RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCancelAdd: () => void;
};

export function ClosetAddMethodDialog({
  fileInputRef,
  cameraInputRef,
  handleImageUpload,
  handleCancelAdd,
}: ClosetAddMethodDialogProps) {
  const { t } = useTranslation();

  return (
    <ClosetAddDialog dialogKey="closet:addMethod" onClose={handleCancelAdd}>
      <div className="p-6">
        <ClosetDialogTitle title={t('closet.addItemTitle')} className="mb-4" />
        <Text variant="caption" className="mb-6 leading-[1.5] text-[#555555]">
          {t('closet.selectImageMethod')}
        </Text>

        <div className="space-y-3">
          <Card
            onClick={() => fileInputRef.current?.click()}
            variant="surface"
            interactive
            className="flex w-full items-center gap-3 border-[1.5px] px-5 py-4"
          >
            <Upload size={20} color="#000" strokeWidth={1.5} />
            <Text as="span" variant="bodyStrong" className="font-medium">
              {t('closet.chooseFromFile')}
            </Text>
          </Card>

          <Card
            onClick={() => cameraInputRef.current?.click()}
            variant="surface"
            interactive
            className="flex w-full items-center gap-3 border-[1.5px] px-5 py-4"
          >
            <Camera size={20} color="#000" strokeWidth={1.5} />
            <Text as="span" variant="bodyStrong" className="font-medium">
              {t('closet.takePhoto')}
            </Text>
          </Card>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <Dialog.Close
        render={
          <IconButton
            className="absolute top-4 right-4 text-2xl text-[#555555] hover:opacity-70"
            tone="default"
            size="sm"
            aria-label="닫기"
            onClick={handleCancelAdd}
          >
            ×
          </IconButton>
        }
        aria-label="닫기"
      />
    </ClosetAddDialog>
  );
}
