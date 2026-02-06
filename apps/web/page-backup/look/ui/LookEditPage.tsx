'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClothesItem } from '@/shared/api/clothes';
import type { LookItem } from '@/shared/api/looks';
import { updateLookClient, deleteLookClient } from '@/shared/api/looks.client';
import { BackButton } from '@/shared/ui/BackButton';

const CATEGORIES = ['TOP', 'BOTTOM', 'OUTER', 'SHOES', 'ACCESSORY'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

const PRESET_TAGS = [
  '캐주얼',
  '포멀',
  '스포츠',
  '데이트',
  '출근',
  '여행',
  '파티',
  '데일리',
  '봄',
  '여름',
  '가을',
  '겨울',
] as const;

type Props = {
  look: LookItem;
  clothes: ClothesItem[];
};

export const LookEditPage = ({ look, clothes }: Props) => {
  const router = useRouter();
  const [name, setName] = useState(look.name);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    look.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  );
  const [selected, setSelected] = useState<string[]>(
    look.items.map((item) => item.clothesId).filter(Boolean)
  );
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, ClothesItem[]> = {};
    clothes.forEach((item) => {
      map[item.category] = map[item.category] ? [...map[item.category], item] : [item];
    });
    return map;
  }, [clothes]);

  const filteredItems = grouped[activeCategory] ?? [];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('룩 이름을 입력해주세요.');
      return;
    }
    if (trimmedName.length > 20) {
      setErrorMessage('룩 이름은 20자 이내로 입력해주세요.');
      return;
    }
    if (selected.length === 0) {
      setErrorMessage('최소 1개 아이템을 선택해주세요.');
      return;
    }
    if (selectedTags.length > 5) {
      setErrorMessage('태그는 최대 5개까지 선택할 수 있습니다.');
      return;
    }
    const selectedItems = selected
      .map((id) => clothes.find((item) => item.id === id))
      .filter(Boolean) as ClothesItem[];
    if (selectedItems.length === 0) {
      setErrorMessage('선택된 아이템 정보를 찾을 수 없습니다.');
      return;
    }
    try {
      setSaving(true);
      await updateLookClient(look.id, {
        name: trimmedName,
        tags: selectedTags.join(','),
        items: selectedItems.map((item, index) => ({
          clothesId: item.id,
          sortOrder: index + 1,
          role: item.category,
        })),
      });
      setSuccessMessage('룩이 저장되었습니다.');
      setTimeout(() => {
        router.push(`/look/${look.id}`);
        router.refresh();
      }, 600);
    } catch (error) {
      console.error(error);
      setErrorMessage('룩 수정에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('이 룩을 삭제하시겠습니까?')) return;
    try {
      setDeleting(true);
      await deleteLookClient(look.id);
      router.push('/look');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-xl font-semibold text-gray-900">룩 수정</h1>
        <span className="h-9 w-9" />
      </header>

      <section className="px-6 space-y-5">
        {/* Name Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">룩 이름</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="룩 이름을 입력하세요"
            className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm"
          />
        </div>

        {/* Tags Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700">태그</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="mt-6 px-6">
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

      {/* Items Grid */}
      <section className="mt-4 px-6">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              {CATEGORY_LABELS[activeCategory]}에 등록된 아이템이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className="relative overflow-hidden rounded-2xl bg-gray-100 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="aspect-square w-full object-cover"
                />
                {selected.includes(item.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="h-8 w-8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {successMessage && (
        <div className="fixed inset-x-0 top-6 z-50">
          <div className="mx-auto w-full max-w-[600px] px-6">
            <div className="rounded-xl bg-black/90 px-4 py-3 text-sm text-white">
              {successMessage}
            </div>
          </div>
        </div>
      )}

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
              onClick={handleDelete}
              disabled={saving || deleting}
              className="flex-1 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || deleting}
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
