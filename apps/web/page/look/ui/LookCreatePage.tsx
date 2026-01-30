'use client';

import { useMemo, useState } from 'react';
import { ClothesItem } from '@/shared/api/clothes';

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
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

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

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">룩 등록</h1>
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
                      체크됨
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};
