'use client';

import { useState } from 'react';
import type { ClothesDetail } from '@/shared/api/clothes';
import { BackButton } from '@/shared/ui/BackButton';

type Props = {
  detail: ClothesDetail;
};

export const ClosetDetailPage = ({ detail }: Props) => {
  const [memo, setMemo] = useState(detail.memo ?? '');
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-base font-semibold text-gray-900">아이템상세</h1>
        <button
          type="button"
          className="text-gray-900"
          aria-label="공유하기"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16v-7m0 0l-3 3m3-3l3 3M5 20h14a1 1 0 001-1v-3M4 16v3a1 1 0 001 1"
            />
          </svg>
        </button>
      </header>

      <section className="px-6">
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
              이미지 로딩 중
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={detail.imageUrl}
            alt={detail.title}
            className={`h-full w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">{detail.title}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <span>카테고리: {detail.category}</span>
            <span>시즌: {detail.season ?? '미지정'}</span>
            <span>색상: {detail.color}</span>
            <span>브랜드: {detail.brand ?? '미지정'}</span>
            <span>소재: {detail.material ?? '미지정'}</span>
            <span>사이즈: {detail.size ?? '미지정'}</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-700">메모</label>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className="mt-2 h-28 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700"
          />
        </div>
      </section>
    </main>
  );
};
