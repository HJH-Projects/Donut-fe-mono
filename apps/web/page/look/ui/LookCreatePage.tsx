'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClothesItem } from '@/shared/api/clothes';
import { createLookClient } from '@/shared/api/looks.client';
import { BackButton } from '@/shared/ui/BackButton';

const CATEGORY_LABELS: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  ACCESSORY: '액세서리',
};

type Props = {
  clothes: ClothesItem[];
};

export const LookCreatePage = ({ clothes }: Props) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, ClothesItem[]> = {};
    clothes.forEach((item) => {
      map[item.category] = map[item.category] ? [...map[item.category], item] : [item];
    });
    return map;
  }, [clothes]);

  const toggle = (id: string) => {
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
    const tagList = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const uniqueTags = Array.from(new Set(tagList));
    if (uniqueTags.length > 5) {
      setErrorMessage('태그는 최대 5개까지 입력할 수 있습니다.');
      return;
    }
    const tooLongTag = uniqueTags.find((tag) => tag.length > 10);
    if (tooLongTag) {
      setErrorMessage('태그는 10자 이내로 입력해주세요.');
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
      await createLookClient({
        name: trimmedName,
        tags: uniqueTags.join(','),
        items: selectedItems.map((item, index) => ({
          clothesId: item.id,
          sortOrder: index + 1,
          role: item.category,
        })),
      });
      setSuccessMessage('룩이 저장되었습니다.');
      setTimeout(() => {
        router.push('/look');
      }, 600);
    } catch (error) {
      console.error(error);
      setErrorMessage('룩 등록에 실패했습니다.');
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-xl font-semibold text-gray-900">룩 등록</h1>
        <span className="h-9 w-9" />
      </header>

      <section className="px-6 space-y-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="룩 이름"
          className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm"
        />
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="태그 (쉼표로 구분)"
          className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm"
        />
      </section>

      <section className="mt-6 px-6 space-y-6">
        {Object.keys(grouped).map((category) => (
          <div key={category}>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {grouped[category].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="relative overflow-hidden rounded-2xl bg-gray-100 text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-40 w-full object-cover"
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
          </div>
        ))}
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

      <div className="fixed inset-x-0 bottom-24 z-40">
        <div className="mx-auto w-full max-w-[600px] px-6">
          {errorMessage && (
            <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? '등록 중...' : '룩 저장'}
          </button>
        </div>
      </div>
    </main>
  );
};
