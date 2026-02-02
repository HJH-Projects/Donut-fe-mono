'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LookItem } from '@/shared/api/looks';
import { deleteLookClient } from '@/shared/api/looks.client';
import { BottomNav } from '@/shared/ui/BottomNav';

type Props = {
  looks: LookItem[];
};

export const LookPage = ({ looks: initialLooks }: Props) => {
  const router = useRouter();
  const [looks, setLooks] = useState<LookItem[]>(initialLooks);

  const handleShare = async (e: React.MouseEvent, look: LookItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.share({
        title: look.name,
        text: `${look.name} 룩을 확인해보세요!`,
        url: `${window.location.origin}/look/${look.id}`,
      });
    } catch {
      await navigator.clipboard.writeText(`${window.location.origin}/look/${look.id}`);
      alert('링크가 복사되었습니다.');
    }
  };

  const handleEdit = (e: React.MouseEvent, look: LookItem) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/look/${look.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, look: LookItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('이 룩을 삭제하시겠습니까?')) return;
    try {
      await deleteLookClient(look.id);
      setLooks((prev) => prev.filter((l) => l.id !== look.id));
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
    }
  };

  const tagList = (tags: string) =>
    tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">룩</h1>
      </header>

      <section className="px-6 space-y-4">
        {looks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">등록된 룩이 없어요</p>
            <p className="mt-2 text-xs text-gray-500">
              오른쪽 아래 + 버튼을 눌러 룩을 만들어보세요.
            </p>
          </div>
        )}
        {looks.map((look) => (
          <Link
            key={look.id}
            href={`/look/${look.id}`}
            className="block rounded-2xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">{look.name}</h2>
              <span className="text-xs text-gray-400">{look.createdAt?.slice(0, 10)}</span>
            </div>

            {/* Tags */}
            {look.tags && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tagList(look.tags).map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Items Preview */}
            <div className="mt-3 flex gap-2">
              {look.items.map((item) => (
                <div key={item.id} className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.clothes?.imageUrl}
                    alt={item.clothes?.title ?? '옷'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Action Icons */}
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={(e) => handleShare(e, look)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="공유"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => handleEdit(e, look)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="수정"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => handleDelete(e, look)}
                className="text-gray-400 hover:text-red-500"
                aria-label="삭제"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </section>

      {/* Floating Button with Count */}
      <div className="fixed inset-x-0 bottom-24 z-50">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-6">
          <span className="rounded-full bg-black/80 px-4 py-2 text-sm text-white">
            총 {looks.length}개의 룩
          </span>
          <Link
            href="/look/new"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
            aria-label="룩 등록"
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
