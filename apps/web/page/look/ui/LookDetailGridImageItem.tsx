'use client';

import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

type LookDetailGridImageItemProps = {
  imageUrl?: string;
  name: string;
};

export function LookDetailGridImageItem({ imageUrl, name }: LookDetailGridImageItemProps) {
  const renderKey = `${imageUrl || 'no-src'}:${name}`;
  return <LookDetailGridImageItemInner key={renderKey} imageUrl={imageUrl} name={name} />;
}

function LookDetailGridImageItemInner({ imageUrl, name }: LookDetailGridImageItemProps) {
  const hasSrc = Boolean(imageUrl);

  return (
    <div className="w-full aspect-square relative">
      <div
        className="w-full h-full overflow-hidden rounded-[10px] bg-white"
      >
        {hasSrc ? (
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#999] text-[9px] font-medium">이미지</span>
          </div>
        )}
      </div>
    </div>
  );
}
