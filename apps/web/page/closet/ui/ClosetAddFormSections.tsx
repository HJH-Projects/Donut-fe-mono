'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { ClothingItem } from '../model/clothing.types';
import { CATEGORIES, COLORS, MATERIALS, SEASONS } from './closet.constants';
import {
  AddProcessingOverlay,
  LoadingButtonContent,
  OptionSkeletonRow,
  RemoveBackgroundButton,
} from './ClosetDialogLoadingUi';

type FormStateProps = {
  newClothing: Partial<ClothingItem>;
  setNewClothing: Dispatch<SetStateAction<Partial<ClothingItem>>>;
};

type AddImagePreviewSectionProps = {
  imageUrl?: string;
  isProcessing: boolean;
  hasPendingFile: boolean;
  processingText: string;
  refreshText: string;
  onRefresh: () => void;
};

export function AddImagePreviewSection({
  imageUrl,
  isProcessing,
  hasPendingFile,
  processingText,
  refreshText,
  onRefresh,
}: AddImagePreviewSectionProps) {
  if (!imageUrl) return null;

  return (
    <div>
      <div
        className="w-full aspect-square bg-gray-100 overflow-hidden relative rounded-2xl"
      >
        <img src={imageUrl} alt="preview" className="w-full h-full object-cover object-center" />
        {isProcessing && <AddProcessingOverlay text={processingText} />}
      </div>
      {!isProcessing && hasPendingFile && <RemoveBackgroundButton onClick={onRefresh} text={refreshText} />}
    </div>
  );
}

type AddCategoryPrimarySectionProps = FormStateProps & {
  isProcessing: boolean;
};

export function AddCategoryPrimarySection({
  newClothing,
  setNewClothing,
  isProcessing,
}: AddCategoryPrimarySectionProps) {
  if (isProcessing) {
    return <OptionSkeletonRow widths={[70, 80, 90, 100, 110]} />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(CATEGORIES)
        .filter((cat) => cat !== '전체')
        .map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() =>
              setNewClothing({
                ...newClothing,
                category1: cat,
                category2: '',
              })
            }
            className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
            style={{
              backgroundColor: newClothing.category1 === cat ? '#000' : '#fff',
              color: newClothing.category1 === cat ? '#fff' : '#000',
            }}
          >
            {cat}
          </button>
        ))}
    </div>
  );
}

type AddCategorySecondarySectionProps = FormStateProps & {
  isProcessing: boolean;
};

export function AddCategorySecondarySection({
  newClothing,
  setNewClothing,
  isProcessing,
}: AddCategorySecondarySectionProps) {
  if (!newClothing.category1) return null;

  const categories = CATEGORIES[newClothing.category1 as keyof typeof CATEGORIES];
  if (!categories || categories.length === 0) return null;

  if (isProcessing) {
    return <OptionSkeletonRow widths={[78, 86, 94, 102, 110]} />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((subCat) => (
        <button
          key={subCat}
          type="button"
          onClick={() =>
            setNewClothing({
              ...newClothing,
              category2: newClothing.category2 === subCat ? '' : subCat,
            })
          }
          className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
          style={{
            backgroundColor: newClothing.category2 === subCat ? '#000' : '#fff',
            color: newClothing.category2 === subCat ? '#fff' : '#000',
          }}
        >
          {subCat}
        </button>
      ))}
    </div>
  );
}

type AddSeasonSectionProps = FormStateProps & {
  isProcessing: boolean;
  toggleArrayValue: (array: string[], value: string) => string[];
};

export function AddSeasonSection({
  newClothing,
  setNewClothing,
  isProcessing,
  toggleArrayValue,
}: AddSeasonSectionProps) {
  if (isProcessing) return <OptionSkeletonRow widths={[70, 80, 90, 100, 110]} />;

  return (
    <div className="flex flex-wrap gap-2">
      {SEASONS.map((season) => (
        <button
          key={season}
          type="button"
          onClick={() =>
            setNewClothing({
              ...newClothing,
              season: toggleArrayValue(newClothing.season || [], season),
            })
          }
          className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
          style={{
            backgroundColor: newClothing.season?.includes(season) ? '#000' : '#fff',
            color: newClothing.season?.includes(season) ? '#fff' : '#000',
          }}
        >
          {season}
        </button>
      ))}
    </div>
  );
}

type AddColorSectionProps = FormStateProps & {
  isProcessing: boolean;
  toggleArrayValue: (array: string[], value: string) => string[];
};

export function AddColorSection({
  newClothing,
  setNewClothing,
  isProcessing,
  toggleArrayValue,
}: AddColorSectionProps) {
  if (isProcessing) return <OptionSkeletonRow widths={[70, 75, 80, 85, 90, 95]} />;

  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() =>
            setNewClothing({
              ...newClothing,
              color: toggleArrayValue(newClothing.color || [], color.name),
            })
          }
          className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5]"
          style={{
            backgroundColor: newClothing.color?.includes(color.name) ? '#000' : '#fff',
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
          <span className="text-[11px] font-medium" style={{ color: newClothing.color?.includes(color.name) ? '#fff' : '#000' }}>
            {color.name}
          </span>
        </button>
      ))}
    </div>
  );
}

type AddMaterialSectionProps = FormStateProps & {
  isProcessing: boolean;
};

export function AddMaterialSection({
  newClothing,
  setNewClothing,
  isProcessing,
}: AddMaterialSectionProps) {
  if (isProcessing) return <OptionSkeletonRow widths={[66, 74, 82, 90, 98, 106]} />;

  return (
    <div className="flex flex-wrap gap-2">
      {MATERIALS.map((material) => (
        <button
          key={material}
          type="button"
          onClick={() =>
            setNewClothing({
              ...newClothing,
              material: newClothing.material === material ? '' : material,
            })
          }
          className="px-3 py-1.5 transition-all rounded-2xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
          style={{
            backgroundColor: newClothing.material === material ? '#000' : '#fff',
            color: newClothing.material === material ? '#fff' : '#000',
          }}
        >
          {material}
        </button>
      ))}
    </div>
  );
}

type AddRegisterButtonProps = {
  isSubmitting: boolean;
  registerText: string;
  onClick: () => void;
  disabled: boolean;
};

export function AddRegisterButton({
  isSubmitting,
  registerText,
  onClick,
  disabled,
}: AddRegisterButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-[24px] bg-black text-sm font-semibold"
    >
      {isSubmitting ? <LoadingButtonContent text={registerText} /> : registerText}
    </button>
  );
}
