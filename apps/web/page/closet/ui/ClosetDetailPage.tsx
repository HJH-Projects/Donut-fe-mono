'use client';

import { useState } from 'react';
import { ClothesDetail } from '@/shared/api/clothes';

type Props = {
  detail: ClothesDetail;
};

export const ClosetDetailPage = ({ detail }: Props) => {
  const [memo, setMemo] = useState(detail.memo ?? '');

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <button className="text-sm text-gray-500">뒤로가기</button>
        <h1 className="text-base font-semibold text-gray-900">아이템상세</h1>
        <button className="text-sm text-gray-500">공유하기</button>
      </header>

      <section className="px-6">
        <div className="w-full overflow-hidden rounded-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={detail.imageUrl} alt={detail.title} className="w-full object-cover" />
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
