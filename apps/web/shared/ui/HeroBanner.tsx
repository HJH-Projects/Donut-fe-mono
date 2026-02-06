'use client';

import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";

interface HeroBannerProps {
  imageUrl: string;
  headline: string;
  subheadline?: string;
}

export function HeroBanner({ imageUrl, headline, subheadline }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[600px] overflow-hidden" style={{ borderRadius: '32px' }}>
      <ImageWithFallback
        src={imageUrl}
        alt="Hero Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/40 to-transparent">
        <h1
          className="text-white mb-2"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}
        >
          {headline}
        </h1>
        {subheadline && (
          <p
            className="text-white/90"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: '1.5'
            }}
          >
            {subheadline}
          </p>
        )}
      </div>
    </div>
  );
}
