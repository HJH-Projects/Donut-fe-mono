'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClothesDetail } from '@/shared/api/clothes';
import { deleteClothesClient } from '@/shared/api/clothes.client';
import { BackButton } from '@/shared/ui/BackButton';

type Props = {
  detail: ClothesDetail;
};

export const ClosetDetailPage = ({ detail }: Props) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('이 아이템을 삭제하시겠습니까?')) return;
    try {
      setDeleting(true);
      await deleteClothesClient(detail.id);
      router.push('/closet');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/closet/${detail.id}/edit`);
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-base font-semibold text-gray-900">아이템상세</h1>
        <span className="h-9 w-9" />
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
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
              {detail.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
              {detail.color}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? '삭제 중...' : '삭제'}
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            수정
          </button>
        </div>
      </section>
    </main>
  );
};
