'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type ImageWithFallbackProps = {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  loadingText?: string;
  keepPlaceholderWhenNoSrc?: boolean;
};

const EMPTY_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const {
    src,
    alt,
    style,
    className,
    onLoad,
    onError,
    loadingText,
    keepPlaceholderWhenNoSrc = false,
  } =
    props;
  const rawSrc = typeof src === 'string' ? src : '';
  const renderKey = rawSrc || '__empty__';

  return (
    <ImageWithFallbackInner
      key={renderKey}
      src={rawSrc}
      alt={alt}
      style={style}
      className={className}
      onLoad={onLoad}
      onError={onError}
      loadingText={loadingText}
      keepPlaceholderWhenNoSrc={keepPlaceholderWhenNoSrc}
    />
  );
}

function ImageWithFallbackInner({
  src,
  alt,
  style,
  className,
  onLoad,
  onError,
  loadingText,
  keepPlaceholderWhenNoSrc,
}: Required<Pick<ImageWithFallbackProps, 'src' | 'keepPlaceholderWhenNoSrc'>> &
  Omit<ImageWithFallbackProps, 'src' | 'keepPlaceholderWhenNoSrc'>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const rawSrc = typeof src === 'string' ? src : '';
  const safeSrc = rawSrc || EMPTY_PIXEL;
  const hasRealSrc = rawSrc.length > 0;

  if (!loadingText && !hasRealSrc) return null;

  const showPlaceholder = Boolean(loadingText) && !isLoaded;

  return (
    <div className="relative w-full h-full overflow-hidden" style={style}>
      <Image
        src={safeSrc}
        alt={alt || ''}
        fill
        sizes="100%"
        className={className}
        onLoad={(e) => {
          if (!hasRealSrc && keepPlaceholderWhenNoSrc) {
            onLoad?.(e);
            return;
          }
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setIsLoaded(true);
          onError?.(e);
        }}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[#999] text-[11px] font-medium">{loadingText}</p>
        </div>
      )}
    </div>
  );
}
