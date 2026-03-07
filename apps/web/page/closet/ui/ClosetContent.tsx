'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';
import { useClosetContentData } from '../model/useClosetContentData';
import { ClosetAddFormDialog } from './ClosetAddFormDialog';
import { ClosetAddMethodDialog } from './ClosetAddMethodDialog';
import { ClosetCountMeta } from './ClosetCountMeta';
import { ClosetDeleteConfirmDialog } from './ClosetDeleteConfirmDialog';
import { ClosetDetailDialogContent } from './ClosetDetailDialogContent';
import { ClosetListGridSection } from './ClosetListGridSection';

interface ClosetContentProps {
  clothesPromise: Promise<ClothesListItemResponseDto[]>;
  selectedCategory: string;
  showFavoriteOnly: boolean;
}

export function ClosetContent({
  clothesPromise,
  selectedCategory,
  showFavoriteOnly,
}: ClosetContentProps) {
  const initialClothes = use(clothesPromise);
  const { t } = useTranslation();

  const {
    clothes,
    handleItemClick,
    toggleFavorite,
    displayedClothes,
    openAddMethodDialog,
    loadSelectedItemDetail,
    selectedItem,
    setSelectedItem,
    editMode,
    setEditMode,
    isProcessing,
    handleDeleteConfirm,
    newClothing,
    setNewClothing,
    fileInputRef,
    cameraInputRef,
    hasPendingFile,
    draftId,
    handleImageUpload,
    handleRefreshBgRemoval,
    handleAddClothing,
    handleUpdateClothing,
    handleDeleteClick,
    handleCancelAdd,
    handleCancelDetail,
    handleStartImageEdit,
    toggleArrayValue,
  } = useClosetContentData({
    initialClothes,
    selectedCategory,
    showFavoriteOnly,
  });

  return (
    <>
      <ClosetCountMeta count={displayedClothes.length} suffix={t('closet.items')} />
      <ClosetListGridSection
        clothes={clothes}
        displayedClothes={displayedClothes}
        onAddClick={openAddMethodDialog}
        onItemClick={handleItemClick}
        onToggleFavorite={toggleFavorite}
      />
      <ClosetAddMethodDialog
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
        handleImageUpload={handleImageUpload}
        handleCancelAdd={handleCancelAdd}
      />
      <ClosetAddFormDialog
        newClothing={newClothing}
        setNewClothing={setNewClothing}
        isProcessing={isProcessing}
        hasPendingFile={hasPendingFile}
        handleRefreshBgRemoval={handleRefreshBgRemoval}
        handleCancelAdd={handleCancelAdd}
        handleAddClothing={handleAddClothing}
        draftId={draftId}
        toggleArrayValue={toggleArrayValue}
      />
      <ClosetDetailDialogContent
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        editMode={editMode}
        setEditMode={setEditMode}
        loadSelectedItemDetail={loadSelectedItemDetail}
        handleToggleFavorite={toggleFavorite}
        toggleArrayValue={toggleArrayValue}
        handleDeleteClick={handleDeleteClick}
        handleCancelDetail={handleCancelDetail}
        handleUpdateClothing={handleUpdateClothing}
        handleStartImageEdit={handleStartImageEdit}
      />
      <ClosetDeleteConfirmDialog
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
