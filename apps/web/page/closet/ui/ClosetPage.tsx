'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ClothesItem } from '@/shared/api/clothes';
import { BottomNav } from '@/shared/ui/BottomNav';

const CATEGORIES = ['TOP', 'BOTTOM', 'OUTER', 'SHOES', 'ACCESSORY'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

type Props = {
  clothes: ClothesItem[];
};

export const ClosetPage = ({ clothes }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);

  const filteredItems = clothes.filter((item) => item.category === activeCategory);
  const totalCount = clothes.length;

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">옷장</h1>
      </header>

      {/* Category Tabs */}
      <div className="px-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 px-6">
        {totalCount === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">등록된 옷이 없어요</p>
            <p className="mt-2 text-xs text-gray-500">
              오른쪽 아래 + 버튼을 눌러 옷을 추가해보세요.
            </p>
          </div>
        )}

        {filteredItems.length === 0 && totalCount > 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              {CATEGORY_LABELS[activeCategory]}에 등록된 아이템이 없습니다.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item, index) => {
            if (!item.id) {
              return (
                <div
                  key={`missing-${index}`}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100 text-xs text-gray-400"
                >
                  잘못된 아이템
                </div>
              );
            }
            return (
              <Link
                key={item.id}
                href={`/closet/${item.id}`}
                className="relative overflow-hidden rounded-2xl bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="aspect-square w-full object-cover"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Floating Button with Count */}
      <div className="fixed inset-x-0 bottom-24 z-50">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-6">
          <span className="rounded-full bg-black/80 px-4 py-2 text-sm text-white">
            총 {totalCount}개의 아이템
          </span>
          <Link
            href="/closet/new"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
            aria-label="옷 추가"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
};
