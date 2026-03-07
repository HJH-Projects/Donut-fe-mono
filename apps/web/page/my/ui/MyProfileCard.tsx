'use client';

import { Pencil } from 'lucide-react';

type MyProfileCardProps = {
  nickname: string;
  email: string;
  closetCount: number;
  looksCount: number;
  closetItemsLabel: string;
  totalLooksLabel: string;
  onEditNickname: () => void;
};

export function MyProfileCard({
  nickname,
  email,
  closetCount,
  looksCount,
  closetItemsLabel,
  totalLooksLabel,
  onEditNickname,
}: MyProfileCardProps) {
  return (
    <div className="px-6 mb-8">
      <div
        className="p-8 relative"
        style={{
          backgroundColor: '#000000',
          borderRadius: 'var(--radius-xl)',
          minHeight: '212px',
        }}
      >
        <div className="mb-2">
          <h2
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              color: 'rgba(255, 255, 255, 1)',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {nickname}
          </h2>
        </div>
        <button
          onClick={onEditNickname}
          className="absolute top-8 right-8 z-10 p-2 bg-black hover:bg-black/90 transition-colors rounded-full"
          style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
        >
          <Pencil size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
        </button>

        <p
          className="mb-6"
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 400,
            minHeight: '22px',
          }}
        >
          {email || '\u00A0'}
        </p>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p
              className="text-white mb-1"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: '1',
              }}
            >
              {closetCount}
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {closetItemsLabel}
            </p>
          </div>

          <div>
            <p
              className="text-white mb-1"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: '1',
              }}
            >
              {looksCount}
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {totalLooksLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
