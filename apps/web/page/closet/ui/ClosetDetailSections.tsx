'use client';

import { Edit2, Heart, Trash2, Upload } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type { ClothingItem } from '../model/clothing.types';
import { LoadingButtonContent } from './ClosetDialogLoadingUi';
import {
  BrandReadonlySection,
  CategoryReadonlySection,
  ColorReadonlySection,
  MaterialReadonlySection,
  MemoReadonlySection,
  SeasonReadonlySection,
  SizeReadonlySection,
} from './ClosetDetailReadonlySections';
import { ClosetFormLabel } from './ClosetFormLabel';
import { CATEGORIES, COLORS, MATERIALS, SEASONS, SIZES } from './closet.constants';

type DetailFieldBaseProps = {
  selectedItem: ClothingItem;
  setSelectedItem: Dispatch<SetStateAction<ClothingItem | null>>;
  editMode: boolean;
  isDetailLoading: boolean;
  toggleArrayValue: (array: string[], value: string) => string[];
};

type ClosetDetailImageSectionProps = {
  selectedItem: ClothingItem;
  setSelectedItem: Dispatch<SetStateAction<ClothingItem | null>>;
  editMode: boolean;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onStartImageEdit: () => void;
  noImageText: string;
  changeImageText: string;
};

export function ClosetDetailImageSection({
  selectedItem,
  setSelectedItem,
  editMode,
  onToggleFavorite,
  onStartImageEdit,
  noImageText,
  changeImageText,
}: ClosetDetailImageSectionProps) {
  return (
    <div className="relative">
      <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-2xl">
        {selectedItem.imageUrl ? (
          <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#999] text-[11px] font-medium">
              {noImageText}
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          onToggleFavorite(selectedItem.id, selectedItem.isFavorite);
        }}
        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white transition-all rounded-xl"
      >
        <Heart
          size={18}
          color={selectedItem.isFavorite ? '#000' : '#999'}
          fill={selectedItem.isFavorite ? '#000' : 'none'}
          strokeWidth={1.5}
        />
      </button>
      {editMode && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onStartImageEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-xl border-[1.5px] border-[#E5E5E5] text-[13px] font-medium"
          >
            <Upload size={16} strokeWidth={1.5} />
            {changeImageText}
          </button>
        </div>
      )}
    </div>
  );
}

type ClosetDetailAliasSectionProps = DetailFieldBaseProps & {
  label: string;
  placeholder: string;
};

export function ClosetDetailAliasSection({
  selectedItem,
  setSelectedItem,
  editMode,
  label,
  placeholder,
}: ClosetDetailAliasSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} required={editMode} />
      {editMode ? (
        <input
          type="text"
          value={selectedItem.name}
          onChange={(e) =>
            setSelectedItem({
              ...selectedItem,
              name: e.target.value,
            })
          }
          placeholder={placeholder}
          className="w-full px-4 py-2.5 outline-none rounded-xl border-[1.5px] border-[#E5E5E5] text-[13px] font-normal"
        />
      ) : (
        <p className="text-sm font-normal">
          {selectedItem.name}
        </p>
      )}
    </div>
  );
}

type ClosetDetailCategorySectionProps = DetailFieldBaseProps & {
  label: string;
  subcategoryLabel: string;
};

export function ClosetDetailCategorySection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  label,
  subcategoryLabel,
}: ClosetDetailCategorySectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} required={editMode} />
      {editMode ? (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.keys(CATEGORIES)
              .filter((cat) => cat !== '전체')
              .map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setSelectedItem({
                      ...selectedItem,
                      category1: cat,
                      category2: '',
                    })
                  }
                  className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
                  style={{
                    backgroundColor: selectedItem.category1 === cat ? '#000' : '#fff',
                    color: selectedItem.category1 === cat ? '#fff' : '#000',
                  }}
                >
                  {cat}
                </button>
              ))}
          </div>
          {selectedItem.category1 &&
            CATEGORIES[selectedItem.category1 as keyof typeof CATEGORIES].length > 0 && (
              <div>
                <ClosetFormLabel text={subcategoryLabel} />
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES[selectedItem.category1 as keyof typeof CATEGORIES].map((subCat) => (
                    <button
                      key={subCat}
                      type="button"
                      onClick={() =>
                        setSelectedItem({
                          ...selectedItem,
                          category2: selectedItem.category2 === subCat ? '' : subCat,
                        })
                      }
                      className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
                      style={{
                        backgroundColor: selectedItem.category2 === subCat ? '#000' : '#fff',
                        color: selectedItem.category2 === subCat ? '#fff' : '#000',
                      }}
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </>
      ) : (
        <CategoryReadonlySection
          category1={selectedItem.category1}
          category2={selectedItem.category2}
          isLoading={isDetailLoading}
        />
      )}
    </div>
  );
}

type ClosetDetailSeasonSectionProps = DetailFieldBaseProps & {
  label: string;
  emptyText: string;
};

export function ClosetDetailSeasonSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  toggleArrayValue,
  label,
  emptyText,
}: ClosetDetailSeasonSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((season) => (
            <button
              key={season}
              type="button"
              onClick={() =>
                setSelectedItem({
                  ...selectedItem,
                  season: toggleArrayValue(selectedItem.season || [], season),
                })
              }
              className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
              style={{
                backgroundColor: selectedItem.season?.includes(season) ? '#000' : '#fff',
                color: selectedItem.season?.includes(season) ? '#fff' : '#000',
              }}
            >
              {season}
            </button>
          ))}
        </div>
      ) : (
        <SeasonReadonlySection
          season={selectedItem.season}
          isLoading={isDetailLoading}
          emptyText={emptyText}
        />
      )}
    </div>
  );
}

type ClosetDetailColorSectionProps = DetailFieldBaseProps & {
  label: string;
  emptyText: string;
};

export function ClosetDetailColorSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  toggleArrayValue,
  label,
  emptyText,
}: ClosetDetailColorSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() =>
                setSelectedItem({
                  ...selectedItem,
                  color: toggleArrayValue(selectedItem.color || [], color.name),
                })
              }
              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5]"
              style={{
                backgroundColor: selectedItem.color?.includes(color.name) ? '#000' : '#fff',
              }}
            >
              <div
                className="shrink-0"
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  ...(color.hex === null
                    ? {
                        background:
                          'linear-gradient(135deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc)',
                      }
                    : {
                        backgroundColor: color.hex,
                        border: color.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                      }),
                }}
              />
              <span className="text-[11px] font-medium" style={{ color: selectedItem.color?.includes(color.name) ? '#fff' : '#000' }}>
                {color.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <ColorReadonlySection color={selectedItem.color} isLoading={isDetailLoading} emptyText={emptyText} />
      )}
    </div>
  );
}

type ClosetDetailMaterialSectionProps = DetailFieldBaseProps & {
  label: string;
  emptyText: string;
};

export function ClosetDetailMaterialSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  label,
  emptyText,
}: ClosetDetailMaterialSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((material) => (
            <button
              key={material}
              type="button"
              onClick={() =>
                setSelectedItem({
                  ...selectedItem,
                  material: selectedItem.material === material ? '' : material,
                })
              }
              className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
              style={{
                backgroundColor: selectedItem.material === material ? '#000' : '#fff',
                color: selectedItem.material === material ? '#fff' : '#000',
              }}
            >
              {material}
            </button>
          ))}
        </div>
      ) : (
        <MaterialReadonlySection
          material={selectedItem.material}
          isLoading={isDetailLoading}
          emptyText={emptyText}
        />
      )}
    </div>
  );
}

type ClosetDetailBrandSectionProps = DetailFieldBaseProps & {
  label: string;
  placeholder: string;
  emptyText: string;
};

export function ClosetDetailBrandSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  label,
  placeholder,
  emptyText,
}: ClosetDetailBrandSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <input
          type="text"
          value={selectedItem.brand}
          onChange={(e) =>
            setSelectedItem({
              ...selectedItem,
              brand: e.target.value,
            })
          }
          placeholder={placeholder}
          className="w-full px-4 py-2.5 outline-none rounded-xl border-[1.5px] border-[#E5E5E5] text-[13px] font-normal"
        />
      ) : (
        <BrandReadonlySection brand={selectedItem.brand} isLoading={isDetailLoading} emptyText={emptyText} />
      )}
    </div>
  );
}

type ClosetDetailSizeSectionProps = DetailFieldBaseProps & {
  label: string;
  emptyText: string;
};

export function ClosetDetailSizeSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  label,
  emptyText,
}: ClosetDetailSizeSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSelectedItem({
                  ...selectedItem,
                  size: selectedItem.size === size ? '' : size,
                })
              }
              className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
              style={{
                backgroundColor: selectedItem.size === size ? '#000' : '#fff',
                color: selectedItem.size === size ? '#fff' : '#000',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      ) : (
        <SizeReadonlySection size={selectedItem.size} isLoading={isDetailLoading} emptyText={emptyText} />
      )}
    </div>
  );
}

type ClosetDetailMemoSectionProps = DetailFieldBaseProps & {
  label: string;
  placeholder: string;
  emptyText: string;
};

export function ClosetDetailMemoSection({
  selectedItem,
  setSelectedItem,
  editMode,
  isDetailLoading,
  label,
  placeholder,
  emptyText,
}: ClosetDetailMemoSectionProps) {
  return (
    <div>
      <ClosetFormLabel text={label} />
      {editMode ? (
        <textarea
          value={selectedItem.memo}
          onChange={(e) =>
            setSelectedItem({
              ...selectedItem,
              memo: e.target.value,
            })
          }
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2.5 outline-none resize-none rounded-xl border-[1.5px] border-[#E5E5E5] text-[13px] font-normal"
        />
      ) : (
        <MemoReadonlySection memo={selectedItem.memo} isLoading={isDetailLoading} emptyText={emptyText} />
      )}
    </div>
  );
}

type ClosetDetailFooterSectionProps = {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  onDeleteClick: () => void;
  onCancelDetail: () => void;
  onUpdateClothing: () => void;
  isSavingClothing: boolean;
  canSave: boolean;
  editLabel: string;
  deleteLabel: string;
  cancelLabel: string;
  saveLabel: string;
};

export function ClosetDetailFooterSection({
  editMode,
  setEditMode,
  onDeleteClick,
  onCancelDetail,
  onUpdateClothing,
  isSavingClothing,
  canSave,
  editLabel,
  deleteLabel,
  cancelLabel,
  saveLabel,
}: ClosetDetailFooterSectionProps) {
  return (
    <div className="shrink-0 flex gap-2 px-6 pb-6 pt-3 bg-white rounded-b-[24px]">
      {!editMode ? (
        <>
          <button
            onClick={() => setEditMode(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors rounded-[24px] border-[1.5px] border-[#E5E5E5] text-sm font-semibold"
          >
            <Edit2 size={16} strokeWidth={2} />
            {editLabel}
          </button>
          <button
            onClick={onDeleteClick}
            className="flex-1 flex items-center justify-center gap-2 text-white px-4 py-3 hover:opacity-90 transition-opacity rounded-[24px] bg-black text-sm font-semibold"
          >
            <Trash2 size={16} strokeWidth={2} />
            {deleteLabel}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onCancelDetail}
            className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors rounded-[24px] border-[1.5px] border-[#E5E5E5] text-sm font-semibold"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onUpdateClothing}
            disabled={isSavingClothing || !canSave}
            className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-[24px] bg-black text-sm font-semibold"
          >
            {isSavingClothing ? <LoadingButtonContent text={saveLabel} /> : saveLabel}
          </button>
        </>
      )}
    </div>
  );
}
