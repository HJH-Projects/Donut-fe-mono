'use client';

import { use } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { LookForm } from '@/shared/ui/LookForm';
import { useTranslation } from 'react-i18next';
import { LookCountMeta } from './LookCountMeta';
import type { ClothesListItemResponseDto, LookResponseDto } from '@/shared/model/orvalSchemas';
import { LookEmptyState } from './LookEmptyState';
import { LookListCard } from './LookListCard';
import { LookDetailDialog } from './LookDetailDialog';
import { LookDeleteConfirmDialog } from './LookDeleteConfirmDialog';
import { LookCreateLinkDialog } from './LookCreateLinkDialog';
import { LookShareDialog } from './LookShareDialog';
import { useLookContentData } from '../model/useLookContentData';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';

export interface LookContentProps {
  looksPromise: Promise<LookResponseDto[]>;
  clothesPromise: Promise<ClothesListItemResponseDto[]>;
  showFavoriteOnly: boolean;
  searchQuery: string;
}

export function LookContent({
  looksPromise,
  clothesPromise,
  showFavoriteOnly,
  searchQuery,
}: LookContentProps) {
  const initialLooks = use(looksPromise);
  const initialClothes = use(clothesPromise);
  const { t } = useTranslation();
  const isAddDialogOpen = useGlobalDialogOpen('look:add');
  const {
    looks,
    filteredLooks,
    closetItems,
    clothesImageMap,
    selectedLook,
    setSelectedLook,
    showEditDialog,
    setShowEditDialog,
    setShowDetailDialog,
    isSavingLook,
    isDeletingLook,
    sharedLinks,
    selectedLink,
    setSelectedLink,
    copiedLinkId,
    linkName,
    setLinkName,
    isLoadingSharedLinks,
    handleToggleFavorite,
    handleCardClick,
    handleCardPointerDown,
    handleCardPointerUp,
    handleCardPointerLeave,
    handleDeleteClick,
    handleDeleteConfirm,
    handleAddLook,
    handleEditLook,
    handleCreateLink,
    handleKakaoShare,
    handleDeleteLink,
    handleCopyLink,
    formatDate,
  } = useLookContentData({
    initialLooks,
    initialClothes,
    showFavoriteOnly,
    searchQuery,
  });

  return (
    <>
      <LookCountMeta count={filteredLooks.length} suffix={t('looks.items')} />

      <div className="flex-1 overflow-y-auto pb-24">
        {filteredLooks.length === 0 ? (
          <LookEmptyState
            isCompletelyEmpty={looks.length === 0}
            onAddClick={() => openGlobalDialog('look:add')}
            addFirstLabel={t('looks.createFirst')}
            title={looks.length === 0 ? t('looks.emptyTitle') : t('looks.noResults')}
            description={looks.length === 0 ? t('looks.emptyDescription') : t('looks.noResultsDescription')}
          />
        ) : (
          <div className="px-6 flex flex-col gap-4">
            {filteredLooks.map((look) => (
              <LookListCard
                key={look.id}
                look={look}
                items={look.items.map((item) => ({
                  ...item,
                  imageUrl: item.imageUrl || clothesImageMap.get(item.id) || '',
                }))}
                onClick={handleCardClick}
                onPointerDown={handleCardPointerDown}
                onPointerUp={handleCardPointerUp}
                onPointerLeave={handleCardPointerLeave}
                onToggleFavorite={handleToggleFavorite}
                onOpenShare={(targetLook) => {
                  setSelectedLook(targetLook);
                  openGlobalDialog('look:share');
                }}
              />
            ))}
          </div>
        )}
      </div>

      <LookDetailDialog
        selectedLook={selectedLook}
        clothesImageMap={clothesImageMap}
        includedItemsLabel={selectedLook ? t('looks.includedItemsCount', { count: selectedLook.items.length }) : ''}
        deleteLabel={t('looks.delete')}
        editLabel={t('looks.edit')}
        onDeleteClick={handleDeleteClick}
        onEditClick={() => {
          setShowDetailDialog(false);
          setShowEditDialog(true);
        }}
      />

      {/* 룩 추가 다이얼로그 */}
      <Dialog.Root
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (open) openGlobalDialog('look:add');
          else closeGlobalDialog('look:add');
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col overflow-hidden rounded-[24px]"
            aria-describedby={undefined}
          >
            <LookForm
              mode="add"
              closetItems={closetItems}
              onSave={handleAddLook}
              onCancel={() => closeGlobalDialog('look:add')}
              isSaving={isSavingLook}
            />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 룩 수정 다이얼로그 */}
      <Dialog.Root open={showEditDialog} onOpenChange={setShowEditDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col overflow-hidden rounded-[24px]"
            aria-describedby={undefined}
          >
            {selectedLook && (
              <LookForm
                mode="edit"
                initialData={selectedLook}
                closetItems={closetItems}
                onSave={handleEditLook}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedLook(null);
                }}
                isSaving={isSavingLook}
              />
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <LookCreateLinkDialog
        selectedLook={selectedLook}
        linkName={linkName}
        titleCreateNewLink={t('looks.shareDialog.createNewLink')}
        placeholder={t('looks.shareDialog.enterLinkName')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('profile.confirm')}
        onLinkNameChange={setLinkName}
        onCreateLink={handleCreateLink}
      />

      <LookShareDialog
        selectedLook={selectedLook}
        sharedLinks={sharedLinks}
        selectedLink={selectedLink}
        copiedLinkId={copiedLinkId}
        isLoadingSharedLinks={isLoadingSharedLinks}
        title={t('looks.shareDialog.title')}
        generatedLinksLabel={t('looks.shareDialog.generatedLinks')}
        loadingLabel="로딩 중..."
        emptyLabel="생성된 링크가 없습니다"
        copiedLabel={t('looks.shareDialog.copied')}
        copyLinkLabel={t('looks.shareDialog.copyLink')}
        kakaoShareLabel={t('looks.shareDialog.kakaoShare')}
        createLinkLabel={t('looks.shareDialog.createLink')}
        onSelectLink={setSelectedLink}
        onDeleteLink={handleDeleteLink}
        onCopyLink={handleCopyLink}
        onKakaoShare={handleKakaoShare}
        formatDate={formatDate}
      />

      <LookDeleteConfirmDialog
        isDeleting={isDeletingLook}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
