'use client';

import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";

interface ProductCardProps {
  imageUrl: string;
  brand: string;
  name: string;
  price: string;
}

export function ProductCard({ imageUrl, brand, name, price }: ProductCardProps) {
  return (
    <div className="w-full group cursor-pointer">
      <div
        className="w-full aspect-[3/4] overflow-hidden mb-4 bg-gray-50"
        style={{ borderRadius: '24px' }}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-1">
        <h3
          className="text-black"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '1.3',
          }}
        >
          {brand}
        </h3>
        <p
          className="text-black"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '1.5'
          }}
        >
          {name}
        </p>
        <p
          className="text-black"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '1.5',
            letterSpacing: '0.01em'
          }}
        >
          {price}
        </p>
      </div>
    </div>
  );
}
