'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import type { ClothingItem } from '../model/clothing.types';
import { SIZES } from './closet.constants';
import { ClosetAddDialog } from './ClosetAddDialog';
import { ClosetFormLabel } from './ClosetFormLabel';
import { ClosetDialogSectionHeader } from './ClosetDialogSectionHeader';
import {
  AddCategoryPrimarySection,
  AddCategorySecondarySection,
  AddColorSection,
  AddImagePreviewSection,
  AddMaterialSection,
  AddRegisterButton,
  AddSeasonSection,
} from './ClosetAddFormSections';

type ClosetAddFormDialogProps = {
  newClothing: Partial<ClothingItem>;
  setNewClothing: Dispatch<SetStateAction<Partial<ClothingItem>>>;
  isProcessing: boolean;
  hasPendingFile: boolean;
  handleRefreshBgRemoval: () => void;
  handleCancelAdd: () => void;
  handleAddClothing: () => Promise<void>;
  draftId: string | null;
  toggleArrayValue: (array: string[], value: string) => string[];
};

export function ClosetAddFormDialog({
  newClothing,
  setNewClothing,
  isProcessing,
  hasPendingFile,
  handleRefreshBgRemoval,
  handleCancelAdd,
  handleAddClothing,
  draftId,
  toggleArrayValue,
}: ClosetAddFormDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleAddClothing();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClosetAddDialog dialogKey="closet:addForm" onClose={handleCancelAdd}>
      <ClosetDialogSectionHeader title={t('closet.enterItemInfo')} />

      <div className="flex-1 overflow-y-auto px-6 pb-2">
        <div className="space-y-4">
          <AddImagePreviewSection
            imageUrl={newClothing.imageUrl}
            isProcessing={isProcessing}
            hasPendingFile={hasPendingFile}
            processingText={t('closet.removingBackground')}
            refreshText="배경 제거 갱신"
            onRefresh={handleRefreshBgRemoval}
          />

          <div>
            <ClosetFormLabel text={t('closet.alias')} required />
            <Input
              type="text"
              value={newClothing.name}
              onChange={(e) =>
                setNewClothing({
                  ...newClothing,
                  name: e.target.value,
                })
              }
              placeholder={t('closet.aliasPlaceholder')}
              className="py-2.5"
            />
          </div>

          <div>
            <ClosetFormLabel text={t('closet.category')} required />
            <AddCategoryPrimarySection
              newClothing={newClothing}
              setNewClothing={setNewClothing}
              isProcessing={isProcessing}
            />
          </div>

          {newClothing.category1 && (
            <div>
              <ClosetFormLabel text={t('closet.subcategory')} />
              <AddCategorySecondarySection
                newClothing={newClothing}
                setNewClothing={setNewClothing}
                isProcessing={isProcessing}
              />
            </div>
          )}

          <div>
            <ClosetFormLabel text={t('closet.season')} />
            <AddSeasonSection
              newClothing={newClothing}
              setNewClothing={setNewClothing}
              isProcessing={isProcessing}
              toggleArrayValue={toggleArrayValue}
            />
          </div>

          <div>
            <ClosetFormLabel text={t('closet.color')} />
            <AddColorSection
              newClothing={newClothing}
              setNewClothing={setNewClothing}
              isProcessing={isProcessing}
              toggleArrayValue={toggleArrayValue}
            />
          </div>

          <div>
            <ClosetFormLabel text={t('closet.material')} />
            <AddMaterialSection
              newClothing={newClothing}
              setNewClothing={setNewClothing}
              isProcessing={isProcessing}
            />
          </div>

          <div>
            <ClosetFormLabel text={t('closet.brand')} />
            <Input
              type="text"
              value={newClothing.brand}
              onChange={(e) =>
                setNewClothing({
                  ...newClothing,
                  brand: e.target.value,
                })
              }
              placeholder={t('closet.brandPlaceholder')}
              className="py-2.5"
            />
          </div>

          <div>
            <ClosetFormLabel text={t('closet.size')} />
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setNewClothing({
                      ...newClothing,
                      size: newClothing.size === size ? '' : size,
                    })
                  }
                  className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
                  style={{
                    backgroundColor: newClothing.size === size ? '#000' : '#fff',
                    color: newClothing.size === size ? '#fff' : '#000',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <ClosetFormLabel text={t('closet.memo')} />
            <Textarea
              value={newClothing.memo}
              onChange={(e) =>
                setNewClothing({
                  ...newClothing,
                  memo: e.target.value,
                })
              }
              placeholder={t('closet.enterMemo')}
              rows={3}
              className="py-2.5"
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 flex gap-2 px-6 pb-6 pt-3 bg-white rounded-b-[24px]">
        <Button
          onClick={handleCancelAdd}
          variant="secondary"
          size="xl"
          className="flex-1 px-4"
        >
          {t('common.cancel')}
        </Button>
        <AddRegisterButton
          onClick={handleSubmit}
          isSubmitting={isSubmitting}
          registerText={t('closet.register')}
          disabled={isSubmitting || isProcessing || !draftId || !newClothing.name || !newClothing.category1}
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
