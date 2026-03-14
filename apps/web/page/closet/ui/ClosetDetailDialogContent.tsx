'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClothingItem } from '../model/clothing.types';
import { ClosetDetailDialog } from './ClosetDetailDialog';
import { ClosetDialogSectionHeader } from './ClosetDialogSectionHeader';
import { useGlobalDialogOpen } from '@/shared/model/globalDialogStore';
import {
  ClosetDetailAliasSection,
  ClosetDetailBrandSection,
  ClosetDetailCategorySection,
  ClosetDetailColorSection,
  ClosetDetailFooterSection,
  ClosetDetailImageSection,
  ClosetDetailMaterialSection,
  ClosetDetailMemoSection,
  ClosetDetailSeasonSection,
  ClosetDetailSizeSection,
} from './ClosetDetailSections';

type ClosetDetailDialogContentProps = {
  selectedItem: ClothingItem | null;
  setSelectedItem: Dispatch<SetStateAction<ClothingItem | null>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  loadSelectedItemDetail: (itemId: string) => Promise<void>;
  handleToggleFavorite: (id: string, isFavorite: boolean) => void;
  toggleArrayValue: (array: string[], value: string) => string[];
  handleDeleteClick: () => void;
  handleCancelDetail: () => void;
  handleUpdateClothing: () => Promise<void>;
  handleStartImageEdit: () => void;
};

export function ClosetDetailDialogContent({
  selectedItem,
  setSelectedItem,
  editMode,
  setEditMode,
  loadSelectedItemDetail,
  handleToggleFavorite,
  toggleArrayValue,
  handleDeleteClick,
  handleCancelDetail,
  handleUpdateClothing,
  handleStartImageEdit,
}: ClosetDetailDialogContentProps) {
  const { t } = useTranslation();
  const open = useGlobalDialogOpen('closet:detail');
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSavingDetail, setIsSavingDetail] = useState(false);

  useEffect(() => {
    if (!open || !selectedItem?.id) return;
    setIsDetailLoading(true);
    loadSelectedItemDetail(selectedItem.id).finally(() => {
      setIsDetailLoading(false);
    });
  }, [open, selectedItem?.id, loadSelectedItemDetail]);

  const handleUpdate = async () => {
    setIsSavingDetail(true);
    try {
      await handleUpdateClothing();
    } finally {
      setIsSavingDetail(false);
    }
  };

  return (
    <ClosetDetailDialog onClose={handleCancelDetail}>
      {selectedItem && (
        <>
          <ClosetDialogSectionHeader title={editMode ? t('closet.editItemInfo') : t('closet.itemInfo')} />

          <div className="flex-1 overflow-y-auto px-6 pb-2">
            <div className="space-y-4">
              <ClosetDetailImageSection
                selectedItem={selectedItem}
                editMode={editMode}
                onToggleFavorite={handleToggleFavorite}
                onStartImageEdit={handleStartImageEdit}
                noImageText={t('closet.loadingImage')}
                changeImageText={t('closet.changeImage')}
              />

              <ClosetDetailAliasSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.alias')}
                placeholder={t('closet.aliasPlaceholder')}
              />

              <ClosetDetailCategorySection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.category')}
                subcategoryLabel={t('closet.subcategory')}
              />

              <ClosetDetailSeasonSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.season')}
                emptyText={t('common.notSet')}
              />

              <ClosetDetailColorSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.color')}
                emptyText={t('common.notSet')}
              />

              <ClosetDetailMaterialSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.material')}
                emptyText={t('common.notSet')}
              />

              <ClosetDetailBrandSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.brand')}
                placeholder={t('closet.brandPlaceholder')}
                emptyText={t('common.notSet')}
              />

              <ClosetDetailSizeSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.size')}
                emptyText={t('common.notSet')}
              />

              <ClosetDetailMemoSection
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                editMode={editMode}
                isDetailLoading={isDetailLoading}
                toggleArrayValue={toggleArrayValue}
                label={t('closet.memo')}
                placeholder={t('closet.enterMemo')}
                emptyText={t('common.notSet')}
              />
            </div>
          </div>

          <ClosetDetailFooterSection
            editMode={editMode}
            setEditMode={setEditMode}
            onDeleteClick={handleDeleteClick}
            onCancelDetail={handleCancelDetail}
            onUpdateClothing={handleUpdate}
            isSavingClothing={isSavingDetail}
            canSave={Boolean(selectedItem.name && selectedItem.category1)}
            editLabel={t('common.edit')}
            deleteLabel={t('common.delete')}
            cancelLabel={t('common.cancel')}
            saveLabel={t('closet.save')}
          />
        </>
      )}

      <Dialog.Close
        className="absolute top-4 right-4 text-[#555555] text-2xl hover:opacity-70 transition-opacity"
        aria-label="닫기"
        onClick={handleCancelDetail}
      >
        ×
      </Dialog.Close>
    </ClosetDetailDialog>
  );
}
