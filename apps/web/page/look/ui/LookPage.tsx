import Link from 'next/link';
import { getLooksServer } from '@/shared/api/looks.server';
import { BottomNav } from '@/shared/ui/BottomNav';
import { FloatingLinkButton } from '@/shared/ui/FloatingLinkButton';

export const LookPage = async () => {
  const looks = await getLooksServer();

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
            <p className="mt-1 text-xs text-gray-500">{look.tags}</p>
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
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <span>즐겨찾기</span>
              <span>공유</span>
              <span>수정</span>
              <span>삭제</span>
            </div>
          </Link>
        ))}
      </section>

      <FloatingLinkButton href="/look/new" label="룩 등록" />
      <BottomNav />
    </main>
  );
};
