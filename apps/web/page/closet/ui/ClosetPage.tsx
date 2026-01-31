import Link from 'next/link';
import { getClothesServer } from '@/shared/api/clothes';
import { BottomNav } from '@/shared/ui/BottomNav';
import { FloatingAddButton } from '@/shared/ui/FloatingAddButton';

const CATEGORY_LABELS: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  SHOES: '신발',
  ACCESSORY: '액세서리',
};

export const ClosetPage = async () => {
  const clothes = await getClothesServer();

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">옷장</h1>
      </header>

      <section className="px-6">
        {clothes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">등록된 옷이 없어요</p>
            <p className="mt-2 text-xs text-gray-500">
              오른쪽 아래 + 버튼을 눌러 옷을 추가해보세요.
            </p>
          </div>
        )}
        {Object.keys(CATEGORY_LABELS).map((category) => {
          const filtered = clothes.filter((item) => item.category === category);
          if (filtered.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={`/closet/${item.id}`}
                    className="relative overflow-hidden rounded-2xl bg-gray-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-40 w-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs">
                      {item.isFavorite ? '♥' : '♡'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <FloatingAddButton />
      <BottomNav />
    </main>
  );
};
