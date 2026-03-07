'use client';

import { COLORS } from './closet.constants';
import {
  DetailInlineSkeleton,
  DetailMemoSkeleton,
  OptionSkeletonRow,
} from './ClosetDialogLoadingUi';

type CategoryReadonlySectionProps = {
  category1: string;
  category2: string;
  isLoading: boolean;
};

export function CategoryReadonlySection({
  category1,
  category2,
  isLoading,
}: CategoryReadonlySectionProps) {
  return (
    <>
      <p className="text-sm font-normal">{category1}</p>
      {isLoading ? (
        <DetailInlineSkeleton width="120px" height="18px" className="mt-1" />
      ) : category2 ? (
        <p className="text-[#666] mt-1 text-[13px] font-normal">
          {category2}
        </p>
      ) : null}
    </>
  );
}

type SeasonReadonlySectionProps = {
  season: string[];
  isLoading: boolean;
  emptyText: string;
};

export function SeasonReadonlySection({
  season,
  isLoading,
  emptyText,
}: SeasonReadonlySectionProps) {
  if (isLoading) {
    return <OptionSkeletonRow widths={[66, 80, 94]} height={30} />;
  }

  if (season.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {season.map((s) => (
          <span
            key={s}
            className="px-3 py-1 rounded-2xl bg-[#F3F3F3] text-[12px] font-medium"
          >
            {s}
          </span>
        ))}
      </div>
    );
  }

  return (
    <p className="text-[#999] text-[13px] font-normal">
      {emptyText}
    </p>
  );
}

type ColorReadonlySectionProps = {
  color: string[];
  isLoading: boolean;
  emptyText: string;
};

export function ColorReadonlySection({
  color,
  isLoading,
  emptyText,
}: ColorReadonlySectionProps) {
  if (isLoading) {
    return <OptionSkeletonRow widths={[68, 78, 88, 98]} height={30} />;
  }

  if (color.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {color.map((c) => {
          const colorData = COLORS.find((col) => col.name === c);
          return (
            <div
              key={c}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#F3F3F3]"
            >
              {colorData && (
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    ...(colorData.hex === null
                      ? {
                          background:
                            'linear-gradient(135deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc)',
                        }
                      : {
                          backgroundColor: colorData.hex,
                          border: colorData.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                        }),
                  }}
                />
              )}
              <span className="text-[11px] font-medium">
                {c}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <p className="text-[#999] text-[13px] font-normal">
      {emptyText}
    </p>
  );
}

type MaterialReadonlySectionProps = {
  material: string;
  isLoading: boolean;
  emptyText: string;
};

export function MaterialReadonlySection({
  material,
  isLoading,
  emptyText,
}: MaterialReadonlySectionProps) {
  if (isLoading) return <DetailInlineSkeleton width="100px" />;
  if (material) {
    return <p className="text-sm font-normal">{material}</p>;
  }

  return <p className="text-[#999] text-[13px] font-normal">{emptyText}</p>;
}

type BrandReadonlySectionProps = {
  brand: string;
  isLoading: boolean;
  emptyText: string;
};

export function BrandReadonlySection({
  brand,
  isLoading,
  emptyText,
}: BrandReadonlySectionProps) {
  if (isLoading) return <DetailInlineSkeleton width="120px" />;
  if (brand) {
    return <p className="text-sm font-normal">{brand}</p>;
  }

  return <p className="text-[#999] text-[13px] font-normal">{emptyText}</p>;
}

type SizeReadonlySectionProps = {
  size: string;
  isLoading: boolean;
  emptyText: string;
};

export function SizeReadonlySection({
  size,
  isLoading,
  emptyText,
}: SizeReadonlySectionProps) {
  if (isLoading) return <DetailInlineSkeleton width="64px" />;
  if (size) {
    return <p className="text-sm font-normal">{size}</p>;
  }

  return <p className="text-[#999] text-[13px] font-normal">{emptyText}</p>;
}

type MemoReadonlySectionProps = {
  memo: string;
  isLoading: boolean;
  emptyText: string;
};

export function MemoReadonlySection({
  memo,
  isLoading,
  emptyText,
}: MemoReadonlySectionProps) {
  if (isLoading) return <DetailMemoSkeleton />;
  if (memo) {
    return <p className="text-sm font-normal leading-[1.6]">{memo}</p>;
  }

  return <p className="text-[#999] text-[13px] font-normal">{emptyText}</p>;
}
