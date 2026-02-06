'use client';

import { useState } from "react";

interface SizeSelectorProps {
  sizes: string[];
  defaultSize?: string;
}

export function SizeSelector({ sizes, defaultSize }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState(defaultSize || sizes[0]);

  return (
    <div className="flex gap-3">
      {sizes.map((size) => {
        const isSelected = size === selectedSize;
        return (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-14 h-14 rounded-full transition-all duration-200 ${
              isSelected
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black/5'
            }`}
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              border: isSelected ? 'none' : '1px solid #000000',
              letterSpacing: '0.01em'
            }}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
