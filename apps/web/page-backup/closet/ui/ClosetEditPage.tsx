'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClothesDetail } from '@/shared/api/clothes';
import { updateClothesClient } from '@/shared/api/clothes.client';
import { BackButton } from '@/shared/ui/BackButton';

const CATEGORIES = [
  { value: 'TOP', label: '상의' },
  { value: 'BOTTOM', label: '하의' },
  { value: 'OUTER', label: '아우터' },
  { value: 'SHOES', label: '신발' },
  { value: 'ACCESSORY', label: '악세사리' },
] as const;

const COLORS = [
  { value: 'White', label: '화이트', hex: '#FFFFFF' },
  { value: 'Black', label: '블랙', hex: '#000000' },
  { value: 'Gray', label: '그레이', hex: '#808080' },
  { value: 'Navy', label: '네이비', hex: '#000080' },
  { value: 'Blue', label: '블루', hex: '#0000FF' },
  { value: 'Red', label: '레드', hex: '#FF0000' },
  { value: 'Pink', label: '핑크', hex: '#FFC0CB' },
  { value: 'Orange', label: '오렌지', hex: '#FFA500' },
  { value: 'Yellow', label: '옐로우', hex: '#FFFF00' },
  { value: 'Green', label: '그린', hex: '#008000' },
  { value: 'Brown', label: '브라운', hex: '#8B4513' },
  { value: 'Beige', label: '베이지', hex: '#F5F5DC' },
] as const;

type Props = {
  detail: ClothesDetail;
};

export const ClosetEditPage = ({ detail }: Props) => {
  const router = useRouter();

  const [title, setTitle] = useState(detail.title);
  const [category, setCategory] = useState<string>(detail.category);
  const [color, setColor] = useState<string>(detail.color);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('아이템 이름을 입력해주세요.');
      return;
    }
    if (!category) {
      setErrorMessage('카테고리를 선택해주세요.');
      return;
    }
    if (!color) {
      setErrorMessage('색상을 선택해주세요.');
      return;
    }

    try {
      setSaving(true);
      await updateClothesClient(detail.id, {
        title: title.trim(),
        category: category as 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY',
        color,
      });
      router.push(`/closet/${detail.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage('수정에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-base font-semibold text-gray-900">아이템 수정</h1>
        <span className="h-9 w-9" />
      </header>

      <section className="px-6">
        {/* Image Section */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={detail.imageUrl}
            alt={detail.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Fields */}
        <div className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">아이템 이름</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아이템 이름을 입력하세요"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    category === cat.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-gray-700">색상</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors ${
                    color === c.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto w-full max-w-[600px]">
          {errorMessage && (
            <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 rounded-xl bg-black py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
