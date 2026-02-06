'use client';

import { useState } from "react";

interface FilterChipsProps {
  filters: string[];
  defaultActive?: string;
}

export function FilterChips({ filters, defaultActive }: FilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState(defaultActive || filters[0]);

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-4 transition-all duration-200 ${
              isActive
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black/5'
            }`}
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '999px',
              border: isActive ? 'none' : '1px solid #000000',
              letterSpacing: '0.02em'
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
