'use client';

import { ChevronRight } from 'lucide-react';

type MyMenuItem = {
  label: string;
  onClick: () => void;
};

type MyMenuSectionProps = {
  title: string;
  items: MyMenuItem[];
};

export function MyMenuSection({ title, items }: MyMenuSectionProps) {
  return (
    <section className="mb-8">
      <h3
        className="mb-4"
        style={{
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#737373',
        }}
      >
        {title}
      </h3>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>
        ))}
      </div>
    </section>
  );
}
