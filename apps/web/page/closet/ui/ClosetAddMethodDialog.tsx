'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Camera, Upload } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
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
        <p className="text-[#555555] mb-6 text-[13px] font-normal leading-[1.5]">
          {t('closet.selectImageMethod')}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors rounded-2xl border-[1.5px] border-[#E5E5E5]"
          >
            <Upload size={20} color="#000" strokeWidth={1.5} />
            <span className="text-black text-sm font-medium">
              {t('closet.chooseFromFile')}
            </span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors rounded-2xl border-[1.5px] border-[#E5E5E5]"
          >
            <Camera size={20} color="#000" strokeWidth={1.5} />
            <span className="text-black text-sm font-medium">
              {t('closet.takePhoto')}
            </span>
          </button>
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
        className="absolute top-4 right-4 text-[#555555] text-2xl hover:opacity-70 transition-opacity"
        aria-label="닫기"
        onClick={handleCancelAdd}
      >
        ×
      </Dialog.Close>
    </ClosetAddDialog>
  );
}
