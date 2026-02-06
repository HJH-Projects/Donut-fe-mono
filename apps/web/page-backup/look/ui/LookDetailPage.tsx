'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LookItem } from '@/shared/api/looks';
import { BackButton } from '@/shared/ui/BackButton';

type Props = {
  detail: LookItem;
};

export const LookDetailPage = ({ detail }: Props) => {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: detail.name,
        text: `${detail.name} 룩을 확인해보세요!`,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다.');
    }
  };

  const handleAddItem = () => {
    router.push(`/look/${detail.id}/edit`);
  };

  const tagList = detail.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-base font-semibold text-gray-900">룩 상세</h1>
        <button
          type="button"
          onClick={handleShare}
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </header>

      <section className="px-6">
        {/* Name */}
        <h2 className="text-xl font-semibold text-gray-900">{detail.name}</h2>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tagList.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Items Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {detail.items.map((item) => {
            const href = item.clothesId ? `/closet/${item.clothesId}` : undefined;
            const Card = (
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.clothes?.imageUrl}
                  alt={item.clothes?.title ?? '옷'}
                  className="h-full w-full object-cover"
                />
              </div>
            );

            if (!href) return <div key={item.id}>{Card}</div>;

            return (
              <Link key={item.id} href={href}>
                {Card}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Floating Button with Count */}
      <div className="fixed inset-x-0 bottom-24 z-50">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-6">
          <span className="rounded-full bg-black/80 px-4 py-2 text-sm text-white">
            총 {detail.items.length}개의 아이템
          </span>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
            aria-label="아이템 추가"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
};
