'use client';

import { RefreshCw } from 'lucide-react';
import Spinner from '@/shared/ui/Spinner';

type AddProcessingOverlayProps = {
  text: string;
};

export function AddProcessingOverlay({ text }: AddProcessingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px]">
      <div className="w-20 h-20 rounded-full mb-3 skeleton-shimmer bg-[#F0F0F0]" />
      <p className="text-sm font-semibold text-black">{text}</p>
    </div>
  );
}

type RemoveBackgroundButtonProps = {
  onClick: () => void;
  text: string;
};

export function RemoveBackgroundButton({ onClick, text }: RemoveBackgroundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 transition-colors rounded-xl border-[1.5px] border-[#E5E5E5] text-[12px] font-medium"
    >
      <RefreshCw size={14} strokeWidth={1.5} />
      {text}
    </button>
  );
}

type OptionSkeletonRowProps = {
  widths: number[];
  height?: number;
};

export function OptionSkeletonRow({ widths, height = 32 }: OptionSkeletonRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {widths.map((width, index) => (
        <div
          key={`${width}-${index}`}
          className="skeleton-shimmer"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '16px',
            backgroundColor: '#F5F5F5',
          }}
        />
      ))}
    </div>
  );
}

type LoadingButtonContentProps = {
  text: string;
};

export function LoadingButtonContent({ text }: LoadingButtonContentProps) {
  return (
    <>
      <Spinner size="sm" className="text-white" />
      {text}
    </>
  );
}

type DetailInlineSkeletonProps = {
  width: string;
  height?: string;
  className?: string;
};

export function DetailInlineSkeleton({
  width,
  height = '20px',
  className,
}: DetailInlineSkeletonProps) {
  return (
    <div
      className={className ? `skeleton-shimmer ${className}` : 'skeleton-shimmer'}
      style={{
        width,
        height,
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
      }}
    />
  );
}

export function DetailMemoSkeleton() {
  return (
    <div className="space-y-2">
      <DetailInlineSkeleton width="100%" height="14px" />
      <DetailInlineSkeleton width="72%" height="14px" />
    </div>
  );
}
